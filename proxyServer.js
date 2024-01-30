const express = require('express');
const fetch = require('node-fetch');

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/proxy', async (req, res) => {
    try {
        const url = 'https://mgamma.123tokyo.xyz/get.php/7/bd/WfGMYdalClU.mp3?cid=MmEwMTo0Zjg6YzAxMDo5ZmE2OjoxfE5BfERF&h=4MTiRZZOXgMZhaB6Ju_RtA&s=1706078666&n=MAN';
        const response = await fetch(url);
        const data = await response.buffer();

        res.setHeader('Content-Type', 'audio/mp3');
        res.send(data);
    } catch (error) {
        console.error('Proxy error:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server is running on http://localhost:${PORT}`);
});
