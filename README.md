# AI Shorts OS for Agencies

A production-minded, local-first web application that turns long-form videos into multiple short-form clips optimized for social media platforms. Built for agencies, marketers, and content operators.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/Node-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg)

## 🎯 What It Does

1. **Upload** a long video (podcast, interview, tutorial, etc.)
2. **Choose** content type, target platform, and visual style
3. **AI analyzes** the video and detects engaging moments
4. **Generate** multiple short clips with captions
5. **Export** vertical videos ready for TikTok, Reels, Shorts
6. **Share** approval links with clients for feedback

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                       │
├─────────────────────────────────────────────────────────────┤
│  API Routes  │  Dashboard  │  Projects  │  Clients  │  etc. │
├─────────────────────────────────────────────────────────────┤
│                    Job Queue (Background)                    │
│   Ingest → Transcribe → Generate Clips → Export → Approval  │
├─────────────────────────────────────────────────────────────┤
│  Providers (Pluggable)                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐ │
│  │Transcription│  │Clip Scoring │  │     Storage         │ │
│  │ Whisper.cpp │  │   Ollama    │  │   Local / S3        │ │
│  │   OpenAI    │  │   OpenAI    │  │                     │ │
│  └─────────────┘  └─────────────┘  └─────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│  FFmpeg + ffprobe (Video Processing)                         │
├─────────────────────────────────────────────────────────────┤
│  SQLite Database (Prisma ORM)                                │
└─────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
ai-shorts-os/
├── app/
│   ├── (auth)/              # Auth pages (login, register)
│   ├── dashboard/           # Dashboard pages
│   │   ├── clients/         # Client management
│   │   ├── projects/        # Project management
│   │   └── approvals/       # Approval pages
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── clients/         # Client CRUD
│   │   ├── projects/        # Project CRUD
│   │   ├── uploads/         # File uploads
│   │   ├── transcripts/     # Transcript management
│   │   ├── clips/           # Clip operations
│   │   ├── exports/         # Export jobs
│   │   └── approvals/       # Public approval endpoints
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── dashboard/           # Dashboard components
│   ├── player/              # Video player components
│   ├── transcript/          # Transcript viewer
│   ├── clips/               # Clip management
│   └── approvals/           # Approval components
├── lib/
│   ├── ai/                  # AI utilities
│   ├── auth/                # Authentication helpers
│   ├── db/                  # Database client
│   ├── jobs/                # Job queue system
│   ├── presets/             # Content/Platform/Style presets
│   ├── providers/           # Provider interfaces
│   ├── storage/             # Storage abstraction
│   ├── validations/         # Zod schemas
│   └── video/               # FFmpeg helpers
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data
├── worker/
│   ├── index.ts             # Worker process
│   ├── jobs/                # Job definitions
│   └── processors/          # Job processors
├── data/
│   ├── uploads/             # Uploaded videos
│   ├── renders/             # Exported clips
│   ├── temp/                # Temporary files
│   └── transcripts/         # Audio/transcript files
└── styles/
    └── globals.css          # Global styles
```

## 🚀 Quick Start (Windows)

### Prerequisites

1. **Node.js 18+**
   - Download from: https://nodejs.org/
   - Verify: `node --version`

2. **FFmpeg**
   - Download from: https://www.gyan.dev/ffmpeg/builds/
   - Download `ffmpeg-release-essentials.zip`
   - Extract to `C:\ffmpeg`
   - Add to PATH:
     - Open "Environment Variables" (search in Start menu)
     - Edit "Path" under System variables
     - Add `C:\ffmpeg\bin`
   - Verify: `ffmpeg -version` and `ffprobe -version`

3. **Git** (optional, for cloning)
   - Download from: https://git-scm.com/

### Installation

1. **Clone or download the project**
   ```powershell
   cd C:\Users\%USERNAME%
   # If cloning: git clone <repo-url> ai-shorts-os
   cd ai-shorts-os
   ```

2. **Install dependencies**
   ```powershell
   npm install
   ```

3. **Set up environment variables**
   ```powershell
   # Copy the example env file
   copy .env.example .env
   ```
   
   Edit `.env` if needed (defaults work for local development)

4. **Initialize database**
   ```powershell
   # Generate Prisma client
   npm run db:generate
   
   # Create database tables
   npm run db:push
   
   # Seed demo data
   npm run db:seed
   ```

5. **Start the application**
   ```powershell
   # Option A: Run both web app and worker
   npm run dev:all
   
   # Option B: Run separately (in different terminals)
   npm run dev        # Web app
   npm run worker     # Background worker
   ```

6. **Open in browser**
   - Web App: http://localhost:3000
   - Demo Login: `demo@aishortsos.com` / `demo123`

## 📋 Features

### V1 Features (Implemented)

- ✅ User authentication (email/password)
- ✅ Workspace management
- ✅ Client CRUD operations
- ✅ Project CRUD operations
- ✅ Video upload (local file)
- ✅ Long-video URL input
- ✅ Content type selector (10 types)
- ✅ Target platform selector (6 platforms)
- ✅ Style preset selector (10 styles)
- ✅ Transcription job (whisper.cpp stub)
- ✅ Transcript viewer with timestamps
- ✅ Clip candidate generation
- ✅ Clip scoring system
- ✅ Clip preview page
- ✅ Trim controls (start/end)
- ✅ Caption style presets
- ✅ Export to MP4
- ✅ Public approval page with token
- ✅ Approve/reject/comment feedback
- ✅ Job tracking UI
- ✅ Background worker process

### Coming Soon

- ⏳ Social media publishing
- ⏳ Advanced analytics
- ⏳ Payments/billing
- ⏳ Team roles
- ⏳ White-label domains
- ⏳ Public API

## 🎨 Content Types

| Type | Icon | Best For |
|------|------|----------|
| Podcast | 🎙️ | Interviews, discussions |
| Gaming | 🎮 | Gameplay, streams |
| Interview | 🎤 | Q&A sessions |
| Tutorial | 📚 | How-to guides |
| Webinar | 📊 | Presentations |
| Vlog | 📹 | Daily life content |
| Motivation | 💪 | Inspirational content |
| News | 📰 | Current events |
| Nature | 🌿 | Wildlife, outdoors |
| Review | ⭐ | Product reviews |

## 📱 Target Platforms

| Platform | Aspect Ratio | Duration | Style Notes |
|----------|--------------|----------|-------------|
| TikTok | 9:16 | 15-60s | Fast pacing, bold captions |
| YouTube Shorts | 9:16 | 15-60s | Clean aesthetic |
| Instagram Reels | 9:16 | 15-90s | Polished look |
| Facebook Reels | 9:16 | 15-60s | General audience |
| X (Twitter) | 9:16 | 15-45s | Compact, punchy |
| LinkedIn | 9:16 | 30-90s | Professional tone |

## 🎬 Style Presets

| Style | Description |
|-------|-------------|
| Clean | Minimal styling |
| Cinema | Cinematic look, letterbox |
| Black & White | Grayscale, dramatic |
| Nature | Warm, calm tones |
| Gaming Neon | Vivid, high-energy |
| Podcast Studio | Professional podcast look |
| Documentary | Film documentary style |
| Luxury | Premium, elegant |
| Dark Dramatic | Moody, dramatic |
| Warm Creator | Friendly creator aesthetic |

## 🔧 Configuration

### Environment Variables

```env
# Database
DATABASE_URL="file:./data/dev.db"

# Authentication
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"

# Application
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# File Upload
MAX_FILE_SIZE="5368709120"  # 5GB
UPLOAD_DIR="./data/uploads"
RENDERS_DIR="./data/renders"
TEMP_DIR="./data/temp"

# FFmpeg
FFMPEG_PATH="ffmpeg"
FFPROBE_PATH="ffprobe"

# AI Providers
TRANSCRIPTION_PROVIDER="whisper_cpp"  # or "openai"
CLIP_SCORING_PROVIDER="ollama"        # or "openai", "anthropic"
OLLAMA_BASE_URL="http://localhost:11434"

# Storage
STORAGE_PROVIDER="local"  # or "s3"
```

## 🛠️ Development

### Available Scripts

```powershell
# Development
npm run dev          # Start Next.js dev server
npm run worker       # Start background worker
npm run dev:all      # Start both concurrently

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:seed      # Seed demo data
npm run db:reset     # Reset and seed database

# Production
npm run build        # Build for production
npm run start        # Start production server
```

### Adding New Features

1. **New API Route**: Add file in `app/api/[route]/route.ts`
2. **New Page**: Add file in `app/[route]/page.tsx`
3. **New Component**: Add file in `components/[category]/`
4. **New Job Type**: Add to `lib/jobs/types.ts` and `processors.ts`
5. **New Provider**: Implement interface in `lib/providers/`

## 📊 Database Schema

Key models:
- **User** - Authentication and user data
- **Workspace** - Organization unit
- **Client** - Client accounts
- **Project** - Video projects with settings
- **Transcript** - Video transcriptions
- **TranscriptSegment** - Timestamped transcript segments
- **ClipCandidate** - AI-generated clip suggestions
- **Export** - Rendered clip exports
- **ApprovalLink** - Client approval tokens
- **ApprovalFeedback** - Client feedback
- **Job** - Background job queue

## 🔐 Security

- JWT-based authentication
- HTTP-only cookies for tokens
- Password hashing with bcrypt
- Input validation with Zod
- SQL injection prevention (Prisma ORM)
- CORS configuration

## 🚨 Troubleshooting

### FFmpeg not found
```powershell
# Check installation
ffmpeg -version

# If not found, add to PATH or set in .env
FFMPEG_PATH="C:\ffmpeg\bin\ffmpeg.exe"
```

### Database errors
```powershell
# Reset database
npm run db:reset

# Or manually delete and recreate
rm data/dev.db
npm run db:push
npm run db:seed
```

### Port already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>
```

### Worker not processing jobs
```powershell
# Check worker is running
npm run worker

# Check job queue
# Look at browser console for job status
```

## 📝 API Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - List clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Uploads
- `POST /api/uploads` - Upload video file

### Clips
- `PUT /api/clips/:id` - Update clip
- `DELETE /api/clips/:id` - Delete clip

### Exports
- `POST /api/exports` - Create export
- `GET /api/exports/:id` - Get export status

### Approvals
- `POST /api/approvals/link` - Create approval link
- `GET /api/approvals/:token` - Get approval page data
- `POST /api/approvals/feedback` - Submit feedback

## 🤝 Contributing

Contributions welcome! Areas for improvement:
- Better AI clip detection algorithms
- Whisper AI integration for real captions
- Additional social media platform exports
- Real-time collaboration features
- Advanced analytics dashboard

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database ORM by [Prisma](https://prisma.io/)
- Video processing with [FFmpeg](https://ffmpeg.org/)

---

**Built with ❤️ for agencies and content creators**
