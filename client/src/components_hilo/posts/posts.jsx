import styles from './styles.module.css';
import React from 'react';
import LikeButton from './like';
import { Link } from 'react-router-dom';

const PostItem = ({ post, likes, handleShareClick, handleReplyClick, commentText, handleCommentChange, handleAddComment, comments }) => {
  const formatPostDate = (createdAt) => {
    const postDate = new Date(createdAt);
    const currentDate = new Date();

    const timeDiff = Math.abs(currentDate - postDate);
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

    if (hoursDiff < 24) {
      return `${hoursDiff} hours ago`;
    } else {
      return postDate.toLocaleDateString();
    }
  };
  return (
    <div>
        <div className={`${styles.post_box} ${post.up_down === "up" ? styles.hi_post : post.up_down === "down" ? styles.lo_post : ""}`} key={post.id}>
          <div className={styles.post_top}>
            <Link to={`/profile/${post.username}`} className={styles.char_btn}>
              {/** user profile pic placeholder "/avatar.png" */}
              <img className={styles.char_pic} src={post.prof_pic || "/avatar.png"} alt="Profile Picture"/>
              <div className={styles.char_name}>{post.username}</div>
            </Link>
            
            <div className={styles.dates}>
              <div>{formatPostDate(post.created_at)}</div>
            </div>
            <div className={styles.content}>
              {post.content}
            </div>
          </div>

          <div className={styles.photo_pos}>
            <img className={styles.photo} src={post.image_url} alt="No photo"/>
          </div>

          {/** reply & share no function yet */}
          <div className={styles.react_bar}>                
            <LikeButton like={likes.filter((like) => like.post_id === post.id)} />

            <button className={styles.reply_btn} onClick={() => handleShareClick(index)}>
              <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318">
                <path d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
              </svg>
              <div className={styles.reply_text}>
                Share
              </div>
            </button>

            <button className={styles.reply_btn} onClick={() => handleReplyClick(index)}>
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
              <Link to={`/profile/${post.username}`} className={styles.profile_icon_pos}>
                <img className={styles.profile_icon} src="/avatar.png" alt="Avatar"/>
              </Link>
              <div className={styles.comment_input_pos}>
                <textarea 
                type="text"
                placeholder="Add a comment"
                value={commentText.postId === post.id ? commentText.comment_text : ""}
                onChange={(event) => handleCommentChange(event, post.id)}
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
                <div className={styles.comment_each}>
                  <div className='h-full flex'>
                    <Link to={`/profile/${post.username}`} className={styles.profile_icon_pos}>
                      <img className={styles.profile_icon} src="/avatar.png" alt="Avatar"/>
                    </Link>
                  </div>
                  <div className={styles.comment_name}>{comment.username}</div>
                  <div key={comment.id} className={styles.comment_text}>{comment.content}</div>
                  
                </div>
              ))}
              
            </div>
          </div>
        </div>
     
    </div>
  );
}
export default PostItem;