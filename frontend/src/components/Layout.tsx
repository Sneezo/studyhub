import { Link, Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="app">
      <header className="site-header">
        <h1>StudyHub</h1>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/news">News</Link>
          <Link to="/cms">CMS</Link>
        </nav>
      </header>

      <main className="site-main">
        <Outlet />
      </main>
    </div>
  );
}