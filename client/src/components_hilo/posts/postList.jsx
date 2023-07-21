import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import LikeButton from './like';
import actors from '../posts/actors';

const PostList = ({ groupId, userId }) => {

  const [posts, setPosts] = useState([...actors]);

  useEffect(() => {
    fetchPosts();
    fetchComments();
  }, [groupId]);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/images/posts/${groupId}`, {
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
      console.log(sortedPosts)

    } catch (error) {
      console.error('Fetching posts failed:', error);
    }
  };

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({});

  const fetchComments = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/comments/${groupId}`, {
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
      const response = await axios.post('http://localhost:5000/comment', { comment_text, group_id: groupid, postId: post__id }, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      
      setCommentText((prevCommentText) => ({
        ...prevCommentText,
        [post__id]: "",
      }));
      window.location.reload();
      console.log(response)
      //alert(response.data.message);
      fetchComments();
      
    } catch (error) {
      console.error(error);
      alert('Could not create comment');
    }
  };

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

  const [visiblePosts, setVisiblePosts] = useState(10); // Number of initially visible posts
  const postsPerPage = 10;
  const handleLoadMore = () => {
    setVisiblePosts(prevVisiblePosts => prevVisiblePosts + postsPerPage);
    console.log('+10 posts');
  };

    
  //sample like data
  const [likes, setLikes] = useState([
    {
      id: 4,
      user_id: 13,
      post_id: 115,
      comment_id: null,
      group_id: 1,
      created_at: "2023-07-11T03:17:04.771Z",
    },
  ]);

  const handleReplyClick = () => {
    console.log('Reply button clicked');
  };
  const handleShareClick = () => {
    console.log('Share button clicked');
  };

  return (
    <div className='flex flex-col items-center'>
      {posts.slice(0, visiblePosts).map((post, index) => (
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
            <img className={styles.photo} src={post.imageUrl || post.image_url} alt="No photo"/>
          </div>

          {/** reply & share no function yet */}
          <div className={styles.react_bar}>                
            <LikeButton postId={post.id} userId={userId} group_id={post.group_id} />

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
      ))}
      <button className={styles.load} onClick={handleLoadMore}>Load More</button>
    </div>
  );
}
export default PostList;