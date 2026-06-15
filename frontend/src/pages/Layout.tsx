import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      <header>
        <nav>
          <NavLink className="nav-element" to="/">
            Day Charts
          </NavLink>
          <NavLink className="nav-element" to="/second">
            Best Clean Energy Charging Time
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
}
