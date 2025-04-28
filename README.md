# Poppy Pie Live

Welcome to the **Poppy Pie Live** repository!  
This project is a **Next.js-based frontend application** for managing blog posts, deployed live at [https://www.thepoppypie.com](https://www.thepoppypie.com).  
It features **user authentication, CRUD operations, and a responsive UI**, integrating with a **MongoDB backend** via API routes using modern web technologies.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Git Commands](#git-commands)
- [Usage](#usage)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

This repository hosts the **frontend codebase for Poppy Pie Live**, a blog management system.  
It provides an admin interface to **Create, Read, Update, and Delete** blog posts, with features like **search**, **filtering**, and **image support**.  
Built using **Next.js**, **React**, and **Tailwind CSS**, with authentication handled via a custom `AuthProvider`.

---

## Features

- **User authentication** with login redirection.
- **CRUD operations** for blog posts.
- **Search and filter functionality** by status, category, and keywords.
- **Responsive layout** for displaying blog posts.
- **Support for featured images** with URL input.
- **Real-time state management** with React hooks.

---

## Folder Structure

```plaintext
Poppy-Pie-Live/
├── .next/                  # Next.js build output (generated on build)
├── app/                    # Next.js app directory
│   ├── admin/              # Admin section
│   │   └── blog/           # Blog management page
│   │       └── page.js     # Admin blog component
│   ├── api/                # API routes
│   │   ├── posts/          # Blog post API endpoints
│   │   │   ├── route.js    # GET/POST for all posts
│   │   │   └── [id]/       # PUT/DELETE for individual posts
│   │   └── auth/           # Authentication routes
│   │       └── [...nextauth]/
│   │           └── route.js # NextAuth configuration
│   └── components/         # Reusable UI components
│       └── context/        # Context providers
│           └── AuthProvider.js
├── components/             # Additional reusable components
├── lib/                    # Utility libraries or configurations
├── models/                 # Mongoose models
│   └── Blog.js             # Blog post schema
├── public/                 # Static assets
├── .env.local              # Environment variables
├── .gitignore              # Git ignore file
├── components.json         # Component configuration
├── eslint.config.mjs       # ESLint configuration
├── jsconfig.json           # JavaScript path aliases
├── next.config.mjs         # Next.js configuration
├── package-lock.json       # Dependency tree
├── package.json            # Project metadata and dependencies
├── postcss.config.mjs      # PostCSS configuration
└── README.md               # This file
