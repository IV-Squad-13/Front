import React, { useState, useEffect } from 'react';
import ItemCard from '@/components/ItemCard/ItemCard'; 
import { getCatalogByResource } from '@/services/CatalogService';
import styles from './contadorDeItens.module.css';

const CatalogCount = ({ resourceType, displayName }) => { 
  const [itemCount, setItemCount] = useState('...');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    setItemCount('...');

    const fetchData = async () => {
      try {
        const data = await getCatalogByResource(resourceType);
        
        if (Array.isArray(data)) {
          const count = data.length;
          setItemCount(count.toString());
        } else {
           setItemCount('Sem Dados'); 
           console.error(`Dados da API para ${resourceType} não são um array:`, data);
        }
        
      } catch (err) {
        setError(err.message);
        setItemCount('Erro');
        console.error(`Erro ao buscar ${resourceType}:`, err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [resourceType]);

  const cardText = isLoading 
    ? `Carregando ...` 
    : error 
      ? `Erro` 
      : `${itemCount}`; 

  return (
    <div className={styles.cardContainer}>
      <p>{displayName}:</p>
      <ItemCard text={cardText} />
    </div>
  );
}

export default CatalogCount;