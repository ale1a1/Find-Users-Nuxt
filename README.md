# Find Users App

A full-stack web application for discovering and connecting with professionals. Browse a directory of users, save favourites, and manage your own profile — built with Nuxt 3, Firebase, and Tailwind CSS 4.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Nuxt 3](https://nuxt.com) (v3.15) |
| UI | [Vue 3](https://vuejs.org) + [Tailwind CSS 4](https://tailwindcss.com) |
| State | [Pinia](https://pinia.vuejs.org) |
| Backend / Auth | [Firebase](https://firebase.google.com) (Auth + Firestore) |
| Image Uploads | [Cloudinary](https://cloudinary.com) |
| Icons | [Lucide Vue Next](https://lucide.dev) |
| Notifications | [vue3-toastify](https://vue3-toastify.js-bridge.com) |

---

## Features

- **Authentication** — Email/password login, registration, email verification, and password reset via Firebase Auth
- **User Directory** — Browse all registered users with sortable, filterable table (profession, country, open-to-work status)
- **Favourites** — Save users to a personal favourites list, managed in Firestore
- **Profile Management** — Update name, profession, country, profile picture (Cloudinary upload), and open-to-work status
- **Responsive Design** — Mobile-first layout with dedicated mobile list view, tap-to-open user modals, and per-page pagination
- **Glassmorphism UI** — Frosted-glass cards, blurred background, amber accent palette

---

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with **Authentication** and **Firestore** enabled
- A Cloudinary account with an unsigned upload preset named `profile_upload`

### Environment Variables

Create a `.env` file in the project root:

```env
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

### Install & Run

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Project Structure

```
├── pages/
│   ├── index.vue          # Home / landing
│   ├── login.vue          # Login page
│   ├── users-list.vue     # Full user directory
│   ├── favourites.vue     # Saved favourites
│   ├── profile.vue        # Edit own profile
│   └── action.vue         # Firebase email action handler
├── components/
│   ├── usersTable.vue     # Directory table with filters & mobile view
│   ├── favsTable.vue      # Favourites table with filters & mobile view
│   ├── userDetails.vue    # Profile edit form
│   ├── footer.vue
│   ├── login.vue
│   ├── registration-modal.vue
│   └── forgot-password-modal.vue
├── stores/
│   ├── userStore.ts       # Auth token + user profile state
│   └── loginRedirect.ts   # Post-login redirect state
└── app.vue                # Root layout, nav, auth listener
```

---

## Deployment

The app can be deployed to any platform that supports Node.js SSR or static output.

```bash
# SSR build (Node server)
npm run build

# Static site generation
npm run generate
```

Recommended platforms: [Vercel](https://vercel.com), [Netlify](https://netlify.com), [Firebase Hosting](https://firebase.google.com/docs/hosting).

---

## Author

**Alessandro Ladu** — [GitHub](https://github.com/ale1a1)
