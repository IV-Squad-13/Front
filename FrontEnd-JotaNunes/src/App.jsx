import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Catalogo from './pages/Catalogo';
import GerenciadorDeUsuarios from './pages/GerenciadorDeUsuarios';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/home" element={<MainPage />}>
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="usuarios" element={<GerenciadorDeUsuarios />} />

        </Route>
      </Routes>
    </div>
  );
};

export default App;
