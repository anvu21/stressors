const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand,GetObjectCommand  } = require("@aws-sdk/client-s3");
const fs = require('fs');
require("dotenv").config();
const crypto = require('crypto');
const upload = multer({ dest: 'uploads/' }); // temporarily store file in 'uploads' directory
const sharp = require('sharp');
//const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
//const app = express();
const verifyToken = require('../verifyToken');


const s3 = new S3Client({ 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  region: process.env.BUCKET_REGION }); // create access point

router.post('/upload', upload.single('image'), async (req, res) => {
  const file = req.file;
  // Generate a random string for filename
  let randomName = crypto.randomBytes(16).toString("hex");
  // Preserve the file extension
  let fileExtension = file.originalname.split(".").pop();
  let newFileName = `${randomName}.${fileExtension}`;  
  
  const fileBuffer = await sharp(file.buffer)
    .resize({ height: 1920, width: 1080, fit: "contain" })
    .toBuffer()

  

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: newFileName, 
    Body: fileBuffer,
    ContentType: fileBuffer.mimetype // this will make the uploaded file publicly accessible. Adjust as necessary
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${uploadParams.Key}`;
    console.log(`File uploaded successfully. ${fileUrl}`);
    res.status(200).send(`File uploaded successfully. ${fileUrl}`);
  } catch (err) {
    console.log('Error', err);
    res.status(500).send(err);
  }
  newFileName


});



module.exports = router;
