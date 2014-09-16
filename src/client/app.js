(function() {
  var gcStatsUpdater, ipc, objCountUpdater;

  ipc = require('ipc');

  objCountUpdater = function() {
    setTimeout(objCountUpdater, 1000);
    return ipc.send('asynchronous-message', 'sendObjCount');
  };

  gcStatsUpdater = function() {
    setTimeout(gcStatsUpdater, 3000);
    return ipc.send('asynchronous-message', 'sendGcStats');
  };

  ipc.on('gcStats', function(data) {
    if (_.isEmpty(data)) {
      return;
    }
    return Rbkit.updateGcStats(data);
  });

  ipc.on('objCount', function(data) {
    var totalObjectCount, totalObjectCountArray;
    totalObjectCountArray = _.map(data, function(dataObject) {
      return dataObject.count;
    });
    totalObjectCount = _.reduce(totalObjectCountArray, function(memo, num) {
      return memo + num;
    }, 0);
    return Rbkit.updateLiveObjectsChart({
      'Heap Objects': totalObjectCount
    });
  });

  objCountUpdater();

  gcStatsUpdater();

}).call(this);
