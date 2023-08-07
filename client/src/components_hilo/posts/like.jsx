import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const LikeButton = ({ post, postId, groupId, userId }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [numLikes, setNumLikes] = useState(0);

  useEffect(() => {
    fetchLikes();
  }, []);

  const handleLikeClick = async () => {
    setIsLiked(!isLiked);
    console.log(postId, userId, groupId);
    const likeData = {
      postId: postId, 
      userid: userId,
      group_id: groupId, 
    };

    try {
      const response = await axios.post(`${import.meta.env.VITE_APP_API_URL}/like`, likeData, {
        headers: {
          'auth-token': localStorage.getItem('token'),
          'Content-Type': 'application/json'
        }
      });
      // if response is successful, adjust likes count
      if(response.status === 200 || response.status === 201) {
        setNumLikes((prevLikes) => (isLiked ? prevLikes - 1 : prevLikes + 1));
      }

      console.log("Like button clicked ", response.data);
    } catch (error) {
      console.error('Failed to like/unlike:', error);
    }
  };

  const fetchLikes = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/likes/group/${groupId}`);      
      const likes = response.data;
      setNumLikes(likes.filter((like) => like.post_id === postId).length);
      setIsLiked(likes.some((like) => like.post_id === postId)); //&& like.user_id === userId

      console.log({groupId}, {postId}, "Like fetch ", response.data);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <button
        className={styles.reply_btn}
        onClick={handleLikeClick}
      >
        {isLiked ? (
        <svg className={styles.like_click} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M244.271,464.367c-43.73,7.81-124.007,9.094-147.98,0.1c-15.31-7.82-28.58-19.47-38.51-33.49
            c-17.25-24.51-24.07-54.76-25.69-84.29c-1.729-35.18,2.971-70.52,12.08-104.479c2.5-10.771,8.99-20.58,18.221-26.75
            c13.199-8.879,29.399-11.52,44.979-12.339c26.061-0.641,52.05,3.59,77.12,10.469c-15.26-17.9-22.28-41.2-25.479-64.129
            c-2.94-22.17-2.881-44.7-0.36-66.92c0.62-7.23,1.38-14.9,5.96-20.87c11.59-15.61,38.946-24.813,51.05-18.26
            s24.604,96.553,70.19,141.5c16.881,17.63,35.41,33.7,55.311,47.83c8.66,42.319,8.41,86.35,2.74,129.31
            c-2.92,19.21-4.95,38.35-14.38,55.46c-6.96,13.311-19.21,23.08-32.44,29.72C280.611,455.947,262.421,460.627,244.271,464.367z"/>
          <path d="M480,217h-58.736C388.127,217,361,244.324,361,277.461v122C361,432.598,388.127,459,421.264,459H480V217z"/>
        </svg>
        ) : (
        <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
          <path d="M244.271,464.367c-43.73,7.81-124.007,9.094-147.98,0.1c-15.31-7.82-28.58-19.47-38.51-33.49
            c-17.25-24.51-24.07-54.76-25.69-84.29c-1.729-35.18,2.971-70.52,12.08-104.479c2.5-10.771,8.99-20.58,18.221-26.75
            c13.199-8.879,29.399-11.52,44.979-12.339c26.061-0.641,52.05,3.59,77.12,10.469c-15.26-17.9-22.28-41.2-25.479-64.129
            c-2.94-22.17-2.881-44.7-0.36-66.92c0.62-7.23,1.38-14.9,5.96-20.87c11.59-15.61,38.946-24.813,51.05-18.26
            s24.604,96.553,70.19,141.5c16.881,17.63,35.41,33.7,55.311,47.83c8.66,42.319,8.41,86.35,2.74,129.31
            c-2.92,19.21-4.95,38.35-14.38,55.46c-6.96,13.311-19.21,23.08-32.44,29.72C280.611,455.947,262.421,460.627,244.271,464.367z"/>
          <path d="M480,217h-58.736C388.127,217,361,244.324,361,277.461v122C361,432.598,388.127,459,421.264,459H480V217z"/>
        </svg>
        )}
        <div className={styles.reply_text}>
          Like
        </div>
        <div className={styles.num_likes}>{numLikes}</div>
        
      </button>
  );
};

export default LikeButton;
