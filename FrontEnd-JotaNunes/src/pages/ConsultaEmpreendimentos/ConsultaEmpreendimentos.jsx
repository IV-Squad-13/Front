import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar/SearchBar";
import SelectItem from "@/components/selectItem/SelectItem";
import { getAllEmpreendimentos, searchEmpreendimentos } from "@/services/SpecificationService";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button/Button";
import styles from "./ConsultaEmpreendimentos.module.css";

const ConsultaEmpreendimentos = () => {
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAllEmpreendimentos();
    }, []);

    const loadAllEmpreendimentos = async () => {
        setLoading(true);
        try {
            const data = await getAllEmpreendimentos();
            setEmpreendimentos(data || []);
        } catch {
            alert("Erro ao buscar empreendimentos");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (query) => {
        const trimmed = query.trim();

        if (!trimmed) {
            await loadAllEmpreendimentos();
            return;
        }

        setLoading(true);
        try {
            const data = await searchEmpreendimentos({ name: trimmed });
            setEmpreendimentos(data || []);
        } catch {
            alert("Erro ao buscar empreendimentos");
        } finally {
            setLoading(false);
        }
    };

    const selectEmpreendimento = (id) => {
        navigate(id ? `/home/empreendimento/${encodeURIComponent(id)}` : `/home/empreendimento`);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div className={styles.headerText}>
                    <h1 className={styles.title}>Consulta de Empreendimentos</h1>
                    <p className={styles.subtitle}>
                        Busque, visualize ou cadastre um novo empreendimento.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    <SearchBar
                        title="Buscar Empreendimentos"
                        onSearch={handleSearch}
                        displayDropDown={false}
                        displayButton={true}
                    />

                    <div className={styles.headerBtnContainer}>
                        <Button
                            type="button"
                            onClick={() => selectEmpreendimento(null)}
                            variant="header"
                        >
                            Criar Empreendimento
                        </Button>
                    </div>
                </div>
            </header>

            <main className={styles.gridArea}>
                {loading ? (
                    <div className={styles.spinner}></div>
                ) : empreendimentos.length > 0 ? (
                    empreendimentos.map((emp) => (
                        <SelectItem
                            key={emp.id}
                            id={emp.id}
                            content={emp.name}
                            onSelect={() => selectEmpreendimento(emp.id)}
                        />
                    ))
                ) : (
                    <p className={styles.emptyMsg}>Nenhum empreendimento encontrado.</p>
                )}
            </main>
        </div>
    );
};

export default ConsultaEmpreendimentos;