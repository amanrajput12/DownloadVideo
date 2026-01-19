# Use official Node image
FROM node:18

# Install ffmpeg and python3
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip curl

# Install yt-dlp via pip
RUN pip3 install yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and install node modules
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

# Expose port
EXPOSE 5000

# Start the app
CMD ["npm", "start"]
