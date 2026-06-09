const target = `http://localhost:3009`;

module.exports = {
  '/auth': {
    target,
    secure: false,
    changeOrigin: true,
  },
  '/tasks': {
    target,
    secure: false,
    changeOrigin: true,
  },
};
