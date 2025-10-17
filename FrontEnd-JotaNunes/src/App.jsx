import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Catalogo from './pages/Catalogo';
import GerenciadorDeUsuarios from './pages/GerenciadorDeUsuarios';
import Historico from './pages/Historico';
import Especificacoes from './pages/Especificacoes';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <MainPage />
            </ProtectedRoute>
          }
        >
          <Route path="catalogo" element={<Catalogo />} />
          <Route path="usuarios" element={<GerenciadorDeUsuarios />} />
          <Route path="historico" element={<Historico />} />
          <Route path="especificacoes" element={<Especificacoes />} />
          <Route path="dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
