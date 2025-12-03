import { useEffect, useState } from "react";
import styles from "./CatalogItemDetails.module.css";
import { getCatalogItemById } from "@/services/CatalogService.js";

import { authFetch } from "@/services/AuthService";
import { API_URL } from "@/main.jsx";

const LocalEnum = {
  UNIDADES_PRIVATIVAS: "Unidades Privativas",
  AREA_COMUM: "Área Comum"
}

const CatalogItemDetails = ({ id, type, setSelectedResource, setSelectedResourceType, onClose }) => {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [addRelationType, setAddRelationType] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState(null);
  
  const fetchDetails = async () => {
    if (!id || !type) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCatalogItemById(type, id);
      setDetails(data);
    } catch (err) {
      console.error("Erro ao buscar detalhes:", err);
      setError(err.message || "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
    setAddRelationType("");
    setCandidates([]);
    setSelectedCandidateId(null);
    setMessage(null);
  }, [id, type]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  const updateResource = (rel, resourceType) => {
    setSelectedResource(rel.id);
    setSelectedResourceType(resourceType);
  };

  const renderList = (list, emptyMessage, resourceType) => {
    if (!list || list.length === 0) return <p>{emptyMessage}</p>;

    return (
      <ul>
        {list.map((rel, index) => {
          if (rel.marca && rel.material) {
            return (
              <li key={index}>
                <strong onClick={() => updateResource(rel?.marca, "marca")}>Marca:</strong>{" "}
                {rel.marca?.name || "Sem nome"} <br />
                <strong onClick={() => updateResource(rel?.material, "material")}>Material:</strong>{" "}
                {rel.material?.name || "Sem nome"}
              </li>
            );
          }

          if (rel.item && rel.ambiente) {
            return (
              <li key={index}>
                <strong onClick={() => updateResource(rel?.item, "item")}>Item:</strong>{" "}
                {rel.item?.name || "Sem nome"} — {rel.item?.desc || "Sem descrição"} <br />
                <strong onClick={() => updateResource(rel?.ambiente, "ambiente")}>Ambiente:</strong>{" "}
                {rel.ambiente?.name || "Sem nome"}
              </li>
            );
          }

          if (rel.name) {
            return (
              <li
                key={index}
                className={styles.clickable}
                onClick={() => updateResource(rel, resourceType)}
              >
                {rel.name}
              </li>
            );
          }

          const innerObj = rel?.marca || rel?.material || rel?.padrao || rel?.item;
          if (innerObj && innerObj.name) {
            return (
              <li
                key={index}
                className={styles.clickable}
                onClick={() => updateResource(rel, resourceType)}
              >
                {innerObj.name}
              </li>
            );
          }

          return (
            <li key={index} onClick={() => updateResource(rel, resourceType)}>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(rel, null, 2)}</pre>
            </li>
          );
        })}
      </ul>
    );
  };

  const addableRelationsForType = {
    ambiente: ["padrao", "item"],
    item: ["padrao", "ambiente"],
    material: ["marca", "padrao"],
    marca: ["material", "padrao"],
    padrao: ["ambiente", "item", "material", "marca"],
  };

  const candidatesEndpointFor = (candidateType) => {
    const q = "?loadAll=true";
    switch (candidateType) {
      case "padrao":
        return `${API_URL}/catalogo/padrao${q}`;
      case "marca":
        return `${API_URL}/catalogo/marca${q}`;
      case "material":
        return `${API_URL}/catalogo/material${q}`;
      case "item":
        return `${API_URL}/catalogo/item${q}`;
      case "ambiente":
        return `${API_URL}/catalogo/ambiente${q}`;
      default:
        return null;
    }
  };

  const addRelation = async (currentType, currentId, candidateType, candidateId) => {
    const mapCompType = (t) => {
      return t?.toUpperCase();
    };

    if (candidateType === "padrao") {
      const compType = mapCompType(currentType);
      return {
        url: `${API_URL}/catalogo/padrao/${candidateId}/rel/single?associationId=${currentId}&compType=${compType}`,
        method: "POST",
      };
    }

    if (currentType === "ambiente" && candidateType === "item") {
      return {
        url: `${API_URL}/catalogo/ambiente/${currentId}/item?itemId=${candidateId}`,
        method: "POST",
      };
    }
    if (currentType === "item" && candidateType === "ambiente") {
      return {
        url: `${API_URL}/catalogo/item/${currentId}/ambiente?ambienteId=${candidateId}`,
        method: "POST",
      };
    }

    if (currentType === "material" && candidateType === "marca") {
      return {
        url: `${API_URL}/catalogo/material/${currentId}/marca?marcaId=${candidateId}`,
        method: "POST",
      };
    }
    if (currentType === "marca" && candidateType === "material") {
      return {
        url: `${API_URL}/catalogo/marca/${currentId}/material?materialId=${candidateId}`,
        method: "POST",
      };
    }

    return {
      url: `${API_URL}/catalogo/padrao/${candidateId}/rel/single?associationId=${currentId}&compType=${mapCompType(
        currentType
      )}`,
      method: "POST",
    };
  };

  useEffect(() => {
    const loadCandidates = async () => {
      if (!addRelationType) {
        setCandidates([]);
        setSelectedCandidateId(null);
        return;
      }

      const endpoint = candidatesEndpointFor(addRelationType);
      if (!endpoint) {
        setCandidates([]);
        return;
      }

      try {
        const res = await authFetch(endpoint, { method: "GET" });
        setCandidates(res || []);
        setSelectedCandidateId(null);
      } catch (err) {
        console.error("Erro ao carregar candidatos:", err);
        setMessage("Erro ao carregar opções.");
        setCandidates([]);
      }
    };

    loadCandidates();
  }, [addRelationType]);

  const handleAdd = async () => {
    setMessage(null);
    if (!addRelationType || !selectedCandidateId) {
      setMessage("Escolha o tipo e o item a adicionar.");
      return;
    }
    setIsAdding(true);
    try {
      const action = await addRelation(type, details.id, addRelationType, selectedCandidateId);
      const res = await authFetch(action.url, { method: action.method });
      setMessage("Relação adicionada com sucesso.");
      await fetchDetails();
      setSelectedCandidateId(null);
    } catch (err) {
      console.error("Erro ao adicionar relação:", err);
      setMessage(err.message || "Falha ao adicionar relação.");
    } finally {
      setIsAdding(false);
    }
  };

const renderAddSection = () => {
  const allowed = addableRelationsForType[type] || [];
  if (allowed.length === 0) return null;

  return (
    <div className={styles.addRelationSection}>
      <h3>Adicionar relação</h3>

      <div className={styles.addRelationRow}>
        <label className={styles.addRelationLabel}>
          Tipo:
          <select
            value={addRelationType}
            onChange={(e) => {
              setAddRelationType(e.target.value);
              setMessage(null);
            }}
            className={styles.addRelationSelect}
          >
            <option value="">-- selecione --</option>
            {allowed.map((r) => (
              <option key={r} value={r}>
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.addRelationLabel}>
          Opção:
          <select
            disabled={!addRelationType || candidates.length === 0}
            value={selectedCandidateId ?? ""}
            onChange={(e) =>
              setSelectedCandidateId(e.target.value ? Number(e.target.value) : null)
            }
            className={styles.addRelationSelect}
          >
            <option value="">-- selecione --</option>
            {candidates.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name || c.nome || `${c.id}`}
              </option>
            ))}
          </select>
        </label>

        <button
          onClick={handleAdd}
          disabled={isAdding || !selectedCandidateId}
          className={styles.addRelationButton}
        >
          {isAdding ? "Adicionando..." : "Adicionar"}
        </button>
      </div>

      {message && <p className={styles.addRelationMessage}>{message}</p>}
    </div>
  );
};
  const renderDetails = () => {
    if (!details) return null;

    switch (type) {
      case "padrao":
        return (
          <>
            <h3>Itens e Ambientes associados:</h3>
            {renderList(details.ambienteList || details.ambientes || details.ambienteSet, "Nenhum item ou ambiente associado.", "ambiente")}

            <h3>Marcas e Materiais associados:</h3>
            {renderList(details.materialList || details.materiais || details.marcaSet, "Nenhuma marca ou material associado.", "material")}
          </>
        );

      case "ambiente":
        return (
          <>
            <p>
              <strong>Local:</strong> {LocalEnum[details.local]}
            </p>

            {renderAddSection()}

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet || details.padraoList || details.padroes || details.padraoList, "Nenhum padrão associado.", "padrao")}

            <h3>Itens associados:</h3>
            {renderList(details.itemSet || details.itemList || details.itens, "Nenhum item associado.", "item")}
          </>
        );

      case "item":
        return (
          <>
            <p>
              <strong>Descrição:</strong> {details.descricao || details.desc}
            </p>
            <p>
              <strong>Tipo:</strong> {details.tipo?.name || "Sem tipo definido"}
            </p>

            {renderAddSection()}

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet || details.padraoList || details.padroes, "Nenhum padrão associado.", "padrao")}

            <h3>Ambientes associados:</h3>
            {renderList(details.ambienteSet || details.ambientes || details.ambienteList, "Nenhum ambiente associado.", "ambiente")}
          </>
        );

      case "material":
        return (
          <>
            {renderAddSection()}

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet || details.padraoList || details.padroes, "Nenhum padrão associado.", "padrao")}

            <h3>Marcas associadas:</h3>
            {renderList(details.marcaSet || details.marcas, "Nenhuma marca associada.", "marca")}
          </>
        );

      case "marca":
        return (
          <>
            {renderAddSection()}

            <h3>Padrões associados:</h3>
            {renderList(details.padraoSet || details.padraoList || details.padroes, "Nenhum padrão associado.", "padrao")}

            <h3>Materiais associados:</h3>
            {renderList(details.materialSet || details.materiais || details.marcaSet, "Nenhum material associado.", "material")}
          </>
        );

      default:
        return <p>Tipo não reconhecido: {type}</p>;
    }
  };

  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          Fechar
        </button>

        <h2>{details?.name || details?.nome || "Detalhes"}</h2>

        {isLoading && <p>Carregando detalhes...</p>}
        {error && <p style={{ color: "red" }}>Erro: {error}</p>}
        {!isLoading && !error && renderDetails()}
      </div>
    </div>
  );
};

export default CatalogItemDetails;