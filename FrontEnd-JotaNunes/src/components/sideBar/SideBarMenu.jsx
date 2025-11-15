import styles from './SideBarMenu.module.css';
import { Link } from 'react-router-dom';

import dashboard from '@/assets/Dashboard.svg';
import lupa from '@/assets/lupa.svg';
import especificacoes from '@/assets/Especificacoes.svg';
import historico from '@/assets/Historico.svg';
import users from '@/assets/User.svg';

import { useAuth } from '@/context/AuthContext';

const items = [
  {
    id: 1,
    icon: dashboard,
    text: 'DashBoard',
    alt: 'Dashboard',
    path: '/home/dashboard',
  },
  {
    id: 2,
    icon: lupa,
    text: 'Catálogo',
    alt: 'Catálogo',
    path: '/home/catalogo',
  },
  {
    id: 3,
    icon: especificacoes,
    text: 'Especificações',
    alt: 'Especificações',
    path: '/home/especificacoes',
  },
  {
    id: 4,
    icon: historico,
    text: 'Histórico',
    alt: 'Histórico',
    path: '/home/historico',
  },

  {
    id: 5,
    icon: users,
    text: 'Usuários',
    alt: 'usuários',
    path: '/home/usuarios',
    adminOnly: true,
  },
  {
    id: 6,
    icon: especificacoes,
    text: 'Empreendimentos (Nova Especificações)',
    alt: 'Empreendimento',
    path: '/home/consulta-empreendimentos',
    adminOnly: true,
  }
];

const SideBarMenu = ({ onTitleChange }) => {
  const { user } = useAuth();

  const handleItemClick = (title) => {
    onTitleChange(title);
  };

  return (
    <div className={styles.navigation}>
      <ul>
        {items
          .filter(
            (item) =>
              !item.adminOnly || (user && user.papel?.nome === 'ADMIN'),
          )
          .map((item) => (
            <li
              key={item.id}
              className={styles.navItem}
              onClick={() => handleItemClick(item.text)}
            >
              <Link to={item.path} className={styles.navLink}>
                <img
                  src={item.icon}
                  alt={item.alt}
                  className={styles.navIcon}
                />
                <span>{item.text}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default SideBarMenu;