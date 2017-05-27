require('../services/players');
require('../services/roundRobin');
require('../services/swissChess');
require('../services/game');
require('./compRunnerDirectives');
require('./compRunnerController');

angular.module('compRunner').component('compRunner', {
  template: require('../views/comp-runner.html'),
  controller: "compRunnerCtrl"
});

