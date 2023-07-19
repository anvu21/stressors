const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand,GetObjectCommand  } = require("@aws-sdk/client-s3");
const fs = require('fs');
require("dotenv").config();
const crypto = require('crypto');
const upload = multer({ dest: 'uploads/' }); // temporarily store file in 'uploads' directory
const sharp = require('sharp');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
//const app = express();
const verifyToken = require('../verifyToken');
const pool = require("../db");


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
  
  //const fileBuffer = await sharp(file.buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()

  

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: newFileName, 
    Body: fs.createReadStream(file.path),
    ContentType: req.file.mimetype // this will make the uploaded file publicly accessible. Adjust as necessary
  };

  try {
    await s3.send(new PutObjectCommand(uploadParams));
    //const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${uploadParams.Key}`;
    //console.log(`File uploaded successfully. ${fileUrl}`);
    res.status(200).send(`File uploaded successfully.`);

    fs.unlink(file.path, (err) => {
      if (err) {
        console.error(err);
      }
      console.log(`Temp file deleted: ${file.path}`);
    });
  } catch (err) {
    console.log('Error', err);
    res.status(500).send(err);
  }

  
  const { text,userId } = req.body;
  //const { id: userId } = req.user;
  //console.log(req.body)
  console.log(userId)
  let group_id = req.body.group_id
  let image_url = newFileName
  let up_down = req.body.up_down
  console.log(group_id)
  if (!text && !image_url) {
    return res.status(400).json({ message: 'Post must contain either text or image url' });
  }
  
  try {
    const result = await pool.query('INSERT INTO Posts (user_id, content, up_down, group_id, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [userId, text, up_down, group_id, image_url] );

    //return res.status(201).json({ message: 'Post created successfully', postId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }

});

router.get("/posts/:groupId", async (req, res) => {
  // Query inside the GET route
  const { groupId } = req.params;
  try {
    pool.query('SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.group_id = $1  OR posts.group_id = 100', [groupId], async (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }
    const posts = results.rows;
    console.log(posts)

    for (let post of posts) { 
      post.imageUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: post.image_url // Assuming 'imageName' is a column in your table
        }),
        { expiresIn: 60 }
      );
    }

    res.send(posts);
  });
} catch (err) {
  console.error(err);
  res.status(500).send('An error occurred during the operation.');
}

});

module.exports = router;



module.exports = router;
