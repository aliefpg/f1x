let articles = [
    { id: 'article-1', title: 'Article 1', author: 'Author 1', content: 'Content of article 1' },
    { id: 'article-2', title: 'Article 2', author: 'Author 2', content: 'Content of article 2' }
  ];
  
  let users = [
      { username: 'admin', password: 'admin123', isAdmin: true } // Admin user
      // Add other users here if needed
  ];
  
  const login = (currentUser) => async (request, h) => {
      const { username, password } = request.payload;
      const user = users.find(u => u.username === username && u.password === password);
  
      if (!user) {
          return h.response({ error: 'Invalid username or password' }).code(401);
      }
  
      currentUser.value = user; // Update currentUser reference
      return h.response({ message: 'Login successful', user: currentUser.value }).code(200);
  };
  
  const getAllArticles = (request, h) => {
      return h.response(articles).code(200);
  };
  
  const getArticleById = (request, h) => {
      const { id } = request.params;
      const article = articles.find(a => a.id === id);
      if (!article) {
          return h.response({ error: 'Article not found' }).code(404);
      }
      return h.response(article).code(200);
  };
  
  const addArticle = (currentUser) => (request, h) => {
      if (currentUser.value && currentUser.value.isAdmin) {
          const { title, author, content } = request.payload;
          const id = `article-${articles.length + 1}`; // Generate ID
          const newArticle = { id, title, author, content };
          articles.push(newArticle);
          return h.response(newArticle).code(201);
      } else {
          return h.response({ error: 'Unauthorized' }).code(403);
      }
  };
  
  const updateArticle = (currentUser) => (request, h) => {
      if (currentUser.value && currentUser.value.isAdmin) {
          const { id } = request.params;
          const { title, author, content } = request.payload;
          const index = articles.findIndex(a => a.id === id);
          if (index === -1) {
              return h.response({ error: 'Article not found' }).code(404);
          }
          const updatedArticle = { id, title, author, content };
          articles[index] = updatedArticle;
          return h.response(updatedArticle).code(200);
      } else {
          return h.response({ error: 'Unauthorized' }).code(403);
      }
  };
  
  const deleteArticle = (currentUser) => (request, h) => {
      if (currentUser.value && currentUser.value.isAdmin) {
          const { id } = request.params;
          const index = articles.findIndex(a => a.id === id);
          if (index === -1) {
              return h.response({ error: 'Article not found' }).code(404);
          }
          articles.splice(index, 1);
          return h.response({ message: 'Article deleted' }).code(200);
      } else {
          return h.response({ error: 'Unauthorized' }).code(403);
      }
  };
  
  module.exports = {
      login,
      getAllArticles,
      getArticleById,
      addArticle,
      updateArticle,
      deleteArticle
  };