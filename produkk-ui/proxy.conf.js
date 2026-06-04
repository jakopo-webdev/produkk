const host = (process.env.NODE_ENV && process.env.NODE_ENV.startsWith('prod')) ? 'api' : 'localhost';
const target = `http://${host}:3009`;

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
