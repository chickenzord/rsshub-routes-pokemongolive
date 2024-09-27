# rsshub-routes-pokemongolive

RSSHub route for Pokemon Go

## Usage in docker-compose

First, clone it to the location of your `docker-compose.yml`

```sh
git clone git@github.com:chickenzord/rsshub-routes-pokemongolive.git
```

Then edit the yaml file accordingly:

```yaml
# docker-compose.yml
services:
  rsshub:
    container_name: rsshub
    image: ghcr.io/diygod/rsshub:latest
    restart: always
    command:
    - bash
    - -c
    - npm run build && npm run start
    environment:
      - NODE_ENV=production
    volumes:
      - ./rsshub-routes-pokemongolive:/app/lib/routes/pokemongolive:ro
```

- `command`: The official docker image only use `npm run start`. We need to rebuild the routes by running `npm run build` beforehand.
- `volumes`: Mount the cloned route repository in `/app/lib/routes`

## Development

Clone in your RSSHub working directory
