import { usePostsStore } from "./usePostsStore";
import { Post } from "../../../interfaces/Posts";
import axios from "axios";
import Swal from "sweetalert2";

export interface UsePosts {
  data: Post[];
  loading: boolean;
  create: (post: Post, files?: File[]) => Promise<Post>;
  get: () => Promise<void>;
  getById: (postId: string) => Promise<Post>;
  getByUser: (userId: string) => Promise<void>;
  update: (post: Post) => Promise<void>;
  remove: (postId: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export default function usePosts(): UsePosts {
  const { data, loading, setPosts, addPost, updatePost, removePost, setLoading } = usePostsStore();

  // Post API functions
  const postPost = async (post: Post, files?: File[]): Promise<Post> => {
    console.log(2);
    const formData = new FormData();

    // Append post data as JSON string
    formData.append('data', JSON.stringify(post));

    // Append image files if any
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await axios.post("/posts", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  };

  const getPosts = async (): Promise<Post[]> => {
    const response = await axios.get("/posts");
    return response.data;
  };

  const getPostById = async (postId: string): Promise<Post> => {
    const response = await axios.get(`/posts/${postId}`);
    return response.data;
  };

  const getPostsByUser = async (userId: string): Promise<Post[]> => {
    const response = await axios.get(`/posts/user/${userId}`);
    return response.data;
  };

  const updatePostAPI = async (post: Post): Promise<Post> => {
    await axios.patch(`/posts/${post.id}`, post);
    return post;
  };

  const deletePostAPI = async (postId: string): Promise<void> => {
    await axios.delete(`/posts/${postId}`);
  };

  // Post operations
  async function createPost(post: Post, files?: File[]): Promise<Post> {
    try {
      setLoading(true);
      const newPost = await postPost(post, files);
      addPost(newPost);
      Swal.fire("Created", "Successfully created post", "success");
      return newPost;
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to create the post, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getAllPosts(): Promise<void> {
    try {
      setLoading(true);
      const posts = await getPosts();
      setPosts(posts);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get the posts, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getPostsByUserId(userId: string): Promise<void> {
    try {
      setLoading(true);
      const posts = await getPostsByUser(userId);
      setPosts(posts);
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to get user posts, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function updatePostById(post: Post): Promise<void> {
    try {
      setLoading(true);
      await updatePostAPI(post);
      updatePost(post);
      Swal.fire("Updated", "Successfully updated post", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to update the post, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function removePostById(postId: string): Promise<void> {
    try {
      setLoading(true);
      await deletePostAPI(postId);
      removePost(postId);
      Swal.fire("Deleted", "Successfully deleted post", "success");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Error to delete the post, try later", "error");
      throw error;
    } finally {
      setLoading(false);
    }
  }

  async function getPostByIdWrapper(postId: string): Promise<Post> {
    try {
      setLoading(true);
      const post = await getPostById(postId);
      return post;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  return {
    data,
    loading,
    create: createPost,
    get: getAllPosts,
    getById: getPostByIdWrapper,
    getByUser: getPostsByUserId,
    update: updatePostById,
    remove: removePostById,
    setLoading,
  };
}
