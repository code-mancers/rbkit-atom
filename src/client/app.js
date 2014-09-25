(function() {
  var gcStatsUpdater, gcTriggerButton, heapChartsUpdater, ipc, objCountUpdater, startProfiling, startProfilingButton, stopProfiling, stopProfilingButton, triggerGC;

  ipc = require('ipc');

  objCountUpdater = function() {
    setTimeout(objCountUpdater, 1000);
    return ipc.send('asynchronous-message', 'sendObjCount');
  };

  gcStatsUpdater = function() {
    setTimeout(gcStatsUpdater, 3000);
    return ipc.send('asynchronous-message', 'sendGcStats');
  };

  heapChartsUpdater = function() {
    setTimeout(heapChartsUpdater, 1000);
    return ipc.send('asynchronous-message', 'sendHeapData');
  };

  ipc.on('heapData', function(data) {
    if (_.isEmpty(data)) {
      return;
    }
    return Rbkit.updateHeapChart(data);
  });

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

  ipc.on('gc_start', function(timestamp) {
    var dateFromTimestamp;
    dateFromTimestamp = new Date(timestamp);
    return Rbkit.gcStarted(dateFromTimestamp);
  });

  ipc.on('gc_end', function(timestamp) {
    var dateFromTimestamp;
    dateFromTimestamp = new Date(timestamp);
    return Rbkit.gcEnded(dateFromTimestamp);
  });

  objCountUpdater();

  gcStatsUpdater();

  heapChartsUpdater();

  startProfilingButton = $('#start-profiling');

  stopProfilingButton = $('#stop-profiling');

  gcTriggerButton = $('#trigger-gc');

  triggerGC = function(event) {
    event.preventDefault();
    return ipc.send('asynchronous-message', 'triggerGC');
  };

  startProfiling = function(event) {
    event.preventDefault();
    ipc.send('asynchronous-message', 'startProfiling');
    startProfilingButton.hide();
    return stopProfilingButton.show();
  };

  stopProfiling = function(event) {
    event.preventDefault();
    ipc.send('asynchronous-message', 'stopProfiling');
    startProfilingButton.show();
    return stopProfilingButton.hide();
  };

  $('#trigger-gc').click(triggerGC);

  $('#start-profiling').click(startProfiling);

  $('#stop-profiling').click(stopProfiling);

}).call(this);
