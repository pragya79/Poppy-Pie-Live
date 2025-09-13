# Poppy Pie Live

🚀 **Modern Marketing Agency Website** - A Next.js application for Poppy Pie, featuring portfolio showcase, content management, and admin capabilities.

**Live Site:** [https://www.thepoppypie.com](https://www.thepoppypie.com)

## Overview

Poppy Pie Live is a full-stack marketing agency website built with Next.js 15 and modern React. It combines a stunning frontend portfolio with a powerful admin dashboard for content management.

### Key Features

✨ **Frontend Experience**

- Animated hero section with testimonials carousel
- Interactive portfolio gallery with filtering
- Service showcase and company statistics
- Responsive design with smooth animations (Framer Motion & GSAP)
- Contact forms and inquiry management

🔧 **Admin Dashboard**

- Blog post management (Create, Edit, Delete, Publish)
- Job posting system with applications tracking
- Analytics dashboard with insights
- Inquiry management system
- User authentication and role-based access

🛠 **Technical Features**

- Rich text editor (TipTap) for content creation
- Image uploads with Cloudinary integration
- SEO optimization with dynamic meta tags
- Email notifications (Nodemailer)
- MongoDB database with Mongoose ODM

## Tech Stack

**Frontend**

- Next.js 15 with App Router
- React 18 with Hooks
- Tailwind CSS + Radix UI components
- Framer Motion & GSAP for animations
- TipTap rich text editor

**Backend & Database**

- MongoDB with Mongoose ODM
- NextAuth.js for authentication
- Cloudinary for image management
- Nodemailer for email services

**Development**

- ESLint for code quality
- PostCSS for CSS processing
- Turbopack for fast development

## Quick Start

### Prerequisites

- Node.js 18+
- MongoDB database
- Cloudinary account (for images)

### Installation

```bash
# Clone the repository
git clone https://github.com/pragya79/Poppy-Pie-Live.git
cd Poppy-Pie-Live

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

### Environment Variables

Create a `.env.local` file with:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_password
```

## Project Structure

```
app/
├── (pages)/                # Public pages (home, about, services)
├── admin/                  # Admin dashboard
│   ├── blog/              # Blog management
│   ├── jobs/              # Job posting system
│   └── analytics/         # Dashboard analytics
├── api/                   # API routes
│   ├── auth/              # Authentication
│   ├── posts/             # Blog API
│   └── jobs/              # Jobs API
└── components/            # Reusable UI components

components/ui/             # Shared UI components
models/                    # MongoDB schemas
lib/                      # Utilities and configurations
```

## Scripts

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is proprietary and confidential. All rights reserved by Poppy Pie.

---

**Built with ❤️ by the Poppy Pie team**
