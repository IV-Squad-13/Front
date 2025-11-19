import { useState } from "react";
import styles from "./EmpreendimentoForm.module.css";
import SearchBar from "@/components/searchBar/SearchBar";
import { searchEspecificacao } from "@/services/SpecificationService";
import { getCatalogSearch } from "@/services/CatalogService";

const EmpreendimentoForm = ({ emp, setEmp }) => {
    const initOptions = ["PADRAO", "IMPORT", "AVULSO"];

    const [results, setResults] = useState([]);

    const getReference = () => {
        if (emp.init === "PADRAO") {
            const name = emp?.padrao?.name ?? "";
            return {
                disabled: Boolean(name),
                value: name
            };
        }

        if (emp.init === "IMPORT") {
            const name = emp?.refDoc?.name ?? "";
            return {
                disabled: Boolean(name),
                value: name
            };
        }

        return { disabled: false, value: "" };
    };

    const handleSearch = async (init, query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        try {
            let response = [];

            if (init === "IMPORT") {
                response = await searchEspecificacao({ name: trimmed });
            } else if (init === "PADRAO") {
                response = await getCatalogSearch("padrao", { name: trimmed });
            }

            setResults(
                response?.map((r) => ({
                    label: r.name,
                    ...r
                })) || []
            );
        } catch (err) {
            console.error("Erro ao buscar:", err);
            setResults([]);
        }
    };

    const handleSelect = (item) => {
        setEmp({ ...emp });

        if (emp.init === "PADRAO") {
            setEmp({ ...emp, padraoId: item.id });
        } else if (emp.init === "IMPORT") {
            setEmp({ ...emp, docImportId: item.id });
        }
    };

    return (
        <div className={styles.formContainer}>
            <div className={styles.inputGroup}>
                <label htmlFor="name">Nome do Empreendimento</label>
                <input
                    id="name"
                    type="text"
                    value={emp.name}
                    onChange={(e) => setEmp({ ...emp, name: e.target.value })}
                    placeholder="Digite o nome..."
                    className={styles.input}
                />
            </div>

            <div className={styles.inputGroup}>
                <label htmlFor="initType">Tipo de Inicialização</label>
                <select
                    id="initType"
                    value={emp.init}
                    onChange={(e) => {
                        setEmp({ ...emp, init: e.target.value });
                        setResults([]);
                    }}
                    className={styles.select}
                    disabled={emp.id && emp.init}
                >
                    <option value="">Selecione...</option>
                    {initOptions.map((opt) => (
                        <option key={opt} value={opt}>
                            {opt}
                        </option>
                    ))}
                </select>
            </div>

            {emp.init !== "AVULSO" && emp.init && (() => {
                const ref = getReference();
                return (
                    <SearchBar
                        title={`Referência para ${emp.init}`}
                        onSearch={(query) => handleSearch(emp.init, query)}
                        onSelect={handleSelect}
                        displayDropDown={true}
                        displayButton={false}
                        defaultValue={ref.value}
                        results={results}
                        disabled={ref.disabled}
                    />
                );
            })()}
        </div>
    );
};

export default EmpreendimentoForm;