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

If you want to use Typescript, place ./src/jam.ts in the typescript 
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
\\ Coming soon ...
```
