# RequireJS

`requirejs` is javascript file and module loader. It uses `AMD` (asynchronous
module definition) methodology to resolve javascript loading order, and
dependency issues.

This article shows how to setup `requirejs`, the recommended project structure,
and various (and quite often confusing) configuration.

## Table of Contents

1. [Introduction](#i-introduction)
2. [Setup](#ii-setup)
3. [Initializing `requirejs`](#iii-initializing-requirejs)
4. [Bootstrap (`main.js`)](#iv-bootstrap-main-js)
5. [Acknowledgments](../../README.md#acknowledgments)

## I. Introduction

There are 4 main components to every project

1. External libraries
    * `requirejs` is one
2. Entry point
    * the `main` method if you will)
3. `index` page
    * the first thing a user sees when he goes to your site
4. Application code
    * the "meat" where logic, templates, etc reside

We will look at the first three points in this `requirejs` tutorial. The forth
point will be dealt with once we start building an application.

## II. Setup

Project structure is important, a good one allows us to find what we need
quickly.

For the first three aforementioned components, I like this structure

```
├── index.html
└── js
    ├── lib
    │   └── require
    │       ├── require.min.js
    │       └── text.min.js
    └── main.js
```

1. All javascript files are placed under `js`
1. External libraries are clearly labeled, and it's clear to the coder what
    they are.
2. `main.js` is the entry point to the whole application. It includes
    configuration, and in the future, invoks the application itself.

    Some call this the _Bootstrap_
3. `index.html` customarily resides at the root of the project

### See it in Action!

To see how this project works, we need a web server. I find `nodejs` easy to
use, and lightweight.

For Mac OS

```
brew install nodejs
npm install local-web-server -g
# -g: install globally, can use it anywhere on your system
```

To run the project

```
cd <projectRoot>
ws --directory . --log-format dev
# --directory: specify project root
# --log-format: "dev" means development, it gives very verbose output
```

Go to `http://localhost:8000` to see the index page.

## III. Initializing `requirejs`

We first take a look at `index.html`,

```
  <script type='text/javascript' data-main='js/main'
    src='/js/lib/require/require.min.js'>
  </script>
```

This loads our `requirejs` (`src` attribute). The `data-main` attribute is
unique to `requirejs`, and we will explain its significance below.

```
data-main='js/main'
```

1. It specifies the **first** file `requirejs` should load is
    `<projectRoot>/js/main.js`
2. It implicitly tells `requirejs` that, from now on, find files
    **relative to** to the directory `<projectRoot>/js`
    1. The attribute name for this is `baseUrl`
    2. It can be changed. We will see that later.

## IV. Bootstrap (`main.js`)

Since `main.js` is the first file to be loaded, we can add configuration here.

```
requirejs.config({
  baseUrl: '/js',
  paths: {
    text: 'lib/require/text.min'
  }
});
```

In the code above, we **re**-specify the `baseUrl`. Since it's already implied
in `data-main` attribute earlier, it's redundant. It just shows we can
re-define it if we wish to in the future.

The `paths` attribute specifies **modules** and their location **relative** to
the `baseUrl`.

The `text` module will be used in the future to render **plain-text** templates
for others to consume.

### See it in Action!

We will add a template, and print it out in the console.

1. Make a new directory `templates/cars`, and an HTML file

    ```
    ├── index.html
    ├── js
    └── templates
        └── cars
            └── list.html
    ```

2. Add the following to `list.html`

    ```
    <h1>List of Cars</h1>
    ```

2. Add the following to `main.js`

    ```
    define(['text!/templates/cars/list.html'], function(CarList) {
      console.log(CarList);
    });
    ```

3. Reload the browser, you should see the raw HTML in the console

The code snippet in step 3 shows how a module is used, and also how a
dependency is defined.

1. Using the `text` module

    ```
    text!/templates/cars/list.html
    ```

    * This tells `requirejs` to use the module `text`, and feeds it the HTML
    file.
    * **Pay attention** to the leading `/` in `/templates/cars...`.

        This tells `requirejs` that the `templates` directory is **not
        relative** to `baseUrl`.  It is relative to `<projectRoot>` instead.
2. Defining dependency

    ```
    define(['text!...'] function(CarList) { });
    ```

    You will see this structure often. It is how `requirejs` defines a
    **dependency** to the `function`.

    In this case, we are defining the **output** of the `text` module to
    be a dependency, and name that output with the variable name `CarList`

    Finally, we print out what `CarList` is holding.
