const Post = require('../database/Models/PostModel');
const User = require('../database/Models/User');
const Comment = require('../database/Models/Comment');


const postController = {
  // Criar uma nova postagem
  async createPost(req, res) {
    try {
      const { title, content } = req.body;
      const authorId = req.user.id; // ID do usuário logado

      if (!title || !content) {
        return res.status(400).json({ error: "Título e conteúdo são obrigatórios!" });
      }

      // Cria a nova postagem no banco de dados
      const newPost = await Post.create({ title, content, authorId });

      // Busca o autor do post
      const postWithAuthor = await Post.findOne({
        where: { id: newPost.id },
        include: [{ model: User, as: "author", attributes: ["name"] }],
      });

      res.status(201).json({
        id: postWithAuthor.id,
        title: postWithAuthor.title,
        content: postWithAuthor.content,
        author: postWithAuthor.author.name,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar a postagem." });
    }
  },





  async getAllPosts(req, res) {
    try {
      const posts = await Post.findAll({
        include: [{ model: User, as: "author", attributes: ["name"] }], // Inclui o modelo User com o alias "author"
        order: [["id", "desc"]], // Ordena por ID decrescente
      });

      res.render("home", { user: req.user, posts }); // Envia os dados para o template
    } catch (error) {
      console.error(error);
      res.status(500).render("home", { user: req.user, posts: [] }); // Renderiza mesmo em caso de erro
    }
  },





  async addComment(req, res) {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Você precisa estar logado para comentar." });
      }

      const { postId, content } = req.body;
      const commenterId = req.user.id;

      if (!content) {
        return res.status(400).json({ error: "O comentário não pode estar vazio." });
      }

      // Cria o comentário no banco
      await Comment.create({ postId, commenterId, content });

      res.status(201).json({ message: "Comentário adicionado com sucesso!" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao adicionar o comentário." });
    }
  },



  // Obter uma única postagem pelo ID
  async getPostById(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: 'Postagem não encontrada.' });
      }
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao obter a postagem.' });
    }
  },

  // Atualizar uma postagem pelo ID
  async updatePost(req, res) {
    try {
      const { id } = req.params;
      const { title, content, author } = req.body;
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: 'Postagem não encontrada.' });
      }
      await post.update({ title, content, author });
      return res.status(200).json(post);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar a postagem.' });
    }
  },

  // Excluir uma postagem pelo ID
  async deletePost(req, res) {
    try {
      const { id } = req.params;
      const post = await Post.findByPk(id);
      if (!post) {
        return res.status(404).json({ error: 'Postagem não encontrada.' });
      }
      await post.destroy();
      return res.status(200).json({ message: 'Postagem excluída com sucesso.' });
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao excluir a postagem.' });
    }
  },
};

module.exports = postController;
