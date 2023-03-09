# DragSelector
DragSelector is a small and easy-to-use JavaScript library that allows you to select HTML elements by drag-and-drop, just like selecting files on your desktop.

You can find the source code [here](https://github.com/jeffery-zhang/dragselector)

# Getting started
You can use NPM or YARN to install the library like this:
``` bash
npm i drag-selector --save

# or
yarn add drag-selector
```

# How to use
DragSelector supports importing the module into your code by using ***es6 Modules***, ***module.exports***, ***AMD Modules***
```javascript
const parentDom = document.getElementById('.root')

// es6
import DragSelector from 'drag-selector'

const dragger = new DragSelector(parentDom)

// AMD Modules
require(['drag-selector'], function(DragSelector) {
  const dragger = new DragSelector(parentDom)
})

// CommonJS
const DragSelector = require('drag-selector')

const dragger = new DragSelector(parentDom)
```

# Advanced options
You can pass in some configuration options as the second parameter in the constructor of DragSelector
```javascript
const parentDom = document.getElementById('.root')

const dragger = new DragSelector(parentDom, {
  // The callback property is a function that takes two parameters: the first is an array of selected elements, and the second is all child elements of the parent element
  callback: (selected, allChildren) => {
    // do something
  },
  // The deep property is a boolean value. When set to true, DragSelector will search for all child elements under the parent element. When set to false, DragSelector will only search for the first level of child elements
  deep: true, // default value is false
})
```
