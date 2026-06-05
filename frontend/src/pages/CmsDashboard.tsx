import { Link } from "react-router-dom";
import { getStoredTerms } from "../data/termStorage";
import { getStoredReviewFlags } from "../data/reviewFlagStorage";

export function CmsDashboard() {
  const terms = getStoredTerms();
  const reviewFlags = Object.values(getStoredReviewFlags());

  const uniqueTags = new Set(terms.flatMap((term) => term.tags));

  return (
    <section className="cms-page">
      <div className="cms-header">
        <div>
          <p className="eyebrow">Teacher CMS</p>
          <h2>StudyHub CMS</h2>
          <p>Manage flashcards, definitions, tags and review feedback.</p>
        </div>
      </div>

      <div className="cms-card-grid">
        <Link to="/cms/terms" className="cms-card">
          <span className="cms-card-number">{terms.length}</span>
          <h3>Terms</h3>
          <p>Edit existing flashcards and definitions.</p>
        </Link>

        <Link to="/cms/terms/new" className="cms-card">
          <span className="cms-card-number">+</span>
          <h3>New term</h3>
          <p>Create a new flashcard term.</p>
        </Link>

        <Link to="/cms/review" className="cms-card">
          <span className="cms-card-number">{reviewFlags.length}</span>
          <h3>Review flags</h3>
          <p>See terms that have been flagged for improvement.</p>
        </Link>

        <div className="cms-card">
          <span className="cms-card-number">{uniqueTags.size}</span>
          <h3>Tags</h3>
          <p>Subjects currently used by flashcards.</p>
        </div>
      </div>
    </section>
  );
}