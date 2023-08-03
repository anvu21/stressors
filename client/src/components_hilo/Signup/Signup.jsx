import styles from './styles.module.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  
  const [file, setFile] = useState(null);

  const handleCamera = () => {
    document.getElementById('fileInput').click();
      // Check if the file input has any selected file
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      fileInput.click();
    } else {
      // Display an error message or handle the case when no file is selected from the camera
      console.log("No file selected from the camera.");
    }
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  
    // show a preview of the image
    let preview = document.getElementById('imagePreview');
    preview.src = URL.createObjectURL(e.target.files[0]);
  };

	const [data, setData] = useState({
		
		username: "",
		password: "",
    groupId: "",
    bio: "",
    
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
	  
	const handleSubmit = async (e) => {
		e.preventDefault();

    const formData = new FormData();
    formData.append('image', file);
    formData.append('username', data.username);
    formData.append('password', data.password);
    formData.append('groupId', data.groupId);
    formData.append('bio', data.bio);
    
		try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/images/profile/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
		  
      /**  const url = `${import.meta.env.VITE_APP_API_URL}/images/profile/upload`;
		  const { data: res } = await axios.post(url, data);*/

		  navigate("/login");
		  console.log(response.data);
		} catch (error) {
		  if (
      error.response &&
      error.response.status >= 400 &&
      error.response.status <= 500
		  ) {
			setError(error.response.data.message);
		  }
		}
	};

  
  return (
    <div>
      <div className={styles.screen}>
        <div className={styles.logo_pos}>
          <img className={styles.logo} src="/HiLo Logo.png" alt="Logo"/>
        </div> 

        <div className={styles.signup_box}>
          <div className={styles.signup_text}>Create a new account</div>
          <div className={styles.input_contain}>
            
            <input
              type="text"
              placeholder="New Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className={styles.enter}
            />
            <input
              type="text"
              placeholder="New Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.enter}
            />
            <input
              type="text"
              placeholder="Group ID"
              name="groupId"
              onChange={handleChange}
              value={data.groupId}
              required
              className={styles.enter}
            />
            <textarea
              type="text"
              placeholder="Bio"
              name="bio"
              onChange={handleChange}
              value={data.bio}
              className={styles.bio}
            ></textarea>
            
            {/** upload image code from main */}
            <input 
              type="file" 
              id="fileInput" 
              style={{ display: "none" }} // hide the input
              onChange={handleFileChange} // call the function to handle the file when it changes
            />
            <button className={styles.upload_text} onClick={handleCamera}>
              Upload an Image
            </button>
            <div className={styles.image}>
              <img id="imagePreview" className="object-cover w-full h-full rounded-full"/>
            </div>

            {error && <div className={styles.error_msg}>{error}</div>}
            
            <button type="submit" className={styles.signup_btn_pos} onClick={handleSubmit}>
              <div className={styles.signup_btn}>Sign Up</div>  
            </button>  
          </div>

          <button className={styles.acct_btn_pos}>
            <a className={styles.acct_btn} href="/login">Have an account?</a>
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default Signup;


