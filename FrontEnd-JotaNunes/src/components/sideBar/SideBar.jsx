import styles from './SideBar.module.css';
import logo from '@/assets/LogoBranca.svg';
import SideBarMenu from './SideBarMenu';
import { useState } from 'react';

const SideBar = ({ isOpen }) => {
  const [title, setTitle] = useState('Olá!');

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
  };

  const sidebarClasses = `${styles.sidebar} ${!isOpen ? styles.closed : ''}`;

  return (
    <div className={sidebarClasses}>
      <img src={logo} alt="Logo JotaNunes" className={styles.logoImage} />

      <h1 className={styles.title}>{title}</h1>

      <SideBarMenu onTitleChange={handleTitleChange} />
    </div>
  );
};

export default SideBar;
