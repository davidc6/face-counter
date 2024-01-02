# A simple face counter system

## Background

The system allows a user to log in, upload an image and detect number of faces using Google Vision API.

In order to use Google Vision API `USE_GCP` environment variable needs to be set (to `true`) in the projects `compose.yml`. Alternatively, the project will run in emulation mode. Additionally, a service account JSON key is required. The key needs to be:

- Generated in GCP
- Downloaded
- Renamed to `vision.json`
- Pasted into `/api/key` directory

A good summary of the steps outlined [in this Medium post](https://medium.com/@roya90/extracting-text-from-local-images-using-google-vision-api-without-cloud-upload-bf61ab00e036).

The system is built with:

- Fastify
- VueJS
- Server-side events
- JWT (for authentication)
- In-memory data store (simple JS native data structure)

## Instructions

The system is split into front-end (`/spa`) and back-end (`/api`) components.

I've included a simple bash script that installs `node_modules` outside of containers and starts Docker Compose (tested on Linux and Mac). To run it, you have to in the root directory of this project and run `./run.sh` script.


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

**This list is frequently being updated**
 
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
- Clear session storage on server restart
- Clear JWT token when api/server restarts as no data is stored in memory anymore