'use strict';

describe('swissChessDirectives: scPlayerDetails', function() {
  var injector;
  var element;
  var scope;
  beforeEach(function() {
    injector = angular.injector(['ng','swissChess',"views/player-details.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.setupFirstRound = () => {};
      spyOn(scope, 'setupFirstRound');

      scope.players = { 
        1: { id:1, score: 4, countBack: 0, name: "ted",army:"army" }, 
        2: { id:2, score: 2, countBack: 0, name: "fred",army:"army" }, 
        3: { id:3, score: 1, countBack: 0, name: "ned",army:"army" }, 
        4: { id:4, score: 3, countBack: 0, name: "jed",army:"" } 
      };

      element = $compile('<sc-player-details players="players" setup-first-round="setupFirstRound()"></sc-player-details>')(scope);
      scope.$apply();
    });
  });

  it('has one row for each player', function() {
    let inputs = element.find('input');
    expect(inputs.length).toEqual(8);
    expect(inputs[6].id).toEqual('playerName4');
    expect(inputs[7].id).toEqual('playerArmy4');
  });
  
  it('has a Create First Round button', function() {
    let buttons = element.find('button');
    expect(buttons.length).toEqual(1);
    expect(buttons[0].innerHTML).toEqual('Create First Round');
    buttons[0].click();
    expect(scope.setupFirstRound).not.toHaveBeenCalled();
    scope.players["4"].army="army;"
    scope.$apply();
    buttons[0].click();
    expect(scope.setupFirstRound).toHaveBeenCalled();
    // var isolatedScope = element.isolateScope();
  });

});