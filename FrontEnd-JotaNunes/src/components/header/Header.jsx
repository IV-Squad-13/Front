import styles from './Header.module.css';

import ThemeButton from '../button/ThemeButton/ThemeButton';
import userImg from '@/assets/Placeholder_userImg.png';

import { useAuth } from '@/context/AuthContext';

const Header = ({ toggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div className={`${styles.container} ${isSidebarOpen ? styles.sidebarActive : ''}`}>
      <div className={styles.leftContent}>
        <button onClick={toggleSidebar} className={styles.toggleButton}>
          ☰
        </button>
        <div className={styles.userInfo}>
          <img src={userImg} alt="userImg" className={styles.userImg} />
          <p className={styles.username}>{user ? user.username : ''}</p>
        </div>
      </div>

      <div className={styles.buttons}>
        <div>
          <ThemeButton />
        </div>
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
