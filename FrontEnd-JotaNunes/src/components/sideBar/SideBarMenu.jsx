import styles from './SideBarMenu.module.css';
import { Link } from 'react-router-dom';

import dashboard from '@/assets/Dashboard.svg';
import lupa from '@/assets/lupa.svg';
import especificacoes from '@/assets/Especificacoes.svg';
import historico from '@/assets/Historico.svg';

const items = [
  {
    id: 1,
    icon: dashboard,
    text: 'DashBoard',
    alt: 'Dashboard',
    path: '/home',
  },
  {
    id: 2,
    icon: lupa,
    text: 'Consulta De Empresas',
    alt: 'Consulta de Empresas',
    path: '/consulta-de-empresas',
  },
  {
    id: 3,
    icon: especificacoes,
    text: 'Especificações',
    alt: 'Especificações',
    path: '/especificacoes',
  },
  {
    id: 4,
    icon: historico,
    text: 'Histórico',
    alt: 'Histórico',
    path: '/historico',
  },
];

const SideBarMenu = () => {
  return (
    <div className={styles.navigation}>
      <ul>
        {items.map((item) => (
          <li key={item.id} className={styles.navItem}>
            <Link to={item.path} className={styles.navLink}>
              <img src={item.icon} alt={item.alt} className={styles.navIcon} />
              <span>{item.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SideBarMenu;
