import styles from './ResetPasswordForm.module.css';
import cadeado from '@/assets/cadeado.svg';
import Button from '@/components/button/Button';
import Input from '@/components/input/Input';

const ResetPasswordForm = () => {
  return (
    <div className={styles.formContainer}>
      <img
        src={cadeado}
        alt="Imagem de recuperação de senha"
        className={styles.image}
      />

      <form className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="password" className={styles.label}>
            Nova senha
          </label>
          <Input type="password" id="password" placeholder="Senha" />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirma Nova Senha
          </label>
          <Input type="password" id="confirmPassword" placeholder="Senha" />
        </div>

        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
