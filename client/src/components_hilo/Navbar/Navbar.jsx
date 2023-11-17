import styles from './styles.module.css';
import React, { useState, useEffect }  from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";

const Navbar = ({  }) => {

  let username = localStorage.getItem("name");

  const [notifications, setNotifications] = useState([]);

  const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

  return (
    <nav className={styles.top_nav}>
      <div className={styles.nav_contain}>
        <a className={styles.logo_pos} href="/">
          <img className={styles.logo} src="/HiLo Logo.png" alt="Logo"/>
        </a> 

        <div className={styles.nav_items}>
          <a className={styles.nav_item} href="/">
            Home
          </a>
          <a className={styles.nav_item} href="/messages">
            Message
            {notifications > 0 && (
              <div className={styles.notify}>{notifications}</div>
            )}
          </a>
          <a></a>
          <a href={`/profile/${username}`} className={styles.nav_item} >
              Profile
          </a>
          <a className={styles.nav_item} href="/admin">
            Admin
          </a>
          {/*
          <a className={styles.nav_item} href="/thing1">Thing 2</a>
          <a className={styles.nav_item} href="/thing1">Thing 3</a>
          */}
          
        </div>
      
        <button className={styles.logout} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;