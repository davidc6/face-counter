# A simple face counter app

The app is split into front-end (`/spa`) and back-end (`/api`) components.

To bring up the environment:

```sh
# detached mode - daemon runs in the background
docker compose up --detach

# or to see logs from each component
docker compose up

# or if you need to rebuild (force build) containers because of errors
docker compose up --build
```

To bring the environment down:

```sh
docker compose down
```

If this does not work (and you are getting errors that contain "module cannot be found" text) please cd into /spa and /api and install all package.json dependencies by running `npm i` command. This should resolve all dependencies that are required to run the whole stack.

You can then use links below to access both the SPA and API.

- For API - http://localhost:8000
- For SPA - http://localhost:5173
