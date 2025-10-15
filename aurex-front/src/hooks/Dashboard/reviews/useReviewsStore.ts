import { create } from "zustand";
import { Review } from "../../../interfaces/Review";

interface ReviewsState {
  reviews: Review[];
  currentReview: Review | null;
  loading: boolean;
  setReviews: (reviews: Review[]) => void;
  setCurrentReview: (review: Review | null) => void;
  addReview: (review: Review) => void;
  updateReview: (review: Review) => void;
  removeReview: (reviewId: string) => void;
  setLoading: (loading: boolean) => void;
  clearReviews: () => void;
}

export const useReviewsStore = create<ReviewsState>((set) => ({
  reviews: [],
  currentReview: null,
  loading: false,
  setReviews: (reviews) => set({ reviews }),
  setCurrentReview: (review) => set({ currentReview: review }),
  addReview: (review) =>
    set((state) => ({
      reviews: [...state.reviews, review],
    })),
  updateReview: (review) =>
    set((state) => ({
      reviews: state.reviews.map((r) => (r.id === review.id ? review : r)),
    })),
  removeReview: (reviewId) =>
    set((state) => ({
      reviews: state.reviews.filter((r) => r.id !== reviewId),
    })),
  setLoading: (loading) => set({ loading }),
  clearReviews: () => set({ reviews: [], currentReview: null }),
}));
