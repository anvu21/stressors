const express = require('express');
const router = express.Router();
const multer = require('multer');
const { S3Client, PutObjectCommand,GetObjectCommand,DeleteObjectCommand   } = require("@aws-sdk/client-s3");
const fs = require('fs');
const cors = require('cors');
const bcrypt = require('bcrypt');

require("dotenv").config();
const crypto = require('crypto');
const upload = multer({ dest: 'uploads/' }); // temporarily store file in 'uploads' directory
const sharp = require('sharp');
const {getSignedUrl} = require('@aws-sdk/s3-request-presigner');
//const app = express();
const verifyToken = require('../verifyToken');
const pool = require("../db");
router.use(cors());

const s3 = new S3Client({ 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },

  region: process.env.BUCKET_REGION }); // create access point

router.post('/upload',verifyToken, upload.single('image'), async (req, res) => {
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

  
  const { text } = req.body;
  //const { id: userId } = req.user;
  //console.log(req.body)
  const { id: userId } = req.user;
 //console.log(userId)
  let group_id = req.body.group_id
  let image_url = newFileName
  let up_down = req.body.up_down
  //console.log(group_id)
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
//for profile signup
router.post('/profile/upload', upload.single('image'), async (req, res) => {
  
  let newFileName
  try {
    if(req.file){
    const file = req.file;
  // Generate a random string for filename
  let randomName = crypto.randomBytes(16).toString("hex");
  // Preserve the file extension
  let fileExtension = file.originalname.split(".").pop();
   newFileName = `${randomName}.${fileExtension}`;  
  
  //const fileBuffer = await sharp(file.buffer).resize({ height: 1920, width: 1080, fit: "contain" }).toBuffer()

  

  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: newFileName, 
    Body: fs.createReadStream(file.path),
    ContentType: req.file.mimetype // this will make the uploaded file publicly accessible. Adjust as necessary
  };
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
  }
  } catch (err) {
    console.log('Error', err);
    //res.status(500).send(err);
  }

  let image_url
  if (newFileName){
     image_url = newFileName

  }

  const { username, password, groupId, bio } = req.body;

  
  //console.log(group_id)
  if (!username ) {
    return res.status(400).json({ message: 'Signup must contain username' });
  }
  try {
    // Check if a user with the provided username already exists
    const existingUserResult = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (existingUserResult.rows.length > 0) {
      // If a user already exists with that username, send an error response
      return res.status(409).json({ message: 'User with that username already exists' });
    }

    // If no user exists with that username, proceed with creating the new user
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const result = await pool.query('INSERT INTO Users (username, password, group_id, created_at, updated_at,bio,profile_pic_url) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4, $5) RETURNING id', [username, hashedPassword, groupId, bio, image_url]);
    res.status(200).json({ message: 'User created successfully', userId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
//Post images get
router.get("/posts/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;
    console.log(groupId);
    pool.query('SELECT posts.*, users.username,users.profile_pic_url FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.group_id = $1 OR posts.group_id = 100', [groupId], async (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send(error);
        return;
      }
      const posts = results.rows;

      for (let post of posts) {
        // Check if post.image_url is not null or empty
        if (post.image_url) {
          post.imageUrl = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: post.image_url
            }),
            { expiresIn: 3600 }
          );
        }

        // Check if post.profile_pic_url is not null or empty
        if (post.profile_pic_url) {
          post.profile_pic_url = await getSignedUrl(
            s3,
            new GetObjectCommand({
              Bucket: process.env.BUCKET_NAME,
              Key: post.profile_pic_url
            }),
            { expiresIn: 3600 }
          );
        }
      }

      res.send(posts);
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred during the operation.');
  }
});

//users posts
router.get("/users_posts/:username", async (req, res) => {
  // Query inside the GET route
  try {
    const { username } = req.params;
    console.log(username);
    const profileResult = await pool.query('SELECT id, username, group_id, bio FROM users WHERE username = $1', [username]);    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with this username' });
    }

    const userProfile = profileResult.rows[0];
    console.log(userProfile);


    pool.query('SELECT posts.*, users.username, users.profile_pic_url FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.user_id = $1 ', [userProfile.id], async (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send(error);
      return;
    }
    const posts = results.rows;
    //console.log(posts)

    for (let post of posts) { 
      post.imageUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: post.image_url // Assuming 'imageName' is a column in your table
        }),
        { expiresIn: 3600 }
      );
      if (post.profile_pic_url) {

      post.profile_pic_url = await getSignedUrl(
        s3,
        new GetObjectCommand({
          Bucket: process.env.BUCKET_NAME,
          Key: post.profile_pic_url // Assuming 'imageName' is a column in your table
        }),
        { expiresIn: 3600 }
      );
    }
  }

    res.send(posts);
  });
} catch (err) {
  console.error(err);
  res.status(500).send('An error occurred during the operation.');
}

});

//users info
router.get("/users/:username", async (req, res) => {
  // Query inside the GET route
  try {
    const { username } = req.params;
    console.log(username);
    const profileResult = await pool.query('SELECT * FROM users WHERE username = $1', [username]);    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with this username' });
    }

    const userProfile = profileResult.rows[0];
    console.log(userProfile);

    
      if (userProfile.profile_pic_url) {

        userProfile.profile_pic_url = await getSignedUrl(
          s3,
          new GetObjectCommand({
            Bucket: process.env.BUCKET_NAME,
            Key: userProfile.profile_pic_url // Assuming 'imageName' is a column in your table
          }),
          { expiresIn: 3600 }
        );
    }
  

    res.send(userProfile);
  } catch (err) {
  console.error(err);
  res.status(500).send('An error occurred during the operation.');
}

});

router.delete("/posts/:id", async (req, res) => {
  const id = +req.params.id;

  try {
    // Retrieve post from the database
    const postResult = await pool.query('SELECT * FROM posts WHERE id = $1', [id]);
    if (postResult.rowCount === 0) {
      res.status(404).send('Post not found');
      return;
    }
    const post = postResult.rows[0];

    // Delete image from S3
    const deleteParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: post.image_name, // Assuming 'image_name' is the column in your table
    };
    await s3.send(new DeleteObjectCommand(deleteParams));

    // Delete post from the database
    await pool.query('DELETE FROM posts WHERE id = $1', [id]);

    res.send(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('An error occurred during the operation.');
  }
});

router.post('/fake_actor/signup', upload.single('image'), async (req, res) => {
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

  

  let image_url = newFileName

  const { username, password, groupId, bio } = req.body;

  
  //console.log(group_id)
  if (!username ) {
    return res.status(400).json({ message: 'Signup must contain username' });
  }
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);  
  try {
    const result = await pool.query('INSERT INTO Users (username, password, group_id, created_at, updated_at,bio,profile_pic_url) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4, $5) RETURNING id', [username, hashedPassword, groupId,bio,image_url]);


  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }

});


router.post('/fake_actor/post', upload.single('image'), async (req, res) => {
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

  
  const { text } = req.body;
  //const { id: userId } = req.user;
  //console.log(req.body)
  const { userId } = req.body;
 //console.log(userId)
  let group_id = req.body.group_id
  let image_url = newFileName
  let up_down = req.body.up_down
  //console.log(group_id)
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


module.exports = router;
