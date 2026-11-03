/*
 * TVHTML5 native player replacement
 * Replaces the old YouTube player binary with an HTMLMediaElement-backed API.
 * Browser-only script: load it as the player's player_url script.
 */
(function (window, document) {
  "use strict";

  if (!window || !document) return;

  var VERSION = "pentagox-tv-player-remake/1.1.0-raw";
  var DEFAULT_INSTANCE = "https://www.invidious.frantisekfiala.eu";
  var DEFAULT_API = DEFAULT_INSTANCE + "/api/v1";
  var instances = Object.create(null);
  var hlsScriptPromise = null;

  var defaults = {
    invidiousBaseUrl: DEFAULT_API,
    embedBaseUrl: DEFAULT_INSTANCE,
    rawQuality: "medium",
    hlsJsUrl: "https://cdn.jsdelivr.net/npm/hls.js@1.5.18/dist/hls.min.js",
    maxHeight: 1080,
    preferredContainer: "mp4",
    fetchTimeout: 20000,
    debug: true
  };

  function settings() {
    var custom = window.TV_PLAYER_CONFIG || {};
    var result = {};

    Object.keys(defaults).forEach(function (key) {
      result[key] = custom[key] !== undefined ? custom[key] : defaults[key];
    });

    if (window.loadParams && window.loadParams.invidious_api_base) {
      result.invidiousBaseUrl = window.loadParams.invidious_api_base;
    }

    if (window.loadParams && window.loadParams.invidious_embed_base) {
      result.embedBaseUrl = window.loadParams.invidious_embed_base;
    }

    result.invidiousBaseUrl = String(result.invidiousBaseUrl || DEFAULT_API).replace(/\/$/, "");
    result.embedBaseUrl = String(result.embedBaseUrl || DEFAULT_INSTANCE).replace(/\/$/, "");
    result.rawQuality = normalizeRawQuality(result.rawQuality, "medium");

    return result;
  }

  function log() {
    if (!settings().debug || !window.console) return;

    var args = Array.prototype.slice.call(arguments);
    args.unshift("[TV Player Remake]");

    console.log.apply(console, args);
  }

  function resolveElement(value) {
    if (value && value.nodeType === 1) return value;

    if (typeof value === "string") {
      return document.getElementById(value.replace(/^#/, ""));
    }

    return null;
  }

  function parseTime(value) {
    if (typeof value === "number" && isFinite(value)) {
      return Math.max(0, value);
    }

    if (typeof value !== "string") return 0;

    if (/^\d+(\.\d+)?$/.test(value)) {
      return Math.max(0, Number(value));
    }

    var parts = value.split(":").map(Number);

    if (!parts.length || parts.some(function (part) {
      return !isFinite(part);
    })) {
      return 0;
    }

    return parts.reduce(function (total, part) {
      return total * 60 + part;
    }, 0);
  }

  function getVideoId(config) {
    config = config || {};

    var args = config.args || config;

    var id =
      args.video_id ||
      args.videoId ||
      args.docid ||
      args.v ||
      config.video_id ||
      config.videoId;

    if (!id && args.player_response) {
      try {
        var response = typeof args.player_response === "string"
          ? JSON.parse(args.player_response)
          : args.player_response;

        id = response && response.videoDetails && response.videoDetails.videoId;
      } catch (_) {}
    }

    if (!id && args.video_url) {
      var match = String(args.video_url).match(/[?&]v=([a-zA-Z0-9_-]{6,})/);

      if (match) id = match[1];
    }

    return id ? String(id) : "";
  }

  function thumbnailFor(data) {
    var list = Array.isArray(data && data.videoThumbnails)
      ? data.videoThumbnails.slice()
      : [];

    list.sort(function (a, b) {
      return (Number(a.width) || 0) - (Number(b.width) || 0);
    });

    for (var i = list.length - 1; i >= 0; i--) {
      if (list[i] && list[i].url) return list[i].url;
    }

    return "";
  }

  function qualityNumber(format) {
    var value = String(
      format.qualityLabel ||
      format.quality ||
      format.resolution ||
      ""
    );

    var match = value.match(/(\d{3,4})\s*p/i) || value.match(/(\d{3,4})/);

    return match ? Number(match[1]) : 0;
  }

  function canPlay(video, format) {
    if (!format || !format.url) return false;

    var mime = String(format.type || format.mimeType || "").split(";")[0].trim();

    if (!mime || mime.indexOf("video/") !== 0) return false;

    if (
      mime.indexOf("mp4") < 0 &&
      mime.indexOf("webm") < 0 &&
      mime.indexOf("ogg") < 0
    ) {
      return false;
    }

    try {
      return !video.canPlayType || video.canPlayType(mime) !== "";
    } catch (_) {
      return true;
    }
  }

  function normalizeRawQuality(value, fallback) {
    var quality = String(value || "").toLowerCase().trim();

    if (!quality || quality === "auto") {
      quality = String(fallback || "medium").toLowerCase();
    }

    var aliases = {
      "480": "medium",
      "480p": "medium",
      "720": "hd720",
      "720p": "hd720",
      "360": "small",
      "360p": "small",
      "240": "tiny",
      "240p": "tiny"
    };

    quality = aliases[quality] || quality;

    if ([
      "medium",
      "hd720",
      "small",
      "tiny",
      "dash",
      "best",
      "worst"
    ].indexOf(quality) < 0) {
      quality = String(fallback || "medium").toLowerCase();
    }

    return quality;
  }

  function rawQualityLabel(quality) {
    var labels = {
      medium: "480p",
      hd720: "720p",
      small: "360p",
      tiny: "240p",
      dash: "auto",
      best: "auto",
      worst: "auto"
    };

    return labels[quality] || quality;
  }

  function makeRawEmbedUrl(videoId, quality) {
    var cfg = settings();

    quality = normalizeRawQuality(quality, cfg.rawQuality);

    return cfg.embedBaseUrl +
      "/embed/" +
      encodeURIComponent(videoId) +
      "?raw=1&quality=" +
      encodeURIComponent(quality);
  }

  function makeError(message, code, cause) {
    var error = new Error(message || "Player error");

    error.code = code || 2;

    if (cause) error.cause = cause;

    return error;
  }

  function requestJson(url, timeout) {
    if (typeof window.fetch !== "function") {
      return Promise.reject(
        makeError("This browser does not support fetch().", 2)
      );
    }

    var controller = typeof window.AbortController === "function"
      ? new window.AbortController()
      : null;

    var timer = controller
      ? window.setTimeout(function () {
          controller.abort();
        }, timeout)
      : null;

    return window.fetch(url, {
      method: "GET",
      mode: "cors",
      credentials: "omit",
      cache: "no-store",
      signal: controller ? controller.signal : undefined,
      headers: {
        "Accept": "application/json"
      }
    }).then(function (response) {
      if (!response.ok) {
        throw makeError(
          "Invidious returned HTTP " + response.status + " for " + url,
          2
        );
      }

      return response.json();
    }).finally(function () {
      if (timer !== null) {
        window.clearTimeout(timer);
      }
    });
  }

  function loadHlsJs(url) {
    if (window.Hls) return Promise.resolve(window.Hls);

    if (hlsScriptPromise) return hlsScriptPromise;

    hlsScriptPromise = new Promise(function (resolve, reject) {
      var script = document.createElement("script");

      script.src = url;
      script.async = true;

      script.onload = function () {
        if (window.Hls) {
          resolve(window.Hls);
        } else {
          reject(
            makeError(
              "hls.js loaded but window.Hls was not created.",
              5
            )
          );
        }
      };

      script.onerror = function () {
        hlsScriptPromise = null;

        reject(
          makeError("Could not load hls.js from " + url, 5)
        );
      };

      (document.head || document.documentElement).appendChild(script);
    });

    return hlsScriptPromise;
  }

  function Player(targetValue, config, id) {
    this.target = resolveElement(targetValue);

    if (!this.target) {
      this.target = document.createElement("div");

      this.target.id = typeof targetValue === "string"
        ? targetValue.replace(/^#/, "")
        : "player";

      (document.body || document.documentElement).appendChild(this.target);
    }

    this.id = id;
    this.config = config || {};
    this.args = this.config.args || {};

    this.listeners = Object.create(null);

    this.ready = false;
    this.destroyed = false;
    this.state = -1;
    this.lastError = null;
    this.ignoreNextPause = false;

    this.videoId = "";
    this.videoData = {};

    this.formats = [];
    this.selectedFormat = null;
    this.selectedQuality = settings().rawQuality;

    this.playlist = [];
    this.playlistIndex = -1;

    this.loop = false;
    this.shuffle = false;
    this.autonav = true;

    this.hls = null;

    this.progressTimer = null;
    this.heartbeatTimer = null;

    this.startAt = 0;
this.lastProgress = 0;
this.seeking = false;
this.pendingSeekTime = null;

    this.options = {
      captions: {
        track: {},
        tracklist: []
      }
    };

    this.infoVisible = false;

    this.volume = 100;
    this.muted = !!this.args.mute;

    this.root = this.findOrCreateRoot();
    this.video = this.findOrCreateVideo();

    this.bindMediaEvents();
    this.applyInitialSettings();

    this.api = this.makeApi();
    this.registerIds();

    this.loadNewVideoConfig(this.config);

    var self = this;

    window.setTimeout(function () {
      self.signalReady();
    }, 0);
  }

  Player.prototype.findOrCreateRoot = function () {
    var root = this.target;

    if (
      !(root.classList && root.classList.contains("html5-video-player")) &&
      root.id !== this.id
    ) {
      root = root.querySelector && root.querySelector(".html5-video-player");
    }

    if (!root) {
      root = document.createElement("div");

      root.className = "html5-video-player";

      root.style.cssText =
        "position:relative;width:100%;height:100%;min-height:180px;background:#000;overflow:hidden;";

      this.target.appendChild(root);
    }

    root.classList.add("html5-video-player");

    if (!root.id && this.target !== root) {
      root.id = this.id;
    }

    root.setAttribute("data-tv-player-remake", VERSION);

    if (!root.style.position) {
      root.style.position = "relative";
    }

    if (!root.style.backgroundColor) {
      root.style.backgroundColor = "#000";
    }

    return root;
  };

  Player.prototype.findOrCreateVideo = function () {
    var video = this.root.querySelector("video");

    if (!video) {
      video = document.createElement("video");

      video.className = "video-stream html5-main-video";

      video.setAttribute("playsinline", "");
      video.playsInline = true;
      video.preload = "auto";
      video.controls = false;
      video.disablePictureInPicture = true;

      video.style.cssText =
        "display:block;width:100%;height:100%;max-width:100%;max-height:100%;object-fit:contain;background:#000;";

      this.root.appendChild(video);
    }

    video.classList.add("video-stream", "html5-main-video");

    video.controls = false;
    video.playsInline = true;
    video.preload = "auto";

    return video;
  };

  Player.prototype.applyInitialSettings = function () {
    var args = this.args || {};

    var volume = Number(args.volume);

    if (isFinite(volume)) {
      this.volume = Math.max(0, Math.min(100, volume));
    }

    this.video.volume = this.volume / 100;
    this.video.muted = this.muted;

    var rate = Number(args.playback_rate || args.playbackRate);

    if (isFinite(rate) && rate > 0) {
      this.video.playbackRate = rate;
    }
  };

  Player.prototype.registerIds = function () {
    instances[this.id] = this;

    if (this.target.id) {
      instances[this.target.id] = this;
    }

    if (this.root.id) {
      instances[this.root.id] = this;
    }

    instances.movie_player = this;
  };

  Player.prototype.on = function (name, callback) {
    if (typeof callback !== "function") return;

    var list = this.listeners[name] || (this.listeners[name] = []);

    if (list.indexOf(callback) < 0) {
      list.push(callback);
    }

    if (name === "onReady" && this.ready) {
      var self = this;

      window.setTimeout(function () {
        callback.call(self.api, self.api);
      }, 0);
    }
  };

  Player.prototype.off = function (name, callback) {
    var list = this.listeners[name];

    if (!list) return;

    if (!callback) {
      delete this.listeners[name];
      return;
    }

    this.listeners[name] = list.filter(function (item) {
      return item !== callback;
    });
  };

  Player.prototype.emit = function (name, value) {
    var list = (this.listeners[name] || []).slice();

    for (var i = 0; i < list.length; i++) {
      try {
        list[i].call(this.api, value);
      } catch (error) {
        window.setTimeout(function (e) {
          return function () {
            throw e;
          };
        }(error), 0);
      }
    }
  };

  Player.prototype.signalReady = function () {
    if (this.destroyed || this.ready) return;

    this.ready = true;

    var callback = this.args && this.args.jsapicallback;

    if (
      typeof callback === "string" &&
      typeof window[callback] === "function"
    ) {
      try {
        window[callback](this.api);
      } catch (error) {
        log("jsapicallback failed", error);
      }
    } else if (typeof callback === "function") {
      try {
        callback(this.api);
      } catch (error) {
        log("jsapicallback failed", error);
      }
    }

    this.emit("onReady", this.api);
    this.emit("onApiChange");

    this.startTimers();

    log("ready", this.id, this.videoId || "no video id yet");
  };

  Player.prototype.startTimers = function () {
    var self = this;

    if (this.progressTimer !== null) {
      window.clearInterval(this.progressTimer);
    }

    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
    }

    this.progressTimer = window.setInterval(function () {
      if (
        !self.destroyed &&
        self.video &&
        self.video.readyState >= 1
      ) {
        self.emitProgress();
      }
    }, 1000);

    this.heartbeatTimer = window.setInterval(function () {
      if (
        !self.destroyed &&
        self.video &&
        self.video.readyState >= 1
      ) {
        self.emit("onHeartbeat", self.getProgressState());
      }
    }, 5000);
  };

  Player.prototype.bindMediaEvents = function () {
    var self = this;
    var video = this.video;

    video.addEventListener("loadstart", function () {
        self.setState(3);
    });

    video.addEventListener("waiting", function () {
        if (!video.paused) self.setState(3);
    });

    video.addEventListener("stalled", function () {
        if (self.state === 1) self.setState(3);
    });

    video.addEventListener("playing", function () {
        self.setState(1);
        self.emit("onPlayVideo", self.getVideoData());
        self.emitProgress();
    });

    video.addEventListener("play", function () {
        self.setState(1);
    });

    video.addEventListener("pause", function () {
        if (self.ignoreNextPause) {
            self.ignoreNextPause = false;
            return;
        }

        if (!video.ended && self.state !== 0 && self.state !== -1) {
            self.setState(2);
        }
    });

    video.addEventListener("ended", function () {
        self.setState(0);
        self.emitProgress();

        if (self.loop) {
            self.seekTo(0, true);
        } else if (
            self.playlistIndex >= 0 &&
            self.playlistIndex < self.playlist.length - 1
        ) {
            self.nextVideo();
        } else if (self.autonav) {
            self.emit("onAutonavDismissed");
        }
    });

    video.addEventListener("loadedmetadata", function () {
        if (self.startAt > 0) {
            try {
                video.currentTime = self.startAt;
            } catch (_) {}

            self.startAt = 0;
        }

        log("media metadata loaded", {
            currentSrc: video.currentSrc || video.src,
            duration: video.duration
        });

        self.emit("onLoadedMetadata", self.getVideoData());
        self.emitProgress();
    });

    video.addEventListener("durationchange", function () {
        self.emitProgress();
    });

    video.addEventListener("timeupdate", function () {
        self.emitProgress();
    });

    video.addEventListener("progress", function () {
        self.emitProgress();
    });

    video.addEventListener("seeking", function () {
        self.seeking = true;
    });

    video.addEventListener("seeked", function () {
        self.seeking = false;
        self.pendingSeekTime = null;
        self.emitProgress();
    });

    video.addEventListener("volumechange", function () {
        self.volume = Math.round(video.volume * 100);
        self.muted = !!video.muted;

        self.emit("onVolumeChange", {
            volume: self.volume,
            muted: self.muted
        });
    });

    video.addEventListener("ratechange", function () {
        self.emit("onPlaybackRateChange", video.playbackRate);
    });

    video.addEventListener("error", function () {
        var mediaError = video.error;

        var message = mediaError
            ? "HTML5 media error " + mediaError.code
            : "Unknown HTML5 media error";

        self.fail(
            makeError(message, mediaError ? mediaError.code : 2)
        );
    });
};

  Player.prototype.setState = function (state) {
    if (this.state === state) return;

    this.state = state;
    this.emit("onStateChange", state);
  };

  Player.prototype.emitProgress = function () {
    var progress = this.getProgressState();

    this.lastProgress = progress.currentTime;

    // The 2018 YouTube TV client expects a number, not a progress object.
    this.emit("onVideoProgress", progress.currentTime);
};

  Player.prototype.getProgressState = function () {
    var video = this.video;
    var duration = Number(video.duration);

    if (!isFinite(duration)) {
        duration = 0;
    }

    var loaded = 0;

    try {
        if (duration > 0 && video.buffered.length) {
            loaded = video.buffered.end(
                video.buffered.length - 1
            ) / duration;
        }
    } catch (_) {}

    var seekableStart = 0;
    var seekableEnd = duration;

    try {
        if (video.seekable && video.seekable.length) {
            seekableStart = video.seekable.start(0);
            seekableEnd = video.seekable.end(
                video.seekable.length - 1
            );
        }
    } catch (_) {}

    var currentTime = this.seeking && this.pendingSeekTime !== null
    ? this.pendingSeekTime
    : (Number(video.currentTime) || 0);

    return {
        currentTime: currentTime,
        duration: duration,
        loaded: Math.max(0, Math.min(1, loaded)),
        seekableStart: seekableStart,
        seekableEnd: seekableEnd,
        ingestionTime: NaN,
        isAtLiveHead: duration > 0 &&
            duration - currentTime < 3,
        allowSeeking: true,
        isLive: !isFinite(video.duration)
    };
};

  Player.prototype.fail = function (error) {
    this.lastError = error || makeError("Unknown player error", 2);

    this.setState(-1);

    var payload = {
      errorCode: this.lastError.code || 2,
      message: this.lastError.message,
      error: this.lastError
    };

    this.emit("onError", payload.errorCode);
    this.emit("onDetailedError", payload);

    log("error", payload.message);
  };

  Player.prototype.setRawVideoSource = function (videoId, quality) {
    if (!videoId) return "";

    var cfg = settings();

    quality = normalizeRawQuality(quality, cfg.rawQuality);

    var url = makeRawEmbedUrl(videoId, quality);

    this.selectedQuality = quality;

    this.selectedFormat = {
      quality: quality,
      qualityLabel: rawQualityLabel(quality),
      url: url
    };

    this.formats = [this.selectedFormat];

    if (this.hls) {
      try {
        this.hls.destroy();
      } catch (_) {}

      this.hls = null;
    }

    log("using Invidious raw media URL", url);

    if (!this.video.paused) {
      this.ignoreNextPause = true;
      this.video.pause();
    }

    this.video.removeAttribute("src");
    this.video.src = url;
    this.video.load();

    this.video.addEventListener("seeking", function () {
    self.seeking = true;
});

this.video.addEventListener("seeked", function () {
    self.seeking = false;
    self.pendingSeekTime = null;
});

    return url;
  };

  Player.prototype.fetchVideo = function (videoId) {
    var self = this;
    var cfg = settings();

    var url =
        cfg.invidiousBaseUrl +
        "/videos/" +
        encodeURIComponent(videoId) +
        "?hl=en-US";

    var storyboardUrl =
    cfg.invidiousBaseUrl.replace(/\/$/, "") +
    "/storyboards/" +
    encodeURIComponent(videoId) +
    "?height=90";

    log("fetch metadata", url);
    log("fetch storyboard", storyboardUrl);

    self.storyboardLevels = [];
    self.storyboardCues = [];
    self.storyboardFormat = null;

    function parseStoryboard(vtt, instanceUrl) {
    var lines = String(vtt || "").split(/\r?\n/);
    var cues = [];
    var currentStart = null;
    var currentEnd = null;

    function parseTimestamp(value) {
        var parts = value.trim().split(":");
        var seconds = 0;

        for (var i = 0; i < parts.length; i++) {
            seconds = seconds * 60 + Number(parts[i]);
        }

        return seconds;
    }

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();

        var timestamp = line.match(
            /^(\d{2}:\d{2}:\d{2}\.\d{3})\s+-->\s+(\d{2}:\d{2}:\d{2}\.\d{3})/
        );

        if (timestamp) {
            currentStart = parseTimestamp(timestamp[1]);
            currentEnd = parseTimestamp(timestamp[2]);
            continue;
        }

        if (currentStart !== null && line.indexOf("#xywh=") !== -1) {
            var match = line.match(
                /#xywh=(\d+),(\d+),(\d+),(\d+)/
            );

            if (match) {
                var x = Number(match[1]);
                var y = Number(match[2]);

                var imageUrl = line.split("#")[0];

                try {
                    imageUrl = new URL(
                        imageUrl,
                        instanceUrl
                    ).href;
                } catch (error) {
                    currentStart = null;
                    currentEnd = null;
                    continue;
                }

                cues.push({
                    start: currentStart,
                    end: currentEnd,
                    url: imageUrl,
                    x: x,
                    y: y,
                    width: Number(match[3]),
                    height: Number(match[4])
                });
            }

            currentStart = null;
            currentEnd = null;
        }
    }

    // Calculate each sprite sheet's grid independently.
    var sheets = {};

    cues.forEach(function (cue) {
        if (!sheets[cue.url]) {
            sheets[cue.url] = {
                columns: [],
                rows: []
            };
        }

        if (sheets[cue.url].columns.indexOf(cue.x) === -1) {
            sheets[cue.url].columns.push(cue.x);
        }

        if (sheets[cue.url].rows.indexOf(cue.y) === -1) {
            sheets[cue.url].rows.push(cue.y);
        }
    });

    Object.keys(sheets).forEach(function (url) {
        sheets[url].columns.sort(function (a, b) {
            return a - b;
        });

        sheets[url].rows.sort(function (a, b) {
            return a - b;
        });
    });

    cues.forEach(function (cue) {
        var sheet = sheets[cue.url];

        cue.columns = sheet.columns.length;
        cue.rows = sheet.rows.length;

        cue.column = sheet.columns.indexOf(cue.x);
        cue.row = sheet.rows.indexOf(cue.y);
    });

    return cues;
}

    return requestJson(url, cfg.fetchTimeout).then(function (data) {
        if (!data || typeof data !== "object") {
            throw makeError("Invidious returned an invalid video response.", 2);
        }

        if (data.error) {
            throw makeError(String(data.error), 2);
        }

        self.videoData = {
            videoId: data.videoId || videoId,
            video_id: data.videoId || videoId,
            title: data.title || "",
            author: data.author || data.authorId || "",
            channelId: data.authorId || "",
            duration: Number(data.lengthSeconds) || 0,
            lengthSeconds: Number(data.lengthSeconds) || 0,
            view_count: Number(data.viewCount) || 0,
            isLive: !!data.liveNow,
            thumbnails: data.videoThumbnails || [],
            description: data.description || ""
        };

        var poster = thumbnailFor(data);

        if (poster) {
            self.video.poster = poster;
        }

        self.emit("videodatachange", self.getVideoData());
        self.emit("onVideoDataChange", self.getVideoData());
        self.emit("onPlaybackQualityChange", self.getPlaybackQuality());

        // Fetch the WebVTT storyboard separately.
        var controller = typeof window.AbortController === "function"
            ? new window.AbortController()
            : null;

        var timer = controller
            ? window.setTimeout(function () {
                controller.abort();
            }, cfg.fetchTimeout)
            : null;

        return window.fetch(storyboardUrl, {
            method: "GET",
            mode: "cors",
            credentials: "omit",
            cache: "no-store",
            signal: controller ? controller.signal : undefined,
            headers: {
                Accept: "text/vtt, text/plain, */*"
            }
        })
        .then(function (response) {
            if (!response.ok) {
                throw new Error("Storyboard HTTP " + response.status);
            }

            return response.text();
        })
        .then(function (vtt) {
            var cues = parseStoryboard(vtt);

            self.storyboardCues = cues;
            self.storyboardFormat = "vtt";

            if (cues.length) {
                self.storyboardLevels = [
                    {
                        index: 0,
                        width: cues[0].width,
                        height: cues[0].height,
                        count: cues.length,
                        interval: cues[0].end - cues[0].start
                    }
                ];
            }

            log(
                "storyboard loaded",
                cues.length,
                "frames",
                self.storyboardLevels.length,
                "levels"
            );

            return data;
        })
        .catch(function (error) {
            self.storyboardLevels = [];
            self.storyboardCues = [];

            log("storyboard unavailable:", error.message);

            return data;
        })
        .finally(function () {
            if (timer !== null) {
                window.clearTimeout(timer);
            }
        });
    });
};

  Player.prototype.attachHls = function (url) {
    var self = this;
    var cfg = settings();

    if (this.video.canPlayType("application/vnd.apple.mpegurl")) {
      this.video.src = url;
      this.video.load();

      return Promise.resolve();
    }

    return loadHlsJs(cfg.hlsJsUrl).then(function (Hls) {
      if (!Hls.isSupported()) {
        throw makeError(
          "This browser does not support Media Source Extensions for HLS playback.",
          5
        );
      }

      if (self.hls) {
        try {
          self.hls.destroy();
        } catch (_) {}
      }

      self.hls = new Hls({
        enableWorker: true
      });

      self.hls.on(Hls.Events.ERROR, function (_event, data) {
        if (data && data.fatal) {
          self.fail(
            makeError(
              "HLS playback failed: " +
                (data.details || data.type || "unknown error"),
              5
            )
          );
        }
      });

      self.hls.loadSource(url);
      self.hls.attachMedia(self.video);
    });
  };

  Player.prototype.loadNewVideoConfig = function (config) {
    if (this.destroyed) return;

    this.config = config || this.config || {};
    this.args = this.config.args || this.args || {};

    var id = getVideoId(this.config);

    if (id) {
      this.selectedQuality = normalizeRawQuality(
        this.args.quality ||
          this.args.player_quality ||
          settings().rawQuality,
        settings().rawQuality
      );

      this.loadVideoById(
        id,
        parseTime(
          this.args.start ||
            this.args.startSeconds ||
            this.args.t
        )
      );
    }
  };

  Player.prototype.loadVideoById = function (id, startSeconds) {
    if (!id) return;

    this.videoId = String(id);
    this.startAt = parseTime(startSeconds);
    this.lastError = null;

    this.videoData = {
      videoId: this.videoId,
      video_id: this.videoId
    };

    this.setState(3);
    this.emit("onPlayVideo", this.getVideoData());

    // Start loading the raw endpoint immediately.
    // The browser reads the actual media type after the redirect.
    this.setRawVideoSource(this.videoId, this.selectedQuality);

    // Metadata is optional for playback.
    // An API/metadata failure must not prevent raw playback.
    var self = this;

    this.fetchVideo(this.videoId).catch(function (error) {
      log(
        "video metadata unavailable; raw playback continues",
        error && error.message
      );
    });
  };

  Player.prototype.cueVideoById = function (id, startSeconds) {
    this.pauseVideo();
    this.loadVideoById(id, startSeconds);
    this.setState(5);
  };

  Player.prototype.loadVideoByPlayerVars = function (vars) {
    vars = vars || {};

    var id = getVideoId({
      args: vars
    });

    if (!id && vars.video_url) {
      id = this.extractId(vars.video_url);
    }

    if (vars.playlist) {
      this.playlist = Array.isArray(vars.playlist)
        ? vars.playlist.slice()
        : this.playlist;
    }

    if (id) {
      this.loadVideoById(
        id,
        vars.start || vars.startSeconds || vars.t
      );
    }
  };

  Player.prototype.cueVideoByPlayerVars = function (vars) {
    this.pauseVideo();
    this.loadVideoByPlayerVars(vars);
    this.setState(5);
  };

  Player.prototype.extractId = function (url) {
    var match =
      String(url || "").match(/[?&]v=([a-zA-Z0-9_-]{6,})/) ||
      String(url || "").match(/youtu\.be\/([a-zA-Z0-9_-]{6,})/);

    return match ? match[1] : "";
  };

  Player.prototype.loadVideoByUrl = function (url, startSeconds) {
    var id = this.extractId(url);

    if (id) {
      this.loadVideoById(id, startSeconds);
    } else {
      this.videoId = "";
      this.video.src = String(url || "");
      this.video.load();
    }
  };

  Player.prototype.cueVideoByUrl = function (url, startSeconds) {
    this.pauseVideo();
    this.loadVideoByUrl(url, startSeconds);
    this.setState(5);
  };

  Player.prototype.playVideo = function () {
    var result;

    try {
      result = this.video.play();
    } catch (error) {
      this.fail(error);
      return;
    }

    if (result && typeof result.catch === "function") {
      result.catch(function (error) {
        log("play() was rejected", error && error.message);
      });
    }
  };

  Player.prototype.pauseVideo = function () {
    try {
      this.video.pause();
    } catch (_) {}
  };

  Player.prototype.stopVideo = function () {
    this.pauseVideo();

    try {
      this.video.currentTime = 0;
    } catch (_) {}

    this.setState(0);
  };

Player.prototype.seekTo = function (seconds) {
    seconds = Number(seconds);
    if (!isFinite(seconds)) return;

    var duration = Number(this.video.duration);
    if (!isFinite(duration) || duration <= 0) return;

    seconds = Math.max(0, Math.min(seconds, duration));

    this.seeking = true;
    this.pendingSeekTime = seconds;

    try {
        this.video.currentTime = seconds;
    } catch (error) {
        this.seeking = false;
        this.pendingSeekTime = null;
        return;
    }

    this.emitProgress();
};


  Player.prototype.getApiInterface = function () {
    return Object.keys(this.api).filter(function (key) {
      return typeof this.api[key] === "function";
    }, this);
  };

 Player.prototype.makeApi = function () {
    var self = this;

    var api = {
        getId: function () {
            return self.id;
        },

        getPlayerType: function () {
            return 1;
        },

        getPresentingPlayerType: function () {
            return 1;
        },

        isReady: function () {
            return !!self.ready && !self.destroyed;
        },

        getLastError: function () {
            return self.lastError;
        },

        getCurrentVideoConfig: function () {
            return self.config;
        },

        loadNewVideoConfig: function (config) {
            return self.loadNewVideoConfig(config);
        },

        addEventListener: function (name, callback) {
            self.on(name, callback);
        },

        removeEventListener: function (name, callback) {
            self.off(name, callback);
        },

        isInline: function () {
            return true;
        },

        destroy: function () {
            return self.destroy();
        },

        // Storyboard format.
        getStoryboardFormat: function () {
            return self.storyboardFormat || null;
        },

        // Number of available storyboard levels.
        getNumberOfStoryboardLevels: function () {
            return Array.isArray(self.storyboardLevels)
                ? self.storyboardLevels.length
                : 0;
        },

        // Returns information about a storyboard level.
        getStoryboardLevel: function (levelIndex) {
            var levels = self.storyboardLevels;

            if (!Array.isArray(levels)) {
                return null;
            }

            levelIndex = Number(levelIndex);

            if (
                !Number.isInteger(levelIndex) ||
                levelIndex < 0 ||
                levelIndex >= levels.length
            ) {
                return null;
            }

            var level = levels[levelIndex];

            if (!level) {
                return null;
            }

            return Object.assign({}, level, {
                index: levelIndex
            });
        },

        // Finds the storyboard frame corresponding to playback time.
        getStoryboardFrameIndex: function (seconds, levelIndex) {
            var levels = self.storyboardLevels;
            var cues = self.storyboardCues;

            if (
                !Array.isArray(levels) ||
                !Array.isArray(cues) ||
                !cues.length
            ) {
                return -1;
            }

            levelIndex = Number(levelIndex);

            if (
                !Number.isInteger(levelIndex) ||
                !levels[levelIndex]
            ) {
                return -1;
            }

            seconds = Number(seconds);

            if (!Number.isFinite(seconds) || seconds < 0) {
                return -1;
            }

            // Find the cue containing this timestamp.
            for (var i = 0; i < cues.length; i++) {
                var cue = cues[i];

                if (
                    seconds >= cue.start &&
                    seconds < cue.end
                ) {
                    return i;
                }

                // If there is a gap, use the preceding frame.
                if (seconds < cue.start) {
                    return Math.max(0, i - 1);
                }
            }

            // Allow the final frame to remain selected at the end.
            return cues.length - 1;
        },

        // Returns the sprite-sheet crop information for a frame.
        getStoryboardFrame: function (frameIndex, levelIndex) {
            var levels = self.storyboardLevels;
            var cues = self.storyboardCues;

            if (
                !Array.isArray(levels) ||
                !Array.isArray(cues)
            ) {
                return null;
            }

            frameIndex = Number(frameIndex);
            levelIndex = Number(levelIndex);

            if (
                !Number.isInteger(levelIndex) ||
                !levels[levelIndex] ||
                !Number.isInteger(frameIndex) ||
                frameIndex < 0 ||
                frameIndex >= cues.length
            ) {
                return null;
            }

            var cue = cues[frameIndex];

            if (!cue || !cue.url) {
                return null;
            }

            return {
                url: cue.url,

                columns: Math.max(1, Number(cue.columns) || 1),
                rows: Math.max(1, Number(cue.rows) || 1),

                column: Math.max(0, Number(cue.column) || 0),
                row: Math.max(0, Number(cue.row) || 0),

                width: Number(cue.width) || 158,
                height: Number(cue.height) || 90
            };
        },

        getCurrentTime: function () {
            return self.seeking && self.pendingSeekTime !== null
                ? self.pendingSeekTime
                : (Number(self.video.currentTime) || 0);
        },

        getDuration: function () {
            return isFinite(self.video.duration)
                ? self.video.duration
                : 0;
        },

        getMediaReferenceTime: function () {
            return self.seeking && self.pendingSeekTime !== null
                ? self.pendingSeekTime
                : (Number(self.video.currentTime) || 0);
        },

        getPlayerState: function () {
            return self.state;
        },

        getProgressState: function () {
            return self.getProgressState();
        },

        getVideoLoadedFraction: function () {
            return self.getProgressState().loaded;
        },

        getVideoBytesLoaded: function () {
            return Math.round(
                self.getProgressState().loaded * 1000000
            );
        },

        getVideoBytesTotal: function () {
            return 1000000;
        },

        getVideoStartBytes: function () {
            return 0;
        },

        playVideo: function () {
            return self.playVideo();
        },

        pauseVideo: function () {
            return self.pauseVideo();
        },

        stopVideo: function () {
            return self.stopVideo();
        },

        clearVideo: function () {
            return self.stopVideo();
        },

        play: function () {
            return self.playVideo();
        },

        pause: function () {
            return self.pauseVideo();
        },

        stop: function () {
            return self.stopVideo();
        },

        seekTo: function (time) {
            return self.seekTo(time);
        },

        getVolume: function () {
            return Math.round(self.video.volume * 100);
        },

        setVolume: function (volume) {
            volume = Number(volume);

            if (isFinite(volume)) {
                self.video.volume = Math.max(
                    0,
                    Math.min(100, volume)
                ) / 100;
            }
        },

        isMuted: function () {
            return !!self.video.muted;
        },

        mute: function () {
            self.video.muted = true;
        },

        unMute: function () {
            self.video.muted = false;
        },

        getPlaybackRate: function () {
            return self.video.playbackRate || 1;
        },

        setPlaybackRate: function (rate) {
            rate = Number(rate);

            if (isFinite(rate) && rate > 0) {
                self.video.playbackRate = rate;
            }
        },

        getAvailablePlaybackRates: function () {
            return [
                0.25, 0.5, 0.75, 1,
                1.25, 1.5, 1.75, 2
            ];
        },

        getPlaybackQuality: function () {
            return self.getPlaybackQuality();
        },

        setPlaybackQuality: function (quality) {
            return api.setPlaybackQualityRange(quality, quality);
        },

        setPlaybackQualityRange: function (min, max) {
            return self.setQuality(min, max);
        },

        getAvailableQualityLevels: function () {
            return self.getQualityLevels();
        },

        getMaxPlaybackQuality: function () {
            var levels = self.getQualityLevels();
            return levels[0] || "auto";
        },

        getUserPlaybackQualityPreference: function () {
            return "auto";
        },

        getVideoData: function () {
            return self.getVideoData();
        },

        getVideoUrl: function () {
            return self.videoId
                ? "https://www.youtube.com/watch?v=" +
                    encodeURIComponent(self.videoId)
                : "";
        },

        getVideoEmbedCode: function () {
            return self.videoId
                ? '<iframe src="https://www.youtube.com/embed/' +
                    self.videoId +
                    '"></iframe>'
                : "";
        },

        getDebugText: function () {
            return VERSION +
                " | " +
                (self.videoId || "no video") +
                " | state=" +
                self.state;
        },

        getBandwidthEstimate: function () {
            return 0;
        },

        reportPlaybackIssue: function () {
            log("reportPlaybackIssue");
        },

        showVideoInfo: function () {
            self.infoVisible = true;
            self.root.classList.add("ytp-show-info");
        },

        hideVideoInfo: function () {
            self.infoVisible = false;
            self.root.classList.remove("ytp-show-info");
        },

        isVideoInfoVisible: function () {
            return self.infoVisible;
        },

        getSphericalProperties: function () {
            return {};
        },

        setSphericalProperties: function () {},

        addCueRange: function () {
            return "";
        },

        removeCueRange: function () {
            return false;
        },

        setSize: function (width, height) {
            if (width) {
                self.root.style.width = typeof width === "number"
                    ? width + "px"
                    : String(width);
            }

            if (height) {
                self.root.style.height = typeof height === "number"
                    ? height + "px"
                    : String(height);
            }
        },

        getPlaylist: function () {
            return self.playlist.slice();
        },

        getPlaylistIndex: function () {
            return self.playlistIndex;
        },

        getPlaylistId: function () {
            return null;
        },

        loadPlaylist: function (items, index) {
            self.playlist = Array.isArray(items)
                ? items.slice()
                : [];

            self.playlistIndex = Math.max(0, Number(index) || 0);

            if (self.playlist.length) {
                self.loadVideoById(
                    self.playlist[self.playlistIndex]
                );
            }
        },

        cuePlaylist: function (items, index) {
            self.playlist = Array.isArray(items)
                ? items.slice()
                : [];

            self.playlistIndex = Math.max(0, Number(index) || 0);

            if (self.playlist.length) {
                self.cueVideoById(
                    self.playlist[self.playlistIndex]
                );
            }
        },

        nextVideo: function () {
            return self.nextVideo();
        },

        previousVideo: function () {
            return self.previousVideo();
        },

        playVideoAt: function (index) {
            return self.playVideoAt(index);
        },

        setShuffle: function (value) {
            self.shuffle = !!value;
        },

        setLoop: function (value) {
            self.loop = !!value;
        },

        setAutonav: function (value) {
            self.autonav = !!value;
        },

        setAutonavState: function (value) {
            self.autonav = !!value;
        },

        loadVideoById: function (id, start) {
            return self.loadVideoById(id, start);
        },

        cueVideoById: function (id, start) {
            return self.cueVideoById(id, start);
        },

        loadVideoByUrl: function (url, start) {
            return self.loadVideoByUrl(url, start);
        },

        cueVideoByUrl: function (url, start) {
            return self.cueVideoByUrl(url, start);
        },

        loadVideoByPlayerVars: function (vars) {
            return self.loadVideoByPlayerVars(vars);
        },

        cueVideoByPlayerVars: function (vars) {
            return self.cueVideoByPlayerVars(vars);
        },

        preloadVideoByPlayerVars: function (vars) {
            return self.preloadVideoByPlayerVars(vars);
        },

        updatePlaylist: function (items) {
            if (Array.isArray(items)) {
                self.playlist = items.slice();
            }
        },

        updateLastActiveTime: function () {},

        updateVideoData: function (data) {
            if (data && typeof data === "object") {
                self.videoData = Object.assign(
                    {},
                    self.videoData,
                    data
                );
            }
        },

        getAdState: function () {
            return 0;
        },

        skipAd: function () {
            self.emit("onAdStateChange", 0);
        },

        onAdUxClicked: function () {},
        confirmYpcRental: function () {},

        loadModule: function (name) {
            if (name === "captions") {
                self.loadCaptions();
            }
        },

        unloadModule: function () {},

        setOption: function (module, option, value) {
            return self.setOption(module, option, value);
        },

        getOption: function (module, option) {
            return self.getOption(module, option);
        },

        getOptions: function (module) {
            return self.getOptions(module);
        },

        getApiInterface: function () {
            return self.getApiInterface();
        },

        getInternalApiInterface: function () {
            return self.getApiInterface();
        },

        setHomeGroupInfo: function (value) {
            self.homeGroupInfo = value;
        },

        setLivingRoomAppMode: function (value) {
            self.livingRoomAppMode = value;
        },

        setEnablePrivacyFilter: function (value) {
            self.enablePrivacyFilter = value;
        },

        setSafetyMode: function (value) {
            self.safetyMode = value;
        },

        setAudioTrack: function () {},

        setBlackout: function (value) {
            self.root.style.visibility = value ? "hidden" : "";
        },

        setInline: function () {},
        setMinimized: function () {},
        setScreenLayer: function () {},

        getStatsForNerds: function () {
            return {};
        },

        channelSubscribed: function () {},
        channelUnsubscribed: function () {},

        isPictureInPictureAllowed: function () {
            return false;
        },

        togglePictureInPicture: function () {},

        isFastLoad: function () {
            return false;
        },

        isNotServable: function () {
            return false;
        },

        sendAbandonmentPing: function () {},
        setLoopRange: function () {},

        getLoopRange: function () {
            return null;
        },

        enqueueVideoByPlayerVars: function (vars) {
            var id = getVideoId({
                args: vars || {}
            });

            if (id) {
                self.playlist.push(id);
            }
        },

        clearQueue: function () {
            self.playlist = [];
            self.playlistIndex = -1;
        },

        getCurrentTime: function () {
            return Number(self.video.currentTime) || 0;
        },

        getAvailableAudioTracks: function () {
            return [];
        },

        getAudioTrack: function () {
            return null;
        },

        getVideoContentRect: function () {
            var video = self.video;
            var root = self.root;

            var rect = video.getBoundingClientRect();
            var rootRect = root.getBoundingClientRect();

            return {
                left: rect.left - rootRect.left,
                top: rect.top - rootRect.top,
                width: rect.width,
                height: rect.height
            };
        },

        getPlayerResponse: function () {
            return self.playerResponse || null;
        },

        getDuration: function () {
            return isFinite(self.video.duration)
                ? self.video.duration
                : 0;
        },

        getProgressState: function () {
            return self.getProgressState();
        }
    };

    if (typeof Proxy === "function") {
        return new Proxy(api, {
            get: function (target, key) {
                if (key === "then") return undefined;
                if (key in target) return target[key];
                if (typeof key === "symbol") return target[key];

                return function () {
                    log("unimplemented player API call:", key);
                };
            }
        });
    }

    return api;
};

  Player.prototype.getPlaybackQuality = function () {
    return this.selectedFormat
      ? (
          this.selectedFormat.qualityLabel ||
          this.selectedFormat.quality ||
          "auto"
        )
      : "auto";
  };

  Player.prototype.getVideoData = function () {
    var data = this.videoData || {};

    return {
      videoId: data.videoId || this.videoId,
      video_id: data.video_id || this.videoId,
      title: data.title || "",
      author: data.author || "",
      lengthSeconds: Number(data.lengthSeconds || data.duration) || 0,
      duration: Number(data.duration || data.lengthSeconds) || 0,
      viewCount: Number(data.view_count) || 0,
      isLive: !!data.isLive,
      thumbnails: data.thumbnails || []
    };
  };

  Player.prototype.getQualityLevels = function () {
    var seen = Object.create(null);

    return this.formats.map(function (format) {
      return format.qualityLabel ||
        format.quality ||
        (qualityNumber(format) ? qualityNumber(format) + "p" : "auto");
    }).filter(function (value) {
      if (seen[value]) return false;

      seen[value] = true;
      return true;
    });
  };

  Player.prototype.setQuality = function (minimum, maximum) {
    if (!this.videoId) return;

    var cfg = settings();

    var quality = normalizeRawQuality(
      maximum || minimum || "auto",
      cfg.rawQuality
    );

    if (quality === this.selectedQuality) return;

    var time = Number(this.video.currentTime) || 0;
    var wasPlaying = !this.video.paused;

    this.setRawVideoSource(this.videoId, quality);

    var self = this;

    this.video.addEventListener("loadedmetadata", function restore() {
      self.video.removeEventListener("loadedmetadata", restore);

      try {
        self.video.currentTime = time;
      } catch (_) {}

      if (wasPlaying) {
        self.playVideo();
      }
    });

    this.emit("onPlaybackQualityChange", this.getPlaybackQuality());
  };

  Player.prototype.nextVideo = function () {
    if (!this.playlist.length) return;

    if (this.shuffle && this.playlist.length > 1) {
      var next = Math.floor(Math.random() * this.playlist.length);

      if (next === this.playlistIndex) {
        next = (next + 1) % this.playlist.length;
      }

      this.playlistIndex = next;
    } else {
      this.playlistIndex = (this.playlistIndex + 1) % this.playlist.length;
    }

    this.loadVideoById(this.playlist[this.playlistIndex]);
  };

  Player.prototype.previousVideo = function () {
    if (!this.playlist.length) return;

    this.playlistIndex = (
      this.playlistIndex - 1 + this.playlist.length
    ) % this.playlist.length;

    this.loadVideoById(this.playlist[this.playlistIndex]);
  };

  Player.prototype.playVideoAt = function (index) {
    index = Number(index);

    if (!this.playlist.length || !isFinite(index)) return;

    this.playlistIndex = Math.max(
      0,
      Math.min(this.playlist.length - 1, Math.floor(index))
    );

    this.loadVideoById(this.playlist[this.playlistIndex]);
  };

  Player.prototype.preloadVideoByPlayerVars = function (vars) {
    var id = getVideoId({
      args: vars || {}
    });

    if (!id || typeof window.fetch !== "function") {
      return Promise.resolve(null);
    }

    var url =
      settings().invidiousBaseUrl +
      "/videos/" +
      encodeURIComponent(id) +
      "?hl=en-US";

    return requestJson(url, settings().fetchTimeout).catch(function () {
      return null;
    });
  };

  Player.prototype.setOption = function (module, option, value) {
    if (!this.options[module]) {
      this.options[module] = {};
    }

    if (option) {
      this.options[module][option] = value;
    }

    return true;
  };

  Player.prototype.getOption = function (module, option) {
    var options = this.options[module];

    return options && option ? options[option] : options || null;
  };

  Player.prototype.getOptions = function (module) {
    return this.options[module] ? Object.keys(this.options[module]) : [];
  };

  Player.prototype.loadCaptions = function () {
    this.emit("onApiChange");
  };

  Player.prototype.destroy = function () {
    if (this.destroyed) return;

    this.destroyed = true;

    if (this.progressTimer !== null) {
      window.clearInterval(this.progressTimer);
    }

    if (this.heartbeatTimer !== null) {
      window.clearInterval(this.heartbeatTimer);
    }

    if (this.hls) {
      try {
        this.hls.destroy();
      } catch (_) {}

      this.hls = null;
    }

    try {
      this.video.pause();
    } catch (_) {}

    try {
      this.video.removeAttribute("src");
      this.video.load();
    } catch (_) {}

    Object.keys(instances).forEach(function (key) {
      if (instances[key] === this) {
        delete instances[key];
      }
    }, this);

    this.listeners = Object.create(null);
    this.emit("onDestroy");
  };

  function create(target, config) {
    var element = resolveElement(target);
    var args = config && config.args || {};
    var attrs = config && config.attrs || {};

    var id = String(
      attrs.id ||
      args.playerapiid ||
      (element && element.id) ||
      "movie_player"
    );

    var existing = instances[id];

    if (existing && !existing.destroyed && existing.target === element) {
      existing.loadNewVideoConfig(config || {});
      return existing.api;
    }

    var player = new Player(target, config || {}, id);

    return player.api;
  }

  function getById(id) {
    var player = instances[String(id)] || null;

    return player && !player.destroyed ? player.api : null;
  }

  var yt = window.yt || (window.yt = {});

  yt.player = yt.player || {};
  yt.player.instances = yt.player.instances || {};

  yt.player.instances.create = create;
  yt.player.instances.getById = getById;

  window.__TV_PLAYER_REMAKE__ = {
    version: VERSION,
    instances: instances,
    getById: getById,
    settings: settings
  };

  log("installed", VERSION);
})(window, document);