var mock, notify;
beforeEach(module('swissChess'));
// beforeEach(function() {
//   mock = {alert: jasmine.createSpy()};

//   module(function($provide) {
//     $provide.value('$window', mock);
//   });

//   inject(function($injector) {
//     playersFactory = $injector.get('playersFactory');
//   });
// });

// it('should start with an empty players object', function() {
//   expect(playersFactory.players).toEqual({});
// });

// it('should not alert first two notifications', function() {
//   notify('one');
//   notify('two');

//   expect(mock.alert).not.toHaveBeenCalled();
// });

// it('should alert all after third notification', function() {
//   notify('one');
//   notify('two');
//   notify('three');

//   expect(mock.alert).toHaveBeenCalledWith("one\ntwo\nthree");
// });

// it('should clear messages after alert', function() {
//   notify('one');
//   notify('two');
//   notify('third');
//   notify('more');
//   notify('two');
//   notify('third');

//   expect(mock.alert.calls.count()).toEqual(2);
//   expect(mock.alert.calls.mostRecent().args).toEqual(["more\ntwo\nthird"]);
// });