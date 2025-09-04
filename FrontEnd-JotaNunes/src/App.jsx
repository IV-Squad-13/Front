import { Routes, Route, Navigate } from 'react-router-dom';
// import RegisterPage from './pages/RegisterPage';
// import PasswordRecoveryPage from './pages/PasswordRecoveryPage';
// import ResetPasswordPage from './pages/ResetPasswordPage';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Especificacoes from './pages/Especificacoes';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/home" element={<MainPage />} />
        <Route path="/especificacoes" element={<Especificacoes/>}/>

        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="/password-recovery" element={<PasswordRecoveryPage />} /> */}
        {/* <Route path="/reset-password" element={<ResetPasswordPage />} /> */}
      </Routes>
    </div>
  );
};

export default App;
