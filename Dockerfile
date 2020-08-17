FROM jrottenberg/ffmpeg:4.1-alpine

RUN apk add --update nodejs npm
# ADD setup-ffmpeg.sh /root
# Create app directory

WORKDIR /app
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
RUN npm install -g nodemon
# where available (npm@5+)
COPY package*.json ./
RUN npm install
# If you are building your code for production
# RUN npm install --only=production
# Bundle app source
COPY . .
EXPOSE 8080

ENTRYPOINT []

CMD [ "nodemon" ]