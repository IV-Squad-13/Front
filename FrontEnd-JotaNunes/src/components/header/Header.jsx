import styles from './Header.module.css';

import ThemeButton from '../button/ThemeButton/ThemeButton';
import userImg from '@/assets/Placeholder_userImg.png';

import notificationGray from '@/assets/sinoNotCinza.png';
import notificationRed from '@/assets/sinoNotVermelho.png';

const Header = () => {
  return (
    <div className={styles.container}>
      <div className={styles.userInfo}>
        <img src={userImg} alt="userImg" className={styles.userImg} />
        <p className={styles.username}>Nome do usuário</p>
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
        <button className={styles.logoutButton}>Logout</button>
      </div>
    </div>
  );
};

export default Header;
