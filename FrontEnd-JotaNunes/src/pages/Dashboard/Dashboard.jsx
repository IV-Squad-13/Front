import styles from './Dashboard.module.css';
import CatalogCount from '@/components/ContadorDeItens/contadorDeItem'; 
import React from 'react';

const specs = [
  { type: "padrao", name: "Padrões" },
  { type: "ambiente", name: "Ambientes" },
  { type: "item", name: "Itens" },
  { type: "material", name: "Materiais" },
  { type: "marca", name: "Marcas" },
];

const Dashboard = () => {

  return (
    <div>
      <div className={styles.container}><h2>Dashboard do Catálogo</h2></div>
      
      <div className={styles.cardGrid}>
        
        {specs.map((spec) => (
          <CatalogCount
            key={spec.type} 
            resourceType={spec.type}
            displayName={spec.name}   
          />
        ))}
        
      </div>
    </div>
  )
}

export default Dashboard