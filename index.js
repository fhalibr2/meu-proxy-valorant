const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Fila em memória na nuvem (Caixa de recados)
let fila = {
    solicitacao: null, // Guarda o riotId pendente que o VB.NET precisa buscar
    respostaUrl: null  // Guarda o link do paste.rs enviado pelo VB.NET
};

// 1. O App Web (va.html) envia o pedido de busca para a nuvem
app.post('/api/solicitar', (req, res) => {
    fila.solicitacao = req.body.riotId;
    fila.respostaUrl = null; // Reseta o resultado anterior
    res.json({ success: true, message: "Pedido adicionado à fila." });
});

// 2. O VB.NET fica olhando esta rota para ver se há trabalho a fazer
app.get('/api/pendente', (req, res) => {
    res.json({ riotId: fila.solicitacao });
});

// 3. O VB.NET envia o link do paste.rs com os dados salvos
app.post('/api/responder', (req, res) => {
    fila.respostaUrl = req.body.url;
    fila.solicitacao = null; // Remove da fila de pendentes pois já foi feito
    res.json({ success: true });
});

// 4. O App Web fica perguntando aqui se o resultado chegou. 
// O Vercel baixa o JSON do paste.rs internamente para EVITAR ERROS DE CORS no HTML!
app.get('/api/resultado', async (req, res) => {
    if (!fila.respostaUrl) {
        return res.json({ pronto: false });
    }

    try {
        // Baixa o texto bruto do paste.rs em segundo plano na nuvem
        const response = await fetch(fila.respostaUrl);
        const jsonOriginal = await response.json();
        
        res.json({ pronto: true, data: jsonOriginal });
    } catch (error) {
        res.status(500).json({ pronto: false, error: "Erro ao ler dados do paste.rs: " + error.message });
    }
});

module.exports = app;
