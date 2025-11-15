import styles from './Input.module.css';

const Input = (props) => {
  return (
    <input
      className={`${styles.input} ${props.defaultcolor ? 'color: black' : styles.defaultcolor}`}
      {...props}
    />
  );
};

export default Input;
