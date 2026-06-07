import type { Term } from "../data/terms";
import type { ReviewFlag } from "../data/reviewFlagStorage";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export type CmsMe = {
  isAuthenticated: boolean;
  username: string | null;
  authenticationType: string | null;
  teacherGroup: string;
  isTeacher: boolean;
};

export async function getCmsMe(): Promise<CmsMe> {
  return request<CmsMe>("/api/cms/me");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
        "Content-Type": "application/json",
        ...options.headers,
    },
    });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getPublicTerms(): Promise<Term[]> {
  return request<Term[]>("/api/public/terms");
}

export async function getPublicTermsByTag(tag: string): Promise<Term[]> {
  return request<Term[]>(`/api/public/terms/by-tag/${tag}`);
}

export async function getCmsTerms(): Promise<Term[]> {
  return request<Term[]>("/api/cms/terms");
}

export async function getCmsTerm(id: number): Promise<Term> {
  return request<Term>(`/api/cms/terms/${id}`);
}

export async function createCmsTerm(term: Omit<Term, "id">): Promise<Term> {
  return request<Term>("/api/cms/terms", {
    method: "POST",
    body: JSON.stringify(term),
  });
}

export async function updateCmsTerm(term: Term): Promise<Term> {
  return request<Term>(`/api/cms/terms/${term.id}`, {
    method: "PUT",
    body: JSON.stringify({
      term: term.term,
      tags: term.tags,
      description: term.description,
      definition: term.definition,
    }),
  });
}

export async function deleteCmsTerm(id: number): Promise<void> {
  return request<void>(`/api/cms/terms/${id}`, {
    method: "DELETE",
  });
}

export async function createReviewFlag(input: {
  termId: number;
  subjectId: string;
  note: string;
}): Promise<ReviewFlag> {
  return request<ReviewFlag>("/api/public/review-flags", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getCmsReviewFlags(): Promise<ReviewFlag[]> {
  return request<ReviewFlag[]>("/api/cms/review-flags");
}

export async function clearCmsReviewFlag(termId: number): Promise<void> {
  return request<void>(`/api/cms/review-flags/${termId}`, {
    method: "DELETE",
  });
}