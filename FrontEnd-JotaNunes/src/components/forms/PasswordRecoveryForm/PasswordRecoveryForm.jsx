import styles from './PasswordRecoveryForm.module.css';
import recuperacaoDeSenha from '@/assets/recuperacao-de-conta-img.svg';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';

const PasswordRecoveryForm = () => {
  return (
    <div className={styles.formContainer}>
      <img
        src={recuperacaoDeSenha}
        alt="Imagem de recuperação de senha"
        className={styles.image}
      />

      <h1 className={styles.title}>
        Esqueceu a sua <span className={styles.section}>senha</span>?
        <p className={styles.description}>
          Por favor informe o <span className={styles.section}>E-mail</span>{' '}
          associado a sua conta que enviaremos um link para o mesmo. Com as
          instruções para restrauração da sua senha
        </p>
      </h1>

      <form className={styles.form}>
        <Input type="email" id="email" placeholder="E-mail" />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
};

export default PasswordRecoveryForm;
