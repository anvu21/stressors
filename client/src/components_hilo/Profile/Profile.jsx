import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';


const Profile = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      {/**const response = await axios.get(`http://localhost:5000/users`, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      }); 

      setUser(data.response);
      console.log(data.response);
    */}
      
      // temporary
      const user = {
        id: 1,
        username: 'Test',
        password: 'test',
        profile_image: 'avatar.png',
        bio: 'bio wwwwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwwwwww wwwwwwwwwwwwwwww',
        group_id: 5,
        created_at: '2023-07-07T13:42:49.401Z',
        updated_at: '2023-07-07T13:42:49.401Z',
      };
      
      setUser(user);

    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }
    

  return (
    <div>
      <div className={styles.screen}>
        <Navbar /> 
        <div className={styles.container}>
          <div className={styles.bg_img}>
            
          </div>
          <div className={styles.profile}>
            <img className={styles.profile_image} src={user.profile_image} alt="Profile" />
            <h1 className={styles.username}>{user.username}</h1>
          </div>
          <button className={styles.edit}>Edit Profile</button>
          <h2 className="text-lg mt-5 ml-14">About Me</h2>
          <p className={styles.bio}>{user.bio}</p>
        </div>
      </div>
    </div>
  )
}

export default Profile;

