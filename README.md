

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

There is a full example in the repo that is called app.ts.

```javascript

// This is a simple app
const app = new Jam({
   template: `<p><%- data.message %></p>`, // This is the template, JAM uses a tempalating language that is syntactically the same as _.js
   data: {message: 'Hello JAM!'} // This is the inital data for rendering
   selector: '#container', // This is used in the document.querySelector() method call to find out where to put you app
   kids: [] // This is and array for child containers
});

// This is the inital DOM rendering so make sure this is called after the DOM is loaded
app.render();

// This can be called whenever you want the message to change and the DOM will reflect the changes
app.update({message: getMessageFromSomewhereCool()});

```
