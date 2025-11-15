import { Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import LoginPage from './pages/LoginPage/LoginPage';
import Catalogo from './pages/Catalogo/Catalogo';
import GerenciadorDeUsuarios from './pages/GerenciadorDeUsuarios/GerenciadorDeUsuarios';
import Historico from './pages/Historico/Historico';
import Especificacoes from './pages/Especificacoes/Especificacoes';
import Dashboard from './pages/Dashboard/Dashboard';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import ConsultaEmpreendimentos from './pages/ConsultaEmpreendimentos/ConsultaEmpreendimentos';
import Empreendimento from './pages/Empreendimento/Empreendimento';

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
          <Route path="consulta-empreendimentos" element={<ConsultaEmpreendimentos />} />
          <Route path="empreendimento/:id" element={<Empreendimento />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
