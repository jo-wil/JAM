# JAM.js

JAM is a javascript library for building web applications.

JAM provides automatic DOM updates when your data changes as 
well as handling event listeners.

JAM is written in Typescript and has no dependecies.

### Installation

If you want to build JAM you can fork the repo and run 

```
tsc
```

This will build the Typescript file to a vanilla Javascript one
that targets ES5.

Feel free to use Jam as a Typescript or Javascript library.

If you want to use Typescript, place ./src/jam.ts in your the typescript 
src folder of your application.

If you want to use Javascript, you only need to copy the prebuilt 
./src/jam.js to your local scripts directory.

This file injects a Jam variable into the global scope that has
all the functionality of the library.

### API

JAM has a very simple API.

Constructor

```javascript
new Jam({
   template: <component template>: string,
   data: <inital data>: Object,
   selector: <DOM selector>: string,
   functions: [<listeners>]: Array<Function>
})
```

Methods

```
render()
```
This function renders your component, this should only need to be called once at app start.

```
update(<new data>: Object)
```
This function triggers an update to your component.

### Docs

Coming soon ...

### Example

There is a full example in the build folder that is called app.js.

```javascript
// This is a simple app
const app = new Jam({
   template: `
      <p><%- message %></p> 
      <button onclick="clickHandler"> Click Me! </button>     
   `, // This is the template, JAM uses a tempalating language that is syntactically the same as _.js
      // Jam automatically knows that clickHander is one of the functions and message is part of the data object
   data: {message: 'Hello from JAM!'}, // This is the inital data for rendering
   selector: '#container', // This is used in the document.querySelector() method call to find out where to put your app
   functions: {
      clickHandler: function (evt) { // this is used as an event handler for the onclick of the button
         this.update({message: `${this._data.message} I have changed`}); // The scope of the function is the Jam instance itself
      }
   }
});

// This is the inital DOM rendering so make sure this is called after the DOM is loaded
app.render();
```
