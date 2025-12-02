import { useState } from 'react';
import Button from '../button/Button';
import styles from './ItemCard.module.css';

const ItemCard = ({ text, onClick, onAction, action, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(text);

  const save = () => {
    const trimmed = draft.trim();
    if (trimmed !== "" && trimmed !== text) {
      onEdit(trimmed);
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(text);
    setIsEditing(false);
  };

  return (
    <div
      className={styles.container}
      onClick={onClick}
      style={{ cursor: "pointer" }}
    >
      {isEditing ? (
        <input
          type="text"
          value={draft}
          autoFocus
          className={styles.editInput}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.stopPropagation();
              save();
            } else if (e.key === "Escape") {
              e.stopPropagation();
              cancel();
            }
          }}
          onBlur={save}
        />
      ) : (
        <>
          <p
            className={styles.name}
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
          >
            {text}
          </p>

          {onAction && action && (
            <Button
              type="button"
              variant="ghost small contained"
              onClick={(e) => {
                e.stopPropagation();
                onAction();
              }}
            >
              {action}
            </Button>
          )}
        </>
      )}
    </div>
  );
};

export default ItemCard;