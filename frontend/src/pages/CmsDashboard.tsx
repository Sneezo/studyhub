import { Link } from "react-router-dom";

export function CmsDashboard() {
  return (
    <section>
      <h2>Teacher CMS</h2>
      <p>
        This area will later require Active Directory authentication.
      </p>

      <ul>
        <li>
          <Link to="/cms/articles">Manage articles</Link>
        </li>
      </ul>
    </section>
  );
}