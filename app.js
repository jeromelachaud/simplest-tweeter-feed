const app = require('http').createServer(handler);
const io = require('socket.io').listen(app);
const fs = require('fs');
const twitter = require('twitter');
const config = require('./config.json');

app.listen(8080);

const tweet = new twitter({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token_key: config.access_token_key,
  access_token_secret: config.access_token_secret
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html', (err, data) => {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}

tweet.stream('statuses/filter', { track: config.track }, (stream) => {
  stream.on('data', (data) => {
    io.sockets.emit('data', data.text);
    console.log(data.text);
  });
});
