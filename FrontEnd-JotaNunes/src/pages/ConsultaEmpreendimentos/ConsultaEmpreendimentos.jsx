import React, { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar/SearchBar";
import SelectItem from "@/components/selectItem/SelectItem";
import { getAllEmpreendimentos, searchEmpreendimentos } from "@/services/SpecificationService";
import { useNavigate } from "react-router-dom";

const ConsultaEmpreendimentos = () => {
    const [empreendimentos, setEmpreendimentos] = useState([]);
    const [searchParams, setSearchParams] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadAllEmpreendimentos();
    }, []);

    useEffect(() => {
        if (searchParams) {
            searchEmps(searchParams);
        }
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

        if (!trimmed) {
            loadAllEmpreendimentos();
            return;
        }

        setSearchParams({ name: trimmed });
    };

    const selectDocument = (id) => {
        if (!id) return;
        navigate(`/home/empreendimento/${encodeURIComponent(id)}`);
    };

    return (
        <div style={{ padding: "16px" }}>
            <SearchBar
                title="Buscar Empreendimentos"
                onSearch={handleSearch}
                displayButton={true}
            />

            <div style={{ marginTop: "16px" }}>
                {loading ? (
                    <p>Carregando empreendimentos...</p>
                ) : empreendimentos.length > 0 ? (
                    empreendimentos.map((emp) => (
                        <SelectItem
                            key={emp.id}
                            id={emp.id}
                            onSelect={() => selectDocument(emp.id)}
                            content={emp.name}
                        />
                    ))
                ) : (
                    <p>Nenhum empreendimento encontrado.</p>
                )}
            </div>
        </div>
    );
};

export default ConsultaEmpreendimentos;