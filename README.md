# Sartiq.ai Caption Manager

A lightweight Next.js app for configuring and launching automatic image captioning, then browsing and editing results.  
Built for the Sartiq “Caption Manager” challenge.

## Quickstart

```bash
npm install
npm run dev
```



## Tech Stack

- Next.js (App Router)
    
- TypeScript
    
- Tailwind CSS



## Features

- Datasets — Create datasets and upload images individually, in batches, or via `.zip` archives.
    
- Profiles — Create, read, update, and delete reusable captioning profiles with system prompts.
    
- Task Launcher — Select a Dataset, Profile, and Model to start a (mocked) captioning job.
    
- Explorer — Browse images with inline caption editing and save support.
    


## Extra Dependencies

- fflate — Handles `.zip` file extraction client-side; can be swapped for a backend API later.



## Architecture

```
app/
  components/
	├── DatasetList/     # List of datasets
    ├── Menu/            # Sidebar navigation
    ├── TaskLauncher/    # Launch captioning jobs (mocked)
    ├── UploaderZip/     # Upload images or .zip archives
  explorer/[datasetId]/  # Image gallery with inline caption editing
  profiles/              # Profiles management page
  page.tsx               # Landing page + Datasets overview
lib/
  idb.ts                 # IndexedDB bootstrap + object stores & indexes
  repo.ts                # Thin data-access layer built on top of idb.ts
```

Architecture Overview:

- UI Layer — React components built with Tailwind for fast iteration and clean design.
    
- Data Layer — IndexedDB abstraction via `lib/repo.ts` for local persistence.
    
- Adapters (future) — Planned layer for integrating external captioning APIs or models (OpenAI, Claude, etc.).
    
- Task Flow — Each task links a Dataset, a Profile, and a chosen Model; all operations are currently mocked for demonstration.



## Future Improvements

- Search and filter in Explorer for better dataset management.
	
- Import/export datasets and profiles (JSON).
	
- Zip upload progress and drag-and-drop UI.
    
- Model adapter system for real caption generation (OpenAI, Claude, Gemini, etc.).
    
- Job queue with live status updates and notifications.
    
- Enhanced UX — toasts, animations, and accessibility refinements.
    
- Optional backend — replace IndexedDB with an API + database for persistence and collaboration.
    
- Testing — lightweight coverage for core CRUD and upload flows.
    