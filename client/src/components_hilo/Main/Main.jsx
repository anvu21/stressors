import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link,useNavigate } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import PostBar from '../posts/postBar';
import PostList from '../posts/postList';
import axios from 'axios';



const Main = () => {
 
  let userId = localStorage.getItem("userID");
  let username = localStorage.getItem("name");
  let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");



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

        <PostList groupId={groupId} userId={userId} />

      </div>
    </div>
  );
}

export default Main;