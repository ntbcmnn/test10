import { NavLink } from 'react-router-dom';

const Toolbar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-dark p-3">
      <div className="container d-flex align-items-center justify-content-between">
        <NavLink className="navbar-brand text-white" to="/">News Portal</NavLink>
      </div>
    </nav>
  );
};

export default Toolbar;