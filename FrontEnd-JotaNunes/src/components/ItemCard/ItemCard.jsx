import styles from './ItemCard.module.css'

const ItemCard = ({text}) => {
  return (
    <li className={styles.container}>
      {text}
    </li>
  );
}

export default ItemCard