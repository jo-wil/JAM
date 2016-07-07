'use strict';
var main = function () {
    var request = new Jam({
        template: "<strong> This is the app.js file running this page </strong> <br> <%- data.results %>",
        data: {},
        selector: '#request',
        kids: []
    });
    var echo = new Jam({
        template: "<div id=\"request\"></div>\n          <br/>\n          <textarea id=\"message\" placeholder=\"Type here to see the text echo\" rows=\"10\" cols=\"50\"></textarea>\n          <p id=\"echo-message\"><%= data.echo %></p>\n         ",
        data: { echo: '' },
        selector: '#echo',
        kids: [request]
    });
    var timer = new Jam({
        template: "<p> <%= data.time %> <strong> <--- Notice the clock </strong> </p>",
        data: { time: new Date() },
        selector: '#timer',
        kids: []
    });
    var container = new Jam({
        template: "<h2>JAM.js Demo App</h2>\n          <div id=\"timer\"></div>\n          <div id=\"echo\"></div>",
        data: {},
        selector: '#container',
        kids: [timer, echo]
    });
    container.render();
    document.querySelector('#message').addEventListener('input', function (evt) {
        echo.update({ echo: this.value });
    });
    window.setInterval(function () {
        timer.update({ time: new Date() });
    }, 1000);
    var xhr = new XMLHttpRequest();
    xhr.addEventListener('load', function () {
        if (xhr.status === 200) {
            request.update({ results: xhr.response });
        }
        else {
            request.update({ results: "Error: " + xhr.status + " " + xhr.response });
        }
    });
    xhr.open('GET', '/build/app.js', true);
    xhr.send();
};
window.addEventListener('load', main);
//# sourceMappingURL=app.js.map