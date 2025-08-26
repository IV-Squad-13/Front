import style from './PasswordRecoveryPage.module.css';
import PasswordRecoveryForm from '@/components/forms/PasswordRecoveryForm/PasswordRecoveryForm'

const PasswordRecoveryPage = () => {
  return (
    <div className={style.container}>
      <PasswordRecoveryForm />
    </div>
  );
};

export default PasswordRecoveryPage;
