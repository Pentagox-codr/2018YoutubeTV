const fs = require("fs");
const path = require("path");
const axios = require("axios");

const settingsPath = path.join(__dirname, "settings.json");

const feedConfig = [
    { title: "Recommended", type: "home", default: true },
    { title: "Music", type: "FEmusic", default: false },
    { title: "Entertainment", type: "FEcomedy", default: false },
    { title: "Gaming", type: "FEgaming", default: false },
    { title: "Movies", type: "FEmovies", default: false }
];

const browseConfig = [
    {
        topic: "home",
        shelves: [
            { title: "Trending", search: "trending videos" },
            { title: "Michael Jackson - Topic", search: "michael jackson videos" },
            { title: "Minecraft - Topic", search: "minecraft videos" }
        ]
    },
    {
        topic: "FEmusic",
        shelves: [
            { title: "Trending", search: "trending music videos" },
            { title: "Top 20 music videos in your region", search: "top music videos in malaysia", limit: 20 },
            { title: "New releases", search: "new official music videos" },
            { title: "Popular music videos", search: "most viewed music videos" },
            { title: "Pop music", search: "popular pop music videos" },
            { title: "Rock music", search: "popular rock music videos" },
            { title: "Hip Hop", search: "popular hip hop music videos" },
            { title: "Electronic Music", search: "popular electronic music videos" },
            { title: "Music Mixes", search: "music mixes" },
            { title: "Live Music", search: "live music performances" }
        ]
    },
    {
        topic: "FEmovies",
        shelves: [
            { title: "Trending", search: "trending movie videos" },
            { title: "Cool movies for you", search: "popular movies in malaysia" },
            { title: "New releases", search: "new movie trailers" },
            { title: "Popular Movie Trailers", search: "popular movie trailers" },
            { title: "Action Movies", search: "action movie trailers" },
            { title: "Comedy Movies", search: "comedy movie trailers" },
            { title: "Animation Movies", search: "animated movie trailers" },
            { title: "Documentaries", search: "popular documentary films" }
        ]
    },
    {
        topic: "FEgaming",
        shelves: [
            { title: "Trending", search: "trending gaming videos" },
            { title: "Fortnite", search: "fortnite gaming videos" },
            { title: "ROBLOX", search: "roblox gaming videos" },
            { title: "PUBG", search: "pubg gaming videos" },
            { title: "Minecraft", search: "minecraft gaming videos" },
            { title: "Grand Theft Auto", search: "gta gaming videos" },
            { title: "Mobile Gaming", search: "mobile gaming videos" },
            { title: "Gameplay Walkthroughs", search: "gaming walkthroughs" },
            { title: "Gaming News", search: "gaming news" },
            { title: "Funny Gaming Moments", search: "funny gaming moments" },
            { title: "Live Gaming", search: "gaming livestreams" }
        ]
    },
    {
        topic: "FEkids",
        shelves: [
            { title: "Popular Children's Videos", search: "popular childrens videos" },
            { title: "Children's Songs", search: "childrens songs" },
            { title: "Nursery Rhymes", search: "nursery rhymes" },
            { title: "Cartoons", search: "cartoon episodes for kids" },
            { title: "Educational Videos for Kids", search: "educational videos for children" },
            { title: "Animated Stories", search: "animated stories for kids" }
        ]
    },
    {
        topic: "FEsports",
        shelves: [
            { title: "Trending", search: "trending sports videos" },
            { title: "Football", search: "football highlights" },
            { title: "Basketball", search: "basketball highlights" },
            { title: "Motorsports", search: "motorsports highlights" },
            { title: "Wrestling", search: "wrestling highlights" },
            { title: "Extreme Sports", search: "extreme sports videos" },
            { title: "Sports News", search: "sports news" }
        ]
    },
    {
        topic: "FEnews",
        shelves: [
            { title: "Top", search: "latest news" },
            { title: "Malaysia News", search: "malaysia news" },
            { title: "World News", search: "world news" },
            { title: "Technology News", search: "technology news" },
            { title: "Business News", search: "business news" },
            { title: "News Analysis", search: "news analysis" }
        ]
    },
    {
        topic: "FEcomedy",
        shelves: [
            { title: "Trending", search: "trending comedy videos" },
            { title: "Funny Videos", search: "funny videos" },
            { title: "Stand-up Comedy", search: "stand up comedy" },
            { title: "Comedy Sketches", search: "comedy sketches" },
            { title: "Pranks", search: "funny prank videos" },
            { title: "Memes", search: "funny meme videos" }
        ]
    },
    {
        topic: "FEtechnology",
        shelves: [
            { title: "Trending", search: "trending technology videos" },
            { title: "Tech Reviews", search: "latest tech reviews" },
            { title: "Smartphones", search: "smartphone reviews" },
            { title: "Computers", search: "PC hardware videos" },
            { title: "Software", search: "software tutorials" },
            { title: "Tech News", search: "technology news" }
        ]
    },
    {
        topic: "FEeducation",
        shelves: [
            { title: "Popular Educational Videos", search: "popular educational videos" },
            { title: "Science", search: "science educational videos" },
            { title: "History", search: "history documentaries" },
            { title: "Mathematics", search: "mathematics lessons" },
            { title: "Programming", search: "programming tutorials" },
            { title: "Learning Languages", search: "language learning videos" }
        ]
    },
    {
        topic: "FEfood",
        shelves: [
            { title: "Trending", search: "trending food videos" },
            { title: "Cooking", search: "cooking tutorials" },
            { title: "Street Food", search: "malaysia street food" },
            { title: "Food Reviews", search: "food reviews" },
            { title: "Recipes", search: "popular recipes" }
        ]
    },
    {
        topic: "FEtravel",
        shelves: [
            { title: "Trending", search: "trending travel videos" },
            { title: "Malaysia", search: "malaysia travel" },
            { title: "Around the World", search: "travel around the world" },
            { title: "Travel Vlogs", search: "travel vlogs" },
            { title: "Beautiful Places", search: "beautiful places in the world" }
        ]
    }
];

const baseURL = "https://eu.yt.chocolatemoo53.com/api/v1";
const REGION = "MY";

const SHELVES_PER_BATCH = 6;
const DEFAULT_PAGE_SIZE = 20;

const CLICK_TRACKING = "CFkQ3BwYACITCPLIwIe15-QCFQfPxAodo08HkA==";
const SHELF_TRACKING = "CFoQxjkiEwjyyMCHtefkAhUHz8QKHaNPB5A=";
const SECTION_TRACKING = "CBUQui8iEwjyyMCHtefkAhUHz8QKHaNPB5A=";
const SURFACE_TRACKING = "CBAQ0IwDIhMI8sjAh7Xn5AIVB8_ECh2jTweQ";

let settings;

if (!fs.existsSync(settingsPath)) {
    settings = {
        serverIp: "localhost",
        expBrowse: false,
        region: REGION
    };

    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 4));
    console.log("Created settings.json with default settings.");
} else {
    try {
        settings = JSON.parse(fs.readFileSync(settingsPath, "utf8"));
    } catch (error) {
        console.error("Could not parse settings.json:", error.message);

        settings = {
            serverIp: "localhost",
            expBrowse: false,
            region: REGION
        };
    }
}

const serverIp = settings.serverIp || "localhost";
const region = settings.region || REGION;


// --------------------------------------------------
// BROWSE HELPERS
// --------------------------------------------------

function normalizeBrowseId(browseId) {
    if (
        browseId === null ||
        browseId === undefined ||
        browseId === "" ||
        browseId === "default" ||
        browseId === "FEwhat_to_watch"
    ) {
        return "home";
    }

    if (browseId === "FEmusic_home") {
        return "FEmusic";
    }

    return browseId;
}

function getBrowseConfig(browseId) {
    const normalized = normalizeBrowseId(browseId);

    return browseConfig.find(
        item => item.topic === normalized
    ) || null;
}

function isChannelId(id) {
    return /^UC[a-zA-Z0-9_-]{22}$/.test(String(id || ""));
}

function getFeedTitle(browseId) {
    const normalized = normalizeBrowseId(browseId);

    const tab = feedConfig.find(
        item => item.type === normalized
    );

    return tab ? tab.title : normalized;
}

function getSurfaceTrackingParams() {
    return SURFACE_TRACKING;
}


// --------------------------------------------------
// RESPONSE CONTEXT
// --------------------------------------------------

function makeResponseContext() {
    return {
        serviceTrackingParams: [
            {
                service: "GFEEDBACK",
                params: [
                    {
                        key: "logged_in",
                        value: "0"
                    }
                ]
            }
        ],
        maxAgeSeconds: 300
    };
}


// --------------------------------------------------
// CUSTOM CONTINUATION TOKENS
// --------------------------------------------------

function makeContinuation(payload) {
    return Buffer.from(
        JSON.stringify({
            v: 1,
            ...payload
        }),
        "utf8"
    ).toString("base64url");
}

function parseContinuation(token) {
    if (typeof token !== "string" || !token.trim()) {
        return null;
    }

    try {
        const normalized = decodeURIComponent(token);

        const payload = JSON.parse(
            Buffer.from(normalized, "base64url").toString("utf8")
        );

        if (
            !payload ||
            payload.v !== 1 ||
            typeof payload.kind !== "string"
        ) {
            return null;
        }

        return payload;
    } catch (error) {
        return null;
    }
}

function makeNextContinuationData(token) {
    return {
        nextContinuationData: {
            continuation: token,
            clickTrackingParams: CLICK_TRACKING
        }
    };
}

function makeReloadContinuationData(token) {
    return {
        reloadContinuationData: {
            continuation: token,
            clickTrackingParams: CLICK_TRACKING
        }
    };
}

function makeTabContinuation(browseId) {
    return makeContinuation({
        kind: "tab",
        browseId: normalizeBrowseId(browseId)
    });
}

function makeShelvesContinuation(browseId, shelfIndex) {
    return makeContinuation({
        kind: "shelves",
        browseId: normalizeBrowseId(browseId),
        shelfIndex
    });
}

function makeChannelContinuation(channelId, page) {
    return makeContinuation({
        kind: "channelVideos",
        channelId,
        page
    });
}

function makeVideosContinuation(browseId, shelfIndex, page) {
    return makeContinuation({
        kind: "videos",
        browseId: normalizeBrowseId(browseId),
        shelfIndex,
        page
    });
}


// --------------------------------------------------
// INVIDIOUS REQUESTS
// --------------------------------------------------

function getAuthHeaders(authHeader) {
    if (!authHeader) {
        return {};
    }

    if (typeof authHeader === "string") {
        return {
            Authorization: authHeader
        };
    }

    if (
        typeof authHeader === "object" &&
        !Array.isArray(authHeader)
    ) {
        return authHeader;
    }

    return {};
}

async function fetchVideos(endpoint, params = {}, authHeader = null) {
    try {
        const { data } = await axios.get(
            `${baseURL}${endpoint}`,
            {
                params,
                headers: getAuthHeaders(authHeader),
                timeout: 20000
            }
        );

        console.log(
            "[Invidious]",
            endpoint,
            params,
            "->",
            Array.isArray(data)
                ? `${data.length} results`
                : typeof data
        );

        if (!Array.isArray(data)) {
            return [];
        }

        return data.filter(
            video => video && video.videoId
        );

    } catch (error) {
        console.error(
            "[Invidious] Request failed:",
            endpoint,
            error.response?.status || "",
            error.message
        );

        return [];
    }
}

async function fetchChannelInfo(channelId, authHeader = null) {
    try {
        const { data } = await axios.get(
            `${baseURL}/channels/${encodeURIComponent(channelId)}`,
            {
                headers: getAuthHeaders(authHeader),
                timeout: 20000
            }
        );

        console.log("[Invidious] Channel info:", channelId);

        return data;
    } catch (error) {
        console.error(
            "[Invidious] Channel info failed:",
            channelId,
            error.response?.status || "",
            error.message
        );

        return null;
    }
}

async function fetchChannelVideos(
    channelId,
    page = 1,
    authHeader = null
) {
    try {
        const { data } = await axios.get(
            `${baseURL}/channels/${encodeURIComponent(channelId)}/videos`,
            {
                params: { page },
                headers: getAuthHeaders(authHeader),
                timeout: 20000
            }
        );

        const videos = data.videos;
        console.log(videos)

        console.log("[Invidious] Channel videos:", {
            channelId,
            page,
            count: videos.length
        });

        return videos.filter(video => video && video.videoId);
    } catch (error) {
        console.error(
            "[Invidious] Channel videos failed:",
            channelId,
            error.response?.status || "",
            error.message
        );

        return [];
    }
}


// --------------------------------------------------
// VIDEO CONVERTER
// --------------------------------------------------


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



// --------------------------------------------------
// PAGINATION SETTINGS
// --------------------------------------------------

function getPageSize(shelf) {
    const configured = Number(shelf.pageSize);

    if (
        Number.isInteger(configured) &&
        configured > 0
    ) {
        return Math.min(configured, 50);
    }

    return DEFAULT_PAGE_SIZE;
}

function getShelfLimit(shelf) {
    const configured = Number(shelf.limit);

    return (
        Number.isInteger(configured) &&
        configured > 0
    )
        ? configured
        : Infinity;
}


// --------------------------------------------------
// FETCH A SINGLE SHELF PAGE
// --------------------------------------------------

async function fetchShelfPage(
    browseId,
    shelfIndex,
    page,
    authHeader = null
) {
    browseId = normalizeBrowseId(browseId);

    const config = getBrowseConfig(browseId);

    if (!config) {
        throw new Error(`Unknown browseId: ${browseId}`);
    }

    const shelf = config.shelves[shelfIndex];

    if (!shelf) {
        throw new Error(
            `Unknown shelf ${shelfIndex} in ${browseId}`
        );
    }

    const pageSize = getPageSize(shelf);
    const limit = getShelfLimit(shelf);

    const alreadyReturned = (page - 1) * pageSize;
    const remaining = limit - alreadyReturned;

    if (remaining <= 0) {
        return {
            shelf,
            videos: [],
            nextToken: null,
            pageSize
        };
    }

    const rawVideos = await fetchVideos(
        "/search",
        {
            q: shelf.search,
            type: "video",
            page,
            region
        },
        authHeader
    );

    const selectedRawVideos = rawVideos.slice(
        0,
        Math.min(pageSize, remaining)
    );

    const videos = selectedRawVideos.map(
        convertInvVidStructToV10
    );

    const reachedLimit =
        alreadyReturned + selectedRawVideos.length >= limit;

    const hasMore =
        !reachedLimit &&
        rawVideos.length >= pageSize;

    return {
        shelf,
        videos,

        nextToken: hasMore
            ? makeVideosContinuation(
                browseId,
                shelfIndex,
                page + 1
            )
            : null,

        pageSize
    };
}


// --------------------------------------------------
// BUILD SHELF RENDERER
// --------------------------------------------------

async function buildShelfRenderer(
    browseId,
    shelfIndex,
    authHeader = null
) {
    const result = await fetchShelfPage(
        browseId,
        shelfIndex,
        1,
        authHeader
    );

    const shelf = result.shelf;

    const horizontalListRenderer = {
        items: result.videos,
        trackingParams: SHELF_TRACKING,
        collapsedItemCount: 3,
        visibleItemCount: 3
    };

    if (result.nextToken) {
        horizontalListRenderer.continuations = [
            makeNextContinuationData(result.nextToken)
        ];
    }

    return {
        shelfRenderer: {
            title: {
                runs: [
                    {
                        text: shelf.title
                    }
                ]
            },

            endpoint: {
                clickTrackingParams: CLICK_TRACKING,

                browseEndpoint: {
                    browseId: normalizeBrowseId(browseId)
                }
            },

            content: {
                horizontalListRenderer
            },

            trackingParams: CLICK_TRACKING
        }
    };
}

async function buildChannelBrowseData(
    channelId,
    authHeader = null,
    page = 1
) {
    const [channel, rawVideos] = await Promise.all([
        fetchChannelInfo(channelId, authHeader),
        fetchChannelVideos(channelId, page, authHeader)
    ]);

    if (!channel && rawVideos.length === 0) {
        throw new Error(`Could not load channel: ${channelId}`);
    }

    const videos = rawVideos
        .slice(0, DEFAULT_PAGE_SIZE)
        .map(convertInvVidStructToV10);

        console.log(videos)

    const hasMore = rawVideos.length >= DEFAULT_PAGE_SIZE;

    const title = channel?.author || "Channel";
    const shelfRenderer = {
        shelfRenderer: {
            title: {
                runs: [{ text: "Uploads" }]
            },

            content: {
                horizontalListRenderer: {
                    items: videos,
                    trackingParams: SHELF_TRACKING,
                    collapsedItemCount: 3,
                    visibleItemCount: 3,

                    ...(hasMore && {
                        continuations: [
                            makeNextContinuationData(
                                makeChannelContinuation(
                                    channelId,
                                    page + 1
                                )
                            )
                        ]
                    })
                }
            },

            trackingParams: CLICK_TRACKING
        }
    };

    const surface = {
        content: {
            sectionListRenderer: {
                contents: [shelfRenderer],
                trackingParams: SECTION_TRACKING
            }
        },

        header: {
            tvSurfaceHeaderRenderer: {
                subtitle: {
                    runs: [{ text: title }]
                }
            }
        },

        continuation: makeReloadContinuationData(
            makeChannelContinuation(channelId, 1)
        ),

        trackingParams: SURFACE_TRACKING
    };

    return {
    responseContext: makeResponseContext(),

    header: {
        tvChannelHeaderRenderer: {
            title: channel.author,
            channelId: channel.authorId,

            avatar: {
                thumbnails: [...(channel.authorThumbnails || [])].sort(
                    (a, b) => Number(b.width || 0) - Number(a.width || 0)
                )
            },

            desktopBanner: {
                thumbnails: [...(channel.authorBanners || [])].sort(
                    (a, b) => Number(a.width || 0) - Number(b.width || 0)
                )
            },

            subscribeButton: {
                subscribeButtonRenderer: {
                    channelId: channel.authorId,
                    subscribed: false,
                    enabled: true,
                    type: "FREE",

                    subscribedButtonText: {
                        simpleText: "Subscribed"
                    },

                    unsubscribedButtonText: {
                        simpleText: "Subscribe"
                    },

                    unsubscribeButtonText: {
                        simpleText: "Unsubscribe"
                    },

                    trackingParams: ""
                }
            }
        }
    },

    contents: {
        sectionListRenderer: {
            contents: [
                shelfRenderer
            ],
            trackingParams: SECTION_TRACKING
        }
    },

    trackingParams: CLICK_TRACKING
};
}

async function fetchChannelContinuation(payload, authHeader = null) {
    const channelId = String(payload.channelId || "");
    const page = Number(payload.page);

    if (!isChannelId(channelId)) {
        throw new Error("Invalid channel ID");
    }

    if (
        !Number.isInteger(page) ||
        page < 2 ||
        page > 1000
    ) {
        throw new Error("Invalid channel page");
    }

    const rawVideos = await fetchChannelVideos(
        channelId,
        page,
        authHeader
    );

    const videos = rawVideos
        .slice(0, DEFAULT_PAGE_SIZE)
        .map(convertInvVidStructToV10);

    const nextToken = rawVideos.length >= DEFAULT_PAGE_SIZE
        ? makeChannelContinuation(channelId, page + 1)
        : null;

    return makeHorizontalContinuationResponse(
        videos,
        nextToken
    );
}


// --------------------------------------------------
// FETCH SHELF BATCH
// --------------------------------------------------

async function fetchShelfBatch(
    browseId,
    startIndex,
    authHeader = null
) {
    browseId = normalizeBrowseId(browseId);

    const config = getBrowseConfig(browseId);

    if (!config) {
        throw new Error(
            `No browseConfig found for ${browseId}`
        );
    }

    const endIndex = Math.min(
        startIndex + SHELVES_PER_BATCH,
        config.shelves.length
    );

    const indexes = [];

    for (
        let index = startIndex;
        index < endIndex;
        index++
    ) {
        indexes.push(index);
    }

    const shelves = await Promise.all(
        indexes.map(index =>
            buildShelfRenderer(
                browseId,
                index,
                authHeader
            )
        )
    );

    return {
        shelves,

        nextShelfToken:
            endIndex < config.shelves.length
                ? makeShelvesContinuation(
                    browseId,
                    endIndex
                )
                : null,

        endIndex,
        totalShelves: config.shelves.length
    };
}


// --------------------------------------------------
// BUILD TV SURFACE CONTENT
// --------------------------------------------------

function makeSurfaceContent(
    browseId,
    title,
    batch
) {
    const sectionListRenderer = {
        contents: batch.shelves,
        trackingParams: SECTION_TRACKING
    };

    if (batch.nextShelfToken) {
        sectionListRenderer.continuations = [
            makeNextContinuationData(
                batch.nextShelfToken
            )
        ];
    }

    return {
        content: {
            sectionListRenderer
        },

        header: {
            tvSurfaceHeaderRenderer: {
                subtitle: {
                    runs: [
                        {
                            text: title || getFeedTitle(browseId)
                        }
                    ]
                }
            }
        },

        continuation: makeReloadContinuationData(
            makeTabContinuation(browseId)
        ),

        trackingParams: getSurfaceTrackingParams(browseId)
    };
}

async function fetchShelvesData(
    browseId,
    title,
    authHeader = null,
    startIndex = 0
) {
    browseId = normalizeBrowseId(browseId);

    const batch = await fetchShelfBatch(
        browseId,
        startIndex,
        authHeader
    );

    return makeSurfaceContent(
        browseId,
        title,
        batch
    );
}


// --------------------------------------------------
// TVHTML5 CONTINUATION RESPONSES
// --------------------------------------------------

// Horizontal shelf video pagination.
//
// The 2018 TV application reads:
// continuationContents.horizontalListContinuation.items
//
// It then appends those items to horizontalListRenderer.items.

function makeHorizontalContinuationResponse(
    items,
    nextToken
) {
    return {
        responseContext: makeResponseContext(),

        trackingParams: SHELF_TRACKING,

        continuationContents: {
            horizontalListContinuation: {
                items,

                continuations: nextToken
                    ? [
                        makeNextContinuationData(nextToken)
                    ]
                    : []
            }
        }
    };
}


// More shelves inside a tab.
//
// The TV application reads:
// continuationContents.sectionListContinuation.contents
//
// It appends the returned contents to sectionListRenderer.contents.

function makeSectionContinuationResponse(
    contents,
    nextToken
) {
    return {
        responseContext: makeResponseContext(),

        trackingParams: SECTION_TRACKING,

        continuationContents: {
            sectionListContinuation: {
                contents,

                continuations: nextToken
                    ? [
                        makeNextContinuationData(nextToken)
                    ]
                    : [],

                trackingParams: SECTION_TRACKING
            }
        }
    };
}


// Reload an entire tab.
//
// The TV application reads:
// continuationContents.tvSurfaceContentContinuation.content
//
// This replaces the current surface content rather than appending it.

function makeTVSurfaceContinuationResponse(
    browseId,
    title,
    batch
) {
    const surface = makeSurfaceContent(
        browseId,
        title,
        batch
    );

    return {
        responseContext: makeResponseContext(),

        trackingParams: surface.trackingParams,

        continuationContents: {
            tvSurfaceContentContinuation: {
                content: surface.content,
                header: surface.header,
                trackingParams: surface.trackingParams
            }
        }
    };
}


// --------------------------------------------------
// VIDEO CONTINUATION
// --------------------------------------------------

async function fetchVideoContinuation(
    payload,
    authHeader = null
) {
    const browseId = normalizeBrowseId(payload.browseId);
    const config = getBrowseConfig(browseId);

    if (!config) {
        throw new Error(`Unknown browseId: ${browseId}`);
    }

    const shelfIndex = Number(payload.shelfIndex);
    const page = Number(payload.page);

    if (
        !Number.isInteger(shelfIndex) ||
        shelfIndex < 0 ||
        shelfIndex >= config.shelves.length
    ) {
        throw new Error(
            "Invalid shelf index in video continuation"
        );
    }

    if (
        !Number.isInteger(page) ||
        page < 2 ||
        page > 1000
    ) {
        throw new Error(
            "Invalid page in video continuation"
        );
    }

    const result = await fetchShelfPage(
        browseId,
        shelfIndex,
        page,
        authHeader
    );

    console.log("[TV continuation] horizontal videos", {
        browseId,
        shelfIndex,
        page,
        returned: result.videos.length,
        hasNext: !!result.nextToken
    });

    return makeHorizontalContinuationResponse(
        result.videos,
        result.nextToken
    );
}


// --------------------------------------------------
// SHELF CONTINUATION
// --------------------------------------------------

async function fetchShelfContinuation(
    payload,
    authHeader = null
) {
    const browseId = normalizeBrowseId(payload.browseId);
    const config = getBrowseConfig(browseId);

    if (!config) {
        throw new Error(`Unknown browseId: ${browseId}`);
    }

    const startIndex = Number(payload.shelfIndex);

    if (
        !Number.isInteger(startIndex) ||
        startIndex < 0
    ) {
        throw new Error(
            "Invalid shelf index in section continuation"
        );
    }

    const batch = await fetchShelfBatch(
        browseId,
        startIndex,
        authHeader
    );

    console.log("[TV continuation] more shelves", {
        browseId,
        startIndex,
        returned: batch.shelves.length,
        hasNext: !!batch.nextShelfToken
    });

    return makeSectionContinuationResponse(
        batch.shelves,
        batch.nextShelfToken
    );
}


// --------------------------------------------------
// TAB RELOAD CONTINUATION
// --------------------------------------------------

async function fetchTabContinuation(
    payload,
    authHeader = null
) {
    const browseId = normalizeBrowseId(payload.browseId);

    if (!getBrowseConfig(browseId)) {
        throw new Error(`Unknown tab: ${browseId}`);
    }

    const title = getFeedTitle(browseId);

    const batch = await fetchShelfBatch(
        browseId,
        0,
        authHeader
    );

    console.log("[TV continuation] tab reload", {
        browseId,
        returned: batch.shelves.length,
        hasNext: !!batch.nextShelfToken
    });

    return makeTVSurfaceContinuationResponse(
        browseId,
        title,
        batch
    );
}


// --------------------------------------------------
// CONTINUATION DISPATCHER
// --------------------------------------------------

async function fetchBrowseContinuation(
    token,
    authHeader = null
) {
    const payload = parseContinuation(token);

    if (!payload) {
        throw new Error(
            "Invalid or unsupported continuation token"
        );
    }

    switch (payload.kind) {
        case "tab":
            return fetchTabContinuation(
                payload,
                authHeader
            );

        case "shelves":
            return fetchShelfContinuation(
                payload,
                authHeader
            );

        case "channelVideos":
            return fetchChannelContinuation(
                payload,
                authHeader
            );

        case "videos":
            return fetchVideoContinuation(
                payload,
                authHeader
            );

        default:
            throw new Error(
                `Unsupported continuation kind: ${payload.kind}`
            );
    }
}


// --------------------------------------------------
// INITIAL BROWSE REQUEST
// --------------------------------------------------

async function fetchBrowseData(
    browseId = null,
    authHeader = null
) {
    // Accept a complete InnerTube request body.

    if (
        browseId &&
        typeof browseId === "object"
    ) {
        const requestBody = browseId;

        if (requestBody.continuation) {
            return fetchBrowseContinuation(
                requestBody.continuation,
                authHeader
            );
        }

        browseId = requestBody.browseId;
    }

    // Accept our custom continuation token directly.

    if (
        typeof browseId === "string" &&
        parseContinuation(browseId)
    ) {
        return fetchBrowseContinuation(
            browseId,
            authHeader
        );
    }

    const selectedBrowseId = normalizeBrowseId(browseId);

// Channel browsing
if (isChannelId(selectedBrowseId)) {
    return buildChannelBrowseData(
        selectedBrowseId,
        authHeader,
        1
    );
}

const selectedConfig = getBrowseConfig(
    selectedBrowseId
);

    if (!selectedConfig) {
        throw new Error(
            `Unknown browseId: ${selectedBrowseId}`
        );
    }

    const navItems = await Promise.all(
        feedConfig.map(async navitem => {
            const navBrowseId = normalizeBrowseId(
                navitem.type
            );

            const selected =
                navBrowseId === selectedBrowseId;

            const tvSurfaceContentRenderer = selected
                ? await fetchShelvesData(
                    navBrowseId,
                    navitem.title,
                    authHeader,
                    0
                )
                : {
                    continuation: makeReloadContinuationData(
                        makeTabContinuation(navBrowseId)
                    ),

                    trackingParams: getSurfaceTrackingParams(
                        navBrowseId
                    )
                };

            return {
                tabRenderer: {
                    endpoint: {
                        clickTrackingParams: CLICK_TRACKING,

                        browseEndpoint: {
                            browseId: navBrowseId,
                            params: "-gINaGFwcGVuaW5nX25vdw%3D%3D"
                        }
                    },

                    title: navitem.title,
                    selected,

                    content: {
                        tvSurfaceContentRenderer
                    },

                    tabIdentifier: navBrowseId,
                    trackingParams: CLICK_TRACKING
                }
            };
        })
    );

    return {
        responseContext: makeResponseContext(),

        contents: {
            tvBrowseRenderer: {
                content: {
                    tvSecondaryNavRenderer: {
                        sections: [
                            {
                                tvSecondaryNavSectionRenderer: {
                                    tabs: navItems,
                                    trackingParams: CLICK_TRACKING
                                }
                            }
                        ],

                        trackingParams: CLICK_TRACKING,

                        title: {
                            runs: [
                                {
                                    text: "Home"
                                }
                            ]
                        }
                    }
                }
            }
        },

        trackingParams: CLICK_TRACKING
    };
}


// --------------------------------------------------
// EXPORTS
// --------------------------------------------------

module.exports = {
    fetchBrowseData,
    fetchBrowseContinuation,
    fetchShelvesData,
    fetchShelfPage,
    convertInvVidStructToV10,
    parseContinuation,
    browseConfig,
    feedConfig
};