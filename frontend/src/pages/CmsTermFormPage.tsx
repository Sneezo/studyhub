import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  createCmsTerm,
  getCmsTerm,
  updateCmsTerm,
} from "../api/studyHubApi";
import type { Term } from "../data/terms";

type CmsTermFormPageProps = {
  mode: "new" | "edit";
};

export function CmsTermFormPage({ mode }: CmsTermFormPageProps) {
  const navigate = useNavigate();
  const params = useParams();

  const termId = Number(params.id);

  const [existingTerm, setExistingTerm] = useState<Term | null>(null);
  const [isLoading, setIsLoading] = useState(mode === "edit");

  const [term, setTerm] = useState("");
  const [description, setDescription] = useState("");
  const [definition, setDefinition] = useState("");
  const [tagsText, setTagsText] = useState("");
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
        setTagsText(loadedTerm.tags.join(", "));
      } catch {
        setError("Could not load term.");
      } finally {
        setIsLoading(false);
      }
    }

    loadTerm();
  }, [mode, termId]);

  async function handleSubmit(event: FormEvent) {
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

    try {
      if (mode === "new") {
        await createCmsTerm({
          term: term.trim(),
          description: description.trim(),
          definition: definition.trim(),
          tags: parsedTags,
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
          tags: parsedTags,
        });
      }

      navigate("/cms/terms");
    } catch {
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