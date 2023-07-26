import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import Navbar from '../Navbar/Navbar';
import { useParams } from 'react-router-dom';
import actors from '../posts/actors';
import Posts from '../posts/posts';

const Profile = () => {
  
  let bio = localStorage.getItem("bio");
  let groupId = localStorage.getItem("groupID");
  let userId = localStorage.getItem("userID");

  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); 

  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({});
  
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
      const response = await axios.post('http://localhost:5000/comment', { comment_text, group_id: groupid, postId: post__id}, {
        headers: {
          'auth-token': localStorage.getItem('token') 
        }
      });   
      
      setCommentText((prevCommentText) => ({
        ...prevCommentText,
        [post__id]: "",
      }));
      
      setCommentText("");

      console.log(response)
      //alert(response.data.message);
      fetchComments();
      
    } catch (error) {
      console.error(error);
      alert('Could not create comment');
    }
  };

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
  useEffect(() => {
    fetchProfile();
    fetchComments();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
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

      const sortedPosts = posts.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });
      setPosts(sortedPosts);
      setLoading(false);
      
      console.log(profile);
      console.log(posts);
    } catch (error) {
      console.error(error);
    }
  };


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
   


          {/** 
           * post in main 
              content: "test"
              created_at: "2023-07-25T22:15:57.811Z"
              group_id: 1
              id: 37
              imageUrl: "https://mountaintopanniepoon.s3.us-east-1.amazonaws.com/f946f593b2e378994883f206641e10da.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAW5BUIUZYUYV7G44L%2F20230725%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20230725T221740Z&X-Amz-Expires=3600&X-Amz-Signature=f08b0ce96bf3702acada95c30dab56ef83c94e1db34369804b0c47e66c474d54&X-Amz-SignedHeaders=host&x-id=GetObject"
              image_url: "f946f593b2e378994883f206641e10da.jpeg"
              up_down: "down"
              updated_at: "2023-07-25T22:15:57.811Z"
              user_id: 1
              username: "test1"

           * post in profile
              content: "again"
              created_at: "2023-07-25T22:15:57.811Z"
              group_id: 1
              id: 37
              image_url: "f946f593b2e378994883f206641e10da.jpeg"
              up_down: "down"
              updated_at: "2023-07-25T22:15:57.811Z"
              user_id: 1

           * post.imageUrl=https://mountaintopanniepoon.s3.us-east-1.amazonaws.com{.jpeg} not included in posts databse
           * post.image_url=(image).jpeg
          */}
          <div className='mt-5 flex flex-col items-center'>
          <Posts            
            posts={posts}
            userId={profile.id}
            groupId={profile.groupId}
            loading={loading}
            commentText={commentText}
            handleCommentChange={handleCommentChange}
            handleAddComment={handleAddComment}
            comments={comments}            
            //allGroupLikes={allGroupLikes}
          />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile;

