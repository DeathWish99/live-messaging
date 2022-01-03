const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const server = app.listen(3000, () => {
    console.log("server is running on port", server.address().port);
});
const io = require('socket.io')(server);

let dbUrl = 'mongodb://localhost:27017/chatdb'
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

io.on('connection', () => {
    console.log('user connected');
});
mongoose.connect(dbUrl, (e) => {
    console.log('mongodb connected', e);
});


let Message = mongoose.model('Message', {name : String, message: String});

app.get('/getMessages', (req, res) => {
    Message.find({}, (err, message) => {
        res.send(message);
    });
});

app.post('/sendMessages', (req, res) => {
    console.log(req.body);
    var message = new Message(req.body);
    message.save((err) =>{
      if(err)
        sendStatus(500);
      io.emit('message', req.body);
      res.sendStatus(200);
    })
  })