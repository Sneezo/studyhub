import { useCallback, useEffect, useMemo, useState } from "react";
import { subjects } from "../data/subjects";
import { terms } from "../data/terms";
import type { ClassFilter, Subject } from "../data/subjects";
import type { Term } from "../data/terms";

type ReviewFlag = {
  termId: number;
  term: string;
  subjectId: string;
  note: string;
  createdAt: string;
  status: "open";
};

const classFilters: ClassFilter[] = ["All", "SN", "DS"];

function shuffleArray<T>(array: T[]): T[] {
  return [...array].sort(() => Math.random() - 0.5);
}

export function HomePage() {
  const [selectedClass, setSelectedClass] = useState<ClassFilter>("All");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("network");
  const [shuffledTermIds, setShuffledTermIds] = useState<number[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const [reviewFlags, setReviewFlags] = useState<Record<number, ReviewFlag>>(() => {
  const savedFlags = localStorage.getItem("studyhub-review-flags");

  if (!savedFlags) {
    return {};
  }

  try {
    return JSON.parse(savedFlags) as Record<number, ReviewFlag>;
  } catch {
    return {};
  }
});

const [isReviewPanelOpen, setIsReviewPanelOpen] = useState(false);
const [reviewNote, setReviewNote] = useState("");

  const visibleSubjects = useMemo(() => {
    if (selectedClass === "All") {
      return subjects;
    }

    return subjects.filter((subject) =>
      subject.classes.includes(selectedClass)
    );
  }, [selectedClass]);

  const selectedSubject: Subject | undefined =
    visibleSubjects.find((subject) => subject.id === selectedSubjectId) ??
    visibleSubjects[0];

  const visibleTerms = useMemo(() => {
    if (!selectedSubject) {
      return [];
    }

    return terms.filter((term) => term.tags.includes(selectedSubject.id));
  }, [selectedSubject]);

  const defaultTermIds = useMemo(() => {
    return visibleTerms.map((term) => term.id);
  }, [visibleTerms]);

  const termOrder = useMemo(() => {
    if (!shuffledTermIds) {
      return defaultTermIds;
    }

    const allowedIds = new Set(defaultTermIds);
    const validShuffledIds = shuffledTermIds.filter((id) =>
      allowedIds.has(id)
    );

    if (validShuffledIds.length !== defaultTermIds.length) {
      return defaultTermIds;
    }

    return validShuffledIds;
  }, [defaultTermIds, shuffledTermIds]);

  const safeCurrentIndex =
    termOrder.length === 0
      ? 0
      : Math.min(currentIndex, termOrder.length - 1);

  const currentTermId = termOrder[safeCurrentIndex];

  const currentTerm: Term | undefined = visibleTerms.find(
    (term) => term.id === currentTermId
  );

  const progressPercent =
    visibleTerms.length > 0
      ? ((safeCurrentIndex + 1) / visibleTerms.length) * 100
      : 0;

  const handleNext = useCallback(() => {
    if (termOrder.length === 0) {
      return;
    }

    setCurrentIndex((previous) => {
      if (previous >= termOrder.length - 1) {
        return 0;
      }

      return previous + 1;
    });

    setShowAnswer(false);
  }, [termOrder.length]);

  useEffect(() => {
  localStorage.setItem("studyhub-review-flags", JSON.stringify(reviewFlags));
}, [reviewFlags]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();

      if (
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select"
      ) {
        return;
      }

      if (event.key === " " || event.key.toLowerCase() === "s") {
        event.preventDefault();
        setShowAnswer((previous) => !previous);
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        handleNext();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNext]);

  function handleClassChange(classFilter: ClassFilter) {
    setSelectedClass(classFilter);

    const firstSubjectForClass =
      classFilter === "All"
        ? subjects[0]
        : subjects.find((subject) => subject.classes.includes(classFilter));

    if (firstSubjectForClass) {
      setSelectedSubjectId(firstSubjectForClass.id);
    }

    setCurrentIndex(0);
    setShowAnswer(false);
    setShuffledTermIds(null);
  }

  function handleSubjectChange(subjectId: string) {
    setSelectedSubjectId(subjectId);
    setCurrentIndex(0);
    setShowAnswer(false);
    setShuffledTermIds(null);
  }

  function handleTermSelect(termId: number) {
    const newIndex = termOrder.findIndex((id) => id === termId);

    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
      setShowAnswer(false);
    }
  }

  function handleShuffle() {
    setShuffledTermIds(shuffleArray(defaultTermIds));
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  function handleReset() {
    setShuffledTermIds(null);
    setCurrentIndex(0);
    setShowAnswer(false);
  }

  const currentReviewFlag = currentTerm
  ? reviewFlags[currentTerm.id]
  : undefined;

const openReviewFlagCount = Object.keys(reviewFlags).length;

function handleOpenReviewPanel() {
  if (!currentTerm) {
    return;
  }

  setReviewNote(currentReviewFlag?.note ?? "");
  setIsReviewPanelOpen(true);
}

function handleSubmitReviewFlag() {
  if (!currentTerm || !selectedSubject) {
    return;
  }

  const trimmedNote = reviewNote.trim();

  if (!trimmedNote) {
    return;
  }

  const newFlag: ReviewFlag = {
    termId: currentTerm.id,
    term: currentTerm.term,
    subjectId: selectedSubject.id,
    note: trimmedNote,
    createdAt: new Date().toISOString(),
    status: "open",
  };

  setReviewFlags((previous) => ({
    ...previous,
    [currentTerm.id]: newFlag,
  }));

  setIsReviewPanelOpen(false);
  setReviewNote("");
}

function handleClearReviewFlag() {
  if (!currentTerm) {
    return;
  }

  setReviewFlags((previous) => {
    const updated = { ...previous };
    delete updated[currentTerm.id];
    return updated;
  });

  setIsReviewPanelOpen(false);
  setReviewNote("");
}

  return (
    <div className="home-page">
      <aside className="subject-panel">
        <div className="class-filter">
          <h2>Class</h2>

          <div className="class-filter-buttons">
            {classFilters.map((filter) => (
              <button
                key={filter}
                type="button"
                className={selectedClass === filter ? "active" : ""}
                onClick={() => handleClassChange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="subject-list">
          <h2>Subjects</h2>

          {visibleSubjects.map((subject) => (
            <button
              key={subject.id}
              type="button"
              className={selectedSubject?.id === subject.id ? "active" : ""}
              onClick={() => handleSubjectChange(subject.id)}
            >
              {subject.name}
            </button>
          ))}
        </div>
      </aside>

      <section className="flashcard-page">
        {selectedSubject && currentTerm ? (
          <>
            <div className="flashcard-toolbar">
              <div>
                <p className="eyebrow">{selectedClass} subjects</p>
                <h2>{selectedSubject.name} Flashcards</h2>
                {openReviewFlagCount > 0 && (
                <p className="review-count">
                    {openReviewFlagCount} term{openReviewFlagCount === 1 ? "" : "s"} flagged for review
                </p>
                )}
              </div>

              <div className="flashcard-controls">
                <select
                  value={currentTerm.id}
                  onChange={(event) =>
                    handleTermSelect(Number(event.target.value))
                  }
                >
                  {termOrder.map((termId, index) => {
                    const term = visibleTerms.find((item) => item.id === termId);

                    if (!term) {
                      return null;
                    }

                    return (
                      <option key={term.id} value={term.id}>
                        {index + 1}. {term.term}
                      </option>
                    );
                  })}
                </select>

                <button type="button" onClick={() => setShowAnswer(true)}>
                  Show answer
                </button>

                <button
                    type="button"
                    className={currentReviewFlag ? "review-active" : ""}
                    onClick={handleOpenReviewPanel}
                    >
                    {currentReviewFlag ? "Flagged" : "Flag for review"}
                </button>

                <button type="button" onClick={handleNext}>
                  Next
                </button>

                <button type="button" onClick={handleShuffle}>
                  Shuffle
                </button>

                <button type="button" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>

            <div className="flashcard-progress-row">
              <div className="flashcard-progress">
                <div
                  className="flashcard-progress-fill"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span>
                {safeCurrentIndex + 1} / {visibleTerms.length} seen
              </span>
            </div>

            <article className="study-card">
              <div className="study-card-inner">
                <h3>{currentTerm.term}</h3>
                {currentReviewFlag && (
                    <p className="review-badge">Flagged for review</p>
                )}

                <p className="term-description">{currentTerm.description}</p>

                {!showAnswer ? (
                  <p className="answer-hint">
                    Press <kbd>S</kbd> or Space to show the answer
                  </p>
                ) : (
                  <div className="answer-section">
                    <h4>Definition</h4>
                    <p>{currentTerm.definition}</p>

                    <div className="tag-list">
                      {currentTerm.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
            {isReviewPanelOpen && currentTerm && (
                <section className="review-panel">
                    <div className="review-panel-header">
                    <div>
                        <p className="eyebrow">Review feedback</p>
                        <h3>{currentTerm.term}</h3>
                    </div>

                    <button type="button" onClick={() => setIsReviewPanelOpen(false)}>
                        Close
                    </button>
                    </div>

                    <label htmlFor="review-note">
                    What should be improved?
                    </label>

                    <textarea
                    id="review-note"
                    value={reviewNote}
                    onChange={(event) => setReviewNote(event.target.value)}
                    placeholder="Example: The definition is too vague, missing an example, or uses a confusing explanation."
                    rows={4}
                    />

                    <div className="review-actions">
                    <button type="button" onClick={handleSubmitReviewFlag}>
                        Submit review flag
                    </button>

                    {currentReviewFlag && (
                        <button type="button" onClick={handleClearReviewFlag}>
                        Clear flag
                        </button>
                    )}
                    </div>

                    {currentReviewFlag && (
                    <p className="existing-review-note">
                        Current note: {currentReviewFlag.note}
                    </p>
                    )}
                </section>
                )}

            <div className="flashcard-footer">
              <span>
                Card {safeCurrentIndex + 1} of {visibleTerms.length}
              </span>

              <span>
                Shortcuts: <kbd>S</kbd> show | <kbd>→</kbd> next
              </span>
            </div>
          </>
        ) : (
          <p>No flashcards found for this subject.</p>
        )}
      </section>
    </div>
  );
}