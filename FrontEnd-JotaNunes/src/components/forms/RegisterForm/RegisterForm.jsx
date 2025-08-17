import styles from './RegisterForm.module.css';
import Logo from '@/assets/LogoPreta2.png';
import { Link } from 'react-router-dom';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';

const RegisterForm = () => {
  return (
    <div className={styles.formContainer}>
      <img src={Logo} alt="Logo da empresa Jotanunes" className={styles.logo} />

      <h1 className={styles.title}>Cadastro de Usuário</h1>

      <form className={styles.form}>
        <Input type="text" id="fullName" placeholder="Full Name" />
        <Input type="email" id="email" placeholder="E-mail" />
        <Input type="password" id="password" placeholder="Password" />
        <Input
          type="password"
          id="confirmPassword"
          placeholder="Confirm Password"
        />
        <Button type="submit">Entrar</Button>
      </form>

      <p>
        Você ja tem uma conta?{'  '}
        <Link className={styles.loginLink} to="/login">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
