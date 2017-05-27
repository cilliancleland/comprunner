
  angular.module('compRunner').directive("scTabs", function(){
    return {
      type: "E",
      template: require('../views/tabs.html')
    };
  });

  angular.module('compRunner').directive("scAbout", function(){
    return {
      type: "E",
      template: require('../views/about.html')
    };
  });

  angular.module('compRunner').directive("scMenu", function() {
    return {
      type: "E",
      template: require('../views/menu.html')
    };
  });

  angular.module('compRunner').directive("scSetup", function() {    
    return {
      type: "E",
      scope: {
          runSetup: "&setup",
          game:"="
      },
      template: require('../views/setup.html')
    };
  });

  angular.module('compRunner').directive("scPlayerDetails", function() {  
    return {
      type: "E",
      scope: {
        players:"=",
        currentRoundNumber:"=",
        setupFirstRound: "&"
      },
      template: require('../views/player-details.html')
    };
  });

  angular.module('compRunner').directive("scRound", function() {
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

  angular.module('compRunner').directive("scResults", function() {
    return {
      type: "E",
      scope: {
        players: "=",
        finalOrder: "="
      },
      template: require('../views/results.html')
    };
  });