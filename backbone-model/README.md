# Backbone Model

## Table of Contents

1. [I. Introduction](#i-introduction)
2. [II. More `npm` and `bower`](#ii-more-npm-and-bower)

    1. [A. `npm`](#a-npm)
    2. [B. `bower`](#b-bower)
    3. [C. `.gitignore`](#c-gitignore)

3. [III. Model](#iii-model)

    1. [A. What is a Model?](#a-what-is-a-model)
    2. [B. Backbone Model](#b-backbone-model)

        1. [I. Create a Model](#i-create-a-model)
        2. [II. Populate a Model](#ii-populate-a-model)

            1. [A. Manually](#a-manually)
            2. [B. From Data Source](#b-from-data-source)
            3. [C. Transforming Server Response]
              (#c-transforming-server-response)

        3. [III. Validating a Model](#iii-validating-a-model)
        4. [IV. Updating and Saving a Model](#iv-updating-and-saving-a-model)

            1. [A. Updating Properties](#a-updating-properties)
            2. [B. Saving the Model to a Server]
              (#b-saving-the-model-to-a-server)
        5. [V. Remove a Model from the Server]
          (#v-remove-a-model-from-the-server)

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
node_modules/
js/lib/
```

## III. Model

### A. What is a Model?

Quoting from `backbone` authors

> Models ... containing interactive data ... conversions, validations,
> computed properties (attributes), and access control

### B. Backbone Model

In most applications, data is stored in a database, and the frontend queries
for it.

We'd like to simulate that, so first we create a static JSON file in
`data/user.json`, that will be our "backend" data.

#### I. Create a Model

To create a `Backbone.Model` and telling it where to query for data

```javascript
// models/user.js

var User = Backbone.Model.extend({
  url: '/data/user.json',

  initialize: function(options) {
    console.log('A User object is initialized.');
  }
});
```

The `url` attribute tells this model where to get its data.

The `initialize` function executes when an object of `User` class in made. For
example

```javascript
user = new User('foobar');

// prints "A User object is iniitalized"
```

#### II. Populate a Model

##### A. Manually

To create an object manully with desired properties

```javascript
var user = new User({ firstname: 'Joe', lastname: 'Lam', age: 31 })
```

##### B. From Data Source

`Backbone.Model` is smart enough to populate itself with all the
**top-level** keys in the server response.

We use `fetch` to tell the model to populate itself with data from the `url`
attribute.

```javascript
user.fetch()
```

In our data, the top-level keys are `firstname`, `lastname`, and `age`.
Therefore, our model will automatically have these attributes.

##### C. Transforming Server Response

What if we have data that doesn't fit our desired model attributes? We
**transform** them.

Let's say our data looks like [`data/mutant_user.json`](data/mutant_user.json).

The top-level key is `data`, but we want our attributes to be `firstname`,
`lastname`, and `age`. Therefore, we can't depend on `Backbone.Model`'s default
rules on populating our model.

We will use the `parse` method. This method will return a **JSON** in a way
that **you want** the `Backbone.Model` to see, so that the default rule on
populating the model can kick in.

```javascript
// models/mutant_user.js

parse: function(response, options) {
  return response.data;
}
```

`response.data` will return the object that is at key `data` from our server,
which looks exactly like what we want.

Backbone will then populate the model with the **extracted** JSON, instead of

```javascript
{
  "data": {
    ...
  }
}
```

**Note**

Since all that matters is **what `parse` returns** to `Backbone.Model`, you can
very well do the following

```javascript
parse: function(response, options) {
  return {
    firstname: response.data.firstname,
    lastname: response.data.lastname,
    age: response.data.age
  };
}
```

#### III. Validating a Model

Now we have properties on our model, we have to make sure the model is
**valid**.

Let's say all `User` must have a `lastname`, and we don't trust our data-source
for data integrity.

We will use `validate` to ensure our model is a ok.

```javascript
// models/invalid_user.js

validate: function(attrs, options) {
  if (_.isEmpty(attrs.firstname)) {
    return "firstname cannot be blank";
  }
}
```

The `validate` method **must return nothing** if it **passes**.

A bad validation will trigger an `invalid` event, and by listening to this
event, we can act on it.

```javascript
// app.js

invalidUser.on('invalid', function(model, error) {
  console.log("Error is: " + error);
  console.log("Validation Error is: " + model.validationError);
});
```

To run a **manual** validation on an existing object, we can do

```javascript
user.isValid();
```

`isValid()` will return whatever `validate` method returns.

#### IV. Updating and Saving a Model

##### A. Upadting Properties

To change an existing model **in memory**, we use `set()`

```javascript
// app.js

var fooBar = new User({ firstname: 'Joe', lastname: 'Lam', age: 31 });
fooBar.set({ lastname: 'something', age: 29 })
```

**Note**

The change is **only in memory**, it is **not** writen to the backend.

##### B. Saving the Model to a Server

To formally save a model into the data source, we have to call `save()`

```javascript
// app.js

fooBar.save()
```

The will tell the model `User` to make a POST to the `url` value. Formalizing
the model change onto the backend.

#### V. Remove a Model from the Server

To remove the model permanently from the backend, we need a DELETE to the `url`.

```javascript
user.destory()
```

* A `sync` event will fire when the server **acknowledges** a successful DELETE
* A `destroy` event will fire when the method is called, it will bubble up to
  its `Backbone.Collection`
* Use `{ wait: true }` as an option if you want to wait for a server response
  **before** this model is removed from its collection
