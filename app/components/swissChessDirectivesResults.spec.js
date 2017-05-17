'use strict';

describe('swissChessDirectives: scResults', function() {
  let injector;
  let element;
  let scope;
  beforeEach(function() {
    injector = angular.injector(['ng','swissChess',"app/views/results.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.players = { 
        1: { id:1, score: 4, countBack: 4, name: "ted",army:"army" }, 
        2: { id:2, score: 2, countBack: 3, name: "fred",army:"army" }, 
        3: { id:3, score: 1, countBack: 2, name: "ned",army:"army" }, 
        4: { id:4, score: 3, countBack: 1, name: "jed",army:"army" }
      };
      scope.finalOrder = ["1","2","3","4"];
      element = $compile('<sc-results players="players" final-order="finalOrder"></sc-results>')(scope);
      scope.$apply();
    });
  });

  it('has one row for each player', function() {
    const trs = element.find('tr');
    expect(trs.length).toEqual(5);
    expect(trs[0].innerText.replace(/\s+/g, '') ).toEqual('NameArmyScoreCountback');
    expect(trs[1].innerText.replace(/\s+/g, '')).toEqual('tedarmy4(4)');
    expect(trs[2].innerText.replace(/\s+/g, '')).toEqual('fredarmy2(3)');
    expect(trs[3].innerText.replace(/\s+/g, '')).toEqual('nedarmy1(2)');
    expect(trs[4].innerText.replace(/\s+/g, '')).toEqual('jedarmy3(1)');
  });


});