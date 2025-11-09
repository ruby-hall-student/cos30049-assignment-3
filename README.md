# cos30049-assignment-3

Spam and Malware Detector - A Next.js web application that analyzes emails and messages for spam and malware indicators.

## Prerequisites

- Node.js (v18 or higher)
- npm or pnpm

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd cos30049-assignment-3
```

2. Install dependencies:

```bash
npm install --legacy-peer-deps
```

Note: Use `--legacy-peer-deps` flag to resolve peer dependency conflicts.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

Build the application for production:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

## Start Backend

Start running the application's back-end

```bash
uvicorn main:app --reload
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Project Structure

- `frontend/` - Stores the scripts for the front end
    - `app/` - Next.js app directory with pages and components
    - `components/` - Reusable UI components
    - `lib/` - Utility functions and analysis logic
    - `public/` - Static assets
- `back-end/` - Stores the scripts for the back end

## Features

- Email spam detection using heuristic analysis
- Interactive D3 visualizations on the learn page
- Real-time analysis in the browser (no data uploaded)
- Feature importance visualization
- Confusion matrix display
