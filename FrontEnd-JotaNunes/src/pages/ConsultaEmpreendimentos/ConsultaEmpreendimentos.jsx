import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar/SearchBar";
import { deleteEmp, getAllEmpreendimentos, searchEmpreendimentos } from "@/services/SpecificationService";
import { useNavigate } from "react-router-dom";
import Button from "@/components/button/Button";
import styles from "./ConsultaEmpreendimentos.module.css";
import SelectEmp from "@/components/selectEmp/SelectEmp";

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

    const selectEmpreendimento = (id, page) => {
        navigate(id ? `/home/${page}/${encodeURIComponent(id)}` : `/home/${page}`);
    };

    const handleEmpDelete = async (id) => {
        setLoading(true);

        try {
            await deleteEmp(id);
            setEmpreendimentos((prev) => prev.filter((emp) => emp.id !== id));
        } catch (err) {
            console.error(err);
            alert("Erro ao deletar empreendimento");
        } finally {
            setLoading(false);
        }
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
                            onClick={() => selectEmpreendimento(null, "empreendimento")}
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
                        <SelectEmp
                            key={emp.id}
                            id={emp.id}
                            name={emp.name}
                            status={emp.status}
                            author={emp.creator.user.name}
                            dtCreated={emp.createdAt}
                            onSelect={selectEmpreendimento}
                            onDelete={(id) => handleEmpDelete(id)}
                            rev={emp?.revision ?? null}
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