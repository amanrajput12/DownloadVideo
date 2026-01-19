FROM node:18

# Install ffmpeg, python3, pip, curl, venv
RUN apt-get update && apt-get install -y ffmpeg python3 python3-pip python3-venv curl

# Create virtual environment for yt-dlp
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install yt-dlp inside venv
RUN pip install yt-dlp

# Set working directory
WORKDIR /app

# Copy package.json and install node modules
COPY package*.json ./
RUN npm install

# Copy rest of the project
COPY . .

EXPOSE 5000

CMD ["npm", "start"]
