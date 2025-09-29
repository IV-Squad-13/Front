import styles from './ItemCard.module.css'

const ItemCard = ({text}) => {
  return (
    <div className={styles.container}>
      <p>{text}</p>
    </div>
  );
}

export default ItemCard