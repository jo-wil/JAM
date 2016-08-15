'use strict';

/**
 * This test makes sure the global JAM variable is defined
 */
QUnit.test('Jam', function(assert) {
   assert.ok(Jam !== undefined, 'pass');
});

/**
 * This test checks the _renderTemplate function 
 */
QUnit.test('_renderTemplate', function (assert) {

  var ts1 = `<h1> Good </h1>`;
  var data1 = {};

  assert.ok(Jam.prototype._renderTemplate(ts1, data1) === ts1, 'pass');
   
});
