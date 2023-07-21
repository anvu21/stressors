import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/navbar';
import { useParams } from 'react-router-dom';
import actors from '../posts/actors';


const Profile = () => {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // actor profiles
        const profiles = [...actors]
          
        const prof = profiles.find((profile) => profile.username === username);
        if (prof) {
          setProfile(prof);
          setPosts([prof]);
        }

        // user profile
        const response = await axios.get(`http://localhost:5000/profile/${username}`);
        const { profile, posts } = response.data;
        setProfile(profile);
        setPosts(posts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div></div>;
  }
  

  
  return (
    <div>
      <div className={styles.screen}>
        <Navbar /> 
        <div key={profile.id}>
          <div className={styles.container}>
            <div className={styles.bg_img}>
              
            </div>
            <div className={styles.profile}>
              {/** temporay prof img */}
              <img className={styles.profile_image} src={profile.prof_pic || "/avatar.png"} alt="Profile" />
              <h1 className={styles.username}>{profile.username}</h1>
            </div>
            {/**no edit function yet */}
            <button className={styles.edit}>Edit Profile</button>
            <h2 className="text-lg mt-5 ml-14">About Me</h2>
            <p className={styles.bio}>{profile.bio}</p>
          </div>
   


          {/** not done yet */}
          <div className='mt-5 flex flex-col items-center'>
          {posts.map((post, index) => (
            <div className={`${styles.post_box} ${post.up_down === "up" ? styles.hi_post : post.up_down === "down" ? styles.lo_post : ""}`} key={post.id}>
              <div className={styles.post_top}>
                <Link to={`/profile/${profile.username}`} className={styles.char_btn}>
                  <img className={styles.char_pic} src={post.prof_pic || "/avatar.png"} alt="Profile Picture"/>
                  <div className={styles.char_name}>{profile.username}</div>
                </Link>
                
                <div className={styles.dates}>
                  <div>{new Date(post.created_at).toLocaleDateString()}</div>
                </div>
                <div className={styles.content}>
                  {post.content}
                </div>
              </div>
    
              <div className={styles.photo_pos}>
                <img className={styles.photo} src={post.image_url} alt="No photo"/>
              </div>
                      
              <div className={styles.react_bar}>                

                <button className={styles.reply_btn} >
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 114.318">
                    <path d="M122.88,35.289L87.945,70.578v-17.58c-22.091-4.577-39.542,0.468-52.796,17.271 c2.301-34.558,25.907-51.235,52.795-52.339L87.945,0L122.88,35.289L122.88,35.289z"/><path d="M6.908,23.746h35.626c-4.587,3.96-8.71,8.563-12.264,13.815H13.815v62.943h80.603V85.831l13.814-13.579v35.159 c0,3.814-3.093,6.907-6.907,6.907H6.908c-3.815,0-6.908-3.093-6.908-6.907V30.653C0,26.838,3.093,23.746,6.908,23.746L6.908,23.746 z"/>
                  </svg>
                  <div className={styles.reply_text}>
                    Share
                  </div>
                </button>

                <button className={styles.reply_btn}>
                  <svg className={styles.reply_icon} version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M160.156,415.641l-160-159.125l160-160.875v96h128c123.688,0,224,100.313,224,224c0-53-43-96-96-96h-256V415.641z"/>
                  </svg>              
                  <div className={styles.reply_text}>
                    Reply
                  </div>
                </button>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;

