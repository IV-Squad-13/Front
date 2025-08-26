import { Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/password-recovery' element={<PasswordRecoveryPage/>}/>
        <Route path='/reset-password' element={<ResetPasswordPage/>}/>

      </Routes>
    </div>
  );
};

export default App;
