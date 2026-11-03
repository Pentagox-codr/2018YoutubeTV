const axios = require('axios');

const baseURL = 'https://inv.truehosting.net/api/v1';

function text(value, fallback = '') {
    if (value === undefined || value === null) return fallback;
    return String(value);
}

function runs(value) {
    return {
        runs: [{ text: text(value) }]
    };
}

function convertInvVidStructToV10(video) {
    const videoId = String(video.videoId || '');
    const title = String(video.title || 'Untitled video');
    const author = String(video.author || 'Unknown channel');
    const authorId = String(video.authorId || '');

    const publishedText = String(video.publishedText || '');

    const viewCount = Number(video.viewCount || 0);
    const viewCountText = video.viewCountText ||
        `${new Intl.NumberFormat('en-US').format(viewCount)} views`;

    const isLive = video.liveNow === true;
    const isUpcoming = video.isUpcoming === true;
    const is4k = video.is4k === true;
    const is8k = video.is8k === true;

    const durationSeconds = Number(video.lengthSeconds || 0);

    const duration = isLive
        ? 'LIVE'
        : formatDuration(durationSeconds);

    const durationLabel = isLive
        ? 'Live stream'
        : `${durationSeconds} seconds`;

    const thumbnails = Array.isArray(video.videoThumbnails)
        ? video.videoThumbnails
            .filter(item =>
                item &&
                !['start', 'middle', 'end'].includes(item.quality)
            )
            .map(({ quality, ...thumbnail }) => thumbnail)
            .sort((a, b) =>
                Number(a.width || 0) - Number(b.width || 0)
            )
        : [];

    const thumbnailOverlays = [];

    // LIVE badge
    if (isLive) {
        thumbnailOverlays.push({
            thumbnailOverlayTimeStatusRenderer: {
                text: {
                    runs: [{ text: 'LIVE' }]
                },
                style: 'LIVE'
            }
        });
    } else {
        // Normal duration badge
        thumbnailOverlays.push({
            thumbnailOverlayTimeStatusRenderer: {
                text: {
                    runs: [{ text: duration }],
                    accessibility: {
                        accessibilityData: {
                            label: durationLabel
                        }
                    }
                },
                style: 'DEFAULT'
            }
        });
    }

    // Quality badges
    if (is8k) {
        thumbnailOverlays.push({
            thumbnailOverlayBadgeViewModel: {
                badgeViewModel: {
                    text: '8K',
                    badgeStyle: 'BADGE_STYLE_TYPE_SIMPLE'
                }
            }
        });
    } else if (is4k) {
        thumbnailOverlays.push({
            thumbnailOverlayBadgeViewModel: {
                badgeViewModel: {
                    text: '4K',
                    badgeStyle: 'BADGE_STYLE_TYPE_SIMPLE'
                }
            }
        });
    }

    const authorRun = {
        text: author
    };

    if (authorId) {
        authorRun.navigationEndpoint = {
            clickTrackingParams: '',
            browseEndpoint: {
                browseId: authorId
            }
        };
    }

    const byline = {
        runs: [authorRun]
    };

    const navigationEndpoint = {
        clickTrackingParams: '',
        watchEndpoint: {
            videoId
        }
    };

    return {
        gridVideoRenderer: {
            videoId,

            thumbnail: {
                thumbnails
            },

            thumbnailOverlays,

            title: {
                runs: [{ text: title }]
            },

            longBylineText: {
                runs: [{ ...authorRun }]
            },

            shortBylineText: byline,

            publishedTimeText: {
                runs: [{ text: publishedText }]
            },

            viewCountText: {
                runs: [{ text: viewCountText }]
            },

            shortViewCountText: {
                runs: [{ text: viewCountText }]
            },

            lengthText: {
                runs: [{ text: duration }],
                accessibility: {
                    accessibilityData: {
                        label: durationLabel
                    }
                }
            },

            navigationEndpoint,

            channelThumbnail: {
                thumbnails: Array.isArray(video.authorThumbnails)
                    ? video.authorThumbnails
                    : []
            },

            trackingParams: ''
        }
    };
}

function formatDuration(value) {
    const total = Math.max(0, Math.floor(Number(value) || 0));

    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function getThumbnail(video) {
    const thumbnails = Array.isArray(video.videoThumbnails)
        ? video.videoThumbnails
            .filter(item => item && !['start', 'middle', 'end'].includes(item.quality))
            .map(({ quality, ...item }) => item)
            .sort((a, b) => Number(a.width || 0) - Number(b.width || 0))
        : [];

    return { thumbnails };
}

function getVideoEndpoint(videoId) {
    return {
        clickTrackingParams: '',
        watchEndpoint: {
            videoId
        }
    };
}

function getChannelEndpoint(authorId) {
    return {
        clickTrackingParams: '',
        browseEndpoint: {
            browseId: authorId
        }
    };
}

function getCompactVideo(video) {
    const converted = convertInvVidStructToV10(video);
    const grid = converted.gridVideoRenderer;

    return {
        compactVideoRenderer: {
            videoId: grid.videoId,
            thumbnail: grid.thumbnail,
            thumbnailOverlays: grid.thumbnailOverlays,
            title: grid.title,
            shortBylineText: grid.shortBylineText,
            longBylineText: grid.longBylineText,
            publishedTimeText: grid.publishedTimeText,
            viewCountText: grid.viewCountText,
            shortViewCountText: grid.shortViewCountText,
            lengthText: grid.lengthText,
            navigationEndpoint: grid.navigationEndpoint,
            channelThumbnail: grid.channelThumbnail,
            trackingParams: ''
        }
    };
}

// Converts Invidious video data into the renderer used by the
// 2018 YouTube TV pivot shelf.
function buildPivotVideoRenderer(video) {
    const converted = convertInvVidStructToV10(video);
    const grid = converted.gridVideoRenderer;

    return {
        videoId: grid.videoId || text(video.videoId),
        thumbnail: grid.thumbnail || getThumbnail(video),
        title: grid.title || runs(video.title || 'Untitled video'),
        shortBylineText: grid.shortBylineText || runs(video.author || 'Unknown channel'),
        navigationEndpoint: grid.navigationEndpoint || getVideoEndpoint(video.videoId),
        trackingParams: '',

        lengthText: grid.lengthText,

        viewCountText:
            grid.shortViewCountText ||
            grid.viewCountText
    };
}

// Builds the actual related-video shelf.
// The TV client expects pivotShelfRenderer entries, not compactVideoRenderer.
function buildRelatedVideosShelf(relatedVideos) {
    const items = relatedVideos
        .filter(video => video && video.videoId)
        .map(video => ({
            pivotVideoRenderer: buildPivotVideoRenderer(video)
        }));

    if (!items.length) return null;

    return {
        pivot: {
            trackingParams: '',
            contents: [
                {
                    pivotShelfRenderer: {
                        title: runs('Related videos'),
                        trackingParams: '',
                        content: {
                            pivotHorizontalListRenderer: {
                                items,
                                selectedIndex: 0
                            }
                        }
                    }
                }
            ]
        }
    };
}

function buildVideoMetadata(video) {
    const viewCount = Number(video.viewCount || 0);
    const viewCountText = video.viewCountText ||
        `${new Intl.NumberFormat('en-US').format(viewCount)} views`;

    return {
        videoId: text(video.videoId),
        title: runs(video.title || 'Untitled video'),
        description: runs(video.description || ''),
        viewCountText: runs(viewCountText),
        shortViewCountText: runs(viewCountText),
        publishedTimeText: runs(video.publishedText || ''),
        likeStatus: 'INDIFFERENT',
        isCrawlable: true,
        isOwnerViewing: false,
        isPrivate: false,
        isUnlisted: false,
        isFamilySafe: true,
        isLimitedState: false,
        allowRatings: true,
        trackingParams: ''
    };
}

function buildVideoOwner(video) {
    const author = text(video.author, 'Unknown channel');
    const authorId = text(video.authorId);

    return {
        title: runs(author),
        thumbnail: {
            thumbnails: Array.isArray(video.authorThumbnails)
                ? video.authorThumbnails
                : []
        },
        navigationEndpoint: authorId
            ? getChannelEndpoint(authorId)
            : undefined,
        trackingParams: ''
    };
}

function buildAutoplayRenderer(video) {
    if (!video) return null;

    const pivotVideo = buildPivotVideoRenderer(video);
    const endpoint = getVideoEndpoint(video.videoId);

    return {
        autoplayEndpointRenderer: {
            endpoint
        },

        pivotVideoRenderer: pivotVideo
    };
}

function buildNextResponse(video, relatedVideos = []) {
    const contents = [];

    // Current video metadata.
    contents.push({
        itemSectionRenderer: {
            contents: [
                {
                    videoMetadataRenderer: buildVideoMetadata(video)
                }
            ],
            trackingParams: ''
        }
    });

    // Current video channel information.
    contents.push({
        itemSectionRenderer: {
            contents: [
                {
                    videoOwnerRenderer: buildVideoOwner(video)
                }
            ],
            trackingParams: ''
        }
    });

    // First related video becomes the autoplay candidate.
    const nextVideo = relatedVideos.find(item =>
        item &&
        item.videoId &&
        item.videoId !== video.videoId &&
        !item.liveNow &&
        !item.isUpcoming
    );

    const autoplayRenderer = buildAutoplayRenderer(nextVideo);

    // Build related-video pivot shelf.
    const relatedShelf = buildRelatedVideosShelf(relatedVideos);

    const singleColumnWatchNextResults = {
        results: {
            results: {
                contents
            }
        },

        playlist: {
            playlist: null
        },

        autoplay: {
            autoplay: {
                sets: autoplayRenderer
                    ? [
                        {
                            mode: 'NORMAL',
                            autoplayVideoRenderer: autoplayRenderer
                        }
                    ]
                    : []
            }
        }
    };

    // The 2018 TV client reads this separately from results.results.contents.
    if (relatedShelf) {
        singleColumnWatchNextResults.pivot = relatedShelf;
    }

    return {
        currentVideoEndpoint: getVideoEndpoint(video.videoId),

        trackingParams: '',

        alerts: [],

        contents: {
            singleColumnWatchNextResults
        }
    };
}

async function fetchNextData(videoId, accessToken) {
    if (!videoId || typeof videoId !== 'string') {
        throw new Error('A valid videoId is required.');
    }

    try {
        console.log(`[next] Fetching Invidious data for ${videoId}`);

        const videoResponse = await axios.get(
            `${baseURL}/videos/${encodeURIComponent(videoId)}`,
            {
                timeout: 20000,
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const video = videoResponse.data;

        if (!video || !video.videoId) {
            throw new Error('Invidious did not return valid video information.');
        }

        // Invidious includes recommendations in the video details response.
        const relatedVideos = Array.isArray(video.recommendedVideos)
            ? video.recommendedVideos.filter(item =>
                item &&
                item.videoId &&
                item.videoId !== videoId
            )
            : [];

        console.log('[next] Recommendations:', relatedVideos.length);
        console.log('[next] First recommendation:', relatedVideos[0] || null);

        const response = buildNextResponse(video, relatedVideos);

        console.log(
            `[next] ${video.title} | ${relatedVideos.length} related videos`
        );

        return response;

    } catch (error) {
        console.error('[next] Invidious error:', error.message);

        if (error.response?.data) {
            console.error(
                '[next] Response:',
                JSON.stringify(error.response.data, null, 2)
            );
        }

        throw new Error(
            `Failed to fetch Invidious next data: ${error.message}`
        );
    }
}

module.exports = {
    fetchNextData,
    buildNextResponse,
    buildVideoMetadata,
    buildVideoOwner,
    getCompactVideo,
    buildPivotVideoRenderer,
    buildRelatedVideosShelf
};