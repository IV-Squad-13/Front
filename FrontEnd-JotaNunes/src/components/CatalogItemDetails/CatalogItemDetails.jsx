



// CÓDIGO OFICIAL COM ENDPOINTS está comentado, pois o mapeamento de algumas coisas ainda não está 100%, ficar com código mockado por enquanto

/*
import { useEffect, useState } from "react";
import styles from "./CatalogItemDetails.module.css";
import { getCatalogItemById } from "@/services/CatalogService.js";

const CatalogItemDetails = ({ item, type, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!item || !type) return;

    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        const data = await getCatalogItemById(type, item.id);
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [item, type]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const renderList = (list, emptyMessage) => {
    if (!list || list.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <ul>
        {list.map((item, index) => {
          if (item.marca && item.material) {
            return (
              <li key={index}>
                <strong>Marca:</strong> {item.marca?.name || "Sem nome"} <br />
                <strong>Material:</strong> {item.material?.name || "Sem nome"}
              </li>
            );
          }

          if (item.item && item.ambiente) {
            return (
              <li key={index}>
                <strong>Item:</strong> {item.item?.name || "Sem nome"} —{" "}
                {item.item?.desc || "Sem descrição"} <br />
                <strong>Ambiente:</strong> {item.ambiente?.name || "Sem nome"}
              </li>
            );
          }

          if (item.name) {
            return <li key={index}>{item.name}</li>;
          }

          const innerObj =
            item?.marca || item?.material || item?.padrao || item?.item;
          if (innerObj && innerObj.name) {
            return <li key={index}>{innerObj.name}</li>;
          }

          return (
            <li key={index}>
              <pre style={{ whiteSpace: "pre-wrap" }}>
                {JSON.stringify(item, null, 2)}
              </pre>
            </li>
          );
        })}
      </ul>
    );
  };

  const renderDetails = () => {
    if (!details) return null;

    switch (type) {
      case "padrao":
        return (
          <>
            <h3>Itens e Ambientes associados:</h3>
            {renderList(details.ambientes, "Nenhum item ou ambiente associado.")}

            <h3>Marcas e Materiais associados:</h3>
            {renderList(details.materiais, "Nenhuma marca ou material associado.")}
          </>
        );

      case "ambiente":
        return (
          <>
            <p>
              <strong>Local:</strong> {details.local}
            </p>

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet, "Nenhum padrão associado.")}

            <h3>Itens associados:</h3>
            {renderList(details.itemSet, "Nenhum item associado.")}
          </>
        );

      case "item":
        return (
          <>
            <p>
              <strong>Descrição:</strong> {details.descricao}
            </p>
            <p>
              <strong>Tipo:</strong>{" "}
              {details.tipo?.name || "Sem tipo definido"}
            </p>

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet, "Nenhum padrão associado.")}

            <h3>Ambientes associados:</h3>
            {renderList(details.ambientes, "Nenhum ambiente associado.")}
          </>
        );

      case "material":
        return (
          <>
            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet, "Nenhum padrão associado.")}

            <h3>Marcas associadas:</h3>
            {renderList(details.marcas, "Nenhuma marca associada.")}
          </>
        );

      case "marca":
        return (
          <>
            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet, "Nenhum padrão associado.")}

            <h3>Materiais associados:</h3>
            {renderList(details.materiais, "Nenhum material associado.")}
          </>
        );

      default:
        return <p>Tipo não reconhecido: {type}</p>;
    }
  };

  return (
    <div
      className={styles.modal}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeButton} onClick={onClose}>
          Fechar
        </button>

        <h2>{item?.name || item?.nome || "Detalhes"}</h2>

        {isLoading && <p>Carregando detalhes...</p>}
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        {!isLoading && !error && renderDetails()}
      </div>
    </div>
  );
};

export default CatalogItemDetails;
*/
// CÓDIGO COM INFORMAÇÕES MOCKADAS, apagar depois quando resolver a questão do mapeamento

import styles from "./CatalogItemDetails.module.css";

const mockData = {
  ambiente: {
    local: "Cozinha Gourmet",
    padroes: [
      { id: 1, name: "Vida Bela" },
      { id: 2, name: "Mais viver" },
    ],
    itens: [
      { id: 1, name: "Teto" },
      { id: 2, name: "Porta" },
    ],
  },

  item: {
    descricao: "Precisa ser menor.",
    tipo: { id: 1, name: "Marcenaria" },
    padroes: [
      { id: 1, name: "Residence" },
      { id: 2, name: "Mais viver" },
    ],
    ambientes: [
      { id: 1, name: "Cozinha/Área de Serviço" },
      { id: 2, name: "Garden" },
    ],
  },

  material: {
    padroes: [
      { id: 1, name: "Vida Bela" },
      { id: 2, name: "Residence" },
    ],
    marcas: [
      { id: 1, name: "Elizabeth" },
      { id: 2, name: "Portobello" },
    ],
  },

  marca: {
    padroes: [
      { id: 1, name: "Residence" },
      { id: 2, name: "Mais viver" },
    ],
    materiais: [
      { id: 1, name: "Cerâmica" },
      { id: 2, name: "Laminado" },
    ],
  },

  padrao: {
    ambientes: [
      { id: 1, name: "Sala de Estar" },
      { id: 2, name: "Quarto" },
    ],
    itens: [
      { id: 1, name: "Porta" },
      { id: 2, name: "Rodapé" },
    ],
    materiais: [
      { id: 1, name: "Porta (alumínio)" },
      { id: 2, name: "Cerâmica" },
    ],
    marcas: [
      { id: 1, name: "Arielle" },
      { id: 2, name: "Pointer" },
    ],
  },
};

const CatalogItemDetails = ({ item, type, onClose }) => {
  const data = mockData[type];

  if (!data) {
    return (
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeButton} onClick={onClose}>
            Fechar
          </button>
          <p>Tipo não reconhecido: {type}</p>
        </div>
      </div>
    );
  }

  const renderSection = (title, list) => (
    <>
      <h3>{title}</h3>
      {(!list || list.length === 0) ? (
        <p>Nenhum item associado.</p>
      ) : (
        <ul>
          {list.map((el) => (
            <li key={el.id}>{el.name}</li>
          ))}
        </ul>
      )}
    </>
  );

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>

        {/* Botão de fechar */}
        <button className={styles.closeButton} onClick={onClose}>
          Fechar
        </button>

        {/* Título */}
        <h2>{item?.name || item?.nome || "Detalhes"}</h2>

        {/* Renderização dinâmica baseada no "type" */}
        {type === "ambiente" && (
          <>
            <p><strong>Local:</strong> {data.local}</p>
            {renderSection("Padrões", data.padroes)}
            {renderSection("Itens", data.itens)}
          </>
        )}

        {type === "item" && (
          <>
            <p><strong>Descrição:</strong> {data.descricao}</p>
            <p><strong>Tipo:</strong> {data.tipo?.name}</p>
            {renderSection("Padrões", data.padroes)}
            {renderSection("Ambientes", data.ambientes)}
          </>
        )}

        {type === "material" && (
          <>
            {renderSection("Padrões", data.padroes)}
            {renderSection("Marcas", data.marcas)}
          </>
        )}

        {type === "marca" && (
          <>
            {renderSection("Padrões", data.padroes)}
            {renderSection("Materiais", data.materiais)}
          </>
        )}

        {type === "padrao" && (
          <>
            {renderSection("Ambientes", data.ambientes)}
            {renderSection("Itens", data.itens)}
            {renderSection("Materiais", data.materiais)}
            {renderSection("Marcas", data.marcas)}
          </>
        )}
      </div>
    </div>
  );
};

export default CatalogItemDetails;
