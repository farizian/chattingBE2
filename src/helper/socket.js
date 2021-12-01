const io = require('../../app');

io.on('connection', (socket) => {
  console.log('a client connected');
  // menerima request send-message
  socket.on('send-message', (value) => {
    console.log(value);
    // mengirim kembali pesan dari socket.on('send-message') ke FE
    io.emit('get-message', value);
    socket.broadcast.emit('get-broadcast', value);
  });
  socket.on('send-name', (value) => {
    io.emit('get-name', value);
  });
  socket.on('login', (room) => {
    console.log(`a user joined to room ${room}`);
    socket.join(room);
  });
  socket.on('login', (room) => {
    socket.join(room);
  });
  socket.on('send-message-private', (payload) => {
    const { room, msg, name } = payload;
    console.log(room, msg, name);
    io.to(room).emit('get-message-private', { msg, name });
  });
  socket.on('disconnect', () => {
    console.log('a client disconnected');
  });
});

module.exports = io;
