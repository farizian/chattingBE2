/* eslint-disable array-callback-return */
/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const { Server } = require('socket.io');
const { port } = require('./src/helper/env');
// const io = require('./src/helper/socket');
const models = require('./src/models/messagemodel');
const userrouter = require('./src/routers/userrouter');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(userrouter);

app.use(express.static(`${__dirname}/src/img`));

// membuat http server
const httpServer = http.createServer(app);
// membuat socketio
const io = new Server(httpServer, {
  cors: {
    origin: '*',
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
  console.log(`service running on port ${PORT}`);
});

module.exports = io;
    } else {
      models.delMsg(id)
        .then(() => {
          models.getmsg(sender, receiver)
            .then((result) => {
              io.to(sender).emit('history-messages', result.rows);
              io.to(receiver).emit('history-messages', result.rows);
            }).catch((err) => {
              console.log(err);
            });
        });
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
  console.log(`service running on port ${PORT}`);
});

module.exports = io;
