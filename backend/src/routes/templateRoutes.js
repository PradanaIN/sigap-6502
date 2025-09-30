const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const TEMPLATE_PATH = path.join(__dirname, "../templates/message_template.txt");

// GET halaman editor
router.get("/", (req, res) => {
  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  res.render("template", { template });
});

// POST untuk simpan template baru
router.post("/", express.json(), (req, res) => {
  const { template } = req.body;

  if (!template || typeof template !== "string") {
    return res.status(400).json({ message: "Template tidak valid." });
  }

  fs.writeFileSync(TEMPLATE_PATH, template, "utf-8");
  res.json({ message: "Template berhasil disimpan." });
});


// GET JSON template (raw)
router.get('/raw', (req, res) => {
  try {
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf-8');
    res.json({ template });
  } catch (err) {
    res.status(500).json({ message: 'Gagal membaca template.' });
  }
});
module.exports = router;

