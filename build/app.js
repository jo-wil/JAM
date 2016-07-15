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
    var color = new Jam({
        template: "<p style=\"color:<%-data.color%>\"> This text changes colors WOW! </p>",
        data: { color: 'red' },
        selector: '#color',
        kids: []
    });
    var cascade = new Jam({
        template: "<p> <%- data.inherited %>, <%- data.not %>",
        data: { not: 'this didnt come from the parent' },
        selector: '#cascade',
        kids: []
    });
    var container = new Jam({
        template: "<h2>JAM.js Demo App</h2>\n          <div id=\"timer\"></div>\n          <div id=\"color\"></div>\n          <div id=\"echo\"></div>\n          <div id=\"cascade\"></div>",
        data: { inherited: 'this came from the parent', not: 'this should NOT be here' },
        selector: '#container',
        kids: [timer, color, echo, cascade]
    });
    container.render();
    document.querySelector('#message').addEventListener('input', function (evt) {
        echo.update({ echo: this.value });
    });
    window.setInterval(function () {
        timer.update({ time: new Date() });
    }, 1000);
    var selected = 0;
    var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple'];
    window.setInterval(function () {
        selected = (selected + 1) % colors.length;
        color.update({ color: colors[selected] });
    }, 2000);
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