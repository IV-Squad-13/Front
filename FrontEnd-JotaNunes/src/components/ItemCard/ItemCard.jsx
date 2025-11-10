import styles from './ItemCard.module.css'

const ItemCard = ({ text, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick} style={{ cursor: 'pointer' }}>
      <p>{text}</p>
    </div>
  );
}

export default ItemCard
