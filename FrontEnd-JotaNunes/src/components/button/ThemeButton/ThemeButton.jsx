import { useState } from 'react';
import styles from './ThemeButton.module.css';

import lampOn from '@/assets/lampadaAcesa.png';
import lampOff from '@/assets/lampadaApagada.png';

const ThemeButton = () => {
  const [isToggled, setIsToggled] = useState(true);

  const handleToggle = () => {
    setIsToggled(!isToggled);
  };

  const sliderClassName = `${styles.slider} ${isToggled ? styles.toggledOn : ''}`;

  return (
    <button className={styles.container} onClick={handleToggle}>
      <div className={sliderClassName}>
        <img
          src={isToggled ? lampOn : lampOff}
          alt={isToggled ? 'Lâmpada acesa' : 'Lâmpada apagada'}
        />
      </div>
    </button>
  );
};

export default ThemeButton;
