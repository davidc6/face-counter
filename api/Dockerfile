FROM node:lts-alpine
# Linux Alpine does not have bash installed by default, install it
RUN apk update && apk upgrade && apk add bash
RUN mkdir -p /workspace/api
WORKDIR /workspace/api
COPY . .
RUN npm install
EXPOSE 8000
# Using this script we can build according to the environment
ENTRYPOINT [ "./cmd.sh" ]