import styles from './styles.module.css';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  
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
		try {
		  const url = "http://localhost:5000/signup";
		  const { data: res } = await axios.post(url, data);
		  navigate("/login");
		  console.log(res.message);
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
        <button className={styles.logo_pos}>
          <img className={styles.logo} src="HiLo Logo.png" alt="Logo"/>
        </button> 

        <div className={styles.signup_box}>
          <div className={styles.signup_text}>Create a new account</div>
          <form className={styles.input_contain} onSubmit={handleSubmit}>
            
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
            
            {error && <div className={styles.error_msg}>{error}</div>}
            
            <button type="submit" className={styles.signup_btn_pos}>
              <div className={styles.signup_btn}>Sign Up</div>  
            </button>  
          </form>

          <button className={styles.acct_btn_pos}>
            <a className={styles.acct_btn} href="/login">Have an account?</a>
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default Signup;


