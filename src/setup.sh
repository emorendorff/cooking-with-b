#!/bin/bash

# Color codes for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}Setting up Chef Boyar-B Recipe App...${NC}"

# Install frontend dependencies
echo -e "${GREEN}Installing frontend dependencies...${NC}"
npm install

# Check if user wants to set up the Express backend
read -p "Do you want to set up the Express backend (recommended for production)? (y/n) " setup_express

if [ "$setup_express" = "y" ] || [ "$setup_express" = "Y" ]; then
  # Create server directory if it doesn't exist
  if [ ! -d "server" ]; then
    echo -e "${GREEN}Creating server directory...${NC}"
    mkdir -p server
    mkdir -p server/data
  fi

  # Copy server files if they don't exist
  if [ ! -f "server/index.js" ]; then
    echo -e "${GREEN}Copying server files...${NC}"
    cp -n server-files/index.js server/
    cp -n server-files/package.json server/
  fi

  # Install server dependencies
  echo -e "${GREEN}Installing server dependencies...${NC}"
  (cd server && npm install)
  
  echo -e "${GREEN}Express backend setup complete!${NC}"
else
  # Install JSON Server if not using Express
  echo -e "${GREEN}Setting up JSON Server for development...${NC}"
  npm install -D json-server concurrently
  
  # Create db.json if it doesn't exist
  if [ ! -f "db.json" ]; then
    echo -e "${GREEN}Creating initial db.json file...${NC}"
    echo '{
  "recipes": []
}' > db.json
  fi
  
  echo -e "${GREEN}JSON Server setup complete!${NC}"
fi

echo -e "${BLUE}Setup complete! You can now start the application:${NC}"
if [ "$setup_express" = "y" ] || [ "$setup_express" = "Y" ]; then
  echo -e "${GREEN}Start the Express backend:${NC} cd server && npm run dev"
  echo -e "${GREEN}In another terminal, start the frontend:${NC} npm run dev"
else
  echo -e "${GREEN}Start both frontend and JSON Server:${NC} npm run dev:full"
fi