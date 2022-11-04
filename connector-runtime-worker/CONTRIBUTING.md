## Running the tests

To run the tests, you must first run `npm i` in the `src/__test__` directory.

## Building the Docker container

To build the Docker container:

```bash
npm i
npm run build
docker build --tag sitapati/c8-connector-worker-runtime-nodejs:latest .
```