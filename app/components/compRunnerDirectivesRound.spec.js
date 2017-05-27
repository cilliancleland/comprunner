'use strict';

describe('compRunnerDirectives: scRound', function() {
  let injector;
  let element;
  let scope;
  beforeEach(function() {
    injector = angular.injector(['ng','compRunner',"app/views/round.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.round = {
        "roundNumber":2,
        "games":{
          "1":{"gameNumber":1,"player1":"2","player2":"4","result":""},
          "2":{"gameNumber":2,"player1":"3","player2":"1","result":""},
          "3":{"gameNumber":3,"player1":"5","player2":"5","result":"bye"}
        }
      };
      scope.players = { 
        1: { id:1, score: 4, countBack: 0, name: "ted",army:"army" }, 
        2: { id:2, score: 2, countBack: 0, name: "fred",army:"army" }, 
        3: { id:3, score: 1, countBack: 0, name: "ned",army:"army" }, 
        4: { id:4, score: 3, countBack: 0, name: "jed",army:"army" } , 
        5: { id:5, score: 3, countBack: 0, name: "head",army:"army" } 
      };
      element = $compile('<sc-round players="players" round="round" is-current-round="true"></sc-round>')(scope);
      scope.$apply();
    });
  });

  it('has one row for each game', function() {
    const labels = element.find('label');
    expect(labels.length).toEqual(3);
    expect(labels[0].innerText.replace(/\s+/g, '') ).toEqual('Game1fred(army)vsjed(army)');
    expect(labels[1].innerText.replace(/\s+/g, '')).toEqual('Game2ned(army)vsted(army)');
    expect(labels[2].innerText.replace(/\s+/g, '')).toEqual('Byeforhead');
  });

  it('shows selects & button if current round', function() {
    const selects = element.find('select');
    expect(selects.length).toEqual(2);
    expect(selects[0].options[0].value).toEqual('');
    expect(selects[0].options[1].value).toEqual('Player 1 win');
    expect(selects[0].options[2].value).toEqual('Player 2 win');
    expect(selects[0].options[3].value).toEqual('Draw');
    const buttons = element.find('button');
    expect(buttons.length).toEqual(1);
    expect(buttons[0].innerHTML).toEqual('Complete round');
  });

  it('shows text &  no button if not current round', function() {
    const isolatedScope = element.isolateScope();
    isolatedScope.isCurrentRound="false"
    scope.$apply();
    const buttons = element.find('button');
    expect(buttons.length).toEqual(0);
    const selects = element.find('select');
    expect(selects.length).toEqual(0);
  });

  it('button is disabled when form is incomplete', function() {
    const buttons = element.find('button');
    const isolatedScope = element.isolateScope();
    spyOn(isolatedScope, 'completeRound');
    expect(isolatedScope.completeRound).not.toHaveBeenCalled();
    buttons[0].click();
    expect(isolatedScope.completeRound).not.toHaveBeenCalled();
  });

  it('calls complete round when button clicked', function() {
    const buttons = element.find('button');
    const isolatedScope = element.isolateScope();
    spyOn(isolatedScope, 'completeRound');
    scope.round.games["1"].result = "Draw";
    scope.round.games["2"].result = "Draw";
    scope.$apply();
    expect(isolatedScope.completeRound).not.toHaveBeenCalled();
    buttons[0].click();
    expect(isolatedScope.completeRound).toHaveBeenCalled();
  });
});
