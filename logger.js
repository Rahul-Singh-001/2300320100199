const axios = require('axios');
const fs = require('fs');

const tokenData = JSON.parse(fs.readFileSync('token.json'));
const TOKEN = tokenData.access_token;

// Allowed values
const validStacks = ["backend", "frontend"];

const validLevels = ["debug", "info", "warn", "error", "fatal"];

const validPackages = [

    "cache", "controller", "cron_job", "db", "domain",
    "handler", "repository", "route", "service",

    "api", "component", "hook", "page", "state", "style",
    "auth", "config", "middleware", "utils"
];

async function Log(stack, level, package_name, message) {
    const url = "http://4.224.186.213/evaluation-service/logs";

    // Validate inputs
    if (!validStacks.includes(stack)) {
        throw new Error(`Invalid stack! Allowed: ${validStacks.join(', ')}`);
    }
    if (!validLevels.includes(level)) {
        throw new Error(`Invalid level! Allowed: ${validLevels.join(', ')}`);
    }
    if (!validPackages.includes(package_name)) {
        throw new Error(`Invalid package! Allowed: ${validPackages.join(', ')}`);
    }

    const payload = {
        stack: stack,
        level: level,
        package: package_name,
        message: message
    };

    try {
        const response = await axios.post(url, payload, {
            headers: {
                Authorization: `Bearer ${TOKEN}`
            }
        });

        // Response: { logID: "...", message: "log created successfully" }
        return response.data;

    } catch (error) {
        throw new Error(error.response.data);
    }
}

module.exports = { Log };