# Shophilly Deployment Script
Write-Host "🚀 Starting deployment for Shophilly..." -ForegroundColor Cyan

# Ensure we are in the right project
Write-Host "📍 Setting GCP Project to: shophilly"
gcloud config set project shophilly

# Build and Deploy to Cloud Run
Write-Host "🏗️  Building and deploying to Cloud Run..."
gcloud run deploy shophilly `
    --source . `
    --region us-central1 `
    --platform managed `
    --allow-unauthenticated `
    --port 8080 `
    --quiet

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🌐 You can now visit Shophilly at the link provided above."
