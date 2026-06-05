import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getNextTermId,
  getStoredTerm,
  upsertStoredTerm,
} from "../data/termStorage";
import type { Term } from "../data/terms";

type CmsTermFormPageProps = {
  mode: "new" | "edit";
};

export function CmsTermFormPage({ mode }: CmsTermFormPageProps) {
  const navigate = useNavigate();
  const params = useParams();

  const termId = Number(params.id);
  const existingTerm = mode === "edit" ? getStoredTerm(termId) : undefined;

  const [term, setTerm] = useState(existingTerm?.term ?? "");
  const [description, setDescription] = useState(
    existingTerm?.description ?? ""
  );
  const [definition, setDefinition] = useState(existingTerm?.definition ?? "");
  const [tagsText, setTagsText] = useState(
    existingTerm?.tags.join(", ") ?? ""
  );
  const [error, setError] = useState("");

  if (mode === "edit" && !existingTerm) {
    return (
      <section className="cms-page">
        <h2>Term not found</h2>
        <p>The term you tried to edit does not exist.</p>
        <Link to="/cms/terms">Back to terms</Link>
      </section>
    );
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    const parsedTags = tagsText
      .split(",")
      .map((tag) => tag.trim().toLowerCase())
      .filter(Boolean);

    if (!term.trim()) {
      setError("Term is required.");
      return;
    }

    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    if (!definition.trim()) {
      setError("Definition is required.");
      return;
    }

    if (parsedTags.length === 0) {
      setError("At least one tag is required.");
      return;
    }

    const savedTerm: Term = {
      id: existingTerm?.id ?? getNextTermId(),
      term: term.trim(),
      description: description.trim(),
      definition: definition.trim(),
      tags: parsedTags,
    };

    upsertStoredTerm(savedTerm);
    navigate("/cms/terms");
  }

  return (
    <section className="cms-page">
      <div className="cms-header">
        <div>
          <p className="eyebrow">CMS</p>
          <h2>{mode === "new" ? "Create new term" : "Edit term"}</h2>
          <p>
            Tags connect the term to subjects, for example network, linux or
            security.
          </p>
        </div>
      </div>

      <form className="cms-form" onSubmit={handleSubmit}>
        {error && <p className="form-error">{error}</p>}

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
            placeholder="Example: Automatically gives devices IP configuration."
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

        <label>
          Tags
          <input
            value={tagsText}
            onChange={(event) => setTagsText(event.target.value)}
            placeholder="network, windows-server"
          />
        </label>

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