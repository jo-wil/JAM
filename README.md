# JAM.js

JAM is a javascript tool for building web applications.

JAM provides automatic DOM updates when your data changes.

JAM is written in Typescript and has no dependecies.

### Installation

If you want to build Jam you can fork the repo and run 

```
tsc
```

This will build the Typescript file to a vanilla Javascript one
that targets ES5.

If you just want to use Jam, you only need to copy the prebuilt 
jam.js file from the build directory to your local working directory.

This file injects a Jam variable into the global scope that has
all the functionality of the tool.

### API

Jam has a very simple API.

Constructor

```javascript
new Jam({
   template: <component template>: string,
   data: <inital data>: Object,
   selector: <DOM selector>: string,
   kids: [<Jams>]: Array<Jam>
})
```

Methods

```
render()
```
This function renders your component and all kids recursively, this should only need to be called once for the top level components at app start.

```
update(<new data>: Object)
```
This function triggers an update to your component, internally render is called to update the DOM.

### Docs

Coming soon ...

### Example

You can see this example by forking the repo and simply starting a webserver in the directory and navigating your browser to the index.html file provided.

```javascript
'use strict';

// This function is the main function of our app.
const main = function () {
   
   // This is our reqest component, it shows how we can update the page with ajax
   const request = new Jam({
      template: `<strong> This is the app.js file running this page </strong> <br\> <%- data.results %>`,
      data: {},
      selector: '#request',
      kids: []
   });
   
   // This is our echo component, it echo's everything the user types
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

   // This is our timer component, it ticks every second
   const timer = new Jam({
      template: `<p> <%= data.time %> <strong> <--- Notice the clock </strong> </p>`,
      data: {time: new Date()},
      selector: '#timer',
      kids: []
   });

   // This is our container, it holds the all the app components
   const container = new Jam({
      template:
         `<h2>JAM.js Demo App</h2>
          <div id="timer"></div>
          <div id="echo"></div>`,
      data: {},
      selector: '#container',
      kids: [timer, echo] 
   });
 
   // This renders the container
   container.render();

   // This listens for changes in the text box to echo the input
   document.querySelector('#message').addEventListener('input', function (evt) {
      // Notice how we simply update the data and Jam auto updates the DOM
      echo.update({echo: this.value});
   });

   // This is our timer
   window.setInterval(function () {
      // Again just update the data and the DOM mirrors the changes automatically
      timer.update({time: new Date()});
   }, 1000);


   // This is an AJAX request for this file :)
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

// This starts the app when the DOM is loaded
window.addEventListener('load', main);
```
