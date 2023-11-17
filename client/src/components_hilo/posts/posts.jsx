import styles from './styles.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import LikeButton from './like';
import LoadingAnimation from './loadingBar';
//import actors from './actors';

//import CommentList from './comments/commentList';
//import CommentBar from './comments/commentBar';

const Posts = ({ profile, username, userId, groupId, posts, loading, commentText, handleCommentChange, handleAddComment, comments, allGroupLikes, }) => {  

  const [focusedPostId, setFocusedPostId] = useState(null); // State variable to track the ID of the post with the focused comment input bar
  
  /** reply btn puts user into comment input bar */
  const handleReplyClick = (postId) => {
    setFocusedPostId(prevFocusedPostId => (prevFocusedPostId === postId ? null : postId));
    console.log('Reply button clicked');
  };
  useEffect(() => {
    if (focusedPostId !== null && commentInputRefs[focusedPostId]) {
      commentInputRefs[focusedPostId].focus();
    }
  }, [focusedPostId]);

  const commentInputRefs = {}; // Object to hold refs for all comment input bars

  // Function to set the ref for a specific post ID
  const setCommentInputRef = (postId, ref) => {
    commentInputRefs[postId] = ref;
  };

  // share not done yet
  const handleShareClick = () => {
    window.location.href = '/messages'; // Redirects to the login page
    console.log('Share button clicked');
  };

  const formatPostDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();
    //const postLikes = allGroupLikes.filter(like => like.post_id === post.id);
    const timeDiff = Math.abs(currentDate - postDate);
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    if (minutesDiff < 60) {
      return `${minutesDiff} minutes ago`;
    } 
    else if (hoursDiff < 24) {
      return `${hoursDiff} hours ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };

  const [visiblePosts, setVisiblePosts] = useState(10); // Number of initially visible posts
  const postsPerPage = 10;
  const handleLoadMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + postsPerPage);
    console.log('+10 posts');
  };

  return (
    <div className='flex flex-col items-center'>
      {loading ? (
        <div> 
          <LoadingAnimation />
        </div>
      ) : (
      posts.slice(0, visiblePosts).map((post, index) => (
        <div key={post.id} className={`${styles.post_box} ${post.up_down === "up" ? styles.hi_post : post.up_down === "down" ? styles.lo_post : ""}`}>
          <div className={styles.post_top}>
            <Link to={`/profile/${post.username || username}`} className={styles.char_btn}>
              <img className={styles.char_pic} src={post.prof_pic || post.profile_pic_url} alt="Profile Picture"/>
              <div className={styles.char_name}>{post.username || username}</div>
            </Link>
            
            <div className={styles.dates}>
              <div>{formatPostDate(post.created_at)}</div>
            </div>
            <div className={styles.content}>
              {post.content}
            </div>
          </div>

          <div className={styles.photo_pos}>  {/** */}
            <img className={styles.photo} src={post.imageUrl||post.image_url||`/uploads`} alt="No photo"/>
          </div>
          

          {/** reply & share no function yet */}
          <div className={styles.react_bar}>                
          <LikeButton 
          //like={allGroupLikes.filter(like => like.post_id === post.id)}
            post={post}
            postId={post.id} // Assuming `post.id` is your `postId`
            userId={userId}
            groupId={localStorage.getItem("groupID")}
          />

            <button className={styles.reply_btn} onClick={() => handleShareClick(index,post.id,groupId)}>
              <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318">
                <path d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
              </svg>
              <div className={styles.reply_text}>
                Share
              </div>
            </button>

            <button className={styles.reply_btn} onClick={() => handleReplyClick(post.id)}>
              <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                <path d="M160.156,415.641l-160-159.125l160-160.875v96h128c123.688,0,224,100.313,224,224c0-53-43-96-96-96h-256V415.641z"/>
              </svg>              
              <div className={styles.reply_text}>
                Reply
              </div>
            </button>
          </div>

          
          <div className={styles.posts_bot}>
            <div className={styles.comment_bar}>
              <Link to={`/profile/${username}`} className={styles.profile_icon_pos}>
                {profile && profile.profile_pic_url !== null && (
                  <img className={styles.profile_icon} src={profile.profile_pic_url} alt="Avatar"/>
                )}
              </Link>
              <div className={styles.comment_input_pos}>
                <textarea 
                type="text"
                placeholder="Add a comment"
                value={commentText.postId === post.id ? commentText.comment_text : ""}
                onChange={(event) => handleCommentChange(event, post.id)}
                ref={(ref) => setCommentInputRef(post.id, ref)} // Set the ref for the comment input bar of the specific post
                className={styles.comment_input}
                >
                </textarea>
              </div>  
            
              <button className={styles.send_pos} onClick={(e) => handleAddComment(e, post.id)}>
                <svg className={styles.send} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                  <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
                </svg>
              </button>
            </div>

            <div className={styles.comment_box}>
              {comments
              .filter((comment) => comment.post_id === post.id)
              .map((comment) => (
                <div key={comment.id} className={styles.comment_each}>
                  <div className='h-full flex'>
                    <Link to={`/profile/${comment.username || username}`}>
                      <img className={styles.comment_pic} src={comment.profile_pic_url} alt="Profile Picture"/>
                    </Link>
                  </div>
                  <div className={styles.comment_name}>{comment.username}</div>
                  <div key={comment.id} className={styles.comment_text}>{comment.content}</div>
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      ))
      )}
      <div className='w-full flex justify-center'>      
        <button className={styles.load} onClick={handleLoadMore}>Load More</button>
      </div>
    </div>
  );
}
export default Posts;