import styles from './LoginForm.module.css';
import Logo from '@/assets/LogoPreta2.png';
import { Link } from 'react-router-dom';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import { loginUser } from '@/api/calls';

const LoginForm = () => {
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    try {
      await loginUser(email, password)
        .then(() => alert("Login successful"))
        .catch(err => alert(err.message || "Login failed"));
    } catch (err) {
      alert("Login failed");
    }
  };
  
  return (
    <div className={styles.formContainer}>
      <img src={Logo} alt="Logo da empresa Jotanunes" className={styles.logo} />

      <h1 className={styles.title}>Login</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="email" id="email" placeholder="E-mail" />
        <Input type="password" id="password" placeholder="Password" />
        <Button type="submit">Entrar</Button>
      </form>

      <p>
        <Link className={styles.passwordRecovery} to="/password-recovery">
          Esqueceu a senha?
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;
