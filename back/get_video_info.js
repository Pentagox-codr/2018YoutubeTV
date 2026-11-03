const fs = require('fs');
const path = require('path');
const { title } = require('process');
const youtubeDl = require('youtube-dl-exec');

const settingsPath = path.join(__dirname, 'settings.json');

let settings;

if (!fs.existsSync(settingsPath)) {
    const defaultSettings = {
        serverIp: 'localhost',
        expBrowse: false
    };
    fs.writeFileSync(settingsPath, JSON.stringify(defaultSettings, null, 4));
    console.log("Created settings.json with default serverIp = localhost and expBrowse = false.");
    settings = defaultSettings;
} else {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
}

const serverIp = settings.serverIp || "localhost";

function handleGetVideoInfo(req, res) {
    const videoId = req.query.video_id;
    if (!videoId) {
        return res.status(400).send('Video ID is required');
    }

    youtubeDl(videoId, {
        dumpSingleJson: true,
        writeSubs: true,
        writeAutoSubs: true,
        subLangs: 'all',
        noWarnings: true,
        quiet: true,
    })
        .then(output => {
            const logsDir = path.join(__dirname, 'logs');
            if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const logFilePath = path.join(logsDir, `video-info-${timestamp}.json`);
            fs.writeFileSync(logFilePath, JSON.stringify(output, null, 2));

            const videoDuration = output.duration;
            const videoTitle = output.title;

            // --- FIX: PARSE AND BUILD CAPTION TRACKS ---
            let captionTracksArr = [];
            const subSource = output.subtitles || output.automatic_captions || {};

            Object.keys(subSource).forEach(lang => {
                // Find the vtt or srv3 format url if available
                const trackData = subSource[lang];
                if (Array.isArray(trackData)) {
                    // Try to find standard xml/vtt web formats
                    const formatObj = trackData.find(f => f.ext === 'vtt' || f.ext === 'srv3') || trackData[0];
                    if (formatObj && formatObj.url) {
                        // Legacy players expect: u=URL&lc=LANG&name=NAME
                        const trackString = `u=${encodeURIComponent(formatObj.url)}&lc=${lang}&lang=${lang}&name=${encodeURIComponent(lang)}`;
                        captionTracksArr.push(trackString);
                    }
                }
            });

            const captionTracksResponse = captionTracksArr.join(',');
            const hasSubtitles = captionTracksArr.length > 0;
            // -------------------------------------------

            const adaptiveFmts = [];
            const fmtListArr = [];
            const urlEncodedFmtStreamMapArr = [];

            if (output.formats && Array.isArray(output.formats)) {
                output.formats.sort((a, b) => (b.height || 0) - (a.height || 0));

                output.formats.forEach(format => {
                    const skipFormatIds = ["sb1", "sb2", "sb0"];
                    if (skipFormatIds.includes(format.format_id)) return;

                    if (format.url && format.format_id) {
                        let mimeType = format.vcodec && format.vcodec !== "none" && format.acodec && format.acodec !== "none"
                            ? `video/${format.ext || 'mp4'}; codecs="${format.vcodec},${format.acodec}"`
                            : format.vcodec && format.vcodec !== "none"
                                ? `video/${format.ext || 'mp4'}; codecs="${format.vcodec}"`
                                : `audio/${format.ext || 'mp4'}; codecs="${format.acodec}"`;

                        if (format.format_id !== '18') {
                            let formattedurl = format.url.includes("m3u8") ? "http://localhost:8070/" + format.url : format.url;

                            if (!format.url.includes("m3u8") && format.url.includes('manifest')) return;

                            const urlParams = new URLSearchParams();
                            urlParams.append('url', formattedurl);
                            urlParams.append('itag', format.format_id);
                            urlParams.append('clen', format.filesize || 'unknown');
                            urlParams.append('lmt', format.lastModified || 'unknown');
                            urlParams.append('dur', format.duration || 'unknown');
                            urlParams.append('fps', format.fps || 'unknown');
                            urlParams.append('size', `${format.width || 0}x${format.height || 0}`);
                            urlParams.append('bitrate', format.tbr || 'unknown');
                            urlParams.append('type', mimeType);

                            adaptiveFmts.push(urlParams.toString());

                            if (format.width && format.height) {
                                fmtListArr.push(`${format.format_id}/${format.width}x${format.height}`);
                            }
                        }

                        if (format.format_id === '18' || format.format_id === '22') {
                            const fmtString = `itag=${format.format_id}&type=${mimeType}&url=${encodeURIComponent(format.url)}&quality=${format.quality || 'unknown'}`;
                            urlEncodedFmtStreamMapArr.push(fmtString);
                        }
                    }
                });
            }

            let hlsvpParam = "";
            if (output.is_live) {
                const manifestUrl = output.manifest_url || (output.formats.find(f => f.url && f.url.includes('m3u8')) || {}).url;
                if (manifestUrl) {
                    hlsvpParam = `\nhlsvp=${encodeURIComponent("http://localhost:8070/" + manifestUrl)}`;
                }
            }
            const isLiveStream = output.is_live ? "1" : "0";
            const lengthSecondsValue = output.is_live ? "0" : (videoDuration || 0);

            const fmtList = fmtListArr.join(',');
            const adaptiveFmtsResponse = adaptiveFmts.join(',');
            const urlEncodedFmtStreamMapResponse = urlEncodedFmtStreamMapArr.join(',');

            // --- ADDED caption_tracks AND cc_load_policy HERE ---
            const videoInfo = `baseUrl=https%3A%2F%2F${encodeURIComponent(serverIp)}%3A8090
iv_module=https%3A%2F%2Fs.ytimg.com%2Fyts%2Fswfbin%2Fplayer-vflq9bo_X%2Fiv_module.swf
account_playback_token=QUFFLUhqbUNlSEVkMTBaWWVFcjgtNC1KZ3VIRzA0X2I2d3xBQ3Jtc0tsYklEbEFDemhBNlJJOS01TkFZQzJNUmVrVERqeDhaV1pqQmJEOFZ3V3pSWjNNRnhiZnd5NnJWejJONzM3dFh0MG9PT0U2Q3gzVnVKS194cEphNkVPeFE3azlSSFhabmh0QkpITW90b2FEMnpvVGZPQQ%3D%3D
cbr=Chrome
iv3_module=1
iv_load_policy=1
cosver=5.1
${hasSubtitles ? "ttsurl=" + encodeURIComponent(output.subtitles?.en?.[0]?.url || output.automatic_captions?.en?.[0]?.url) : ""}
probe_url=https%3A%2F%2Fr3---sn-p5qlsu7r.googlevideo.com%2Fvideogoodput%3Fid%3Do-AAdvekeNvhTnc7BLnVx3s1tYNVrOiCABO6a6dAvgVFLF%26source%3Dgoodput%26range%3D0-99999%26expire%3D1426349446%26ip%3D207.241.226.230%26ms%3Dpm%26mm%3D35%26pl%3D24%26sparams%3Did%2Csource%2Crange%2Cexpire%2Cip%2Cms%2Cmm%2Cpl%26signature%3D16006AFBAD95DD923171C54EAD9B46BC38E9EB.423F08645F93F89A254D8AF80FB0F006623DD7F3%26key%3Dcms1
of=DI8ulxjA44_i6rKc8TzAhw
iv_invideo_url=https%3A%2F%2Fwww.youtube.com%2Fannotations_invideo%3Fcap_hist%3D1%26cta%3D2%26playlist_id%3DPLSH1V8Iv8_1VZzhTkvVHYdz8KUPeBGfN9%26video_id%3D0ggR11jYS3A
length_seconds=${encodeURIComponent(videoDuration || 0)}
has_cc=${encodeURIComponent(hasSubtitles ? "True" : "False")}
caption_tracks=${encodeURIComponent(captionTracksResponse)}
cc_load_policy=1
enablecsi=1
is_live=${isLiveStream}
live_playback=${isLiveStream}
pltype=contentugc
timestamp=1426345846
avg_rating=4.5801980198
vid=${encodeURIComponent(videoId)}
plid=AAURQQWJOzsm_uzM
watermark=%2Chttps%3A%2F%2Fs.ytimg.com%2Fyts%2Fimg%2Fwatermark%2Fyoutube_watermark-vflHX6b6E.png%2Chttps%3A%2F%2Fs.ytimg.com%2Fyts%2Fimg%2Fwatermark%2Fyoutube_hd_watermark-vflAzLcD6.png
ytfocEnabled=1
video_id=${encodeURIComponent(videoId)}
thumbnail_url=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0ggR11jYS3A%2Fdefault.jpg
iurlhq=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0ggR11jYS3A%2Fhqdefault.jpg
ldpj=0
allow_embed=1
cos=Windows
allow_ratings=1
muted=0
c=web
status=ok
loudness=-20.4790000916
fmt_list=${encodeURIComponent(fmtList)}
aid=P-r-BXKOXj0
ptk=youtube_none
vq=auto
iurl=https%3A%2F%2Fi.ytimg.com%2Fvi%2F0ggR11jYS3A%2Fhqdefault.jpg
url_encoded_fmt_stream_map=${encodeURIComponent(urlEncodedFmtStreamMapResponse)}
adaptive_fmts=${encodeURIComponent(adaptiveFmtsResponse)}${hlsvpParam}
idpj=-2
cbrver=41.0.2272.89
title=${encodeURIComponent(videoTitle)}
csi_page_type=embed
cl=88507848
no_get_video_log=0
iv_allow_in_place_switch=1
uid=4x7LYSzgGH-TMKc9J8pwgQ
view_count=71358
tmi=1
use_cipher_signature=False`;

            const properties = videoInfo.trim().split("\n");
            const encodedProperties = properties.map(prop => {
                const [key, value] = prop.split('=');
                return `${key.trim()}=${value || ''}`;
            });

            const encodedResponse = encodedProperties.join('&').replace(/\s+/g, '');
            res.send(encodedResponse);
        })
        .catch(err => {
            console.error('Error fetching video info:', err);
            res.status(500).send('Failed to fetch video info');
        });
}

module.exports = { handleGetVideoInfo };
