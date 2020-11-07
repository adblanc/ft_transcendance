# To make sure gems are installled

`bundle install`

# To run the server

`rails s`

# How to setup a similar project

## Steps to configure rails 6 with typescript

1. Setup this folder

`rails new transcendance --database=postgresql --skip-active-storage --skip-action-mailer --skip-action-mailbox`

2. Setup typescript

`bundle exec rails webpacker:install:typescript`

It configures webpack to process correctly our typescript files, creates our tsconfig.json and add `typescript` and `ts-loader` as dependencies.

3. Create the db

`rails db:create`

4. _Optional_

We remove `app/javascript/packs/hello_typescript.ts` and rename `app/javascript/packs/application.js` as a typescript file so : `app/javascript/packs/application.ts`;

```bash
mv app/javascript/packs/application.js app/javascript/packs/application.ts
rm app/javascript/packs/hello_typescript.ts
```

## Steps to add backbone to the project

1. Adding the library

`yarn add backbone`

**[Yarn](https://yarnpkg.com/)** is a node package manager, used here to add a new library to our project.

2. Adding the types for the library

`yarn add -D @types/backbone`

`-D` is used here to specify that we have this library as a **[dev dependency](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file)** as we only need it in dev.

3. Adding the backbone dependencies

`yarn add jquery underscore`

`yarn add -D @types/jquery @types/underscore`

4. Use it

We can now use backbone in our typescript files.
For example in `app/javascript/packs/application.ts` we could use backbone as so :

```ts
import Backbone from "backbone";

const view = new Backbone.View({
  el: "body",
});
```

## Steps to expose our index.html to the server

1. Add an index to our application controller

```ruby
# app/controllers/application_controller.rb

class ApplicationController < ActionController::Base
  def index
  end
end
```

2. Create a view for our controller

```bash
mkdir app/views/application
echo "<h1>Hello, world</h1>" > app/views/application/index.html.erb
```

3. Define a route to handle requests and direct them to our application index

```ruby
# config/routes.rb

Rails.application.routes.draw do
  root to: "application#index"
end
```

## Steps to make jquery globally available in our ts files

1. Modify webpack environment config

In `config/webpack/environment.js`:

```diff
const { environment } = require("@rails/webpacker");
+ const webpack = require("webpack");
const typescript = require("./loaders/typescript");

+ environment.plugins.append(
+   "Provide",
+   new webpack.ProvidePlugin({
+     $: "jquery",
+     jQuery: "jquery",
+   })
+ );

environment.loaders.prepend("typescript", typescript);
module.exports = environment;
```

2. Use it

Now for example in our `app/javascript/packs/application.ts`, instead of importing jquery like so :

```ts
import $ from "jquery";

$("body").append("<h1>Hello World</h1>");
```

We can use it without importing it first :

```ts
$("body").append("<h1>Hello World</h1>");
```
