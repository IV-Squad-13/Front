import style from './LoginPage.module.css';
import LoginForm from '@/components/forms/LoginForm/LoginForm';

const LoginPage = () => {
  return (
    <div className={style.container}>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
