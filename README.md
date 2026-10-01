# StreamTube — YouTube-Style MERN + Next.js Platform

A portfolio-ready video sharing platform inspired by modern streaming applications.

## Stack
- Next.js 16 + React + JavaScript (web client)
- Node.js + Express.js REST API
- MongoDB + Mongoose
- JWT authentication
- Multer local video/image uploads
- REST endpoints for videos, channels, likes, comments, search and trending

## Included features
- Home feed with featured/trending videos
- Search
- Video detail/player page
- Register/login/logout
- Channel creation and channel pages
- Video upload
- Like/unlike videos
- Comments
- Subscribe/unsubscribe to channels
- View counting
- Trending endpoint
- Responsive UI
- Protected upload/channel actions
- MongoDB data models
- Seed script with demo data
- CORS and environment configuration

## Project structure
```
streamtube/
  server/
    src/
      models/
      middleware/
      routes/
      controllers/
      index.js
    uploads/
    .env.example
    package.json
  web/
    app/
    components/
    lib/
    public/
    .env.local.example
    package.json
```

## Run locally

### 1. MongoDB
Install MongoDB locally or use MongoDB Atlas.

### 2. API
```bash
cd server
npm install
copy .env.example .env
npm run dev
```
Windows PowerShell:
```powershell
Copy-Item .env.example .env
```

Default API: `http://localhost:5000`

### 3. Web
Open another terminal:
```bash
cd web
npm install
copy .env.local.example .env.local
npm run dev
```

Default web: `http://localhost:3000`

## Demo account
After running the seed:
- email: demo@streamtube.dev
- password: Demo@123

Run:
```bash
cd server
npm run seed
```

## Important
This is an educational portfolio implementation, not a production-scale YouTube clone. Production deployments should replace local media storage with object storage/CDN, add transcoding/HLS/DASH, queues, rate limiting, moderation, observability and stronger upload validation.
