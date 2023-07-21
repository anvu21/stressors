import styles from './styles.module.css';
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const PostBar = () => {
  let username = localStorage.getItem("name");

  const [data, setData] = useState({ text: "", up_down: "" });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log(data);
  };

  const handleCamera = () => {
    document.getElementById('fileInput').click();
  };

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
    if (data.text === "") {
      alert('Post must contain text');
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

  return (

  <div className={styles.post_bar}>
    <Link to={`/profile/${username}`} className={styles.profile_icon_pos}>
      <img className={styles.profile_icon} src="/avatar.png" alt="Avatar"/>
    </Link>

    <div className={styles.post_input_pos}>
      <textarea 
        type="text"
        placeholder="Start a post"
        name="text"
        onChange={handleChange}
        value={data.text}
        className={styles.post_input} 
      />

      <button className={styles.send_pos} onClick={handlePost}>
        <svg className={styles.send} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
          <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
        </svg>
      </button>

      <input 
        type="file" 
        id="fileInput" 
        style={{ display: "none" }} // hide the input
        onChange={handleFileChange} // call the function to handle the file when it changes
      />

      <button className={styles.camera_pos} onClick={handleCamera}>
        <svg className={styles.camera_icon} height="800px" width="800px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 487 487">
          <path d="M308.1,277.95c0,35.7-28.9,64.6-64.6,64.6s-64.6-28.9-64.6-64.6s28.9-64.6,64.6-64.6S308.1,242.25,308.1,277.95z
            M440.3,116.05c25.8,0,46.7,20.9,46.7,46.7v122.4v103.8c0,27.5-22.3,49.8-49.8,49.8H49.8c-27.5,0-49.8-22.3-49.8-49.8v-103.9
            v-122.3l0,0c0-25.8,20.9-46.7,46.7-46.7h93.4l4.4-18.6c6.7-28.8,32.4-49.2,62-49.2h74.1c29.6,0,55.3,20.4,62,49.2l4.3,18.6H440.3z
            M97.4,183.45c0-12.9-10.5-23.4-23.4-23.4c-13,0-23.5,10.5-23.5,23.4s10.5,23.4,23.4,23.4C86.9,206.95,97.4,196.45,97.4,183.45z
            M358.7,277.95c0-63.6-51.6-115.2-115.2-115.2s-115.2,51.6-115.2,115.2s51.6,115.2,115.2,115.2S358.7,341.55,358.7,277.95z"/>
        </svg>
      </button>

      <img id="imagePreview" style={{maxWidth: "100px"}}/>

      <button className={styles.hi_pos} onClick={handleHiClick}>
        <img 
        className={styles.hi}   
        src={isImageHoveredHi || isHiActive ? hoverHi : defaultHi}
        alt="High"
        onMouseEnter={() => setIsImageHoveredHi(true)}
        onMouseLeave={() => setIsImageHoveredHi(false)}
        />
      </button>
      <button className={styles.lo_pos} onClick={handleLoClick}>
        <img 
        className={styles.lo}
        src={isImageHoveredLo || isLoActive ? hoverLo : defaultLo}
        alt="Low"
        onMouseEnter={() => setIsImageHoveredLo(true)}
        onMouseLeave={() => setIsImageHoveredLo(false)}
        />
      </button>
    </div>  
  </div>
  );
};

export default PostBar;