const path = require('path');
const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');

const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI0ZjQwOTgxMC0yZTRjLTAxM2MtMWFjMi0wNjAzNzFjMDFlZTQiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNjkzOTQwMzg4LCJwdWIiOiJibHVlaG9sZSIsInRpdGxlIjoicHViZyIsImFwcCI6ImtpbGwtcmVjb3JkLXYxIn0.UmtcORtJXnGlxT5CBIcz24BtM338rQzlYU3oWJ81Nc8'; // Replace with your PUBG API Key
const headers = {
    'Authorization': `Bearer ${API_KEY}`,
    'Accept': 'application/vnd.api+json'
};

async function fetchPlayerData(url) {
    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        console.error('Error fetching player data:', error);
        return null;
    }
}

app.get('/', async (req, res) => {
    const player1Url = 'https://api.pubg.com/shards/steam/players/account.1f781d0ea0284c0fa529771a3ca37569/seasons/lifetime';
    const player2Url = 'https://api.pubg.com/shards/steam/players/account.5a2d79249212408792a4266e820ed5d4/seasons/lifetime';

    const player1Data = await fetchPlayerData(player1Url);
    const player2Data = await fetchPlayerData(player2Url);

const leadingPlayer = player1Data.data.attributes.gameModeStats['squad-fpp'].kills > player2Data.data.attributes.gameModeStats['squad-fpp'].kills ? player1Data : player2Data;


const topStats = {
    kills: leadingPlayer.data.attributes.gameModeStats['squad-fpp'].kills,
    assists: leadingPlayer.data.attributes.gameModeStats['squad-fpp'].assists,
    damageDealt: leadingPlayer.data.attributes.gameModeStats['squad-fpp'].damageDealt,
    headshotKills: leadingPlayer.data.attributes.gameModeStats['squad-fpp'].headshotKills,
    wins: leadingPlayer.data.attributes.gameModeStats['squad-fpp'].wins
};

res.render('index', { topStats });

});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
