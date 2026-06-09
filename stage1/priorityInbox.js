const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Log } = require('../logger');

// Read token
const tokenData = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../token.json'))
);
const TOKEN = tokenData.access_token;

// Weight for each notification type
const WEIGHTS = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
};

// Fetch all notifications from API
async function fetchNotifications() {
    const url = "http://4.224.186.213/evaluation-service/notifications";

    try {
        await Log("backend", "info", "service", "Fetching notifications from API");

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        await Log("backend", "info", "service", `Fetched ${response.data.notifications.length} notifications`);

        return response.data.notifications;

    } catch (error) {
        await Log("backend", "error", "service", `Failed to fetch notifications: ${error.message}`);
        throw error;
    }
}

// Calculate priority score for each notification
function calculateScore(notification) {
    const weight = WEIGHTS[notification.Type] || 0;

    // Convert timestamp to number (newer = higher score)
    const timestamp = new Date(notification.Timestamp).getTime();

    // Score = weight * large number + timestamp
    // This ensures weight is primary, recency is secondary
    const score = (weight * 1e13) + timestamp;

    return score;
}

// Get top N priority notifications
async function getTopNotifications(n = 10) {
    try {
        await Log("backend", "info", "handler", `Getting top ${n} priority notifications`);

        const notifications = await fetchNotifications();

        // Add score to each notification
        const scored = notifications.map(notification => ({
            ...notification,
            score: calculateScore(notification)
        }));

        // Sort by score descending
        scored.sort((a, b) => b.score - a.score);

        // Get top N
        const topN = scored.slice(0, n);

        await Log("backend", "info", "handler", `Top ${n} notifications calculated successfully`);

        return topN;

    } catch (error) {
        await Log("backend", "error", "handler", `Failed to calculate priority: ${error.message}`);
        throw error;
    }
}

// Main function
async function main() {
    try {
        console.log(" Fetching Top 10 Priority Notifications...\n");

        const top10 = await getTopNotifications(10);

        console.log("Top 10 Priority Notifications:\n");
        top10.forEach((notification, index) => {
            console.log(`${index + 1}. [${notification.Type}] ${notification.Message}`);
            console.log(`  ${notification.Timestamp}`);
            console.log(` ${notification.ID}`);
            console.log(` Score: ${notification.score}`);
            console.log();
        });

        await Log("backend", "info", "service", "Priority inbox displayed successfully");

    } catch (error) {
        await Log("backend", "fatal", "service", `Priority inbox failed: ${error.message}`);
        console.log(" Error:", error.message);
    }
}

main();

module.exports = { getTopNotifications };