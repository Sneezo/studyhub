export type ReviewFlag = {
  termId: number;
  term: string;
  subjectId: string;
  note: string;
  createdAt: string;
  status: "open";
};

const REVIEW_FLAGS_STORAGE_KEY = "studyhub-review-flags";

export function getStoredReviewFlags(): Record<number, ReviewFlag> {
  const savedFlags = localStorage.getItem(REVIEW_FLAGS_STORAGE_KEY);

  if (!savedFlags) {
    return {};
  }

  try {
    return JSON.parse(savedFlags) as Record<number, ReviewFlag>;
  } catch {
    return {};
  }
}

export function saveStoredReviewFlags(flags: Record<number, ReviewFlag>) {
  localStorage.setItem(REVIEW_FLAGS_STORAGE_KEY, JSON.stringify(flags));
}

export function clearStoredReviewFlag(termId: number) {
  const flags = getStoredReviewFlags();
  delete flags[termId];
  saveStoredReviewFlags(flags);
}