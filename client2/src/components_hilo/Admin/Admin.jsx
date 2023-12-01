import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Navbar from '../Navbar/Navbar';
//import PostBar from '../posts/postBar';
import Posts from './AdminPosts';
//import actors from '../posts/actors';

const Admin = () => {
   
  const default_img = "/avatar.png"

  //let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");
  //let userId = localStorage.getItem("userID");
  let username = localStorage.getItem("name");
  const [bio, setBios] = useState([null]);
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [data, setData] = useState({ text: "", up_down: "" });
  const [loading, setLoading] = useState(true); 
  const [postDateTime, setPostDateTime] = useState('');
  const [userId, setUserId] = useState('');


  const handlePost = async (e) => {
    e.preventDefault();

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
    formData.append('up_down', data.up_down);
    formData.append('created_at', postDateTime);
    formData.append('userId', userId);

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/images/admin/upload`, formData, {
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
    fetchFakeActorUsernames();
    //fetchPosts();
    //fetchComments();
    
    //fetchProfile();
    //fetchLikesForGroup();
  }, []);
  
  const fetchPosts = async () => {
    setLoading(true);
    console.log("fetching Post")
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/images/fake_actors/fetchall`, {
       
      });
      const fetchedPosts = response.data;
      //const combinedPosts = [...actors, ...fetchedPosts];
      const sortedPosts = fetchedPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setPosts(sortedPosts);
      console.log("Posts fetch");
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
  const handleDateTimeChange = (event) => {
    setPostDateTime(event.target.value);
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

/* Worry about this later
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
        //navigate('/login'); // Redirects to the login page
        window.location.href = '/login'; // Redirects to the login page
        return null;
      }
      
      return true; // If we reach this point, the token is valid
    } catch (error) {
      console.error(`An error occurred: ${error}`);
      return null;
    }
  }; */




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
  const defaultHi = "/Hi.png";
  const hoverHi = "/hi_green.png";  

  const [isImageHoveredLo, setIsImageHoveredLo] = useState(false);
  const defaultLo = "/Lo.png";
  const hoverLo = "/lo_red.png";
  


  const fetchProfile = async () => {
    setLoading(true);
    try {
      /** temporary posts for actors
      const profilePosts = actors.filter((post) => post.username === username);
      if (profilePosts.length > 0) {
        const sortedPosts = profilePosts.sort((a, b) => {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        setPosts(sortedPosts);
        setLoading(false);
        return;
      } */

      // user profile and posts fetch
      let username = localStorage.getItem("name");

      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/images/fake_actors/${username}`); 
      console.log(response.data.profile_pic_url);
      if (response.data.profile_pic_url === null) {
        // Set a default image URL when profile_pic_url is null
        response.data.profile_pic_url = default_img;
      }
       setBios(response.data.bio);

      //console.log(bio)
      setProfile(response.data);
      setLoading(false);
      setUserId(response.data.id)
      localStorage.setItem('id_key', response.data.id);
      console.log(response.data.id)
      console.log("profile fetch");
      console.log(response.data);
      fetchPosts();

    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

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
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/images/comments/${groupId}`, {
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

  const [fakeActorUsernames, setFakeActorUsernames] = useState([]);
  const [selectedUsername, setSelectedUsername] = useState('');

  const fetchFakeActorUsernames = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/images/fake_actors/usernames`);
        setFakeActorUsernames(response.data);
    } catch (error) {
        console.error('Error fetching fake actor usernames:', error);
    }
  };

  const handleSelectChange = (event) => {
    const username = event.target.value;
    setSelectedUsername(username);
    localStorage.setItem('name', username);
    fetchProfile();
    // Optionally, trigger fetching posts for the selected fake actor
    fetchFakeActorPosts(username);
};




  return (
      <div className={styles.screen}> 

        <div className={styles.screen_centered}>
          <div className={styles.left_col}>
          <div>
            {/* Select bar for fake actor usernames */}
            <select value={selectedUsername} onChange={handleSelectChange}>
                <option value="">Select a Fake Actor</option>
                {fakeActorUsernames.map((username, index) => (
                    <option key={index} value={username}>{username}</option>
                ))}
            </select>
        </div>
            {/**Profile Box */}
            <div className={styles.user_box}>
              {/** profile not editable by user yet */}
              <Link to={`/profile/${username}`}>
                {profile && profile.profile_pic_url !== null && (
                  <img className={styles.user_pic} src={profile.profile_pic_url} alt="Profile Picture"/>
                )}
              </Link>
              <div className={styles.name}>{username}</div>
              <div className={styles.bio}>{bio}</div>
            </div>
          </div>
          <div className={styles.post_col}>
            {/** Post input bar */}
            <div className={styles.post_bar}>
              <div className={styles.post_bar_top}>
                <Link to={`/profile/${username}`}>
                  {profile && profile.profile_pic_url !== null && (
                    <div className={styles.profile_icon_flx}>
                      <img src={profile.profile_pic_url} alt="Avatar" className={styles.profile_icon} />
                    </div>)}
                </Link>
                <input
                  type="text"
                  placeholder="Start a post"
                  name="text"
                  onChange={handleChange}
                  value={data.text}
                  className={styles.post_input}
                ></input>
                <input
                type="datetime-local"
                value={postDateTime}
                onChange={handleDateTimeChange}
                className={styles.post_datetime_input} // Apply your CSS styles as needed
                />
                
                <button className="" onClick={handleLoClick}>
                  <img src={isImageHoveredLo || isLoActive ? hoverLo : defaultLo}           
                    alt="Low"
                    onMouseEnter={() => setIsImageHoveredLo(true)}
                    onMouseLeave={() => setIsImageHoveredLo(false)}
                    className={styles.hilo} />
                </button>
                <button className="" onClick={handleHiClick}>
                  <img src={isImageHoveredHi || isHiActive ? hoverHi : defaultHi} 
                    alt="High"
                    onMouseEnter={() => setIsImageHoveredHi(true)}
                    onMouseLeave={() => setIsImageHoveredHi(false)} 
                    className={styles.hilo}
                  />
                </button>
                <input 
                  type="file" 
                  id="fileInput" 
                  style={{ display: "none" }} // hide the input
                  onChange={handleFileChange} // call the function to handle the file when it changes
                />
                <button className="" onClick={handleCamera}>
                  <svg className={styles.send_camera} height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 487 487">
                    <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z
                      M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9
                      v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z
                      M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z
                      M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"/>
                  </svg>
                </button>
                <button className="" onClick={handlePost}>
                  <svg className={styles.send_camera} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                    <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
                  </svg>
                </button>
              </div>
              
              <div className={styles.post_bar_bot}>
                <img id="imagePreview" className={styles.post_img}/>
              </div>
            </div>
            
            {/** Post List */}
            <Posts      
              profile={profile}
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
      </div>
  );
}

export default Admin;
