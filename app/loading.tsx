import css from './page.module.css';

const loading = () => {
  return (
    <div className={css.spinner}>
      <p>Loading, please wait...</p>
    </div>
  );
};

export default loading;
