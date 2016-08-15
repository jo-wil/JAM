'use strict';

const main = function () {
   
   const container = new Jam({
      template:
         `<h2>JAM.js Demo App</h2>
          <button onclick="timer">Start</button>
          <button onclick="flip">Flip</button>
          <p> <%- data.time %> </p>
          <p style="color:<%-data.color%>"> This text changes colors WOW! </p>
          <% if (data.flip) { %>
             <textarea oninput="echo" placeholder="Type here to see the text echo" rows="10" cols="50"></textarea>
             <p><%- data.echo %></p>
          <% } %>`,
      data: {time: new Date(), color: 'red', echo: '', flip: false},
      selector: '#container',
      functions: {
         timer: function () {
            console.log('test sucess', this);
            let selected = 0;
            const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
            window.setInterval(function () {
               this.update({time: new Date()});
               selected = (selected + 1) % colors.length;
               this.update({color: colors[selected]});
            }.bind(this), 1000);
         },
         flip: function () {
            console.log(this);
            console.log(this._data.flip);
            if (this._data.flip) {
               this.update({flip: false});
               return;
            }
            this.update({flip: true});
         },
         echo: function (evt: Event) {
            this.update({echo: (<HTMLTextAreaElement>evt.target).value});
         }
      }
   });
 
   container.render(); 

};

window.addEventListener('load', main);
