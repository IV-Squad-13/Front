import { useState, useEffect } from 'react';
import styles from './EditModal.module.css';
import Input from '@/components/input/Input';
import { updateUser } from '@/services/UserService';

const EditModal = ({ user, onSave, onClose }) => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name,
        email: user.email,
        password: '',
        role: user.role,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoleChange = (newRole) => {
    setUserData({
      ...userData,
      role: newRole,
    });
  };

  const handleSubmit = async () => {
    const newData = {};

    if (userData.name != user.name) {
      newData.name = userData.name;
    }

    if (userData.email != user.email) {
      newData.email = userData.email;
    }

    if (userData.role != user.role) {
      newData.role = userData.role;
    }

    if (userData.password && userData.password.trim() !== '') {
      newData.password = userData.password;
    }

    if (Object.keys(newData).length === 0) {
      onClose();
      return;
    }

    try {
      const updatedUser = await updateUser(user.id, newData);
      onSave(updatedUser);
      onClose();
    } catch (error) {
      console.error('Erro ao editar usuário: ', error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.mainForm}>
        <h2 className={styles.title}>Editar usuário</h2>
        <div className={styles.inputArea}>
          <Input
            type="text"
            name="name"
            id="name"
            value={userData.name}
            onChange={handleChange}
          />
          <Input
            type="email"
            name="email"
            id="email"
            value={userData.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            id="password"
            placeholder="Nova senha"
            value={userData.password}
            onChange={handleChange}
          />
        </div>
        <div className={styles.roleArea}>
          <p className={styles.roleArea_title}>Cargos</p>
          <div className={styles.roles}>
            <p
              onClick={() => handleRoleChange('ADMIN')}
              className={`${styles.roleItem} ${
                styles.ADMIN
              } ${userData.role === 'ADMIN' ? styles.active : ''}`}
            >
              Admin
            </p>
            <p
              onClick={() => handleRoleChange('RELATOR')}
              className={`${styles.roleItem} ${styles.RELATOR} ${userData.role === 'RELATOR' ? styles.active : ''}`}
            >
              Relator
            </p>
            <p
              onClick={() => handleRoleChange('REVISOR')}
              className={`${styles.roleItem} ${styles.REVISOR} ${userData.role === 'REVISOR' ? styles.active : ''}`}
            >
              Revisor
            </p>
          </div>
        </div>

        <div className={styles.buttonsArea}>
          <button className={styles.deleteButton}>Excluir usuário</button>
          <div className={styles.bottonButtons}>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button className={styles.saveButton} onClick={handleSubmit}>
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
