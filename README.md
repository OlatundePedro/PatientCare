## 📁 Project Structure

The LASUTH Patient Care platform is organized into four main areas:

- **Mobile App:** Patient-facing mobile application.
- **Frontend:** Web application interface.
- **Backend:** API, authentication, business logic, and data management.
- **Admin:** Administrative dashboard for managing platform operations.

```text
LASUTH-Patient-App/
│
├── mobile/                         # Patient mobile application
│   ├── app/
│   │   ├── (tabs)/
│   │   │   ├── _layout.jsx
│   │   │   ├── index.jsx
│   │   │   ├── appointments.jsx
│   │   │   ├── consultations.jsx
│   │   │   ├── prescriptions.jsx
│   │   │   └── profile.jsx
│   │   ├── _layout.jsx
│   │   ├── sign-in.jsx
│   │   ├── sign-up.jsx
│   │   ├── forgot-password.jsx
│   │   ├── terms.jsx
│   │   └── privacy-policy.jsx
│   │
│   ├── assets/
│   │   └── images/
│   │       ├── logo.png
│   │       └── ayinke.png
│   │
│   ├── components/
│   │   └── CurvedTabBar.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── constants/
│   ├── hooks/
│   ├── services/
│   ├── app.json
│   ├── eas.json
│   └── package.json
│
├── frontend/                       # Web application
│   ├── public/                     # Static assets
│   ├── src/
│   │   ├── assets/                 # Images, icons, fonts
│   │   ├── components/             # Reusable UI components
│   │   ├── pages/                  # Application pages
│   │   ├── layouts/                # Shared page layouts
│   │   ├── routes/                 # Route definitions
│   │   ├── services/               # API communication
│   │   ├── hooks/                  # Custom hooks
│   │   ├── context/                # Shared application state
│   │   ├── utils/                  # Helper functions
│   │   └── styles/                 # Global and component styles
│   ├── .env.example
│   └── package.json
│
├── backend/                        # Backend API
│   ├── src/
│   │   ├── config/                 # Environment and service config
│   │   ├── controllers/            # Request handlers
│   │   ├── middleware/             # Authentication and validation
│   │   ├── models/                 # Data models
│   │   ├── routes/                 # API route definitions
│   │   ├── services/               # Business logic
│   │   ├── utils/                  # Shared utilities
│   │   ├── validators/             # Input validation
│   │   └── server.js               # API entry point
│   ├── tests/                      # Automated tests
│   ├── .env.example
│   └── package.json
│
├── admin/                          # Admin dashboard
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── utils/
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── README.md
└── package.json                    # Optional workspace root
```

## 🧩 Component Responsibilities

### Mobile App

The patient-facing application provides account registration and sign-in, appointment booking, online consultations, prescription access, and patient profile management.

### Frontend

The web interface provides browser-based access to the platform's supported features. It communicates with the backend API for data and application operations.

### Backend

The backend exposes API endpoints, handles authentication and authorization, validates requests, applies business rules, and communicates with the database and other integrated services.

### Admin Dashboard

The admin interface provides authorized personnel with administrative tools for managing supported platform operations. Access should be protected by role-based authorization enforced by the backend.

## 🛠️ Technology Stack

| Layer           | Technology                               |
| --------------- | ---------------------------------------- |
| Mobile          | React Native, Expo, Expo Router          |
| Web frontend    | Confirm against the actual project       |
| Admin dashboard | Confirm against the actual project       |
| Backend         | Confirm against the actual project       |
| Database        | Confirm against the actual configuration |
| Version control | Git and GitHub                           |

## 🔐 Environment Configuration

Each application should use its own environment configuration where appropriate.

- Keep actual secrets and credentials out of version control.
- Provide `.env.example` files containing variable names and safe placeholder values.
- Configure API base URLs separately for local development, testing, and production.
- Enforce authentication and authorization on the backend, including administrative access.

## 🚀 Getting Started

Each application may have its own installation and startup commands. Consult the relevant `package.json` and project configuration before running commands.

```bash
# Navigate to the required application
cd backend

# Install its dependencies
npm install

# Run the script defined in package.json
npm run dev
```

Repeat with the appropriate directory and available scripts for the mobile app, frontend, and admin dashboard.

```

```
