(function(){
  "use strict";
  swissChess.directive("scTabs", function(){
    return {
      type: "E",
      templateUrl: "views/tabs.html"
    };
  });

  swissChess.directive("scMenu", function() {
    return {
      type: "E",
      templateUrl: "views/menu.html"
    };
  });

  swissChess.directive("scSetup", function() {    
    return {
      type: "E",
      scope: {
          runSetup: "&setup",
          game:"="
      },
      templateUrl:"views/setup.html"
    };
  });

  swissChess.directive("scPlayerDetails", function() {  
    return {
      type: "E",
      scope: {
        players:"=",
        setupFirstRound: "&",
        isStarted: "@"
      },
      templateUrl:"views/player-details.html"
    };
  });

  swissChess.directive("scRound", function() {
    return {
      type: "E",
      scope: {
        players:"=",
        round:"=",
        completeRound: "&",
        isCurrentRound: "@"
      },
      link: function(scope, element, attr) {
        scope.submit = function(){
          scope.roundForm.$setPristine();
          scope.roundForm.$setUntouched();
          scope.completeRound();
        }

      },
      templateUrl: "views/round.html"
    };
  });

  swissChess.directive("scResults", function() {
    return {
      type: "E",
      scope: {
        players: "=",
        finalOrder: "="
      },
      templateUrl: "views/results.html"
    };
  });
})();