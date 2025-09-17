import styles from './ThemeButton.module.css';
import { useTheme } from '@/context/ThemeContext';

import lampOn from '@/assets/lampadaAcesa.png';
import lampOff from '@/assets/lampadaApagada.png';

const ThemeButton = () => {
  const { theme, toggleTheme } = useTheme();
  
  const isLightMode = theme === 'light';

  const handleToggle = () => {
    toggleTheme();
  }

  const sliderClassName = `${styles.slider} ${isLightMode ? styles.toggledOn : ''}`;

  return (
    <button className={styles.container} onClick={handleToggle}>
      <div className={sliderClassName}>
        <img
          src={isLightMode ? lampOn : lampOff}
          alt={isLightMode ? 'Lâmpada acesa' : 'Lâmpada apagada'}
        />
      </div>
    </button>
  );
};

export default ThemeButton;
