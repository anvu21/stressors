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
const imagesRouter = require('./routes/images');
const http = require('http');
require("dotenv").config();

//middleware
app.use(cors());
app.use('/images', imagesRouter);

app.use(express.json())
//app.use(express.static("./client/build"))
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  //Allow all origins
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  path: '/ws',
  serveClient: false
});


//routes
app.get('/register', function(req, res) {
    res.send("It works!");
});  
//createrr

const jwtSecret = process.env.JWT_SECRET_KEY  // This should be in an environment variable in production



app.post('/signup', async (req, res) => {
  const { username, password, groupId, bio } = req.body;
  //console.log(req.body);
  //console.log(password);
  //console.log(groupId);

  if (!username || !password || !groupId) {
    return res.status(400).json({ message: 'Username, password, and group id are required' });
  }

  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const result = await pool.query('INSERT INTO Users (username, password, group_id, created_at, updated_at,bio) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $4) RETURNING id', [username, hashedPassword, groupId,bio]);

    const userId = result.rows[0].id;

    const token = jwt.sign({ id: userId ,group_id: groupId}, jwtSecret, { expiresIn: '2h' });

    return res.status(201).json({ message: 'User created successfully', userId, groupId, token });

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
    //console.log(userName)
    const token = jwt.sign({ id: userId ,group_id: groupId}, jwtSecret, { expiresIn: '2h' });

    return res.status(200).json({ message: 'User authenticated successfully', userId, token, userName,bio,groupId });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/post', verifyToken, async (req, res) => {
  const { text } = req.body;
  const { id: userId } = req.user;
  //console.log(req.body)
  console.log(userId)
  let group_id = req.body.group_id
  //let image_url = 'e'
  let up_down = req.body.up_down
  //console.log(group_id)
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
  //console.log(req.params)
  const { groupId } = req.params;
  //console.log(groupId)
  try {
    const result = await pool.query('SELECT posts.*, users.username FROM posts INNER JOIN users ON posts.user_id = users.id WHERE posts.group_id = $1  OR posts.group_id = 100', [groupId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No posts found for this group' });
    }

    return res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/comment', verifyToken, async (req, res) => {
  const { postId, comment_text } = req.body;
  console.log(req.body)
  //const {userId, group_id} = req.body;
  const { id: userId,group_id: group_id  } = req.user;

  console.log("userID"+userId)
  console.log("postID"+postId) 
  console.log("text"+comment_text) 
  console.log("GroupID"+group_id)
  if (!postId || !comment_text) {
    return res.status(400).json({ message: 'Post id and text are required' });
  }

  try {
    const result = await pool.query('INSERT INTO Comments (post_id, user_id, content,group_id, created_at, updated_at) VALUES ($1, $2, $3 , $4 , CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING id', [postId, userId, comment_text,group_id]);

    return res.status(201).json({ message: 'Comment created successfully', commentId: result.rows[0].id });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/comments/:groupId', async (req, res) => {
  try {
    const { groupId } = req.params;
    //console.log(groupId);
    const results = await pool.query(`
      SELECT comments.*, users.username 
      FROM comments 
      INNER JOIN users ON comments.user_id = users.id 
      WHERE comments.group_id = $1`, 
      [groupId]
    );
    //console.log(results.rows);
    res.json(results.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/like',verifyToken,  async (req, res) => {//verifyToken ,
  try{
  const { postId,group_id } = req.body;
  const { id: userId } = req.user;
  //const { group_id, userId} = req.body;
  console.log("postId "+postId)
  console.log("group_id "+group_id)
  console.log("Userid "+userId)
  if (!postId) {
    return res.status(400).json({ message: 'Post id is required' });
  }
  //const result = await pool.query('INSERT INTO likes (post_id, user_id,group_id ,created_at) VALUES ($1, $2,$3 , CURRENT_TIMESTAMP) RETURNING id', [postId, userId,group_id]);

  
    const existingLikeResult = await pool.query('SELECT * FROM Likes WHERE post_id = $1 AND user_id = $2 AND group_id = $3', [postId, userId, group_id]);

    if (existingLikeResult.rows.length > 0) {
      // If a like already exists, delete it
      try {
        await pool.query('DELETE FROM Likes WHERE post_id = $1 AND user_id = $2 AND group_id = $3', [postId, userId, group_id]);
        return res.status(200).json({ message: 'Like removed successfully' });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    } else {
      // If no like exists, create it
      try {
        const result = await pool.query('INSERT INTO Likes (post_id, user_id, group_id, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING id', [postId, userId, group_id]);
        return res.status(201).json({ message: 'Like added successfully', likeId: result.rows[0].id });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }
  
  
}catch (err){

  console.error(err);
}
});




  app.get('/likes/group/:groupId', async (req, res) => {
    
    
    try {
      const { groupId } = req.params;
      const result = await pool.query(
        `SELECT likes.*, posts.content, users.username
        FROM likes 
        INNER JOIN posts ON likes.post_id = posts.id 
        INNER JOIN users ON likes.user_id = users.id
        WHERE likes.group_id = $1`, 
        [groupId]
      );
      //console.log(result)
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'No likes found for this group' });
      }
      //console.log(result.rows);

      return res.status(200).json(result.rows);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });

app.get('/profile/:username', async (req, res) => {
  
  try {
    const { username } = req.params;
    const profileResult = await pool.query('SELECT id, username, group_id, bio FROM users WHERE username = $1', [username]);    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ message: 'No user found with this username' });
    }

    const userProfile = profileResult.rows[0];

    const postsResult = await pool.query('SELECT * FROM posts WHERE user_id = $1', [userProfile.id]);
    
    const userPosts = postsResult.rows;

    return res.status(200).json({ profile: userProfile, posts: userPosts });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/validateToken', verifyToken, (req, res) => {
  res.status(200).send({ message: 'Token is valid' });
});

app.get('/groupUsers/:group_id/:username', verifyToken, (req, res) => {
  // get the group_id and username from the request parameters
  const { group_id, username } = req.params;

  // run a query to get all users in the group excluding the given username
  const query = `SELECT username FROM users WHERE (group_id = $1 OR group_id = 100) AND username != $2`;
  const values = [group_id, username];

  pool.query(query, values, (error, result) => {
    if (error) {
      console.error('Error executing query', error.stack);
      res.status(500).json({ error: 'Failed to get users for the group' });
    } else {
      // send the result as the response
      res.status(200).json(result.rows);
    }
  });
});

app.post('/createAdmin', async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

  const result = await pool.query(`
    INSERT INTO users (username, password, is_admin) 
    VALUES ($1, $2, true) 
    RETURNING id, username, is_admin`, 
    [username, hashedPassword]
  );

  res.json(result.rows[0]);
});






io.use((socket, next) => {
  const token = socket.handshake.query.token;
  if (!token) {
    next(new Error('401 Unauthorized'));
    return;
  }

  try {
    // verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    // attach decoded to socket
    socket.decoded = decoded;
    next();
  } catch (err) {
    next(new Error('403 Forbidden'));
  }
});

io.on('connection', (socket) => {
  console.log('a user connected');

  const user = socket.decoded;
  const userId = user.id;
  socket.on('join conversation', (conversationId) => {
    socket.join(conversationId);
  });
  socket.on('chat message', async (data) => {
    
    const { conversationId,group_id, content, receiver_name } = JSON.parse(data);
    const user = socket.decoded;
    //console.log('User:', user);
    const sender_id = user.id;

    try {
      // Query to find the receiver's id based on the receiver_name
      const receiverQuery = 'SELECT id FROM users WHERE username = $1';
      const receiverResult = await pool.query(receiverQuery, [receiver_name]);

      if (receiverResult.rows.length > 0) {
        const receiver_id = receiverResult.rows[0].id;

        // Now that we have the receiver_id, we can insert the new message into the messages table
        const query = 'INSERT INTO messages (group_id, sender_id, content, receiver_id) VALUES ($1, $2, $3, $4)';
        const values = [group_id, sender_id, content, receiver_id];

        await pool.query(query, values);

        io.to(conversationId).emit('chat message', data); 
            } else {
        // If the receiver was not found in the database, we can't insert the message
        socket.emit('chat message', JSON.stringify({ error: 'Receiver not found' }));
      }
    } catch (error) {
      console.error('Error executing query', error.stack);
      socket.emit('chat message', JSON.stringify({ error: 'Could not save message' }));
    }
  });

  socket.on('fetch old messages', async (data) => {
    const { group_id,receiver_name,user_id } = data;
    console.log(group_id,receiver_name,user_id);
    try {
          // First, get the receiver's ID from the username
      const userQuery = `SELECT id FROM users WHERE username = $1`;
      const userResult = await pool.query(userQuery, [receiver_name]);
      // Query to find old messages based on the group_id
      if (userResult.rows.length > 0) {
        const receiver_id = userResult.rows[0].id;
  
        // Now, use the receiver's ID to fetch the messages
        const messagesQuery = `
        SELECT messages.*, users.username AS sender_name 
        FROM messages 
        JOIN users ON messages.sender_id = users.id
        WHERE messages.group_id = $1 AND 
          ((messages.receiver_id = $2 AND messages.sender_id = $3) OR 
           (messages.receiver_id = $3 AND messages.sender_id = $2))
        ORDER BY timestamp DESC
      `;
        const messagesResult = await pool.query(messagesQuery, [group_id, receiver_id,user_id]);
        console.log("Message Row"+messagesResult.rows)
        console.log("Message length"+messagesResult.rows.length)

        if (messagesResult.rows.length > 0) {
          const oldMessages = messagesResult.rows;
          // Send the old messages back to the client
          console.log("Old message")

          socket.emit('old messages', oldMessages);
        } else {
          // If there are no old messages for this group_id, we can send an empty array
          console.log("No old messages")
          socket.emit('old messages', []);
        }
      } else {
        console.error('No user with username', receiver_name);
        socket.emit('chat message', JSON.stringify({ error: 'No user found with given username' }));
      }
    } catch (error) {
      console.error('Error executing query', error.stack);
      socket.emit('chat message', JSON.stringify({ error: 'Could not fetch old messages' }));
    }
  });



  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(process.env.PORT||5000, () => {
  console.log(`server start on port ${process.env.PORT || 5000}`);
});


/*
app.listen(PORT,()=>{
    console.log(`server start on port ${PORT}`)


})*/
