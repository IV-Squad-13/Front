import styles from './Button.module.css';

const Button = ({children, type= 'button', variant= 'primary', ...props}) => {
    
    const buttonClassName = `${styles.button} ${styles[variant]}`
  return (
    <button type={type} className={buttonClassName} {...props}>
        {children}
    </button>
  )
}

export default Button