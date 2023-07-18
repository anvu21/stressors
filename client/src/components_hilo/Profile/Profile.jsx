import styles from './styles.module.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../Navbar/Navbar';
import { useParams } from 'react-router-dom';

const Profile = () => {

  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      {/*const response = await axios.get(http://localhost:5000/profile/:username, {
        headers: {
          'auth-token': localStorage.getItem('token')
        }
      }); 
      setProfiles(data.response);
      console.log(data.response);
    */}

      
      // temporary
      let username = localStorage.getItem("name");  
      let bio = localStorage.getItem("bio");
      const profiles = [
        {
          id: 8,
          username: username,
          prof_pic: "/avatar.png",
          bio: bio,
          group_id: 5,
        },
        {
          id: 7,
          username: "Maya Thompson",
          prof_pic: "/mThompson/image9.png",
          bio: "Hello there! My name is Maya Thompson. I am a high school girl. Nature is my ultimate sanctuary, where I find peace and inspiration. Exploring scenic trails and breathing in the fresh air rejuvenates my soul. Food is another passion of mine, and I love trying new flavors and experiencing different cuisines. Traveling to new places fills me with excitement!",
        },
        {
          id: 6,
          username: "Josh Williams",
          prof_pic: "/jWilliams/image13.png",
          bio: "what up i’m josh, im a 17 y/o senior in hs.  i like baseball and hanging with the boys"      
        },
        {
          id: 5,
          username: "Katie Erickson",
          prof_pic: "/kErickson/image17.png",
          bio: "hi, I’m katie! i’m 17 and a senior in high school. i like playing field hockey, listening to music, and being with my friends and my boyfriend :) i have 2 sisters and a puppy named cowboy! thanks for visiting my profile ☺️",      
        },
        {
          id: 4,
          username: "Emily Turner",
          prof_pic: "/eTurner/image4.png",
          bio: "🌸 17 | Bookworm | Florida | Sharing my quiet adventures | Coco's human 🐇",      
        },  
        {
          id: 3,
          username: "Mollie Abrams",
          prof_pic: "/mAbrams/image3.png",
          bio: "Hi everyone, my name is Molly!  I’m 16 years old and love painting and playing with my dog, Buster.  I work at the local supermarket as a cashier and have a little brother.  I hope you like my profile!",      
        },  
        {
          id: 2,
          username: "Michael Lawrence",
          prof_pic: "/mLawrence/image1.png",
          bio: "16 year old high school sophomore. For the homies, family, baseball, and food in that order. ",      
        },
        {
          id: 1,
          username: "Ryan Donnegan",
          prof_pic: "/rDonnegan/image15.jpg",
          bio: "i’m ryan, and i’m 15 years old. i have big dreams of being on broadway. NYC forever ❤️ singing, dancing, and acting "      
        },
      ]
      setProfiles(profiles);
      console.log(profiles);

    } catch (error) {
      console.error('Error fetching profiles:', error);
    }
  };

  if (!profiles) {
    return <div>Loading...</div>;
  }
  
  const { username } = useParams();
  const matchedProfile = profiles.filter(item => item.username === username);

  return (
    <div>
      <div className={styles.screen}>
        <Navbar /> 
        {matchedProfile.map(profile => (
        <div key={profile.id}>
          <div className={styles.container}>
            <div className={styles.bg_img}>
              
            </div>
            <div className={styles.profile}>
              <img className={styles.profile_image} src={profile.prof_pic} alt="Profile" />
              <h1 className={styles.username}>{profile.username}</h1>
            </div>
            {/**no edit function yet */}
            <button className={styles.edit}>Edit Profile</button>
            <h2 className="text-lg mt-5 ml-14">About Me</h2>
            <p className={styles.bio}>{profile.bio}</p>
          </div>
        </div>
        ))}
      </div>
    </div>
  )
}

export default Profile;

