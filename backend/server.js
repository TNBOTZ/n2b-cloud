const express = require("express");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const cors = require("cors");

const app = express();
app.use(cors());

const upload = multer();

const BOT_TOKEN = "8703476678:AAGosSnHf5Tg6voJtgvjcmjdCP_vhB284OY";
const CHAT_ID = "-1003882073026";

// 📤 Upload to Telegram
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("document", file.buffer, file.originalname);

    const tgRes = await axios.post(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`,
      form,
      { headers: form.getHeaders() }
    );

    const fileId = tgRes.data.result.document.file_id;

    // Get file path
    const fileInfo = await axios.get(
      `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=${fileId}`
    );

    const filePath = fileInfo.data.result.file_path;

    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${filePath}`;

    res.json({ url: fileUrl });

  } catch (err) {
    console.error(err);
    res.status(500).send("Upload failed");
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
