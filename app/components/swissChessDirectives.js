
  angular.module('swissChess').directive("scTabs", function(){
    return {
      type: "E",
      template: require('../views/tabs.html')
    };
  });

  angular.module('swissChess').directive("scAbout", function(){
    return {
      type: "E",
      template: require('../views/about.html')
    };
  });

  angular.module('swissChess').directive("scMenu", function() {
    return {
      type: "E",
      template: require('../views/menu.html')
    };
  });

  angular.module('swissChess').directive("scSetup", function() {    
    return {
      type: "E",
      scope: {
          runSetup: "&setup",
          game:"="
      },
      template: require('../views/setup.html')
    };
  });

  angular.module('swissChess').directive("scPlayerDetails", function() {  
    return {
      type: "E",
      scope: {
        players:"=",
        playerOrder:"=",
        setupFirstRound: "&"
      },
      template: require('../views/player-details.html')
    };
  });

  angular.module('swissChess').directive("scRound", function() {
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
      template: require('../views/round.html')
    };
  });

  angular.module('swissChess').directive("scResults", function() {
    return {
      type: "E",
      scope: {
        players: "=",
        finalOrder: "="
      },
      template: require('../views/results.html')
    };
  });