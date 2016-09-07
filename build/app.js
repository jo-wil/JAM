'use strict';

var main = function () {
   
   var container = new Jam({
      template:`
          <h2>JAM.js Demo App</h2>
          <button onclick="timer">Start</button>
          <button onclick="toggle">Toggle</button>
          <p> <%- time %> </p>
          <p style="color:<%- color %>"> This text changes colors WOW! </p>
          <% if (this.data.toggle) { %>
             <textarea oninput="echo" rows="10" cols="50"><%- echo %></textarea>
             <p><%- echo %></p>
          <% } %>
          <h1> <%- deep.one %> <%- deep.two %> <%- deep.three %> </h1>
      `,
      data: {
         time: new Date(), 
         color: 'red', 
         echo: '', 
         toggle: false,
         deep: {one: 1, two: 2, three: 3}
      },
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
            console.log(this.data);
            if (this.data.toggle) {
               this.update({toggle: false});
            } else {
               this.update({toggle: true});
            }
            this.update({deep:{ one: 11}});
            console.log(this.data);
         },
         echo: function (evt) {
            this.update({echo: evt.target.value});
         }
      }
   });
 
   //container.render(); 

   var form = new Jam({
      template: `
         <form onsubmit="submit">
            <input id="name"/>
            <% for (var i = 0; i < 4; i++) { %>
               <input id="rb<%= i %>"/>
            <% } %>
            <input type="submit"/>
         </form>
         <p> <%= name %> </p>
         <p> <%- name %> </p>
      `,
      data: {
         name: 'Test Name'
      },
      selector: '#container',
      functions: {
         submit: function (evt) {
            evt.preventDefault();
            console.log(evt);
            this.update({name: document.querySelector('#name').value});
         }
      }
   });

   form.render();
};

window.addEventListener('load', main);
