import SelectItem from "@/components/selectItem/SelectItem";
import { searchSpecifications } from "@/services/SpecificationService";
import React, { useEffect } from "react";
import { useState } from "react";

interface Empreendimento {
    id: number;
    name: string;
}

interface SearchParams {
    attribute: string,
    value: any
}

const ConsultaEmpreendimentos = () => {
    const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
    const [searchParams, setSearchParams] = useState<SearchParams | null>();

    useEffect(() => {
        searchEmps(searchParams)
    }, [searchParams]);

    const searchEmps = async (searchParams: SearchParams) => {
        await searchSpecifications(searchParams)
            .then((data) => setEmpreendimentos(data))
            .catch((err) => 
                alert("Erro ao buscar Empreendimentos")
            );
    }

    const goToSpec = (id: number) => {
        console.log(id);
    }

    return (
        <div>
            <div>
                <h1>Header</h1>
            </div>
            <div>
                {empreendimentos.map(emp => (
                    <SelectItem key={emp.id} id={emp.id} onSelect={goToSpec} content={emp.name} />
                ))}
            </div>
        </div>
    );
}

export default ConsultaEmpreendimentos;