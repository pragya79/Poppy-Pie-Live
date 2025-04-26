Poppy Pie Live
Welcome to the Poppy Pie Live repository! This project is a Next.js-based frontend application for managing blog posts, deployed live at https://www.thepoppypie.com. It features user authentication, CRUD operations, and a responsive UI, integrating with a MongoDB backend via API routes using modern web technologies.
Table of Contents

Overview
Features
Folder Structure
Prerequisites
Installation
Running the Application
Git Commands
Usage
Deployment
Contributing
License
Contact

Overview
This repository hosts the frontend codebase for Poppy Pie Live, a blog management system. It provides an admin interface to create, read, update, and delete blog posts, with features like search, filtering, and image support. The project is built using Next.js, React, and Tailwind CSS, with authentication handled via a custom AuthProvider.
Features

User authentication with login redirection.
CRUD operations for blog posts (Create, Read, Update, Delete).
Search and filter functionality by status, category, and keywords.
Responsive card-based layout for displaying blog posts.
Support for featured images with URL input.
Real-time state management with React hooks.

Folder Structure
Poppy-Pie-Live/
├── .next/                  # Next.js build output (generated on build)
├── app/                    # Next.js app directory
│   ├── admin/              # Admin section
│   │   └── blog/           # Blog management page
│   │       └── page.js     # Main admin blog component
│   ├── api/                # API routes
│   │   ├── posts/          # Blog post API endpoints
│   │   │   ├── route.js    # GET/POST for all posts
│   │   │   └── [id]/       # PUT/DELETE for individual posts
│   │   └── auth/           # Authentication routes
│   │       └── [...nextauth]/
│   │           └── route.js # NextAuth configuration
│   └── components/         # Reusable UI components
│       └── context/        # Context providers
│           └── AuthProvider.js # Authentication context
├── components/             # Additional reusable components (legacy or external)
├── lib/                    # Utility libraries or configurations
├── models/                 # Mongoose models
│   └── Blog.js             # Blog post schema
├── node_modules/           # Node.js dependencies (generated on install)
├── public/                 # Static assets
├── .env.local              # Environment variables (e.g., MONGODB_URI)
├── .gitignore              # Git ignore file
├── components.json         # Component configuration (if applicable)
├── eslint.config.mjs       # ESLint configuration
├── jsconfig.json           # JavaScript configuration for path aliases
├── next.config.mjs         # Next.js configuration
├── package-lock.json       # Exact dependency tree
├── package.json            # Project metadata and dependencies
├── postcss.config.mjs      # PostCSS configuration
└── README.md               # This file

Prerequisites

Node.js: v18.x or later (recommended)
npm: v9.x or later (comes with Node.js)
Git: For version control
MongoDB: A running MongoDB instance (local or remote, e.g., MongoDB Atlas) with a valid connection URI
Code Editor: Visual Studio Code or similar

Installation

Clone the repository:
git clone https://github.com/pragya79/Poppy-Pie-Live.git
cd Poppy-Pie-Live


Install dependencies:
npm install


Set up environment variables:

Create a .env.local file in the root directory.
Add the following (replace with your values):MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=https://www.thepoppypie.com
NEXTAUTH_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret




Ensure MongoDB is running or the connection URI points to a live database.


Running the Application

Start the development server:
npm run dev


Open your browser and navigate to:
http://localhost:3000/admin/blog


Log in if prompted (redirects to /login if not authenticated).


Git Commands
Initial Setup

Initialize a new Git repository (if not cloned):git init


Add remote origin (if setting up a new repo):git remote add origin https://github.com/pragya79/Poppy-Pie-Live.git



Basic Workflow

Check status:git status


Stage changes:git add .

or stage specific files:git add path/to/file


Commit changes:git commit -m "Describe your changes"


Push to remote:git push origin main

(Use main or your default branch name)

Branch Management

Create a new branch:git checkout -b feature-branch-name


Switch branches:git checkout branch-name


Merge branches:git checkout main
git merge feature-branch-name


Delete a branch (after merging):git branch -d feature-branch-name



Syncing with Remote

Pull latest changes:git pull origin main


Fetch and merge:git fetch origin
git merge origin/main


Resolve conflicts (if any):
Edit conflicting files.
Mark as resolved:git add resolved-file
git commit





Undo Changes

Discard uncommitted changes:git restore <file>


Revert a commit:git revert <commit-hash>


Reset to a previous commit (with caution):git reset --hard <commit-hash>



Tagging

Create a tag:git tag -a v1.0.0 -m "Release version 1.0.0"


Push tags:git push origin v1.0.0



Usage

Visit the live site at https://www.thepoppypie.com/admin/blog to manage blog posts.
Use the "New Post" button to create a post, filling in the title, content, and optional fields (e.g., featured image URL).
Search or filter posts using the input and dropdowns.
Edit or delete posts using the respective buttons on each card.
Publish or unpublish posts via the status toggle.
For local development, use http://localhost:3000/admin/blog after running npm run dev.

Deployment

Platform: Deployed on Vercel.
Live URL: https://www.thepoppypie.com
Deployment Process:
Connect your GitHub repository (https://github.com/pragya79/Poppy-Pie-Live.git) to Vercel.
Configure environment variables in Vercel (e.g., MONGODB_URI, NEXTAUTH_URL, etc.) matching .env.local.
Deploy automatically on main branch updates or manually trigger a build.
Access the live site at the assigned domain.



Contributing

Fork the repository.
Create a new branch:git checkout -b feature/your-feature


Make your changes and commit them.
Push to your fork:git push origin feature/your-feature


Open a pull request against the main branch.

License
This project is licensed under the MIT License. See the LICENSE file for details (if applicable).
Contact

Email: contact@poppypie.com
Issues: Report bugs or feature requests here.

