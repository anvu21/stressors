import styles from './styles.module.css';
import React from 'react';

const Navbar = () => {

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
          <a className={styles.nav_item} href="/">Home</a>
          <a className={styles.nav_item} href="/messages">Message</a>

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