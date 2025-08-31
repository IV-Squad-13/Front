import styles from './Sidebar.module.css';
import logo from '@/assets/LogoBranca.svg';
import SideBarMenu from './SideBarMenu';

const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <img src={logo} alt="Logo JotaNunes" className={styles.logoImage} />

      <h1 className={styles.title}>DashBoard</h1>

      <SideBarMenu />
    </div>
  );
};

export default SideBar;
