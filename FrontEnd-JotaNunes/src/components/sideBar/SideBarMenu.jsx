import styles from './SideBarMenu.module.css';

import dashboard from '@/assets/Dashboard.svg';
import lupa from '@/assets/lupa.svg';
import especificacoes from '@/assets/Especificacoes.svg';
import historico from '@/assets/Historico.svg';

const items = [
  { id: 1, icon: dashboard, text: 'DashBoard', alt: 'Dashboard' },
  { id: 2, icon: lupa, text: 'Consulta De Empresas', alt: 'Consulta de Empresas' },
  { id: 3, icon: especificacoes, text: 'Especificações', alt: 'Especificações' },
  { id: 4, icon: historico, text: 'Histórico', alt: 'Histórico' },
];

const SideBarMenu = () => {
  return (
    <div className={styles.navigation}>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <img src={item.icon} alt={item.alt} className={styles.navIcon} />
            <span>{item.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarMenu;
