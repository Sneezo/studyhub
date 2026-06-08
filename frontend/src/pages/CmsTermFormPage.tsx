import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ApiError,
  createCmsTerm,
  getCmsTerm,
  updateCmsTerm,
} from "../api/studyHubApi";
import { subjects } from "../data/subjects";
import type { Term } from "../data/terms";

type CmsTermFormPageProps = {
  mode: "new" | "edit";
};

const officialSubjectIds = subjects.map((subject) => subject.id);
const officialSubjectIdSet = new Set(officialSubjectIds);

const dsSubjects = subjects.filter((subject) => subject.classes.includes("DS"));
const snSubjects = subjects.filter((subject) => subject.classes.includes("SN"));

export function CmsTermFormPage({ mode }: CmsTermFormPageProps) {
  const navigate = useNavigate();
  const params = useParams();

  const termId = Number(params.id);

  const [existingTerm, setExistingTerm] = useState<Term | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");

  const [duplicateTermId, setDuplicateTermId] = useState<number | null>(null);
  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [definition, setDefinition] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [unknownTags, setUnknownTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (mode !== "edit") {
      return;
    }

    async function loadTerm() {
      try {
        const loadedTerm = await getCmsTerm(termId);

        setExistingTerm(loadedTerm);
        setTerm(loadedTerm.term);
        setDescription(loadedTerm.description);
        setDefinition(loadedTerm.definition);

        const knownTags = loadedTerm.tags.filter((tag) =>
          officialSubjectIdSet.has(tag)
        );

        const oldUnknownTags = loadedTerm.tags.filter(
          (tag) => !officialSubjectIdSet.has(tag)
        );

        setSelectedTags(knownTags);
        setUnknownTags(oldUnknownTags);
      } catch {
        setError("Could not load term.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTerm();
  }, [mode, termId]);

  function handleTagToggle(tagId: string) {
    setSelectedTags((previous) => {
      if (previous.includes(tagId)) {
        return previous.filter((id) => id !== tagId);
      }

      return [...previous, tagId];
    });
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setDuplicateTermId(null);
    setError("");

    if (!term.trim()) {
      setError("Term is required.");
      return;
    }

    if (!definition.trim()) {
      setError("Definition is required.");
      return;
    }

    if (selectedTags.length === 0) {
      setError("Choose at least one subject/tag.");
      return;
    }

    try {
      if (mode === "new") {
        await createCmsTerm({
          term: term.trim(),
          description: description.trim(),
          definition: definition.trim(),
          tags: selectedTags,
        });
      } else {
        if (!existingTerm) {
          setError("Cannot save because the term was not loaded.");
          return;
        }

        await updateCmsTerm({
          id: existingTerm.id,
          term: term.trim(),
          description: description.trim(),
          definition: definition.trim(),
          tags: selectedTags,
        });
      }

      navigate("/cms/terms");
    } catch (error) {
  if (error instanceof ApiError && error.status === 409) {
    const errorData = error.data as {
      message?: string;
      existingTermId?: number;
    };

    setError(errorData.message ?? "This term already exists.");
    setDuplicateTermId(errorData.existingTermId ?? null);
    return;
  }

  setError("Could not save term.");
}
  }

  if (isLoading) {
    return (
      <section className="cms-page">
        <h2>Loading term...</h2>
      </section>
    );
  }

  if (mode === "edit" && error && !existingTerm) {
    return (
      <section className="cms-page">
        <h2>Term not found</h2>
        <p>{error}</p>
        <Link to="/cms/terms">Back to terms</Link>
      </section>
    );
  }

  return (
    <section className="cms-page">
      <div className="cms-header">
        <div>
          <p className="eyebrow">CMS</p>
          <h2>{mode === "new" ? "Create new term" : "Edit term"}</h2>
          <p>
            Choose one or more official subjects. These are the subjects that
            appear on the public flashcard page.
          </p>
        </div>
      </div>

      <form className="cms-form" onSubmit={handleSubmit}>
        {error && (
  <div className="form-error">
    <p>{error}</p>

    {duplicateTermId && (
      <Link to={`/cms/terms/${duplicateTermId}/edit`}>
        Edit existing term instead
      </Link>
    )}
  </div>
)}

        <label>
          Term
          <input
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            placeholder="Example: DHCP"
          />
        </label>

        <label>
          Brief description
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Optional. Leave blank if it gives away too much."
          />
        </label>

        <label>
          Definition
          <textarea
            value={definition}
            onChange={(event) => setDefinition(event.target.value)}
            rows={6}
            placeholder="Write the full explanation here."
          />
        </label>

        <div className="tag-picker">
          <div className="tag-picker-header">
            <h3>Subjects / tags</h3>
            <p>
              A term only appears publicly if it has one of these official tags.
            </p>
          </div>

          {unknownTags.length > 0 && (
            <p className="form-warning">
              This term has old/unknown tags: {unknownTags.join(", ")}. Saving
              will remove them unless they are added as official subjects.
            </p>
          )}

          <div className="tag-picker-grid">
            <div className="tag-picker-group">
              <h4>DS</h4>

              {dsSubjects.map((subject) => (
                <label key={subject.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(subject.id)}
                    onChange={() => handleTagToggle(subject.id)}
                  />
                  <span>
                    <strong>{subject.name}</strong>
                    <small>{subject.id}</small>
                  </span>
                </label>
              ))}
            </div>

            <div className="tag-picker-group">
              <h4>SN</h4>

              {snSubjects.map((subject) => (
                <label key={subject.id} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedTags.includes(subject.id)}
                    onChange={() => handleTagToggle(subject.id)}
                  />
                  <span>
                    <strong>{subject.name}</strong>
                    <small>{subject.id}</small>
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">
            {mode === "new" ? "Create term" : "Save changes"}
          </button>

          <Link to="/cms/terms">Cancel</Link>
        </div>
      </form>
    </section>
  );
}