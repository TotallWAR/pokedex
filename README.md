# Pokedex server

Pokemon app with authorization, pagination, search, favourite pokemons panel
powered by koa2, typescript, typeorm, postgresql, passport, koa-csrf.

It's used http://pokeapi.co for data about pokemons.
* note: some requests can be a little bit long (about 6-7 seconds) because of pokeapi.co return
too much information about one pokemon. API actions were optimized with promise.all, however
pokeapi.co's response time is still long. Data could be saved into postgresql
and app would be much faster but it's outside of this task.

You can find DEMO [here](http://35.196.161.18)

1. clone repository
2. install postgresql and create db `todo`
3. install mongodb if required for sessions (it's used jwt by default)
4. run `npm i`
5. edit `ormconfig.json` and change your database configuration as you need
6. run `npm run dev`
7. files will be served from folder `assets` which contains built react app
    * note: it's used CSRF token so don't forget paste into your html file `{csrfToken}` which will be replaced with token
8. open http://localhost:3000

### Client
You can find react app for this project [here](https://github.com/TotallWAR/pokedex-client)
