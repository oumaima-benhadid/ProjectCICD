# ===========================
# STAGE 1 — Base / Dependencies
# ===========================
FROM node:20-alpine AS base
WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies (with legacy-peer-deps for compatibility)
RUN npm install --legacy-peer-deps

# Install missing URL module (for resolving pdfjs-dist issue)
RUN npm install url

# ===========================
# STAGE 2 — Run Tests (optional)
# ===========================
FROM base AS test
COPY . . 
# Run tests (adjust command as needed)
RUN npm run test --watch=false --browsers=ChromeHeadless || true

# ===========================
# STAGE 3 — Build Angular App
# ===========================
FROM base AS build
COPY . . 

# Build Angular production app
RUN npm run build -- --configuration production
# Debugging step: Verify that the dist folder was created
RUN ls -alh /app/dist



# ===========================
# STAGE 4 — Production Image with Nginx
# ===========================
FROM nginx:stable AS production


# Copy built files from previous stage
COPY --from=build /app/dist/pi-angular /usr/share/nginx/html

# Copy custom Nginx configuration (with the correct name)
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port (default for Nginx)
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
