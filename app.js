// Generated by CoffeeScript 1.7.1
var grapher, ipc, updater;

ipc = require('ipc');

grapher = new Graph('#chart');

updater = function() {
  setTimeout(updater, 1000);
  return ipc.send('asynchronous-message', 'sendData');
};

ipc.on('asynchronous-reply', function(data) {
  return grapher.addData(data);
});

updater();
