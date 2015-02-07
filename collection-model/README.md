# Backbone Collection and Model

## Table of Contents

## I. Introduction

We have covered the _controller_ ("C") of MVC, now we will look at the data,
the _model_ ("M").

Backbone provides `Backbone.Collection` and `Backbone.Model` to handle data
on the frontend.

1. `Collection`: List of `Model`s
2. `Model`: an object, with attributes, instance methods, etc

In this article, we will retrieve data (JSON format) from a URL, and do
_CRUD_ (create, read, update, delete) operations on the `Backbone.Collection`

## II. More `npm` and `bower`

We will digress a little bit, and look at our use of `npm`, and `bower`.

Until now, we have been including **all** our libraries, and `npm` packages
in the repo. It's taking up a lot of space.

We'd like to define a _manifest_ file, so we just say what we want, and let the
user installs it when they get the repository.

### A. `npm`

We should have started the project with `npm init` to give a `package.json`
file. It would have had all the packages we needed.

We didn't, so we will do it now

1. Get `package.json`

    ```sh
    npm init --force
    ```

2. Add dependencies

    ```javascript
    "dependencies": {
      "bower": "^1.3.12"
    },
    "devDependencies": {
      "local-web-server": "^0.5.16"
    },
    ```

    We need `bower` all the time, but the web-server is only for development.

    **Note**

    1. `^` means it's allowed to upgrade to the latest **minor** version.

        `^1.2.3` will match `1.x.x`.

    2. `~` means it's allowed to upgrade to the latest **hotfix** version.

        `~1.2.3` will match `1.2.x`

3. Now we can keep `node_modules` empty, and users can install these packages
  themselves

    ```sh
    npm install
    ```

The details for each key in `package.json` can be found [here]
(http://browsenpm.org/package.json).

### B. `bower`

We already have `.bowerrc`, and `bower.json`, so just make sure we have the
target installation directory, and the dependencies, right; and we are good to
go.

### C. `.gitignore`

We will add `.gitkeep` to both `node_modules` and `js/lib` (specified in
`.bowerrc`), then we add the following to `.githignore`

```text
node_modules/*
js/lib/*
```

## III. Collection


