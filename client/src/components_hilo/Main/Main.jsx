import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Navbar from '../Navbar/Navbar';
//import PostBar from '../posts/postBar';
import Posts from '../posts/posts';
import actors from '../posts/actors';

const Main = () => {
  
  let username = localStorage.getItem("name");
  let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");
  let userId = localStorage.getItem("userID");
 
  const [posts, setPosts] = useState([...actors]);
  const [data, setData] = useState({ text: "", up_down: "" });
  const [loading, setLoading] = useState(true); 

  const handlePost = async (e) => {
    e.preventDefault();
    let groupid = localStorage.getItem("groupID") 

    if (data.text === "") {
      alert('Post must contain text');
      return;
    }
    if (data.up_down === "") {
      alert("Please select an up or down arrow");
      return;
    }
    if (!file) {
      alert('Please select an image');
      return;
    }
  
    const formData = new FormData();
    formData.append('image', file);
    formData.append('text', data.text);
    formData.append('group_id', groupid);
    formData.append('up_down', data.up_down);
  
    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/images/upload`, formData, {
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'multipart/form-data'
        }
      });

      setData({ text: "", up_down: "" });
      setFile(null);    
      document.getElementById('imagePreview').src = "";
      console.log(response);
      fetchPosts();
      
    } catch (error) {
      console.error(error);
      alert('Could not create post');
    }
  };

  useEffect(() => {
    validateToken();
    fetchPosts();
    fetchComments();
    //fetchLikesForGroup();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);

    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/images/posts/${groupId}`, {
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
      console.log(sortedPosts);
      setLoading(false);

    } catch (error) {
      console.error('Fetching posts failed:', error);
      setLoading(false);
    }
  };

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log(data);
  };

  const handleCamera = () => {
    document.getElementById('fileInput').click();
  };

  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  
    // show a preview of the image
    let preview = document.getElementById('imagePreview');
    preview.src = URL.createObjectURL(e.target.files[0]);
  };


  const validateToken = async () => {
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': localStorage.getItem('token'),
      },
    };
  
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_API_URL}/validateToken`, requestOptions);
  
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

  const [isHiActive, setIsHiActive] = useState(false);
  const [isLoActive, setIsLoActive] = useState(false);

  const handleHiClick = () => {
    setData({ ...data, up_down: "up" });
    console.log("Hi")
    setIsHiActive(true);
    setIsLoActive(false);
  };
  const handleLoClick = () => {
    setData({ ...data, up_down: "down" });
    console.log("low")
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
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/comment`, { comment_text, group_id: groupid, postId: post__id}, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      
      setCommentText((prevCommentText) => ({
        ...prevCommentText,
        [post__id]: "",
      }));
      
      setCommentText("");
      
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
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/comments/${groupId}`, {
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
        {/** User profile box */}
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
        
        {/** Post input bar */}
        <div className="w-[600px] min-h-[50px] flex-col items-center bg-gray-300 rounded-lg">
          <div className='w-full h-full flex items-center px-3 py-2'>
            <Link to={`/profile/${username}`}>
              <img src={"/avatar.png"} alt="Avatar" className="w-8 h-8 rounded-full mr-2" />
            </Link>
            <input
              type="text"
              placeholder="Start a post"
              name="text"
              onChange={handleChange}
              value={data.text}
              className="flex-grow py-2 px-4 bg-white rounded-lg resize-none focus:outline-none"
            ></input>
            
            <button className="p-1 ml-2" onClick={handleLoClick}>
              <img src={isImageHoveredLo || isLoActive ? hoverLo : defaultLo}           
                alt="Low"
                onMouseEnter={() => setIsImageHoveredLo(true)}
                onMouseLeave={() => setIsImageHoveredLo(false)}
                className="w-5 h-8" />
            </button>
            <button className="p-1" onClick={handleHiClick}>
              <img src={isImageHoveredHi || isHiActive ? hoverHi : defaultHi} 
                alt="High"
                onMouseEnter={() => setIsImageHoveredHi(true)}
                onMouseLeave={() => setIsImageHoveredHi(false)} 
                className="w-5 h-8"
              />
            </button>
            <input 
              type="file" 
              id="fileInput" 
              style={{ display: "none" }} // hide the input
              onChange={handleFileChange} // call the function to handle the file when it changes
            />
            <button className="bg-transparent p-1" onClick={handleCamera}>
              <svg className="w-8 h-8 fill-current text-neutral-500 hover:text-neutral-700" height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 487 487">
                <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z
                  M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9
                  v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z
                  M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z
                  M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"/>
              </svg>
            </button>
            <button className="bg-transparent p-1" onClick={handlePost}>
              <svg className="w-8 h-8 fill-current text-neutral-500 hover:text-neutral-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
              </svg>
            </button>
          </div>
          
          <div className='flex justify-center items-center'>
            <img id="imagePreview" className="max-h-[400px] mb-1"/>
          </div>
        </div>
        
        {/** Post List */}
        <Posts      
          username={username}
          posts={posts}
          userId={userId}
          groupId={groupId}
          loading={loading}
          commentText={commentText}
          handleCommentChange={handleCommentChange}
          handleAddComment={handleAddComment}
          comments={comments}
          //allGroupLikes={allGroupLikes}
        />
      </div>
    </div>
  );
}

export default Main;
