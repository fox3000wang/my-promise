const expectExport = require('expect');
// const Promise = require('./Promise');

test('promise', () => {
  var string = undefined;

  new Promise(function () {
    string = 'foo';
  });

  expectExport(string).toBe('foo');
});
