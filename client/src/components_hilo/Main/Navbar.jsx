import styles from './styles.module.css';
import React from 'react';

const Navbar = () => {
  return (
    <nav className={styles.top_nav}>
      <button className={styles.logo_pos}>
        <img className={styles.logo} src="HiLo Logo.png" alt="Logo"/>
      </button> 

      <div className={styles.nav_items}>
        <a className={styles.nav_active} href="/home">Home</a>
        { /*
        <a className={styles.nav_item} href="/thing1">Thing 1</a>
        <a className={styles.nav_item} href="/thing1">Thing 2</a>
        <a className={styles.nav_item} href="/thing1">Thing 3</a>
        */}
        
      </div>
     
      <button className={styles.logout}>Logout</button>
     
    </nav>
  );
};

export default Navbar;