# Using `bower` to Manage `requirejs` Dependencies

## Table of Contents

1. [Introduction](#i-introduction)
2. [Installing `bower`](#ii-installing-bower)
3. [Prepare the Project for `bower`](#iii-prepare-the-project-for-bower)
4. [Run the Project!](#iv-run-the-project)

## I. Introduction

As a project grows, we require more and more libraries, and it gets hairy to
manage them. `bower` is a tool to manage javascript libraries, and their
dependencies.

In this article, we will change our previous [project](../requirejs) to
accommodate `bower`.

## II. Installing `bower`

We need the _Node Package Manager_(`npm`) to install `bower`

1. Installing `node` (which gives us `npm`)

    Using `homebrew` on Mac

    ```sh
    brew update
    brew install node
    ```

2. Install `bower`

    ```sh
    cd test-project
    npm install bower
    ```

    A directory `node_modules` will be created under `$projectRoot`

## III. Prepare the Project for `bower`

3. Initialize `bower` for the project

    ```sh
    $(npm bin)/bower init
    ```

1. Tell `bower` where javascript libraries should be placed

    Make a file `$projectRoot/.bowerrc`, add:

    ```sh
    {
      "directory": "js/lib"
    }
    ```

2. Remove original manually downloaded libraries

    ```sh
    cd js/lib
    rm -rf *
    ```

3. Install `requirejs`, `text` plugin, etc with `bower`

    ```sh
    cd $projectRoot
    $(npm bin)/bower install --save requirejs text
    # --save: not only install the libraries now, but also save the library
    #   names in bower.json as a project dependency
    ```

4. New javascript library structure

    ```sh
    js
    ├── lib
    │   ├── requirejs
    │   │   ├── README.md
    │   │   ├── bower.json
    │   │   └── require.js
    │   └── text
    │       ├── LICENSE
    │       ├── README.md
    │       ├── package.json
    │       └── text.js
    └── main.js
    ```

5. Since the javascript library files have their locations and names changed,
  we have to modify the corresponding `index.html` and `main.js`

    ```sh
    diff ../requirejs/index.html index.html

    # 3c3
    # <     src='/js/lib/require/require.min.js'>
    # ---
    # >     src='/js/lib/requirejs/require.js'>

    diff ../requirejs/js/main.js js/main.js

    # 7c7
    # <       text: 'lib/require/text.min'
    # ---
    # >       text: 'lib/text/text'
    ```

## IV. Run the Project!

We used `local-web-server` last time, we'll use the same here, but have it
installed locally with `npm`

1. Install and run `local-web-server` locally

    ```sh
    cd $projectRoot
    npm install local-web-server
    $(npm bin)/ws --log-format dev
    ```

2. Go to `http://localhost:8000`, you should see the same result in the Chrome
  console as in the previous article.

    ```text
    /js/main.js
    :8000/js/main.js:12 <h1>List of Cars</h1>
    ```
