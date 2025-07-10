/* eslint-disable array-callback-return */
/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const path = require('path');
const { port } = require('./src/helper/env');
const models = require('./src/models/messagemodel');
const userrouter = require('./src/routers/userrouter');

const app = express();

// Security and middleware setup
app.use(bodyParser.json());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || false 
    : '*',
  credentials: true
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use(userrouter);

// Static file serving
app.use(express.static(`${__dirname}/src/img`));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Create HTTP server
const httpServer = http.createServer(app);

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL || false 
      : '*',
    credentials: true
  },
});

let userOn = [];

io.on('connection', (socket) => {
  console.log('a client connected');
  
  socket.on('login', (room) => {
    console.log(`a user joined to room ${room}`);
    socket.join(room);
  });

  socket.on('broadcast', (id) => {
    userOn.push(id);
    socket.broadcast.emit('get-online-broadcast', userOn);
  });

  socket.on('send-message', (payload) => {
    const { receiver } = payload;
    console.log(payload);
    models.insert(payload).then(() => {
      io.to(receiver).emit('list-message', payload);
    }).catch((err) => {
      console.log(err);
    });
  });

  // menerima request send-message
  socket.on('get-message', ({ sender, receiver }) => {
    // console.log(sender);
    // console.log(receiver);
    models.getmsg(sender, receiver).then((result) => {
      io.to(sender).emit('history-messages', result.rows);
    }).catch((err) => {
      console.log(err);
    });
  });

  socket.on('deleteMessage', async (payload) => {
    const { idMsg, sender, receiver } = payload;
    try {
      const data = await models.getmsg(sender, receiver);
      const { id } = data.rows.length > 0 ? data.rows[data.rows.length - 1] : {};
      if (idMsg) {
        await models.delMsg(idMsg);
        const result = await models.getmsg(sender, receiver);
        io.to(sender).emit('history-messages', result.rows);
        io.to(receiver).emit('history-messages', result.rows);
      } else if (id) {
        await models.delMsg(id);
        const result = await models.getmsg(sender, receiver);
        io.to(sender).emit('history-messages', result.rows);
        io.to(receiver).emit('history-messages', result.rows);
      }
    } catch (err) {
      console.log('Error deleting message:', err);
    }
  });

  socket.on('offline', (id) => {
    // eslint-disable-next-line consistent-return
    const newOn = userOn.filter((e) => {
      if (e !== id) {
        console.log(e);
        return e;
      }
    });
    userOn = newOn;
    console.log(`client ${id} logout`);
    socket.emit('get-online-broadcast', userOn);
  });
});

const PORT = port || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  httpServer.close(() => {
    console.log('Process terminated');
  });
});

module.exports = io;
