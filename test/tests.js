'use strict';

/**
 * This test makes sure the global JAM variable is defined
 */
QUnit.test('Jam', function(assert) {
   assert.ok(Jam !== undefined, 'defined');
});

/**
 * This test checks the _renderTemplate function 
 */
QUnit.test('_renderTemplate', function (assert) {

  var ts1 = `<h1> Good </h1>`;
  var data1 = {};

  assert.ok(Jam.prototype._renderTemplate(ts1, data1) === ts1, 'simple');
   
});

QUnit.test('_merge', function (assert) {

   var d1 = {one: 1, two: 2, three: 3};
   var d2 = {four: 4, five: 5};
   var expected = {
      one: 1,
      two: 2,
      three: 3,
      four: 4,
      five: 5
   };
   assert.deepEqual(Jam.prototype._merge(d1, d2), expected, 'shallow');
   
   d1 = {one: 1, two: { two: 2}};
   expected = {one: 1, two: { two: 2}};
   assert.deepEqual(Jam.prototype._merge(d1, {}), expected, 'one deep');
   
   d1 = {one: 1, two: 2, three: {a: 'A', b: 'B'}};
   d2 = {three: {c: 'C'}};
   expected = {
      one: 1,
      two: 2,
      three: {
         a: 'A',
         b: 'B',
         c: 'C'
      }
   }; 
   assert.deepEqual(Jam.prototype._merge(d1, d2), expected, 'two deep');

   d1 = {time: new Date()}
   d2 = {time: 1234}
   
   assert.deepEqual(Jam.prototype._merge(d1, d2), d2, 'changes');
 
});
