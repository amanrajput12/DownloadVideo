FROM node:18

RUN apt-get update && apt-get install -y ffmpeg python3

RUN npm install -g yt-dlp

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
