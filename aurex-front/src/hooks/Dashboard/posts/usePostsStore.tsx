import { create } from "zustand";
import { Post } from "../../../interfaces/Posts";

interface PostsState {
  data: Post[];
  loading: boolean;
  setPosts: (posts: Post[]) => void;
  addPost: (post: Post) => void;
  updatePost: (post: Post) => void;
  removePost: (postId: string) => void;
  setLoading: (loading: boolean) => void;
}

export const usePostsStore = create<PostsState>((set) => ({
  data: [],
  loading: false,
  setPosts: (posts) => set({ data: posts }),
  addPost: (post) =>
    set((state) => ({
      data: [...state.data, post],
    })),
  updatePost: (post) =>
    set((state) => ({
      data: state.data.map((p) => (p.id === post.id ? post : p)),
    })),
  removePost: (postId) =>
    set((state) => ({
      data: state.data.filter((p) => p.id !== postId),
    })),
  setLoading: (loading) => set({ loading }),
}));
