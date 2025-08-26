import { Routes, Route} from 'react-router-dom';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import PasswordRecoveryPage from './pages/PasswordRecoveryPage';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/register' element={<RegisterPage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/password-recovery' element={<PasswordRecoveryPage/>}/>
      </Routes>
    </div>
  );
};

export default App;
