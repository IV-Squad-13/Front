import styles from './LoginForm.module.css';
import Logo from '@/assets/LogoPreta2.png';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/home', {replace: true});
    }
  }, [user, navigate])

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      await login(email, password);
      navigate('/home');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.formContainer}>
      <img src={Logo} alt="Logo da empresa Jotanunes" className={styles.logo} />

      <h1 className={styles.title}>Login</h1>

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="email"
          id="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          defaultcolor="true"
        />
        <Input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          defaultcolor="true"
        />
        <p className={styles.error}>{error}</p>

        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
};

export default LoginForm;
