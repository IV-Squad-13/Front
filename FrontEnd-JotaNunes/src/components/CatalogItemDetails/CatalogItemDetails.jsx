// src/components/CatalogItemDetails/CatalogItemDetails.jsx
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
        console.log("📦 Dados recebidos:", data);
        setDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    console.log("📦 Item recebido no modal:", item);
    fetchDetails();
  }, [item, type]);

  // --- 🔧 RENDERIZAÇÃO MAIS INTELIGENTE ---
  const renderList = (list, emptyMessage) => {
    if (!list || list.length === 0) {
      return <p>{emptyMessage}</p>;
    }

    return (
      <ul>
        {list.map((item, index) => {
          // Caso seja uma relação material–marca (ex: marca: {...}, material: {...})
          if (item.marca && item.material) {
            return (
              <li key={index}>
                <strong>Marca:</strong> {item.marca?.name || "Sem nome"} <br />
                <strong>Material:</strong> {item.material?.name || "Sem nome"}
              </li>
            );
          }

          // Caso seja uma relação item–ambiente
          if (item.item && item.ambiente) {
            return (
              <li key={index}>
                <strong>Item:</strong> {item.item?.name || "Sem nome"} —{" "}
                {item.item?.desc || "Sem descrição"} <br />
                <strong>Ambiente:</strong> {item.ambiente?.name || "Sem nome"}
              </li>
            );
          }

          // Caso tenha apenas nome
          if (item.name) {
            return <li key={index}>{item.name}</li>;
          }

          // Caso o objeto seja um wrapper com "id" e outro nível de dados
          const innerObj =
            item?.marca || item?.material || item?.padrao || item?.item;
          if (innerObj && innerObj.name) {
            return <li key={index}>{innerObj.name}</li>;
          }

          // Último fallback — mostra JSON se não houver nada legível
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

  // --- 🔍 RENDERIZA DETALHES ---
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
    <div className={styles.modal}>
      <div className={styles.modalContent}>
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
