import styles from './LoginForm.module.css';
import Logo from '@/assets/LogoPreta2.png';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';
import { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/mock/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Falha no login');
      }
      console.log('Login bem-sucedido:', data.user);
      navigate("/home")
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
        />
        <Input
          type="password"
          id="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className={styles.error}>{error}</p>
        
        <Button type="submit">Entrar</Button>
      </form>
    </div>
  );
};

export default LoginForm;
