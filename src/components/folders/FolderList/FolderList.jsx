import styles from './FolderList.module.css';

const FolderList = ({ folders, selectedFolderId, onSelect, onEdit, onDelete }) => {
  if (folders.length === 0) {
    return <p className={styles.empty}>Папок пока нет</p>;
  }

  return (
    <div className={styles.list}>
      {folders.map((folder) => (
        <div
          key={folder.id}
          className={`${styles.item} ${selectedFolderId === folder.id ? styles.active : ''}`}
        >
          <button type="button" className={styles.mainButton} onClick={() => onSelect(folder.id)}>
            <span className={styles.name}>{folder.name}</span>
          </button>

          <div className={styles.actions}>
            <button type="button" className={styles.editButton} onClick={() => onEdit(folder)}>
              Переименовать
            </button>

            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => onDelete(folder.id)}
            >
              Удалить
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FolderList;
