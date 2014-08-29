// Generated by CoffeeScript 1.7.1
var msgpack, zmq;

zmq = require('zmq');

msgpack = require('msgpack');

aggregator(function() {
  var db, sqlite, subSocket;
  subSocket = zmq.socket('sub');
  sqlite = require('sqlite3');
  db = new sqlite.Database('object_events.db');
  db.serialize(function() {
    db.run('create table obj_created (timestamp TEXT, classname TEXT, objectId TEXT)');
    return db.run('create table obj_destroyed (timestamp TEXT, objectId TEXT)');
  });
  subSocket.connect('tcp://127.0.0.1:5555');
  subSocket.subscribe('');
  return subSocket.on('message', function(data) {
    var unpackedData;
    unpackedData = msgpack.unpack(data);
    return db.serialize(function() {
      switch (unpackedData.event_type) {
        case 'obj_created':
          return db.run("insert into obj_created values ( " + unpackedData.timestamp + ", " + unpackedData.payload["class"] + ", " + unpackedData.payload.object_id + " )");
        case 'obj_destroyed':
          return db.run("insert into obj_destroyed values ( " + unpackedData.timestamp + ", " + unpackedData.payload.object_id + " )");
      }
    });
  });
});

module.exports = aggregator;