import styles from '../Especificacoes.module.css';

const FormStep = ({ fields }) => {
  return (
    <>
      {fields.map((field, index) => (
        <div key={index} className={styles.inputArea}>
          <label htmlFor={field.name}>{field.label}</label>
          {field.type === 'textarea' ? (
            <textarea
              className={styles.descriptionInput}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          ) : (
            <input
              type={field.type || 'text'}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default FormStep;
