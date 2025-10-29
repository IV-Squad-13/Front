import { useState, useEffect } from 'react';
import styles from './GerenciadorDeUsuarios.module.css';
import { getAllUsers } from '@/services/UserService';
import filtro from '@/assets/filtro.svg';
import pontos from '@/assets/pontos.svg';
import lupa from '@/assets/lupa.svg';
import EditModal from '@/components/forms/EditModal/EditModal';
import CreateModal from '@/components/forms/CreateModal/CreateModal';

const itemsPerPage = 8;

const GerenciadorDeUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState(null);
  const [usuariosPaginados, setUsuariosPaginados] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const data = await getAllUsers();
        setUsuarios(data);
        setTotalPages(Math.ceil(data.length / itemsPerPage));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = usuarios.slice(startIndex, endIndex);
    setUsuariosPaginados(paginatedData);
  }, [currentPage, usuarios]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((currentPage) => currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((currentPage) => currentPage - 1);
    }
  };

  const handleEdit = (usuario) => {
    setUsuarioSelecionado(usuario);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  }

  const handleSave = (usuarioAtualizado) => {
    setUsuarios(
      usuarios.map((u) =>
        u.id === usuarioAtualizado.id ? usuarioAtualizado : u,
      ),
    );
    setIsModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerContainer}>
        <div className={styles.titleArea}>
          <h1 className={styles.title}>Gerenciador de usuários</h1>
          <p className={styles.subtitle}>
            Gerencie os membros da sua equipe e suas permissões de conta aqui.
          </p>
        </div>
        <div className={styles.actionBar}>
          <div className={styles.actionsButtons}>
            <button onClick={() => handleEdit()} className={styles.addButton}>Adicionar</button>
            <button className={styles.filterButton}>
              <img src={filtro} alt="Filtros" />
              Filtros
            </button>
            <div className={styles.searchContainer}>
              <img src={lupa} alt="Buscar" className={styles.searchIcon} />
              <input className={styles.searchInput} placeholder="Buscar" />
            </div>
          </div>
          <div className={styles.actionText}>
            <p>
              Todos os usuários{'  '}
              <span className={styles.value}>({usuarios.length}) </span>
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className={styles.centeredMessage}>
          <p>Carregando...</p>
        </div>
      ) : error ? (
        <div className={styles.centeredMessage}>
          <p className={styles.error}>Erro: {error}</p>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>Nome Completo</th>
                <th>E-mail</th>
                <th>Acesso</th>
                {/* <th>Data de Adição</th> */}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuariosPaginados.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.name}</td>
                  <td>{usuario.email}</td>
                  <td>
                    <span
                      className={`${styles.roleItem} ${styles[usuario.role]}`}
                    >
                      {usuario.role}
                    </span>
                  </td>
                  {/* <td>
                    {new Date(usuario.createdAt).toLocaleDateString('pt-BR')}
                  </td> */}
                  <td>
                    <button
                      onClick={() => handleEdit(usuario)}
                      className={styles.menuButton}
                    >
                      <img src={pontos} alt="Ações" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className={styles.paginationArea}>
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage >= totalPages}>
          Próximo
        </button>
      </div>

      {isModalOpen && (
        <EditModal
          user={usuarioSelecionado}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      {isCreateModalOpen && (
        <CreateModal
          onSave={handleSave}
          onClose={() => setIsCreateModalOpen(false)}
        />
      )}
    </div>
  );
};

export default GerenciadorDeUsuarios;
