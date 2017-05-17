 require('../services/players');
 require('../services/game');
 require('./swissChessDirectives');
 require('./swissChessController');

angular.module('swissChess').component('swissChess', {
    template: require('../views/swiss-chess.html'),
    controller: "swissChessCtrl"
  });

