'use strict';
// This function is the main function of our app.
var main = function () {
    // This is our reqest component, it shows how we can update the page with ajax
    var request = new Jam({
        template: "<strong> This is the app.js file running this page </strong> <br> <%- data.results %>",
        data: {},
        selector: '#request',
        kids: []
    });
    // This is our echo component, it echo's everything the user types
    var echo = new Jam({
        template: "<div id=\"request\"></div>\n          <br/>\n          <textarea id=\"message\" placeholder=\"Type here to see the text echo\" rows=\"10\" cols=\"50\"></textarea>\n          <p id=\"echo-message\"><%= data.echo %></p>\n         ",
        data: { echo: '' },
        selector: '#echo',
        kids: [request]
    });
    // This is our timer component, it ticks every second
    var timer = new Jam({
        template: "<p> <%= data.time %> <strong> <--- Notice the clock </strong> </p>",
        data: { time: new Date() },
        selector: '#timer',
        kids: []
    });
    // This is our container, it holds the all the app components
    var container = new Jam({
        template: "<h2>JAM.js Demo App</h2>\n          <div id=\"timer\"></div>\n          <div id=\"echo\"></div>",
        data: {},
        selector: '#container',
        kids: [timer, echo]
    });
    // This renders the container
    container.render();
    // This listens for changes in the text box to echo the input
    document.querySelector('#message').addEventListener('input', function (evt) {
        // Notice how we simply update the data and Jam auto updates the DOM
        echo.update({ echo: this.value });
    });
    // This is our timer
    window.setInterval(function () {
        // Again just update the data and the DOM mirrors the changes automatically
        timer.update({ time: new Date() });
    }, 1000);
    // This is out AJAX request for this file :)
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
// This starts the app when the DOM is loaded
window.addEventListener('load', main);
//# sourceMappingURL=app.js.map