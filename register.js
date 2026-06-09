const axios = require('axios');
const fs = require('fs');

async function register() {
    const url = "http://4.224.186.213/evaluation-service/register";

    const payload = {
        email: "rahul.23b0101003@abes.ac.in",
        name: "Rahul singh",
        mobileNo: "7838691085",
        githubUsername: "Rahul-Singh-001",
        rollNo: "2300320100199",
        accessCode: "cXuqht"
    };

    try {
        const response = await axios.post(url, payload);
        const data = {//fetch id and secret
            clientID: response.data.clientID,
            clientSecret: response.data.clientSecret
        };

        fs.writeFileSync('credentials.json', JSON.stringify(data, null, 2));
        console.log("Saved to credentials.json!");

    } catch (error) {
        console.log("Error:", error.response.data);
    }
}

register();