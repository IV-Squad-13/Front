import styles from './Header.module.css';

import ThemeButton from '../button/ThemeButton/ThemeButton';
import userImg from '@/assets/Placeholder_userImg.png';

import notificationGray from '@/assets/sinoNotCinza.png';
import notificationRed from '@/assets/sinoNotVermelho.png';

import { useAuth } from '@/context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();

  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <img src={userImg} alt="userImg" className={styles.userImg} />
        <p className={styles.username}>{user ? user.name : ''}</p>
      </div>

      <div className={styles.buttons}>
        <button className={styles.notificationButton}>
          <img
            src={notificationRed}
            className={`${styles.notificationImg} ${styles.iconHover}`}
          />
          <img
            src={notificationGray}
            className={`${styles.notificationImg} ${styles.iconDefault}`}
          />
        </button>
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
