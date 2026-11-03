const fs = require("fs");
const path = require("path");
const axios = require("axios");

function replaceBrowseId(obj) {
  if (Array.isArray(obj)) {
    obj.forEach((item) => replaceBrowseId(item));
  } else if (typeof obj === "object" && obj !== null) {
    Object.keys(obj).forEach((key) => {
      if (key === "browseId" && obj[key] === "FEtopics") {
        obj[key] = "home";
      } else {
        replaceBrowseId(obj[key]);
      }
    });
  }
}

async function fetchGuideData(authToken = null) {
  const logsDir = path.join(__dirname, "logs");
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir);
  }

  const filePath = path.join(__dirname, "..", "assets", "guide_json.json");

  try {
    const rawData = fs.readFileSync(filePath, "utf-8");
    let guideData = JSON.parse(rawData);
    console.log("Using fixed guide data:", JSON.stringify(guideData, null, 2));
    return guideData;
  } catch (error) {
    console.error("Error reading fixed guide data:", error.message);
    throw new Error("Failed to read guide data.");
  }
}

module.exports = { fetchGuideData };
