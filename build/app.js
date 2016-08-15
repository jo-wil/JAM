'use strict';

var main = function () {
   
   var container = new Jam({
      template:
         `<h2>JAM.js Demo App</h2>
          <button onclick="timer">Start</button>
          <button onclick="toggle">Toggle</button>
          <p> <%- time %> </p>
          <p style="color:<%- color %>"> This text changes colors WOW! </p>
          <% if (this.data.toggle) { %>
             <textarea oninput="echo" rows="10" cols="50"><%- echo %></textarea>
             <p><%- echo %></p>
          <% } %>`,
      data: {time: new Date(), color: 'red', echo: '', toggle: false},
      selector: '#container',
      functions: {
         timer: function () {
            let selected = 0;
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
            window.setInterval(function () {
               selected = (selected + 1) % colors.length;
               this.update({color: colors[selected], time: new Date()});
            }.bind(this), 1000);
         },
         toggle: function () {
            if (this.data.toggle) {
               this.update({toggle: false});
            } else {
               this.update({toggle: true});
            }
         },
         echo: function (evt) {
            this.update({echo: evt.target.value});
         }
      }
   });
 
   container.render(); 
};

window.addEventListener('load', main);
