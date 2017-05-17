'use strict';

describe('swissChessDirectives: scMenu', function() {
  let injector;
  let element;
  let scope;
  beforeEach(function() {
    injector = angular.injector(['ng','swissChess',"app/views/menu.html"]);

    injector.invoke(function($rootScope, $compile) {
      scope = $rootScope.$new();
      scope.reset = () => {};
      spyOn(scope, 'reset');
      scope.save = () => {};
      spyOn(scope, 'save');
      scope.load = () => {};
      spyOn(scope, 'load');
      scope.deleteSave = () => {};
      spyOn(scope, 'deleteSave');
      element = $compile('<sc-menu></sc-menu>')(scope);
      scope.$apply();
    });
  });

  it('menu no buttons by default', function() {
    const actual = element.find('button').length;
    expect(actual).toEqual(0);    
  });

  it('menu has reset and save if game is initialised', function() {
    scope.game={isInitialised:true};
    scope.$apply();
    const buttons = element.find('button');
    expect(buttons[0].innerHTML).toEqual('Reset');
    buttons[0].click();
    expect(scope.reset).toHaveBeenCalled();
    expect(buttons[1].innerHTML).toEqual('Save');
    buttons[1].click();
    expect(scope.save).toHaveBeenCalled();
  });

  it('menu has delete and load buttons if there is a saved game', function() {
    scope.saved = true;
    scope.$apply();
    const buttons = element.find('button');
    expect(buttons[0].innerHTML).toEqual('Load');
    buttons[0].click();
    expect(scope.load).toHaveBeenCalled();
    expect(buttons[1].innerHTML).toEqual('Delete save');
    buttons[1].click();
    expect(scope.deleteSave).toHaveBeenCalled();
  });

});
