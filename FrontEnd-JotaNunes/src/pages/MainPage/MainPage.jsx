import { Outlet } from 'react-router-dom';
import styles from './MainPage.module.css';
import SideBar from '@/components/sideBar/SideBar';
import Header from '@/components/header/Header';
import { useState, useEffect } from 'react';

const MainPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={styles.container}>
      <SideBar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div
        className={`${styles.mainContainer} ${!isSidebarOpen ? styles.sidebarClosed : ''}`}
      >
        <Header 
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={isSidebarOpen}
        />
        <Outlet />
      </div>
    </div>
  );
};

export default MainPage;
