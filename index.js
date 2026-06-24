const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/perfil/:riotId', async (req, res) => {
    const riotId = req.params.riotId;
    const url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${encodeURIComponent(riotId)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Referer': 'https://tracker.gg/',
                'Origin': 'https://tracker.gg',
                'Sec-Ch-Ua': '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"',
                'Sec-Ch-Ua-Mobile': '?0',
                'Sec-Ch-Ua-Platform': '"Windows"',
                'Sec-Fetch-Dest': 'empty',
                'Sec-Fetch-Mode': 'cors',
                'Sec-Fetch-Site': 'same-origin'
            }
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: `Erro na API do Tracker.gg: ${response.status}` });
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

module.exports = app;
