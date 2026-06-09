const axios = require('axios');
const fs = require('fs');

async function getToken() {
    const url = "http://4.224.186.213/evaluation-service/auth";

    // Read clientID and clientSecret from file
    const credentials = JSON.parse(fs.readFileSync('credentials.json'));

    const payload = {
        email: "rahul.23b0101003@abes.ac.in",
        name: "Rahul singh",
        rollNo: "your_roll_number",
        accessCode: "cXuqht",
        clientID: credentials.clientID,
        clientSecret: credentials.clientSecret
    };

    try {
        const response = await axios.post(url, payload);

        // Stored token in a file
        const tokenData = {
            access_token: response.data.access_token,
            token_type: response.data.token_type,
            expires_in: response.data.expires_in
        };

        fs.writeFileSync('token.json', JSON.stringify(tokenData, null, 2));
        console.log(" Token saved to token.json!");

    } catch (error) {
        console.log("Error:", error.response.data);
    }
}

getToken();