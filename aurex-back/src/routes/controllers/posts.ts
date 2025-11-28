import { PostsTS } from "../../interfaces/PostsTS";
import { Post, Product, OrderItem } from "../../db";
import { Op } from "sequelize";

async function createPost(post: PostsTS) {
  try {
    // Verificar que el producto existe
    const product = await Product.findByPk(post.productId);
    if (!product) {
      throw new Error("Product not found");
    }

    console.log(post);

    const newPost = await Post.create({ ...post });

    // Incluir datos del producto en la respuesta
    const postWithProduct = await Post.findByPk(newPost.dataValues.id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "ean", "totalStock", "status"],
        },
      ],
    });

    return postWithProduct;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

async function getAllPosts(filters?: {
  userId?: string;
  marketplace?: boolean;
  title?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
}) {
  try {
    let whereClause: any = {};
    let includeClause: any = [
      {
        model: Product,
        as: "product",
        attributes: ["id", "name", "sku", "ean", "totalStock", "status"],
      },
    ];

    // Filtros para marketplace (solo datos básicos)
    if (filters?.marketplace) {
      includeClause[0].attributes = ["id", "name", "sku", "status"];
    }

    // Filtros por datos de la publicación
    if (filters?.title) {
      whereClause.title = {
        [Op.iLike]: `%${filters.title}%`,
      };
    }

    if (filters?.minPrice || filters?.maxPrice) {
      whereClause.price = {};
      if (filters.minPrice) whereClause.price[Op.gte] = filters.minPrice;
      if (filters.maxPrice) whereClause.price[Op.lte] = filters.maxPrice;
    }

    // Filtros por datos del producto
    if (filters?.status) {
      includeClause[0].where = {};
      if (filters.status) includeClause[0].where.status = filters.status;
    }

    const posts = await Post.findAll({
      where: whereClause,
      include: includeClause,
      order: [["date", "DESC"]],
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

async function getPostById(postId: string) {
  try {
    const post = await Post.findByPk(postId, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "ean", "totalStock", "status"],
        },
      ],
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return post;
  } catch (error) {
    console.error("Error fetching post:", error);
    throw error;
  }
}

async function getPostsByUser(userId: string) {
  try {
    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "ean", "totalStock", "status"],
          include: [
            {
              model: OrderItem,
              as: "orderItems",
              attributes: ["id", "quantity", "price"],
            },
          ],
        },
      ],
      order: [["date", "DESC"]],
    });

    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}

async function updatePost(post: PostsTS) {
  try {
    // Verificar que el post existe
    const existingPost = await Post.findByPk(post.id);
    if (!existingPost) {
      throw new Error("Post not found");
    }

    // Si se está cambiando el producto, verificar que existe
    if (
      post.productId &&
      post.productId !== existingPost.dataValues.productId
    ) {
      const product = await Product.findByPk(post.productId);
      if (!product) {
        throw new Error("Product not found");
      }
    }

    const [updatedRows] = await Post.update(post, {
      where: { id: post.id },
    });

    if (updatedRows === 0) {
      throw new Error("No changes made");
    }

    // Retornar el post actualizado con datos del producto
    const updatedPost = await Post.findByPk(post.id, {
      include: [
        {
          model: Product,
          as: "product",
          attributes: ["id", "name", "sku", "ean", "totalStock", "status"],
        },
      ],
    });

    return updatedPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

async function deletePost(postId: string) {
  try {
    // Verificar que el post existe
    const post = await Post.findByPk(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // TODO: Verificar si existen ventas relacionadas cuando las rutas de ventas estén listas
    // Por ahora se deja en blanco como se solicitó

    const deletedRows = await Post.destroy({
      where: { id: postId },
    });

    if (deletedRows === 0) {
      throw new Error("Post not found");
    }

    return { message: "Post deleted successfully" };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export {
  createPost,
  getAllPosts,
  getPostById,
  getPostsByUser,
  updatePost,
  deletePost,
};
