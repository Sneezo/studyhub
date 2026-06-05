import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteStoredTerm, getStoredTerms } from "../data/termStorage";
import type { Term } from "../data/terms";

export function CmsTermsPage() {
  const [terms, setTerms] = useState<Term[]>(() => getStoredTerms());
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  const tags = useMemo(() => {
    return Array.from(new Set(terms.flatMap((term) => term.tags))).sort();
  }, [terms]);

  const filteredTerms = useMemo(() => {
    return terms.filter((term) => {
      const matchesSearch =
        term.term.toLowerCase().includes(search.toLowerCase()) ||
        term.description.toLowerCase().includes(search.toLowerCase()) ||
        term.definition.toLowerCase().includes(search.toLowerCase());

      const matchesTag =
        selectedTag === "All" || term.tags.includes(selectedTag);

      return matchesSearch && matchesTag;
    });
  }, [terms, search, selectedTag]);

  function handleDelete(termId: number) {
    const confirmed = confirm("Delete this term?");

    if (!confirmed) {
      return;
    }

    deleteStoredTerm(termId);
    setTerms(getStoredTerms());
  }

  return (
    <section className="cms-page">
      <div className="cms-header">
        <div>
          <p className="eyebrow">CMS</p>
          <h2>Manage terms</h2>
          <p>Create, edit and delete flashcard terms.</p>
        </div>

        <Link to="/cms/terms/new" className="primary-link">
          New term
        </Link>
      </div>

      <div className="cms-filters">
        <input
          type="search"
          placeholder="Search terms..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <select
          value={selectedTag}
          onChange={(event) => setSelectedTag(event.target.value)}
        >
          <option value="All">All tags</option>

          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="cms-table-wrapper">
        <table className="cms-table">
          <thead>
            <tr>
              <th>Term</th>
              <th>Description</th>
              <th>Tags</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {filteredTerms.map((term) => (
              <tr key={term.id}>
                <td>
                  <strong>{term.term}</strong>
                </td>
                <td>{term.description}</td>
                <td>
                  <div className="tag-list compact">
                    {term.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </td>
                <td className="table-actions">
                  <Link to={`/cms/terms/${term.id}/edit`}>Edit</Link>
                  <button type="button" onClick={() => handleDelete(term.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {filteredTerms.length === 0 && (
              <tr>
                <td colSpan={4}>No terms found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}