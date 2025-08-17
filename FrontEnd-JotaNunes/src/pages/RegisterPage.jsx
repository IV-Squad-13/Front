import styles from './RegisterPage.module.css';
import RegisterForm from '@/components/forms/RegisterForm/RegisterForm';

const RegisterPage = () => {
  return (
    <div className={styles.container}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
