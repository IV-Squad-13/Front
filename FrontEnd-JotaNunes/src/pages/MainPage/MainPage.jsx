import { Outlet } from 'react-router-dom';
import styles from './MainPage.module.css';
import SideBar from '@/components/sideBar/SideBar';
import Header from '@/components/header/Header';
import { useState } from 'react';

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.container}>
      <SideBar isOpen={isSidebarOpen} />
      <div
        className={`${styles.mainContainer} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}
      >
        <Header toggleSidebar={toggleSidebar} />
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
