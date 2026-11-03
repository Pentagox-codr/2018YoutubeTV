const axios = require('axios'); 
const fs = require('fs'); 
const path = require('path'); 

const settingsPath = path.join(__dirname, 'settings.json');

const browseConfig = [
    {
        topic: "music",
        shelves: [
            {
                title: "Trending",
                search: "trending music videos"
            },
            {
                title: "Top 20 music videos in your region",
                search: "top music videos in malaysia",
                limit: 20
            },
            {
                title: "New releases",
                search: "new music videos"
            }
        ]
    },
    {
        topic: "movies",
        shelves: [
            {
                title: "Trending",
                search: "trending movies videos"
            },
            {
                title: "Cool movies for you",
                search: "top movies videos in malaysia"
            },
            {
                title: "New releases",
                search: "new movies videos"
            }
        ]
    },
    {
        topic: "gaming",
        shelves: [
            {
                title: "Trending",
                search: "trending gaming videos"
            },
            {
                title: "Fortnite",
                search: "fortnite gaming videos"
            },
            {
                title: "ROBLOX",
                search: "roblox gaming videos"
            },
            {
                title: "PUBG",
                search: "pubg gaming videos"
            }
        ]
    }
]

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

async function fetchBrowseData() {
    try {
        const fileUrl = `http://${serverIp}:8090/assets/browse_example_client6.json`;
        const fileResponse = await axios.get(fileUrl);

        return fileResponse.data;
    } catch (error) {
        console.error('Error:', error.message);
        
        if (error.response) {
            console.error('Error Response:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('General error:', error.message);
        }
        
        return { error: 'Failed to read the JSON file' };
    }
}


module.exports = { fetchBrowseData };