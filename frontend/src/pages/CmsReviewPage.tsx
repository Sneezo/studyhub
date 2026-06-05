import { useState } from "react";
import { Link } from "react-router-dom";
import {
  clearStoredReviewFlag,
  getStoredReviewFlags,
} from "../data/reviewFlagStorage";
import { getStoredTerm } from "../data/termStorage";
import type { ReviewFlag } from "../data/reviewFlagStorage";

export function CmsReviewPage() {
  const [flags, setFlags] = useState<ReviewFlag[]>(() =>
    Object.values(getStoredReviewFlags())
  );

  function handleClear(termId: number) {
    clearStoredReviewFlag(termId);
    setFlags(Object.values(getStoredReviewFlags()));
  }

  return (
    <section className="cms-page">
      <div className="cms-header">
        <div>
          <p className="eyebrow">CMS</p>
          <h2>Review flags</h2>
          <p>Feedback from flashcards that should be improved.</p>
        </div>
      </div>

      {flags.length === 0 ? (
        <div className="empty-state">
          <h3>No review flags</h3>
          <p>No terms have been flagged for review yet.</p>
        </div>
      ) : (
        <div className="review-list">
          {flags.map((flag) => {
            const term = getStoredTerm(flag.termId);

            return (
              <article key={flag.termId} className="review-item">
                <div>
                  <p className="eyebrow">{flag.subjectId}</p>
                  <h3>{flag.term}</h3>
                  <p>{flag.note}</p>
                  <p className="review-date">
                    Created: {new Date(flag.createdAt).toLocaleString()}
                  </p>
                </div>

                <div className="review-item-actions">
                  {term ? (
                    <Link to={`/cms/terms/${flag.termId}/edit`}>
                      Edit term
                    </Link>
                  ) : (
                    <span>Term deleted</span>
                  )}

                  <button
                    type="button"
                    onClick={() => handleClear(flag.termId)}
                  >
                    Clear flag
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}