FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
# If package-lock exists, it will use it. If not, it will generate it.
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
