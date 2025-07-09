import Link from 'next/link';
import css from '../../../../components/SidebarNotes/SidebarNotes.module.css';

const SidebarNotes = async () => {
  const allTag = ['All', 'Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];
  return (
    <ul className={css.menuList}>
      {allTag.map(tag => (
        <li key={tag} className={css.menuItem}>
          <Link href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default SidebarNotes;
