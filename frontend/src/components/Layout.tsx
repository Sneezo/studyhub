import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app">
      <header className="site-header">
        <h1>StudyHub</h1>

        <nav>
          <Link to="/">Home</Link>
          <a href="/fsmo.html" target="_blank" rel="noreferrer">
            FSMO
          </a>
          <Link to="/cms">CMS</Link>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}