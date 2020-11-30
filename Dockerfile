#dockerfile
FROM node:current-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install 
COPY . ./
CMD ["npm", "start"]