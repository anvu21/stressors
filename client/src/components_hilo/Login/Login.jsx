import styles from './styles.module.css';
import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
	const [data, setData] = useState({ username: "", password: "" });
	const [error, setError] = useState("");
  
	const handleChange = ({ currentTarget: input }) => {
	  setData({ ...data, [input.name]: input.value });
	};
  
	const handleSubmit = async (e) => {
	  e.preventDefault();
	  try {
		const url = `${import.meta.env.VITE_APP_API_URL}/signin`;
		const { data: res } = await axios.post(url, data);
		console.log(res)
		if (res.status === 401) {
		  setError("Wrong username or password");
		} else {
		  localStorage.setItem("token", res.token);
		  localStorage.setItem("name", res.userName);
      localStorage.setItem("userID", res.userId);
      localStorage.setItem("groupID", res.groupId);
      localStorage.setItem("bio", res.bio);
      //localStorage.setItem('imageUrl', res.imageUrl);
		  window.location = "/";
		}
	  } catch (error) {
		if (
		  error.response &&
		  error.response.status >= 400 &&
		  error.response.status <= 500
		) {
		  setError(error.response.data.message);
		}
	  }
	}
  

  return (
    <div>
      <div className={styles.screen}>

        <div className={styles.logo_pos}>
          <img className={styles.logo} src="/HiLo Logo.png" alt="Logo"/>
        </div> 

        <div className={styles.login_box}>
          <div className={styles.login_text}>Login</div>
            
          <form className={styles.input_contain} onSubmit={handleSubmit}>
            <input
              type="username"
              placeholder="Username"
              name="username"
              onChange={handleChange}
              value={data.username}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}

            <button type="submit" className={styles.login_btn_pos}>
              <div className={styles.login_btn}>Sign In</div>
            </button>
            <div className={styles.or}>or</div>
            <button className={styles.acct_btn_pos}>
              <a className={styles.acct_btn} href="/signup">Create new account</a>
            </button>
          </form>
         

        </div>
        
      </div>
    </div>
  )
}

export default Login;
