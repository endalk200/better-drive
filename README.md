# Better Drive 🚀

Better Drive is a modern, secure file management system inspired by Google Drive. It provides a seamless experience for managing files and folders with features like file upload, folder organization, and storage management.

## Features ✨

### Authentication & Security

- ✅ GitHub OAuth integration
- ✅ Secure session management
- ✅ Protected API routes
- ✅ Type-safe API calls with tRPC

### File Management

- ✅ File upload with drag & drop support
- ✅ Multiple file upload
- ✅ File size limitations (8MB per file)
- ✅ Storage quota management (50MB per user)
- ✅ File type validation
- ✅ Progress tracking for uploads

### Folder Management

- ✅ Create folders
- ✅ Nested folder structure
- ✅ Rename folders
- ✅ Delete folders with cascade
- ✅ Star/unstar folders
- ✅ Default "Home" folder for new users

### User Interface

- ✅ Modern, responsive design
- ✅ Real-time storage usage indicator
- ✅ File/folder breadcrumb navigation
- ✅ Loading states and error handling
- ✅ Toast notifications
- ✅ Tooltips and confirmations

## Tech Stack 🛠

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **API**: [tRPC](https://trpc.io/)
- **File Upload**: [UploadThing](https://uploadthing.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Package Manager**: [pnpm](https://pnpm.io/)

## Getting Started 🚀

### Prerequisites

- Node.js 18+
- pnpm
- Docker (for local database)
- GitHub OAuth credentials

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/better-drive.git
cd better-drive
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Fill in your `.env` file:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/better-drive"
AUTH_SECRET="your-auth-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
UPLOADTHING_TOKEN="your-uploadthing-token"
```

4. Start the database:

```bash
chmod +x start-database.sh
./start-database.sh
```

5. Run database migrations:

```bash
pnpm db:push
```

6. Start the development server:

```bash
pnpm dev
```

## Available Commands 📜

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format:check` - Check code formatting
- `pnpm format:write` - Fix code formatting
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push database schema
- `pnpm db:studio` - Open Prisma Studio

## Project Architecture 🏗

### Authentication Flow

```mermaid
sequenceDiagram
    User->>+App: Click Login with GitHub
    App->>+GitHub: Redirect to OAuth
    GitHub->>+App: Callback with code
    App->>+Database: Create/Update user
    Database->>+App: User data
    App->>+User: Create session & redirect
```

### File Upload Flow

```mermaid
sequenceDiagram
    User->>+App: Select files
    App->>+UploadThing: Direct upload
    UploadThing->>+App: Upload complete
    App->>+Database: Create file entries
    App->>+Database: Update storage usage
    App->>+User: Show success
```

### Data Model

```mermaid
erDiagram
    User ||--o{ Folder : has
    User ||--o{ File : owns
    Folder ||--o{ File : contains
    Folder ||--o{ Folder : contains
```

### Key Components

1. **Authentication (NextAuth.js)**

   - GitHub OAuth provider configuration
   - Session management
   - Protected API routes
   - Database adapter for Prisma

2. **API Layer (tRPC)**

   - Type-safe API routes
   - Protected procedures
   - File and folder management
   - Storage quota tracking

3. **File Upload (UploadThing)**

   - Direct-to-cloud uploads
   - File type validation
   - Size limitations
   - Progress tracking

4. **Database (Prisma + PostgreSQL)**
   - User management
   - File metadata storage
   - Folder structure
   - Storage usage tracking

## Deployment 🚀

### Vercel Deployment

1. Push your code to GitHub
2. Create a new project on Vercel
3. Connect your repository
4. Set up environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `UPLOADTHING_TOKEN`
5. Deploy!

### Database (Prisma Data Platform)

1. Create a new PostgreSQL database
2. Update `DATABASE_URL` in your Vercel environment variables
3. Run migrations:

```bash
pnpm db:migrate
```

### Post-Deployment

1. Update GitHub OAuth callback URLs
2. Configure UploadThing webhook (if needed)
3. Set up monitoring and alerts

## License 📝

MIT

## Contributing 🤝

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.
