# 🎓 E-Learning Platform

A comprehensive, modern, and engaging e-learning platform built to seamlessly connect dedicated trainers with eager learners. 

Designed with a premium aesthetic and rich user experience, it handles authentication, multi-role dashboards, rich text course creation, multimedia support, and integrated payments.

---

## 🚀 Features

### For Trainees
- **Seamless Learning Journey:** Intuitive progress tracking and course continuation features.
- **Course Exploration:** Browse available courses, view detailed descriptions, and filter based on needs.
- **Secure Payments:** Integrated with Stripe for smooth, reliable transactions.
- **Dynamic Content:** Watch video content directly via YouTube integrations, read formatted content, and track completion progress.

### For Trainers
- **Course Management:** Create, manage, and update comprehensive courses.
- **Rich Media Editing:** Built-in powerful rich text editor using Quill.
- **Media Uploads:** Effortlessly attach images and videos to course materials (powered by Cloudinary).
- **Dashboard Analytics:** Oversee active courses and manage trainees effectively.

### General Platform Features
- **Robust Authentication:** Secure, frictionless sign-in and sign-up powered by Clerk.
- **Modern & Responsive UI:** Built dynamically with Framer Motion, Tailwind CSS v4, and Lucide React icons.
- **Premium Aesthetics:** State-of-the-art UI elements, micro-animations, and harmonized color palettes ensuring a top-tier visual experience.

---

## 💻 Tech Stack

### Frontend (Client)
- **Framework:** React 19 / Vite
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Routing:** React Router v7
- **Auth:** `@clerk/clerk-react`
- **Other Utilities:** Axios, React Toastify, RC Progress, React YouTube, Quill (Rich Text Editor)

### Backend (Server)
- **Server Environment:** Node.js, Express.js
- **Database:** MongoDB & Mongoose
- **Payments:** Stripe
- **Authentication Webhooks:** `@clerk/express` & Svix
- **Media Hosting:** Cloudinary
- **File Uploads:** Multer

---

## 🛠️ Getting Started

Follow these instructions to run the project locally.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed along with a package manager like npm. You will also need accounts for external services to grab your API keys (Clerk, Stripe, Cloudinary, MongoDB).

### 1. Clone & Install Dependencies

Open your terminal and execute the following commands in the root of the project to install both client and server dependencies.

```bash
# Navigate to the client directory
cd client
npm install

# In a new terminal tab, navigate to the server
cd ../server
npm install
```

### 2. Environment Variables

You must set up `.env` files in both your `client` and `server` directories with the appropriate credentials.

**Client (`client/.env`)**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_API_BASE_URL=http://localhost:5000 # Example base URL
```

**Server (`server/.env`)**
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_svix_webhook_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### 3. Run the Development Servers

**Run Backend Server**
```bash
cd server
npm run server
```

**Run Frontend Client**
```bash
cd client
npm run dev
```

Visit the frontend URL displayed by Vite in your browser to explore the platform locally.

---

## 🎨 Design Philosophy

This platform was built prioritizing "Visual Excellence" and "Dynamic Design", emphasizing vivid colors, deep aesthetic integration, non-standard typography, state-enhancing animations, and responsive interactions to create an application that doesn't just work—it wows.

## 📄 License

This project is licensed under the ISC License.
