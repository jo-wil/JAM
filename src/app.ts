const main = function () {
   
   const request = new Jam({
      template: `<strong> This is the app.js file running this page </strong> <br\> <%- data.results %>`,
      data: {},
      selector: '#request',
      kids: []
   });
   
   const echo = new Jam({
      template:
         `<div id="request"></div>
          <br/>
          <textarea id="message" placeholder="Type here to see the text echo" rows="10" cols="50"></textarea>
          <p id="echo-message"><%= data.echo %></p>
         `,
      data: {echo: ''},
      selector: '#echo',
      kids: [request]
   });

   const timer = new Jam({
      template: `<p> <%= data.time %> <strong> <--- Notice the clock </strong> </p>`,
      data: {time: new Date()},
      selector: '#timer',
      kids: []
   });

   const container = new Jam({
      template:
         `<h2>JAM.js Demo App</h2>
          <div id="timer"></div>
          <div id="echo"></div>`,
      data: {},
      selector: '#container',
      kids: [timer, echo] 
   });
 
   container.render();

   document.querySelector('#message').addEventListener('input', function (evt) {
      echo.update({echo: this.value});
   });

   window.setInterval(function () {
      timer.update({time: new Date()});
   }, 1000);

   const xhr = new XMLHttpRequest();

   xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
         request.update({results: xhr.response});
      } else {
         request.update({results: `Error: ${xhr.status} ${xhr.response}`});
      }
   });

   xhr.open('GET', '/build/app.js', true);
   xhr.send();

};

window.addEventListener('load', main);
