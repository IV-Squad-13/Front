import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar/SearchBar";
import SelectItem from "@/components/selectItem/SelectItem";
import { getAllEmpreendimentos, searchEmpreendimentos } from "@/services/SpecificationService";
import { useNavigate } from "react-router-dom";
import styles from "./ConsultaEmpreendimentos.module.css";
import Button from "@/components/button/Button";

const ConsultaEmpreendimentos = () => {
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [searchParams, setSearchParams] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAllEmpreendimentos();
    }, []);

    useEffect(() => {
        if (searchParams) searchEmps(searchParams);
    }, [searchParams]);

    const loadAllEmpreendimentos = async () => {
        setLoading(true);
        try {
            const emps = await getAllEmpreendimentos();
            setEmpreendimentos(emps || []);
        } catch (error) {
            console.error("Erro ao buscar empreendimentos:", error);
            alert("Erro ao buscar empreendimentos");
        } finally {
            setLoading(false);
        }
    };

    const searchEmps = async (params) => {
        setLoading(true);
        try {
            const emps = await searchEmpreendimentos(params);
            setEmpreendimentos(emps || []);
        } catch (error) {
            console.error("Erro ao buscar empreendimentos:", error);
            alert("Erro ao buscar empreendimentos");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query) => {
        const trimmed = query.trim();
        if (!trimmed) return loadAllEmpreendimentos();
        setSearchParams({ name: trimmed });
    };

    const selectEmpreendimento = (id) => {
        if (!id) return navigate(`/home/empreendimento`);
        navigate(`/home/empreendimento/${encodeURIComponent(id)}`);
    };

    return (
        <div className={styles.container}>
            <div className={styles.headerContainer}>
                <h1 className={styles.title}>Consulta de Empreendimentos</h1>
                <p className={styles.subtitle}>Busque, visualize ou cadastre um novo empreendimento.</p>

                <div className={styles.topActions}>
                    <SearchBar
                        title="Buscar Empreendimentos"
                        onSearch={handleSearch}
                        displayButton={true}
                    />

                    <Button
                        type="button"
                        onClick={() => selectEmpreendimento(null)}
                        variant="header"
                    >
                        Criar Empreendimento
                    </Button>
                </div>
            </div>

            <div className={styles.mainArea}>
                {loading ? (
                    <p>Carregando empreendimentos...</p>
                ) : empreendimentos.length > 0 ? (
                    empreendimentos.map((emp) => (
                        <SelectItem
                            key={emp.id}
                            id={emp.id}
                            onSelect={() => selectEmpreendimento(emp.id)}
                            content={emp.name}
                        />
                    ))
                ) : (
                    <p className={styles.emptyMsg}>Nenhum empreendimento encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ConsultaEmpreendimentos;