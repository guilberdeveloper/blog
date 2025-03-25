const express = require('express');
const postController = require('../controllers/postController'); 
const router = express.Router();

// Criar uma nova postagem
router.post('/posts', postController.createPost);

// Obter todas as postagens
router.get('/posts', postController.getAllPosts);

// Obter uma única postagem pelo ID
router.get('/posts/:id', postController.getPostById);

// Atualizar uma postagem pelo ID
router.put('/posts/:id', postController.updatePost);

// Excluir uma postagem pelo ID
router.delete('/posts/:id', postController.deletePost);

module.exports = router;
