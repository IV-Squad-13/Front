import styles from './Dashboard.module.css'
import ItemCard from '@/components/ItemCard/ItemCard'

const Dashboard = () => {
  return (
    <div>
      <div className={styles.container}>Dashboard</div>
      
      <div>
        <ItemCard/>
        <ItemCard/>
        <ItemCard/>
      </div>
    </div>
  )
}

export default Dashboard