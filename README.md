# AI Email Extractor

This contains everything you need to run your app locally and deploy it to GitHub Pages.

## Run Locally

### Option 1: Using Node.js

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

### Option 2: Using Docker

**Prerequisites:** Docker and Docker Compose

1. Set your Gemini API key in the .env.local file
2. Build and run the Docker container:
   ```
   docker-compose up
   ```
   Or without docker-compose:
   ```
   docker build -t ai-email-extractor .
   docker run -p 8080:80 --env-file .env.local ai-email-extractor
   ```
3. Access the application at http://localhost:8080

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup

1. Push this repository to GitHub
2. Go to your repository settings on GitHub
3. Navigate to "Secrets and variables" > "Actions"
4. Add a new repository secret named `GEMINI_API_KEY` with your Gemini API key
5. Go to "Pages" in the repository settings
6. Under "Build and deployment", select "GitHub Actions" as the source

The application will be automatically deployed whenever you push to the main branch.
