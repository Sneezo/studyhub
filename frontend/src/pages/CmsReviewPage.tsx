import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  clearCmsReviewFlag,
  getCmsReviewFlags,
  getCmsTerms,
} from "../api/studyHubApi";
import type { ReviewFlag } from "../data/reviewFlagStorage";
import type { Term } from "../data/terms";

export function CmsReviewPage() {
  const [flags, setFlags] = useState<ReviewFlag[]>([]);
  const [terms, setTerms] = useState<Term[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadReviewData() {
      try {
        const [loadedFlags, loadedTerms] = await Promise.all([
          getCmsReviewFlags(),
          getCmsTerms(),
        ]);

        setFlags(loadedFlags);
        setTerms(loadedTerms);
      } catch {
        setError("Could not load review flags.");
      }
    }

    loadReviewData();
  }, []);

  async function handleClear(termId: number) {
    try {
      await clearCmsReviewFlag(termId);
      setFlags((previous) => previous.filter((flag) => flag.termId !== termId));
    } catch {
      alert("Could not clear review flag.");
    }
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

      {error && <p className="form-error">{error}</p>}

      {flags.length === 0 ? (
        <div className="empty-state">
          <h3>No review flags</h3>
          <p>No terms have been flagged for review yet.</p>
        </div>
      ) : (
        <div className="review-list">
          {flags.map((flag) => {
            const term = terms.find((item) => item.id === flag.termId);

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