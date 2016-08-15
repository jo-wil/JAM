'use strict';
var main = function () {
    /*const request = new Jam({
       template: `<strong> This is the app.js file running this page </strong> <br\> <%- data.results %>`,
       data: {},
       selector: '#request'
    });
    
    const echo = new Jam({
       template:
          `<div id="request"></div>
           <br/>
           <textarea id="message" placeholder="Type here to see the text echo" rows="10" cols="50"></textarea>
           <p id="echo-message"><%= data.echo %></p>
          `,
       data: {echo: ''},
       selector: '#echo'
    });
 
    const timer = new Jam({
       template: `<p> <%= data.time %> <strong> <--- Notice the clock </strong> </p>`,
       data: {time: new Date()},
       selector: '#timer'
    });
 
    const color = new Jam({
       template: `<p style="color:<%-data.color%>"> This text changes colors WOW! </p>`,
       data: {color: 'red'},
       selector: '#color',
    });*/
    var container = new Jam({
        template: "<h2>JAM.js Demo App</h2>\n          <button onclick=\"timer\">Start</button>\n          <button onclick=\"flip\">Flip</button>\n          <p> <%- data.time %> </p>\n          <p style=\"color:<%-data.color%>\"> This text changes colors WOW! </p>\n          <% if (data.flip) { %>\n             <textarea oninput=\"echo\" placeholder=\"Type here to see the text echo\" rows=\"10\" cols=\"50\"></textarea>\n             <p><%- data.echo %></p>\n          <% } %>",
        data: { time: new Date(), color: 'red', echo: '', flip: false },
        selector: '#container',
        functions: {
            timer: function () {
                console.log('test sucess', this);
                var selected = 0;
                var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
                window.setInterval(function () {
                    this.update({ time: new Date() });
                    selected = (selected + 1) % colors.length;
                    this.update({ color: colors[selected] });
                }.bind(this), 1000);
            },
            flip: function () {
                console.log(this);
                console.log(this._data.flip);
                if (this._data.flip) {
                    this.update({ flip: false });
                    return;
                }
                this.update({ flip: true });
            },
            echo: function (evt) {
                evt.preventDefault();
                this.update({ echo: evt.target.value });
            }
        }
    });
    container.render();
    /*document.querySelector('#message').addEventListener('input', function (evt) {
       echo.update({echo: this.value});
    });
 
    window.setInterval(function () {
       timer.update({time: new Date()});
    }, 1000);
 
    let selected = 0;
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    window.setInterval(function () {
       selected = (selected + 1) % colors.length;
       color.update({color: colors[selected]});
    }, 2000);
 
    const xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
       if (xhr.status === 200) {
          request.update({results: xhr.response});
       } else {
          request.update({results: `Error: ${xhr.status} ${xhr.response}`});
       }
    });
    xhr.open('GET', '/build/app.js', true);
    xhr.send();*/
};
window.addEventListener('load', main);
//# sourceMappingURL=app.js.map