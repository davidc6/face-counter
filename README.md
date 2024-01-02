# A simple face counter system

The system is built with:

- Fastify
- VueJS
- Server-side events
- In-memory data store (simple JS native data structure)

The system is split into front-end (`/spa`) and back-end (`/api`) components.

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
- For SPA (Single Page Application) - http://localhost:5173

## Future features / improvements
 
- Add a JWT refresh token functionality to avoid logging users out
    - The plan is to store it in the cookie since it's a more long lived value (as opposed to the access token itself)
- Extract URLs into an environment dependent config
- Store any secrets in an .env file
- Error message when duplicate email
- Handle duplicate images
- Handle server sent events errors
- UI improvements
- Validate email address
- Validate only image file types
- Handle duplicate file names 
- API and SPA logging 
- Namespace downloads locally