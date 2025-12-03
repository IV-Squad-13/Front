"use client"

import { useState, useEffect } from "react"
import { getItemTypes } from "@/services/CatalogService"

const useItemTypes = (activeSpec) => {
    const [itemTypes, setItemTypes] = useState([])
    const [isLoadingTypes, setIsLoadingTypes] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        if (activeSpec !== "item") return

        const fetchTypes = async () => {
            setIsLoadingTypes(true)
            setError(null)

            try {
                const data = await getItemTypes()
                setItemTypes(data)
            } catch (err) {
                console.error("Erro ao buscar tipos de item:", err)
                setError(err)
            } finally {
                setIsLoadingTypes(false)
            }
        }

        fetchTypes()
    }, [activeSpec])

    return {
        itemTypes,
        isLoadingTypes,
        error
    }
}

export default useItemTypes;