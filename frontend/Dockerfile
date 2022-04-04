FROM node:13.12.0-alpine

# Copy in the project files
COPY . .

# Clean
USER root
RUN rm -fr node_modules

COPY package*.json ./

RUN npm install && \
    npm cache clean --force

ENV NODE_ENV=production

RUN npm run build

EXPOSE 3000

# Running the app
CMD [ "npm", "start" ]
