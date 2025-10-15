import { useReviewsStore } from "./useReviewsStore";
import { useEffect } from "react";
import { Review } from "../../../interfaces/Review";
import axios from "axios";
import Swal from "sweetalert2";

export interface UseReviews {
  reviews: Review[];
  currentReview: Review | null;
  loading: boolean;
  createReview: (
    score: number,
    description: string,
    PostId: string
  ) => Promise<Review>;
  getReviewsByOrder: (orderId: string) => Promise<Review[]>;
  getReviewByOrderItem: (orderItemId: string) => Promise<Review | null>;
  getReviewsByPost: (
    postsId: string,
    page?: number
  ) => Promise<{ reviews: Review[]; pagination: any }>;
  deleteReview: (reviewId: string) => Promise<void>;
  clearReviews: () => void;
}

export default function useReviews(): UseReviews {
  const {
    reviews,
    currentReview,
    loading,
    setReviews,
    setCurrentReview,
    addReview,
    removeReview,
    setLoading,
    clearReviews: clearReviewsStore,
  } = useReviewsStore();

  useEffect(() => {
    console.log("Reviews:", reviews);
    console.log("Current Review:", currentReview);
  }, [reviews, currentReview]);

  // Review API functions
  const postReview = async (
    score: number,
    description: string,
    PostId: string
  ): Promise<Review> => {
    const response = await axios.post("/reviews", {
      score,
      description,
      PostId,
    });
    return response.data.review;
  };

  const getReviewsByOrderAPI = async (orderId: string): Promise<Review[]> => {
    const response = await axios.get(`/reviews/byOrder/${orderId}`);
    return response.data.reviews;
  };

  const getReviewByOrderItemAPI = async (
    orderItemId: string
  ): Promise<Review | null> => {
    const response = await axios.get(`/reviews/byOrderItem/${orderItemId}`);
    return response.data.review;
  };

  const getReviewsByPostAPI = async (
    postsId: string,
    page: number = 1
  ): Promise<{ reviews: Review[]; pagination: any }> => {
    const response = await axios.get(
      `/reviews/byPosts/${postsId}?page=${page}&limit=10`
    );
    return response.data;
  };

  const deleteReviewAPI = async (reviewId: string): Promise<void> => {
    await axios.delete(`/reviews/${reviewId}`);
  };

  // Review operations
  async function createReview(
    score: number,
    description: string,
    PostId: string
  ): Promise<Review> {
    try {
      setLoading(true);
      const newReview = await postReview(score, description, PostId);
      addReview(newReview);
      Swal.fire("Reseña Creada", "Reseña creada exitosamente", "success");
      return newReview;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al crear la reseña, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getReviewsByOrder(orderId: string): Promise<Review[]> {
    try {
      setLoading(true);
      const reviews = await getReviewsByOrderAPI(orderId);
      setReviews(reviews);
      return reviews;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener las reseñas, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getReviewByOrderItem(
    orderItemId: string
  ): Promise<Review | null> {
    try {
      setLoading(true);
      const review = await getReviewByOrderItemAPI(orderItemId);
      setCurrentReview(review);
      return review;
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener la reseña, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getReviewsByPost(
    postsId: string,
    page: number = 1
  ): Promise<{ reviews: Review[]; pagination: any }> {
    try {
      setLoading(true);
      const { reviews: newReviews, pagination } = await getReviewsByPostAPI(
        postsId,
        page
      );

      if (page === 1) {
        setReviews(newReviews);
      } else {
        setReviews([...reviews, ...newReviews]);
      }

      return { reviews: newReviews, pagination };
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al obtener las reseñas, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function deleteReview(reviewId: string): Promise<void> {
    try {
      setLoading(true);
      await deleteReviewAPI(reviewId);
      removeReview(reviewId);
      Swal.fire("Reseña Eliminada", "Reseña eliminada exitosamente", "success");
    } catch (error) {
      console.error(error);
      Swal.fire(
        "Error",
        "Error al eliminar la reseña, intenta más tarde",
        "error"
      );
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function clearReviews(): void {
    clearReviewsStore();
  }

  return {
    reviews,
    currentReview,
    loading,
    createReview,
    getReviewsByOrder,
    getReviewByOrderItem,
    getReviewsByPost,
    deleteReview,
    clearReviews,
  };
}
