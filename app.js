const express = require("express");
const vision = require("@google-cloud/vision");
const fs = require("fs");
const cloudinary = require("./utils/cloudinary");
const upload = require("./utils/multer");

const app = express();
app.use(express.json());

const client = new vision.ImageAnnotatorClient({
  keyFilename: "./keyfile.json",
});

app.post("/ocr", upload.single("image"), async (req, res) => {
  try {
    const results = await cloudinary.uploader.upload(req.file.path, {
      tags: "liscences",
      folder: "liscences/",
    });
    imagePath = results.secure_url;
    const [result] = await client.textDetection(imagePath);
    const ocrResult = result.textAnnotations[0].description;
    const output = fs.writeFileSync(
      "output.txt",
      `${ocrResult}`,
      function (err) {
        if (err) throw err;
        console.log("OCR result saved to result.txt");
      }
    );

    res.send({ result: result.textAnnotations[0].description,output });
  } catch (err) {
    // console.error(err);
    res.status(500).send({ err  });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
