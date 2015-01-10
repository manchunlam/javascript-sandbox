# Backbone Router

## Table of Contents

1. [Introduction](#i-introduction)
2. [Preparation](#ii-preparation)
    1. [How does `requirejs` come into play?](#a-how-does-requirejs-come-into-play)
    2. [DRY, Re-Use `requirejs` Modules](#b-dry-re-use-requirejs-modules)
3. [Application Router](#iii-application-router)
    1. [Create a Router](#a-create-a-router)
    2. [Make a Router Class](#b-make-a-router-class)
    3. [Specify `routes` in the Router](#c-specify-routes-in-the-router)
    4. [Constructor for Our Router](#d-constructor-for-our-router)
4. [Application Entry Point](#iv-application-entry-point)
5. [Load Our Application onto the Site](#v-load-our-application-onto-the-site)
6. [Testing](#vi-testing)
    1. [See Router in Action](a-see-router-in-action)
    2. [See that There is No Page Load](b-see-that-there-is-no-page-load)

## I. Introduction

Backbone routers are analogous to _controller_ in an MVC. It tells the
application what _action_ to perform based on the _path_ in the URL.

Backbone router interprets a path to be **anything after /#**

* Valid URL for Backbone routers

    ```text
    example.com/#foo
    example.com/#foo/123
    ```

## II. Preparation

We have covered both `requirejs` for module management, and `bower` for
dependency management prior. It's time for us to make a real application.

We need to

1. Make a router! <sup>[1](#iii-application-router)</sup>
1. Create an entry point to the application (`js/app.js`) <sup>[2]
  (#iv-application-entry-point)</sup>
    1. Tell `requirejs` the application depends on a router
    2. Initialize the router
2. Let the site know of the existence of this application (`js/main.js`, which
    is included in `index.html`) <sup>
  [3](#v-load-our-application-onto-the-site)</sup>

### A. How does `requirejs` come into play?

In the previous articles, we have included all the external libraries that our
application needs. As we build the application, it itself has a lot of
components too. This is when `requirejs` shines.

From the list above, we are adding at least 2 components,

1. Router
2. Application

Let's think about what module(s) each of them needs.

1. Router depends on
    * `backbone`
2. Application depends on
    * `router`
3. The site depends on
    * `app`

To achieve that, in each component, we define a `requirejs` module, and load
the appropriate dependencies.

### B. DRY, Re-Use `requirejs` Modules

Within `requirejs` modules, code has explicit dependencies listed, and isolated
scope. All is good, **but** how do modules talk with each other?

The answer is to `return` what you want publicly accessible from each module.

```javascript
// foo.js
define([], function() {
  var name = 'foobar';

  var sayMyName = function() {
    console.log('My name is ' + name)
  };

  var privateAttribute = 'no one outside can see me';

  return {
    anAttribute: name,
    aMethod: sayMyName
  }
});
```

```javascript
// bar.js

define([
  'foo'
], function(Foo) {
  console.log(Foo.anAttribute); // foobar

  Foo.aMethod(); // My name is foobar

  Foo.privateAttribute; // undefined
});
```

## III. Application Router

There are a few steps

1. Make a `router` module, and define the dependencies
2. Make our own `Backbone.Router`
3. Specify the routes (URL paths) in our Router
4. Tell each route (think of it as _action_ in MVC _controllers_) what to
    do

### A. Create a Router

1. In `$projectRoot`, create an `router.js`.
2. Configure a module, and its dependencies

    ```javascript
    // router.js
    define([
      'jquery',
      'underscore',
      'backbone'
    ], function($, _, Backbone) {
    })
    ```

    **Notes**:

    * Here, we are saying the `router` (as the filename implies) module depends
      on `jquery`, `underscore`, and `backbone` modules

### B. Make a Router Class

To make our own `Backbone.Router` class for **our application**

```javascript
// router.js

define([
  ...
], function(..., Backbone) {
  var AppRouter = Backbone.Router.extend({
  });
}
```

### C. Specify routes in the Router

For a Router to function, it needs to know

1. What _path_(s) is the application expecting?
2. What **event** it should fire when the URL path matches?

To define routes on our Router class,

```javascript
// router.js

var AppRouter = Backbone.Router.extend({
  routes: {
    'users': 'showUsers',

    '*actions': 'defaultAction'
  }
});
```

**Note**

1. The `backbone` documentation explicitly says

    > avoid using a **leading** slash in your route definitions

1. The routes are matched from top to bottom. **The more general the match, the
  closer it should be defined towards the end**

2. Route-matches **fire events**, therefore the values are **strings**. They are
  the names of the events. **Not** a function to call.

2. The above will match `example.com/#/users`, and fire the **event**
    `showUsers`

3. Any other routes will fire the **event** `defaultAction`

### D. Constructor for Our Router

In this step, we want to achieve 3 goals

1. Listen to the fired events, and do something
2. Allow **outside** modules to initiate our router class
3. Allow our routes to be bookmark-able, and navigable
    * If a user bookmarks `example.com/#/user`, it will always take you to the
      right View of the Backbone app
    * If a user goes to `/#/users` from `/#/home`; when he clicks the
      _Back_ button, it should take him back to `/#/home`

```javascript
define([
  ...
], function(...) {
  var AppRouter = ...

  var constructor = function() {
    var app_router = new AppRouter();

    // Listen to router-fired events
    app_router.on('showUsers', function() {
      console.log('Show list of users');
    });

    app_router.on('defaultAction', function(route) {
      console.log("We don't recognize this route, " + route);
    });

    // Make application navigable
    Backbone.history.start();
  };

  // Return something from this module, so other modules can use it
  return {
    initialize: constructor
  }
})
```

This code is pretty dense, let's analyze it in blocks.

1. We created an `constructor` variable which is a function. Inside it, we

    1. Created an instance of our Router class
    2. Have it listen on the events we defined (triggered by route-matches)
    3. Defined what is done for each event (i.e. event-handlers)

2. Start the History API of Backbone which makes our application work with the
    _Back_ button, and different paths can be bookmarked

3. The `return` is significant. We are saying,

    This module will return a JSON object, the key is "initialize", its value
    is a function.

    With this, any other modules can say

    ```javascript
    MyAwesomeRouter.initialize()
    ```

    It will go grab the **value** of the key "initialize" from the JSON, and
    and then executes it (because of `()`)

## IV. Application Entry Point

We have a Router, now we need to make the application, and have it start the
router.

Make a new file `js/app.js`

```javascript
// app.js

define([
  'router'
], function(Router) {
  Router.initialize();
});
```

The above code will do the job just fine. However, eventually the `app` module
needs to be used somewhere else. We need a **public** interface to start the
`app` module.

Just like all `requirejs` module, we use `return` to expose a public interface.

```javascript
// app.js

define([
  'router'
], function(Router) {
  // constructor for `app` module
  var initialize = function() {
    Router.initialize();
  }

  return {
    initialize: initialize
  };
});
```

With the enhanced version, we can start the `app` module anywhere with

```javascript
define([
  'app'
], function(App) {
  App.initialize();
});
```

## V. Load Our Application onto the Site

Finally! We have the Router, and the application; we have to put it onto our
site, so people can use it.

Remember, our `index.html` only knows of the existence of `main.js`, so we have
to put our application there.

```javascript
// main.js

require.config({
  ...
});

define([
  'app'
], function(App) {
  App.initialize();
});
```

And we are done.

## VI. Testing

Fire up the server

```sh
cd $projectRoot
$(npm bin)/ws --log-level dev
```

### A. See Router in Action

Open the javascript console, and browse to

1. `http://localhost:8000/#users`

    ```text
    Show a list of users
    ```

2. `http://localhost:8000/#foobar`

    ```text
    We don't recognize this route: foobar
    ```

3. `http://lcoalhost:8000`

    ```text
    We don't recognize this route: null
    ```

### B. See that There is No Page Load

The awesomeness of Single Page Apps is that no page-load (HTTP request) are
made after the application is loaded. See for yourself!

1. Open the Net console, and browse to `http://localhost:8000`.
2. You will see a request for it, and the loading of various JS files.
3. Now go to `http://localhost:8000/#users`, you'll see
    1. **No** HTTP request to backend for the new path
    2. The javascript console will show the result of the specified action
4. Click the _Back_ button, it will take you back to `http://localhost:8000`.

    Note that there is **no** HTTP request either, **and** the application is
    navigable.
