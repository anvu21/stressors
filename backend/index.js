const express = require("express")
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const pool = require("./db");
const path=require("path")
const PORT=process.env.PORT ||5000;
const verifyToken = require('./verifyToken');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//middleware
app.use(cors());
app.use(express.json())
//app.use(express.static("./client/build"))

if (process.env.NODE_ENV === 'production'){
  //server static conetent
  app.use(express.static(path.join(__dirname, "client/build")))
}
//routes
app.get('/register', function(req, res) {
    res.send("It works!");
});
//create

const jwtSecret = process.env.JWT_SECRET || 'your-secret-key'; // This should be in an environment variable in production



app.post('/signup', async (req, res) => {
  const { username, password, groupId, bio } = req.body;
  console.log(req.body);
  console.log(password);
  console.log(groupId);

  if (!username || !password || !groupId) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO Users (username, password, group_id, created_at, updated_at,bio) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4) RETURNING id', [username, hashedPassword, groupId,bio]);

    const userId = result.rows[0].id;

    const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });

    return res.status(201).json({ message: 'User created successfully', userId, token });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const user = await pool.query('SELECT * FROM Users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    const userId = user.rows[0].id;
    const userName= user.rows[0].username;
    const bio= user.rows[0].bio;
    const groupId = user.rows[0].group_id;
    console.log(userName)
    const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: '1h' });

    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName,bio,groupId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/post', verifyToken, async (req, res) => {
  const { text } = req.body;
  const { id: userId } = req.user;
  console.log(req.body)
  let group_id = 5 
    let image_url = 'e'
    let up_down = Math.floor(Math.random() * 10)
  if (!text && !image_url) {
    return res.status(400).json({ message: 'Post must contain either text or image url' });
  }
  
  try {
    const result = await pool.query('INSERT INTO Posts (user_id, content, up_down, group_id, image_url, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [userId, text, up_down, group_id, image_url] );

    return res.status(201).json({ message: 'Post created successfully', postId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/posts/:groupId', async (req, res) => {
  console.log(req.params)
  const { groupId } = req.params;
  console.log(groupId)
  try {
    const result = await pool.query('SELECT * FROM Posts WHERE group_id = $1', [groupId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No posts found for this group' });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/comment', async (req, res) => {
  const { postId, text } = req.body;
  const { id: userId } = req.user;

  if (!postId || !text) {
    return res.status(400).json({ message: 'Post id and text are required' });
  }

  try {
    const result = await pool.query('INSERT INTO Comments (post_id, user_id, text, created_at, updated_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [postId, userId, text]);

    return res.status(201).json({ message: 'Comment created successfully', commentId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT,()=>{
    console.log(`server start on port ${PORT}`)


})
