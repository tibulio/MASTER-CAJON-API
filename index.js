const express = require('express');
const multer = require('multer');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

const upload = multer({ dest: 'uploads/' });

app.post('/adjust-bpm', upload.single('audio'), (req, res) => {
    const { bpm_factor } = req.body;
    const inputPath = req.file.path;
    const outputPath = `outputs/${Date.now()}_adjusted.mp3`;

    ffmpeg(inputPath)
        .audioFilters(`atempo=${bpm_factor}`)
        .save(outputPath)
        .on('end', () => {
            res.download(outputPath, () => {
                fs.unlinkSync(inputPath);
                fs.unlinkSync(outputPath);
            });
        })
        .on('error', (err) => {
            console.error(err);
            res.status(500).send('Erro ao processar áudio.');
        });
});
app.get('/', (req, res) => {
  res.send('API online e funcionando!');
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
