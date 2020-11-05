# ft_transcendance

## Getting Started

Make sure Ruby, Ruby on Rails, PostgreSQL, and Node.JS are installed.

```sh
cd server
bundle install
rails db:create db:migrate
#if you want to populate the db with somes initial values
rails db:seed
```

You also need a `.env` file in the server folder with some values specified as in `.env.sample`.

```sh
cd web
yarn # or npm install
```

## Development

To run the server:

```sh
cd server
rails s -p 5000

```

To run the web:

```sh
cd web
yarn dev # or npm run dev
```
