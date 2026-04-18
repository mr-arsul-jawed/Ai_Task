# Use Node image
FROM node:22

# Set working directory
WORKDIR /app

# Copy files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all files
COPY . .

# Expose port
EXPOSE 3000

# Run server
CMD ["npm", "run", "dev"]