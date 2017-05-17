'use strict';

describe('swissChessDirectives: scTabs', function() {
  let injector;
  let element;
  let scope;
  beforeEach(function() {
    injector = angular.injector(['ng','swissChess',"app/views/tabs.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      element = $compile('<sc-tabs></sc-tabs>')(scope);
      scope.$apply();
    });
  });

  it('only the players tab shows by default', function() {
    const tab = element.find('li');
    const firstTab = tab[0];
    expect(tab.length).toEqual(1);
    expect(firstTab.firstChild.innerHTML).toEqual('Players');
    expect(firstTab.firstChild.getAttribute("ng-click")).toEqual("showTab('players')");
  });

  it('there should be a tab for each game', function() {
    scope.game = {rounds:{"1":{roundNumber:"1"},"2":{roundNumber:"2"}}};
    scope.$apply();
    const tab = element.find('li');
    const thirdTab = tab[2];
    expect(tab.length).toEqual(3);
    expect(thirdTab.firstChild.innerHTML).toEqual('Round 2');
    expect(thirdTab.firstChild.getAttribute("ng-click")).toEqual("showTab(round.roundNumber)");
  });

  it('the results tab should only show for a finished comp', function() {
    scope.game = {rounds:{"1":{roundNumber:"1"},"2":{roundNumber:"2"}},finalOrder:["1","2"]};
    scope.$apply();
    const tab = element.find('li');
    const lastTab = tab[3];
    expect(tab.length).toEqual(4);
    expect(lastTab.firstChild.innerHTML).toEqual('Results');
    expect(lastTab.firstChild.getAttribute("ng-click")).toEqual("showTab('results')");
  });
  
});