import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
//import LikeButton from '../posts/like';
import Navbar from '../navbar/navbar';
import actors from '../posts/actors';
import PostBar from '../posts/postBar';
import PostItem from '../posts/posts';
//import comments from './comments';

const Main = () => {
  // temp number of posts on screen
  const [visiblePosts, setVisiblePosts] = useState(10); // Number of initially visible posts
  const postsPerPage = 10;
  const handleLoadMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + postsPerPage);
    console.log('+10 posts');
  };

  const handleCamera = () => {
    document.getElementById('fileInput').click();
  };

  //sample like data
  const [likes, setLikes] = useState([  ]);

  const handleReplyClick = () => {
    console.log('Reply button clicked');
  };
  const handleShareClick = () => {
    console.log('Share button clicked');
  };
  
  let username = localStorage.getItem("name");
  let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");
  
  const [error, setError] = useState("");
  const [data, setData] = useState({ text: "", up_down: "" });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log(data);
  };

  const [posts, setPosts] = useState([...actors]);
  const [imageFile, setImageFile] = useState(null);
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  
    // show a preview of the image
    let preview = document.getElementById('imagePreview');
    preview.src = URL.createObjectURL(e.target.files[0]);
  };

  const handlePost = async (e) => {
    e.preventDefault();
    let groupid = localStorage.getItem("groupID") 
    
    if (data.up_down === "") {
      alert("Please select an up or down arrow");
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', data.text);
    formData.append('group_id', groupid);
    formData.append('up_down', data.up_down);
  
    try {
      const response = await axios.post('http://localhost:5000/images/upload', formData, {
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });
        
      setData({ text: "", up_down: "" });
      setFile(null);
      document.getElementById('imagePreview').src = "";
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert('Could not create post');
    }
  };
  const fetchLikesForGroup = async () => {
    try {
      let groupId = localStorage.getItem("groupID"); // replace this with your actual group id logic
      const response = await fetch(`http://localhost:5000/likes/group/${groupId}`);
      const data = await response.json();
      if (response.ok && Array.isArray(data)) {
        setAllGroupLikes(data);
    } else {
        console.log(data.message);
        setAllGroupLikes([]);
    }
      console.log('Fetched likes data:', data);  // Add this line
      
    } catch (error) {
      console.error("An error occurred:", error);
      setAllGroupLikes([]);
    }
  };
  const [allGroupLikes, setAllGroupLikes] = useState([]);

  useEffect(() => {
    validateToken();
    fetchPosts();
    fetchComments();
    fetchLikesForGroup();
  }, []);
  const validateToken = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    };
  
    try {
      const response = await fetch('http://localhost:5000/validateToken', requestOptions);
  
      if (!response.ok) {
        // If the server responds with a status code outside of the 200 range
        localStorage.removeItem('token');
        navigate('/login'); // Redirects to the login page
        return null;
      }
      
      return true; // If we reach this point, the token is valid
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return null;
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/images/posts/${groupId}`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      const fetchedPosts = response.data;

      const combinedPosts = [...actors, ...fetchedPosts];

      const sortedPosts = combinedPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setPosts(sortedPosts);
      console.log(sortedPosts)

    } catch (error) {
      console.error('Fetching posts failed:', error);
    }
  };
  
  const [isHiActive, setIsHiActive] = useState(false);
  const [isLoActive, setIsLoActive] = useState(false);

  const handleHiClick = () => {
    console.log("Hi")
    setData({ ...data, up_down: "up" });
    setIsHiActive(true);
    setIsLoActive(false);
  };
  
  const handleLoClick = () => {
    console.log("low")
    setData({ ...data, up_down: "down" });
    setIsHiActive(false);
    setIsLoActive(true);
  };
  
  const [isImageHoveredHi, setIsImageHoveredHi] = useState(false);
  const defaultHi = "Hi.png";
  const hoverHi = "hi_green.png";  

  const [isImageHoveredLo, setIsImageHoveredLo] = useState(false);
  const defaultLo = "Lo.png";
  const hoverLo = "lo_red.png";


  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({});
    
  const handleCommentChange = ({ currentTarget: input }, postId) => {
    const newCommentText = {
      postId: postId,
      comment_text: input.value,
    };
  
    setCommentText(newCommentText);
    console.log(newCommentText);
  };
  
  const handleAddComment = async (e , post__id) => {
    //console.log('Post button clicked');
    e.preventDefault();
    //console.log("Comment text"+commentText)
    let groupid =localStorage.getItem("groupID") 
    const { comment_text } = commentText;
    console.log(commentText)
    try {
      const response = await axios.post('http://localhost:5000/comment', { comment_text, group_id: groupid, postId: post__id}, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      
      setCommentText((prevCommentText) => ({
        ...prevCommentText,
        [post__id]: "",
      }));
      
      console.log(response)
      //alert(response.data.message);
      fetchComments();
      
    } catch (error) {
      console.error(error);
      alert('Could not create comment');
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/comments/${groupId}`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      console.log(response)
      const sortedComments = response.data.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setComments(sortedComments);
      console.log("comment fetch")
      console.log(sortedComments);
    } catch (error) {
      console.error('Fetching commments failed:', error);
    }
  }



  return (
    <div>
      <div className={styles.screen}> 
        <Navbar />   
        <div className={styles.user_box}>
          {/** profile not editable by user yet */}
          <Link to={`/profile/${username}`}>
            <img className={styles.user_pic} src="/avatar.png" alt="Profile Picture"/>
          </Link>
          <div className="flex">
            <div className={styles.name}>
              {username}
            </div>
            <div className={styles.bio}>
              {bio}
            </div>
          </div>
        </div>
        
        <PostBar />

        {posts.slice(0, visiblePosts).map((post, index) => (
          <PostItem
            key={post.id}
            post={post}
            likes={likes.filter((like) => like.post_id === post.id)}
            handleShareClick={handleShareClick}
            handleReplyClick={handleReplyClick}
            commentText={commentText}
            handleCommentChange={handleCommentChange}
            handleAddComment={handleAddComment}
            comments={comments.filter((comment) => comment.post_id === post.id)}
            allGroupLikes={allGroupLikes}
            
          />
        ))}
        {/** temp btn to load posts */}
        <button className={styles.load} onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  );
}

export default Main;
