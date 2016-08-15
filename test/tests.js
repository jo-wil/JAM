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
   
  var ts2 = `<h1> <%= data.title %> </h1>`;
  var data2 = {title: 'Good'}; 

  assert.ok(Jam.prototype._renderTemplate(ts2, data2).indexOf('Good') !== -1, 'pass');

  var ts3 = `<h1> 
                <% if (data.flag === true) { %> 
                   Bad 
                <% } else { %> 
                   Good 
                <% } %> 
             </h1>`;
  var data3 = {flag: false};

  assert.ok(Jam.prototype._renderTemplate(ts3, data3).indexOf('Good') !== -1, 'pass');
 
  var ts4 = `<% var tmp = '';
                for (var i = 0; i < 10; i++) {
                   tmp += i;
                }
             %>
             <%= tmp %>`;
  var data4 = {};

  assert.ok(Jam.prototype._renderTemplate(ts4, data4).indexOf('0123456789') !== -1, 'pass');

  var ts5 = `<%- data.xss %>`;
  var data5 = {xss: '<script> evil code </script>'};

  assert.ok(Jam.prototype._renderTemplate(ts5, data5).indexOf('<script>') === -1, 'pass');
  assert.ok(Jam.prototype._renderTemplate(ts5, data5).indexOf('</script>') === -1, 'pass');

});
