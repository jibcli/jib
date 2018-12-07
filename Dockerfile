FROM node:alpine

# setup a persistent configuration volume
ARG JIB_HOME=/var/jib_home
ENV JIB_HOME $JIB_HOME
RUN mkdir -p $JIB_HOME
VOLUME $JIB_HOME

# copy source
WORKDIR /var/cli
COPY . .

# setup npm install
RUN npm config set loglevel="error"
RUN npm link && npm run build

# mount point for cli execution
VOLUME /project
WORKDIR /project

# entrypoint is the 'jib' command
ENTRYPOINT [ "jib" ]