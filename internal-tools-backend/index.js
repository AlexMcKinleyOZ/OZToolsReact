const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { stdout } = require('process');

const app = express();
const port = 4000;

app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) return res.status(400).send('No file uploaded.');

  const inputPath = path.join(__dirname, file.path);
  const outputPath = path.join(__dirname, 'uploads', `${file.filename}.html`);

  // Ensure outputs directory exists
  fs.mkdirSync(path.join(__dirname, 'outputs'), { recursive: true });

  // Construct Python command
  const cmd = `python3 ../py-doc-backend/convert.py "${inputPath}" "${outputPath}"`;

  exec(cmd, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Python error: ${stderr}`);
      return res.status(500).send('Conversion failed');
    }

    // Send the resulting HTML file
    res.download(outputPath, 'converted.html', (err) => {
      if (err) {
        console.error(err);
        res.status(500).send('Failed to send file');
      }

      // Optional cleanup
      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
    });
  });
});

app.listen(port, () => {
  console.log(`✅ Backend listening on http://localhost:${port}`);
});
