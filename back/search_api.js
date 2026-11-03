const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseURL = "https://inv.truehosting.net/api/v1";
const logsDir = path.join(__dirname, "logs");

if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

function asText(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);

  if (value && typeof value === "object") {
    if (typeof value.simpleText === "string") {
      return value.simpleText;
    }

    if (Array.isArray(value.runs)) {
      return value.runs
        .map((run) => (run && run.text ? run.text : ""))
        .join("");
    }
  }

  return fallback;
}

function formatViewCount(video) {
  const existing = asText(video.viewCountText, "");

  if (existing) return existing;

  const count = Number(video.viewCount);

  if (Number.isFinite(count) && count >= 0) {
    return `${new Intl.NumberFormat("en-US").format(count)} views`;
  }

  return "Views unavailable";
}

function convertInvVidStructToV10(video) {
  const videoId = String(video.videoId || "");
  const title = String(video.title || "Untitled video");
  const author = String(video.author || "Unknown channel");
  const authorId = String(video.authorId || "");

  const publishedText = String(video.publishedText || "");

  const viewCount = Number(video.viewCount || 0);
  const viewCountText =
    video.viewCountText ||
    `${new Intl.NumberFormat("en-US").format(viewCount)} views`;

  const badges = [];

  const isLive = video.liveNow === true;
  const isUpcoming = video.isUpcoming === true;
  const is4k = video.is4k === true;
  const is8k = video.is8k === true;

  //console.log(video);

  const durationSeconds = Number(video.lengthSeconds || 0);

  const duration = isLive ? "LIVE" : formatDuration(durationSeconds);

  const durationLabel = isLive ? "Live stream" : `${durationSeconds} seconds`;

  const thumbnails = Array.isArray(video.videoThumbnails)
    ? video.videoThumbnails
        .filter(
          (item) => item && !["start", "middle", "end"].includes(item.quality),
        )
        .map(({ quality, ...thumbnail }) => thumbnail)
        .sort((a, b) => Number(a.width || 0) - Number(b.width || 0))
    : [];

  const thumbnailOverlays = [];

  // LIVE badge
  if (isLive) {
    thumbnailOverlays.push({
      thumbnailOverlayTimeStatusRenderer: {
        text: {
          runs: [{ text: "LIVE" }],
        },
        style: "LIVE",
      },
    });
  } else {
    // Normal duration badge
    thumbnailOverlays.push({
      thumbnailOverlayTimeStatusRenderer: {
        text: {
          runs: [{ text: duration }],
          accessibility: {
            accessibilityData: {
              label: durationLabel,
            },
          },
        },
        style: "DEFAULT",
      },
    });
  }

  // Quality badges
  if (is8k) {
    badges.push({
      textBadge: {
        label: {
          runs: [
            {
              text: "8K",
            },
          ],
        },
      },
    });
  } else if (is4k) {
    badges.push({
      textBadge: {
        label: {
          runs: [
            {
              text: "4K",
            },
          ],
        },
      },
    });
  }

  const authorRun = {
    text: author,
  };

  if (authorId) {
    authorRun.navigationEndpoint = {
      clickTrackingParams: "",
      browseEndpoint: {
        browseId: authorId,
      },
    };
  }

  const byline = {
    runs: [authorRun],
  };

  const navigationEndpoint = {
    clickTrackingParams: "",
    watchEndpoint: {
      videoId,
    },
  };

  return {
    gridVideoRenderer: {
      videoId,

      thumbnail: {
        thumbnails,
      },

      thumbnailOverlays,

      badges,

      title: {
        runs: [{ text: title }],
      },

      longBylineText: {
        runs: [{ ...authorRun }],
      },

      shortBylineText: byline,

      publishedTimeText: {
        runs: [{ text: publishedText }],
      },

      viewCountText: {
        runs: [{ text: viewCountText }],
      },

      shortViewCountText: {
        runs: [{ text: viewCountText }],
      },

      lengthText: {
        runs: [{ text: duration }],
        accessibility: {
          accessibilityData: {
            label: durationLabel,
          },
        },
      },

      navigationEndpoint,

      channelThumbnail: {
        thumbnails: Array.isArray(video.authorThumbnails)
          ? video.authorThumbnails
          : [],
      },

      trackingParams: "",
    },
  };
}

function formatDuration(value) {
  const total = Math.max(0, Math.floor(Number(value) || 0));

  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

// Search needs compactVideoRenderer.
// Reuse the existing converter instead of rebuilding video metadata.

function convertInvVidStructToSearchResult(video) {
  const converted = convertInvVidStructToV10(video);
  const grid = converted.gridVideoRenderer;

  return {
    compactVideoRenderer: {
      videoId: grid.videoId,
      thumbnail: grid.thumbnail,
      badges: grid.badges,
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
      trackingParams: grid.trackingParams,
    },
  };
}

function convertInvChaStructToSearchResult(channel) {
    const formatter = new Intl.NumberFormat('en-US');
    const thumbnails = Array.isArray(channel.authorThumbnails)
    ? channel.authorThumbnails
        .sort((a, b) => Number(a.width || 0) - Number(b.width || 0))
    : [];
  return {
    gridChannelRenderer: {
      channelId: channel.authorId,
      thumbnail: {
        thumbnails,
      },
      subscriberCountText: {
        runs: [
          {
            text: formatter.format(channel.subCount || 0) + " subscribers",
          },
        ],
      },
      navigationEndpoint: {
        clickTrackingParams: "",
        browseEndpoint: {
          browseId: channel.authorId,
        },
      },
      title: {
        runs: [
          {
            text: channel.author || "Unknown Channel",
          },
        ],
      },
      trackingParams: "",
    },
  };
}

async function fetchVideos(endpoint, params = {}) {
  const url = `${baseURL}${endpoint}`;
  console.log(`[search] Fetching Invidious search results from ${url} with params:`, params);

  const { data } = await axios.get(url, {
    params,
    timeout: 20000,
    headers: {
      Accept: "application/json",
    },
  });

  if (!Array.isArray(data)) {
    throw new Error(
      `Invidious returned ${
        typeof data === "object" ? "a non-array response" : typeof data
      }`,
    );
  }

  return data;
}

function convertStructToSearchResult(item) {
    console.log(item.type)
  if (item.type === "video") {
    return convertInvVidStructToSearchResult(item);
  }
  if (item.type === "channel") {
    return convertInvChaStructToSearchResult(item);
  }
}

// Build the response expected by the old TVHTML5 search screen.
function buildSearchResponse(query, videos) {
  const items = videos.map(convertStructToSearchResult);

  return {
    estimatedResults: String(items.length),

    contents: {
      sectionListRenderer: {
        contents: [
          {
            itemSectionRenderer: {
              contents: items,
              trackingParams: "",
            },
          },
        ],

        trackingParams: "",
      },
    },

    trackingParams: "",
  };
}

async function handleSearchRequest(req, res) {
  const body = req.body || {};

  const rawQuery = body.query ?? body.q ?? req.query?.query ?? req.query?.q;

  const query = typeof rawQuery === "string" ? rawQuery.trim() : "";

  if (!query) {
    return res.status(400).json({
      error: "Missing query.",
      expectedFormat: 'POST JSON body: { "query": "search term" }',
    });
  }

  const rawPage = body.page ?? req.query?.page ?? 1;
  const page = Math.max(1, Number.parseInt(rawPage, 10) || 1);

  const region = asText(body.region ?? req.query?.region, "MY").toUpperCase();

  try {
    console.log(
      `[search] Invidious query=${JSON.stringify(query)} page=${page} region=${region}`,
    );

    const videos = await fetchVideos("/search", {
      q: query,
      page,
      region,
      //limit: 20,
    });

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");

    const logFilePath = path.join(logsDir, `search-${timestamp}.json`);

    fs.writeFileSync(
      logFilePath,
      JSON.stringify(
        {
          query,
          page,
          region,
          videos,
        },
        null,
        2,
      ),
    );

    const processedResponse = buildSearchResponse(query, videos);

    console.log(`[search] returned ${videos.length} video results`);

    return res.json(processedResponse);
  } catch (error) {
    console.error("[search] Invidious request failed:", error.message);

    return res.status(502).json({
      error: "Failed to fetch search results from Invidious.",
      details: error.response?.data || error.message,
      upstreamStatus: error.response?.status || null,
    });
  }
}

module.exports = {
  handleSearchRequest,
  convertInvVidStructToV10,
  convertInvVidStructToSearchResult,
  buildSearchResponse,
};
