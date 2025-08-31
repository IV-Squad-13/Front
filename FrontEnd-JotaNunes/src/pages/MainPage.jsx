import styles from './MainPage.module.css';
import SideBar from '@/components/sideBar/SideBar';

const MainPage = () => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div>
        <div>header</div>
        <div>main content</div>
      </div>
    </div>
  );
};

export default MainPage;
