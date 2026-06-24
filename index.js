const express = require('express');
const cors = require('cors');

const app = express();

// Libera o acesso para o seu App Web (Sem mais erros de CORS!)
app.use(cors());

app.get('/api/perfil/:riotId', async (req, res) => {
    const riotId = req.params.riotId;
    const url = `https://api.tracker.gg/api/v2/valorant/standard/profile/riot/${encodeURIComponent(riotId)}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
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

// Essencial para rodar na Vercel
module.exports = app;