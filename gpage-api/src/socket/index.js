module.exports = (io, app) => {
  io.on('connection', socket => {
    socket.on('online', id => {
      socket.join(id);
      socket.emit('test', { id });
    });
  });
};
