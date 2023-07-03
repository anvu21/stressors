import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import profiles from './profiles';
import Navbar from './Navbar';
import axios from "axios";

const Main = () => {

  // user_posts like-icon change color when clicked
  const [likedPosts, setLikedPosts] = useState([]);
  const user_handleLikeClick = (index) => {
    const post = posts[index];
    const isLiked = likedPosts.includes(post.id);
    if (isLiked) {
      const updatedLikedPosts = likedPosts.filter((postId) => postId !== post.id);
      setLikedPosts(updatedLikedPosts);
    } else {
      const updatedLikedPosts = [...likedPosts, post.id];
      setLikedPosts(updatedLikedPosts);
    }
    console.log('Like button clicked');
  };
  // character_posts like-icon change color when clicked
  const [likeStates, setLikeStates] = useState(profiles.map(() => false));
  const handleLikeClick = (index) => {
    const updatedLikeStates = [...likeStates];
    updatedLikeStates[index] = !updatedLikeStates[index];
    setLikeStates(updatedLikeStates);
    console.log('Like button clicked');
  };
  const handleReplyClick = () => {
    console.log('Reply button clicked');
  };
  const handleShareClick = () => {
    console.log('Share button clicked');
  };

  let name =  'Annie' //placeholder
  //localStorage.getItem("name");
  let bio = 'bio ' // placeholder
  //localStorage.getItem("bio");

  const [data, setData] = useState({
		
		text: ""
    
  });
  const [error, setError] = useState("");

  const [posts, setPosts] = useState([]);

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
    console.log(data);
  };

  const handlePost = async (e) => {
    //console.log('Post button clicked');
    e.preventDefault();
    let groupid =localStorage.getItem("userID") // MAKE SURE WE CHANGE THIS LATER CAUSE THIS IS A TERRIBLE FIX
    try {
      {/**const response = await axios.post('http://localhost:5000/post', { text: data.text,group_id: groupid }, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      }); */}

      // sample data temporary
      const newPost = {
        id: Date.now(), 
        user_id: 1, 
        content: data.text,
        up_down: "0", 
        group_id: groupid,
        image_url: "", 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      setPosts([newPost, ...posts]);
      setData({ text: "" });      

      //alert(response.data.message);
    
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

      {/**const response = await axios.get('http://localhost:5000/posts', {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      }); */}
      
      const response = [ //placeholder sample data
        {
          id: 2,
          user_id: 1,
          content: "wer",
          up_down: "9",
          group_id: 5,
          image_url: "e",
          created_at: "2023-06-29T03:52:32.401Z",
          updated_at: "2023-06-29T03:52:32.401Z"
        },
        {
          id: 3,
          user_id: 1,
          content: "wer",
          up_down: "9",
          group_id: 5,
          image_url: "e",
          created_at: "2023-06-29T03:52:35.857Z",
          updated_at: "2023-06-29T03:52:35.857Z"
        },
        {
          id: 4,
          user_id: 1,
          content: "werrwe",
          up_down: "6",
          group_id: 5,
          image_url: "e",
          created_at: "2023-06-29T03:52:43.206Z",
          updated_at: "2023-06-29T03:52:43.206Z"
        },
      ]; 

      //const data = await response.json();
      //setPosts(data);
      setPosts(response);

    } catch (error) {
      console.error('Fetching posts failed:', error);
    }
  };


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
        
        <div className={styles.post_bar} onSubmit={handlePost}>
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
            
            <button type="submit" className={styles.send_pos} onClick={handlePost}>
              <svg className={styles.send} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
              </svg>
            </button>
          </div>  

          {/**high and low btn no funtion yet */}
          <button className={styles.hi_pos}>
            <svg className={styles.hi} enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path d="M18.221,7.206l9.585,9.585c0.879,0.879,0.879,2.317,0,3.195l-0.8,0.801c-0.877,0.878-2.316,0.878-3.194,0  l-7.315-7.315l-7.315,7.315c-0.878,0.878-2.317,0.878-3.194,0l-0.8-0.801c-0.879-0.878-0.879-2.316,0-3.195l9.587-9.585  c0.471-0.472,1.103-0.682,1.723-0.647C17.115,6.524,17.748,6.734,18.221,7.206z" fill="#515151"/>
            </svg>
          </button>
          <button className={styles.lo_pos}>
            <svg className={styles.lo} enable-background="new 0 0 32 32" height="32px" id="Layer_1" version="1.1" viewBox="0 0 32 32" width="32px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <path d="M14.77,23.795L5.185,14.21c-0.879-0.879-0.879-2.317,0-3.195l0.8-0.801c0.877-0.878,2.316-0.878,3.194,0  l7.315,7.315l7.316-7.315c0.878-0.878,2.317-0.878,3.194,0l0.8,0.801c0.879,0.878,0.879,2.316,0,3.195l-9.587,9.585  c-0.471,0.472-1.104,0.682-1.723,0.647C15.875,24.477,15.243,24.267,14.77,23.795z" fill="#515151"/>
            </svg>
          </button>
        </div>

        {/** user posts */}
        {posts.map((post, index) => (
          <div className={styles.post_box} key={post.id}>
            <div className={styles.post_top}>
                <button className={styles.char_btn}>
                  <img className={styles.char_pic} src={"avatar.png"} alt="Profile Picture"/>
                  <div className={styles.char_name}>{post.user_id}</div>
                </button>

                <div className={styles.caption}>
                  {post.content}
                </div>
              </div>

              <div className={styles.photo_pos}>
                <img className={styles.photo} src={post.image_url} alt="Photo"/>
              </div>

              {/** reply share and like btns no function yet */}
              <div className={styles.react_bar}>
                <button className={styles.reply_btn} onClick={() => handleReplyClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
                    <path d="M160.156,415.641l-160-159.125l160-160.875v96h128c123.688,0,224,100.313,224,224c0-53-43-96-96-96h-256V415.641z"/>
                  </svg>              
                  <div className={styles.reply_text}>
                    Reply
                  </div>
                </button>

                <button className={styles.reply_btn} onClick={() => handleShareClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318" enable-background="new 0 0 122.88 114.318">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
                  </svg>
                  <div className={styles.reply_text}>
                    Share
                  </div>
                </button>

                <button className={`${styles.reply_btn} ${likedPosts.includes(post.id) ? styles.liked : ''}`}
                onClick={() => user_handleLikeClick(index)}>
                  {likedPosts.includes(post.id) ? (
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
                  
                </button>
                
              </div>

              
              {/** Comment not yet */}
              <div className={styles.white_bot}>
                <div className={styles.comment_bar}>
                  <button className={styles.profile_icon_pos}>
                    <img className={styles.profile_icon} src="avatar.png" alt="Avatar"/>
                  </button>
                  <div className={styles.post_input_pos}>
                    <textarea className={styles.post_input} placeholder="Comment"></textarea>
                  </div>  
                
                  <button className={styles.send_pos} >
                    <svg className={styles.send} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                      <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
                    </svg>
                  </button>
                </div>
              </div>
          </div>
        ))}


        <div>
          {/** character posts */}
          {profiles.map((profile, index) => (
          
            <div className={styles.post_box}>
              <div className={styles.post_top}>
                <button className={styles.char_btn}>
                  <img className={styles.char_pic} src={profile.profile_pic} alt="Profile Picture"/>
                  <div className={styles.char_name}>{profile.name}</div>
                </button>

                <div className={styles.caption}>
                  {profile.posts[0].caption}
                </div>
              </div>

              <div className={styles.photo_pos}>
                <img className={styles.photo} src={profile.posts[0].photo} alt="Photo"/>
              </div>

              {/** reply share and like no function yet */}
              <div className={styles.react_bar}>
                <button className={styles.reply_btn} onClick={() => handleReplyClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" enable-background="new 0 0 512 512">
                    <path d="M160.156,415.641l-160-159.125l160-160.875v96h128c123.688,0,224,100.313,224,224c0-53-43-96-96-96h-256V415.641z"/>
                  </svg>              
                  <div className={styles.reply_text}>
                    Reply
                  </div>
                </button>

                <button className={styles.reply_btn} onClick={() => handleShareClick(index)}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318" enable-background="new 0 0 122.88 114.318">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
                  </svg>
                  <div className={styles.reply_text}>
                    Share
                  </div>
                </button>

                <button className={styles.reply_btn} onClick={() => handleLikeClick(index)}>
                  {likeStates[index] ? (
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
                  
                  {/** number of likes doesn't change yet*/}
                  <div className={styles.num_likes}>
                    {profile.posts[0].likes}
                  </div>
                </button>
              </div>

              <div className={styles.white_bot}>
                <div className={styles.comment_bar}>
                  <button className={styles.profile_icon_pos}>
                    <img className={styles.profile_icon} src="avatar.png" alt="Avatar"/>
                  </button>
                  {/** Comment not yet */}
                  <div className={styles.post_input_pos}>
                    <textarea className={styles.post_input} placeholder="Comment"></textarea>
                  </div>  
                
                  <button className={styles.send_pos} >
                    
                    <svg className={styles.send} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" >
                      <path d="M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> 

      </div>
    </div>
  );
}

export default Main;
