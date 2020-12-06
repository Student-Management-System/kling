FROM node:14

# Create app directory
WORKDIR /usr/src/app

RUN mkdir submissions

VOLUME /submissions

# Install app dependencies
# Use wildcard to copy package.json and package-lock.json
COPY package*.json ./
RUN npm install

# Copy directory
COPY  . .

EXPOSE 3100

ENV NODE_ENV=development

CMD [ "node", "dist/main" ]

