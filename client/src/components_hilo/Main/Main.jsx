import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import profiles from './profiles';
import Navbar from './Navbar';
import axios from "axios";

const LikeButton = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes || 0);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setLikes(isLiked ? likes - 1 : likes + 1);
    setIsLiked(!isLiked);
    console.log('Like button clicked');
  };

  return (
    <button
      className={styles.reply_btn}
      onClick={handleLikeClick}
    >
      {isLiked ? (
      <svg className={styles.like_click} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
        <path d="M244.271,464.367c-43.73,7.81-124.007,9.094-147.98,0.1c-15.31-7.82-28.58-19.47-38.51-33.49
          c-17.25-24.51-24.07-54.76-25.69-84.29c-1.729-35.18,2.971-70.52,12.08-104.479c2.5-10.771,8.99-20.58,18.221-26.75
          c13.199-8.879,29.399-11.52,44.979-12.339c26.061-0.641,52.05,3.59,77.12,10.469c-15.26-17.9-22.28-41.2-25.479-64.129
          c-2.94-22.17-2.881-44.7-0.36-66.92c0.62-7.23,1.38-14.9,5.96-20.87c11.59-15.61,38.946-24.813,51.05-18.26
          s24.604,96.553,70.19,141.5c16.881,17.63,35.41,33.7,55.311,47.83c8.66,42.319,8.41,86.35,2.74,129.31
          c-2.92,19.21-4.95,38.35-14.38,55.46c-6.96,13.311-19.21,23.08-32.44,29.72C280.611,455.947,262.421,460.627,244.271,464.367z"/>
        <path d="M480,217h-58.736C388.127,217,361,244.324,361,277.461v122C361,432.598,388.127,459,421.264,459H480V217z"/>
      </svg>
      ) : (
      <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
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
      <div className={styles.num_likes}>{likes}</div>
      
    </button>

  );
};

const Main = () => {
  const handleReplyClick = () => {
    console.log('Reply button clicked');
  };
  const handleShareClick = () => {
    console.log('Share button clicked');
  };
  // Placeholder 
  let name = localStorage.getItem("name");
  let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");
  
  const [error, setError] = useState("");
  const [data, setData] = useState({ text: "", up_down: "" });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log(data);
  };

  const [posts, setPosts] = useState([...profiles]);

  const handlePost = async (e) => {
    //console.log('Post button clicked');
    e.preventDefault();
    let groupid =localStorage.getItem("groupID") 
    console.log(data)
    try {
      const response = await axios.post('http://localhost:5000/post', { text: data.text,group_id: groupid,up_down: data.up_down }, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      setData({ text: "", up_down: "" }); 
      console.log(response)
      //alert(response.data.message);
      fetchPosts();
    } catch (error) {
      console.error(error);
      alert('Could not create post');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/posts/${groupId}`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
      const combinedPosts = [...profiles, ...response.data];
  
      const sortedPosts = combinedPosts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setPosts(sortedPosts);
      console.log(sortedPosts)

    } catch (error) {
      console.error('Fetching posts failed:', error);
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

  const [commentText, setCommentText] = useState({ text: ""});


  const handleCommentChange = ({ currentTarget: input }) => {
    setData({ ...commentText, [input.name]: input.value });
    console.log(commentText);
  };
  
  const [comments, setComments] = useState([]);

  const handleAddComment = async (e) => {
    //console.log('Post button clicked');
    e.preventDefault();
    let groupid =localStorage.getItem("groupID") 
    console.log(commentText)
    try {
      {/**const response = await axios.post('http://localhost:5000/post', { text: commentText,group_id: groupid,}, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   */}
      const newComment = {
        id: comments.length + 1,
        user_id: 1,
        post_id: postId,
        content: commentText,
        group_id: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        username: name,
      };

      setComments({ text: ""}); 
      //console.log(response)
      //alert(response.data.message);
      fetchComments();
      
    } catch (error) {
      console.error(error);
      alert('Could not create comment');
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      {/** 
      const response = await axios.get(`http://localhost:5000/comments/${groupId}`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      });
    */}
      
      const response = [
        {
          id: 9,
          user_id: 1,
          post_id: 1,
          content: "1 Brah moment different test",
          group_id: 1,
          created_at: "2023-07-10T13:36:51.779Z",
          updated_at: "2023-07-10T13:36:51.779Z",
          username: name
        },
        {
          id: 8,
          user_id: 1,
          post_id: 1,
          content: "1 Brah moment number 3",
          group_id: 1,
          created_at: "2023-07-10T13:36:37.885Z",
          updated_at: "2023-07-10T13:36:37.885Z",
          username: name
        },
        {
          id: 7,
          user_id: 1,
          post_id: 2,
          content: "2 Brah moment number 3",
          group_id: 1,
          created_at: "2023-07-10T13:36:34.671Z",
          updated_at: "2023-07-10T13:36:34.671Z",
          username: name
        },
        {
          id: 6,
          user_id: 1,
          post_id: 2,
          content: "2 Brah moment wwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwww wwwwwwwwwww wwwwwwwwwwwwwww wwwwwwwwwwwww wwwwwwwww wwwwwwwwwwwww",
          group_id: 1,
          created_at: "2023-07-10T13:34:41.081Z",
          updated_at: "2023-07-10T13:34:41.081Z",
          username: name
        },
      ]

      const sortedComments = response.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
      setComments(sortedComments);
      console.log(sortedComments);
    } catch (error) {
      console.error('Fetching commments failed:', error);
    }
  }
  

  {/**[
    {
        id: 4,
        user_id: 13,
        post_id: 37,
        comment_id: null,
        group_id: 2,
        created_at: "2023-07-11T03:17:04.771Z"
    }
] */}

  return (
    <div>
      <div className={styles.screen}> 
        <Navbar />   
        <div className={styles.user_box}>
          {/** profile not editable by user yet */}
          <div className="">
            <img className={styles.user_pic} src="avatar.png" alt="Profile Picture"/>
          </div>
          <div className="flex">
            <div className={styles.name}>
              {name}
            </div>
            <div className={styles.bio}>
              {bio}
            </div>
          </div>
        </div>
        
        <div className={styles.post_bar}>
          <button className={styles.profile_icon_pos}>
            <img className={styles.profile_icon} src="avatar.png" alt="Avatar"/>
          </button> 
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

        {posts.map((post, index) => (
          <div className={`${styles.post_box} ${post.up_down === "up" ? styles.hi_post : post.up_down === "down" ? styles.lo_post : ""}`} key={post.id}>
            <div className={styles.post_top}>
                <button className={styles.char_btn}>
                  <img className={styles.char_pic} src={"avatar.png"} alt="Profile Picture"/>
                  <div className={styles.char_name}>{post.username}</div>
                </button>

                <div className={styles.content}>
                  {post.content}
                </div>
              </div>

              <div className={styles.photo_pos}>
                <img className={styles.photo} src={post.image_url} alt="Photo"/>
              </div>

              {/** reply & share no function yet */}
              <div className={styles.react_bar}>                
                <LikeButton postId={post.user_id} initialLikes={post.likes}/>

                <button className={styles.reply_btn} onClick={() => handleShareClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318" enable-background="new 0 0 122.88 114.318">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
                  </svg>
                  <div className={styles.reply_text}>
                    Share
                  </div>
                </button>

                <button className={styles.reply_btn} onClick={() => handleReplyClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
                    <path d="M160.156,415.641l-160-159.125l160-160.875v96h128c123.688,0,224,100.313,224,224c0-53-43-96-96-96h-256V415.641z"/>
                  </svg>              
                  <div className={styles.reply_text}>
                    Reply
                  </div>
                </button>
                
              </div>

              {/** Comment not yet */}
              <div className={styles.posts_bot}>
                <div className={styles.comment_bar}>
                  <button className={styles.profile_icon_pos}>
                    <img className={styles.profile_icon} src="avatar.png" alt="Avatar"/>
                  </button>
                  <div className={styles.post_input_pos}>
                    <textarea 
                    type="text"
                    placeholder="Add a comment"
                    value={commentText}
                    onChange={handleCommentChange}
                    className={styles.post_input}
                    >
                    </textarea>
                  </div>  
                
                  <button className={styles.send_pos} onClick={handleAddComment}>
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
                        <button className={styles.profile_icon_pos}>
                          <img className={styles.profile_icon} src="avatar.png" alt="Avatar"/>
                        </button>
                      </div>
                      <div className={styles.comment_name}>{comment.username}</div>
                      <div key={comment.id} className={styles.comment_text}>{comment.content}</div>
                      
                    </div>
                  ))}
                  
                </div>
              </div>
          </div>
        ))}

        
          

      </div>
    </div>
  );
}

export default Main;
