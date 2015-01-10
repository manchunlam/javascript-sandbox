# Using `shim`s in `requirejs`

## Table of Contents

1. [Introduction](#i-introduction)
2. [Why `shim`s?](#ii-why-shims)
3. [Install All the libraries](#iii-install-all-the-libraries)
4. [Setting up `shim`s](#iv-setting-up-shims)
5. [Setting Dependencies for `shim`s](#v-setting-dependencies-for-shims)
6. [`define` does not Need All Libraries Declared]
  (#vi-define-does-not-need-all-libraries-declared)

## I. Introduction

In this article, we will include javascript libraries that are not `AMD` ready
using `shim`s. And then specify its `path`, so `requiejs` knows where to find
them.

## II. Why `shim`s?

Not all javascript libraries are written with `AMD` in mind. To have them
included with `requirejs`, we need to tell `requirejs`

1. How do we invoke it in our code?

    For example,

    `backbonejs` functions are to be called with `Backbone.*`

2. Where is the library located.

For point 2, we have seen the attribute `path`. For the first point, we will
introduce a new concept in `requirejs`, the `shim`s.

## III. Install All the Libraries

Like the previous article, we will install everything we need with `bower`

```sh
$(npm bin)/bower install jquery backbone Backbone.localStorage
```

## IV. Setting up `shim`s

The purpose of `shim`s are to tell `requirejs` **2** things

1. How do we invoke this javascript library?
2. What must be loaded before the library is usable?

We will add the `shim`s in our `requirejs.config` block

```javascript
requirejs.config({
  ...
  shim: {
    underscore: {
      exports: '_'
    }
  }
});
```

In the above code, we are saying

1. The dependency **name** that we will pass to any `define` function is
  `underscore`
2. The `exports` attribute means:

    The intended **global** variable (aka. `windows.*`) is actually `_`.

    That is, whenever `requirejs` sees `underscore` as a dependency, please
    translate that to

    ```javascript
    window._
    ```

    Therefore, when we have `underscore` as a dependency, the `_.*` functions
    will be available to us.

3. The `underscore` library doesn't depend on anything. In later sections,
  we will add another attribute to indicate a library depends on other libraries
  to be loaded first.

### A. Adding to `path`

With any library, we have to tell `requirejs` where it sits. `shim`s are no
different.

Add to our `requirejs.config` block with

```javascript
requirejs.config({
  shim: ...,
  paths: {
    ...,
    underscore: 'lib/underscore/underscore'
  }
})
```

### B. Test Drive!

We will add to our `define` function in `js/main.js` to use the `underscore`
library.

```javascript
define(['underscore'], function(_) {
  var myArray = [{ id: 123, name: 'foo' }, { id: 345, name: 'bar' }]
  console.log(typeof _.where(myArray, { id: 123 }));
  // array
  // [{ id: 123, name: foo }]
});
```

## V. Setting Dependencies for `shim`s

Most libraries have dependencies, some other code/libraries must load before
its turn. That's when the `dep` attribute comes into play

We want to include `backbone.js`, and we know `backbone` has a hard dependency
on `underscore`, and `jquery` (for `Backbone.View`). Therefore, we must tell
`requirejs`:

1. We need `backbonejs`
2. How can we call it?
3. List all dependencies, if any, for the `backbonejs` library, so `requirejs`
  will for sure load those first

Let's re-visit our `requirejs.config` block.

```javascript
requirejs.config({
  ...,
  shim: {
    ...,
    jquery: {
      exports: '$'
    },
    backbone: {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    }
  },
  paths: {
    ...,
    jquery: 'lib/jquery/dist/jquery',
    backbone: 'lib/backbone/backbone'
  }
});
```

The `deps` attribute defines what `backbone` needs. The names should match the
library attributes you have defined prior inside `shim:`.

### A. Test Drive

```javascript
define(['backbone'], function(Backbone) {
  // Define a Backbone.Model class
  var Person = Backbone.Model.extend({
      initialize: function() {
        console.log('Person object initialized');
      }
    });

  // An object of Person, which is a Backbone.Model object
  var person = new Person({ name: 'Joe Lam', age: 31 });
  console.log(person.get('name'));
  // "Joe Lam"
})
```

## VI. `define` does not Need All Libraries Declared

The observant readers will see that, in the `define` code of Section V, I didn't
declare `underscore` (`_`), and `jquery` (`$`) in the `define` function.

That's ok!

`requirejs` will automatically include the dependencies for any libraries you
need in the `define` function even if you don't. **As long as** you have
declared them in the `shim`s.

That is, when you do

```javascript
define(['backbone'], function(Backbone) {
});
```

`requirejs` will automatically provide `Backbone` with

1. `jquery` (aka. `$`), **and**
2. `underscore` (aka. `_`)

to `Backbone` when you call it.
