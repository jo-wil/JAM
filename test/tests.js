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

  assert.equal(Jam.prototype._renderTemplate(ts1), ts1, 'simple');

  var ts2 = `<h1> <%= header %> </h1>`;
  var data2 = {header: 'Good'};
  assert.equal(Jam.prototype._renderTemplate.call({data: data2}, ts2), ts1, 'simple replace');
  
  var ts3 = `
     <h1>
        <% if (this.data.test) { %>
        Good
        <% } else { %>
        Bad
        <% } %>
     </h1>
  `;
  var data3 = {test: true};
  assert.notEqual(Jam.prototype._renderTemplate.call({data: data3}, ts3).indexOf('Good'), -1, 'simple if');

  var ts4 = `
     <h1>
        <% var x = 1; %>
        <% switch (this.data.test) { %>
           <% case 1: %>
              Good
           <% break; %>
        <% } %>
     </h1>
  `;
  var data4 = {test: 1};
  assert.notEqual(Jam.prototype._renderTemplate.call({data: data4}, ts4).indexOf('Good'), -1, 'simple switch');
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
