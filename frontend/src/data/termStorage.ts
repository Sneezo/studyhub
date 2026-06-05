import { terms as defaultTerms } from "./terms";
import type { Term } from "./terms";

const TERMS_STORAGE_KEY = "studyhub-terms";

export function getStoredTerms(): Term[] {
  const savedTerms = localStorage.getItem(TERMS_STORAGE_KEY);

  if (!savedTerms) {
    return defaultTerms;
  }

  try {
    return JSON.parse(savedTerms) as Term[];
  } catch {
    return defaultTerms;
  }
}

export function saveStoredTerms(terms: Term[]) {
  localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(terms));
}

export function getStoredTerm(termId: number): Term | undefined {
  return getStoredTerms().find((term) => term.id === termId);
}

export function getNextTermId(): number {
  const terms = getStoredTerms();

  if (terms.length === 0) {
    return 1;
  }

  return Math.max(...terms.map((term) => term.id)) + 1;
}

export function upsertStoredTerm(updatedTerm: Term) {
  const terms = getStoredTerms();
  const existingIndex = terms.findIndex((term) => term.id === updatedTerm.id);

  if (existingIndex === -1) {
    saveStoredTerms([...terms, updatedTerm]);
    return;
  }

  const updatedTerms = [...terms];
  updatedTerms[existingIndex] = updatedTerm;
  saveStoredTerms(updatedTerms);
}

export function deleteStoredTerm(termId: number) {
  const terms = getStoredTerms().filter((term) => term.id !== termId);
  saveStoredTerms(terms);
}