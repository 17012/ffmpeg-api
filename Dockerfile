FROM jrottenberg/ffmpeg:4.1-alpine as base
RUN apk add --update nodejs npm
WORKDIR /app


FROM base as development
COPY package*.json ./
RUN npm install -g nodemon
RUN npm install
COPY . .
EXPOSE 443
# remove old from ffmpeg
ENTRYPOINT [] 
CMD ["npm","run","start:watch"]

FROM base as build
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

FROM base as production
ENV NODE_ENV=production
COPY --from=build /app/package.json /app/package-lock.json ./
COPY --from=build /app/dist ./dist
RUN npm install --production
ENTRYPOINT []
CMD [ "npm","run","start:prod" ]