import { Outlet } from 'react-router-dom';
import styles from './MainPage.module.css';
import SideBar from '@/components/sideBar/SideBar';
import Header from '@/components/header/Header';

const MainPage = () => {
  return (
    <div className={styles.container}>
      <SideBar />
      <div className={styles.mainContainer}>
        <Header />
        <Outlet /> 
      </div>
    </div>
  );
};

export default MainPage;