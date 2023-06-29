import styles from './styles.module.css';
import React from 'react';

const Navbar = () => {

  const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

  return (
    <nav className={styles.top_nav}>
      <button className={styles.logo_pos}>
        <img className={styles.logo} src="HiLo Logo.png" alt="Logo"/>
      </button> 
      <div className={styles.nav_items}>
        <a className={styles.nav_active} href="/home">Home</a>
        { 
        <button className={styles.white_btn} onClick={handleLogout}>
        Logout
      </button>
        /*
        <a className={styles.nav_item} href="/thing1">Thing 2</a>
        <a className={styles.nav_item} href="/thing1">Thing 3</a>
        */}
      </div>
    </nav>
  );
};

export default Navbar;