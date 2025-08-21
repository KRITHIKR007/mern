# MERN Stack Agent Management System - Complete Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Installation & Setup](#installation--setup)
4. [Features](#features)
5. [API Documentation](#api-documentation)
6. [Frontend Components](#frontend-components)
7. [Database Schema](#database-schema)
8. [Authentication](#authentication)
9. [File Upload System](#file-upload-system)
10. [Theme System](#theme-system)
11. [Deployment](#deployment)
12. [Contributing](#contributing)
13. [Troubleshooting](#troubleshooting)

## Project Overview

A full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for managing agents and distributing data lists among them. The system features JWT authentication, file upload capabilities, and a modern responsive UI with dark/light theme support.

### Key Highlights
- **Admin Authentication**: Secure JWT-based login system
- **Agent Management**: Create, view, and manage agents
- **File Processing**: Upload and parse CSV/Excel files
- **Data Distribution**: Automatically distribute list items among agents
- **Modern UI**: Premium design with dark/light theme support
- **Responsive Design**: Works seamlessly across all devices

## Architecture

```
MERN Stack Application
├── Frontend (React.js)
│   ├── Components (Reusable UI components)
│   ├── Pages (Route-based views)
│   ├── Context (Global state management)
│   └── Styling (CSS variables & premium themes)
├── Backend (Node.js + Express.js)
│   ├── Controllers (Business logic)
│   ├── Models (MongoDB schemas)
│   ├── Routes (API endpoints)
│   └── Middleware (Authentication & validation)
└── Database (MongoDB)
    ├── Users Collection
    ├── Agents Collection
    └── ListItems Collection
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Quick Start with PowerShell Script

```powershell
# Clone the repository
git clone https://github.com/KRITHIKR007/mern.git
cd mern

# Run the automated setup script
.\start-all.ps1
```

### Manual Setup

#### Backend Setup
```bash
cd backend
npm install

# Create .env file
echo "MONGO_URI=mongodb://localhost:27017/mern_machine_test" > .env
echo "JWT_SECRET=your_super_secret_jwt_key_here" >> .env

# Seed admin user and sample agents
node seedAdmin.js
node seedAgents.js

# Start the server
npm run dev
```

#### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Environment Variables

Create a `.env` file in the backend directory:

```env
MONGO_URI=mongodb://localhost:27017/mern_machine_test
JWT_SECRET=your_super_secret_jwt_key_here
PORT=5000
```

## Features

### 🔐 Authentication System
- JWT-based secure authentication
- Admin login with email/password
- Protected routes and middleware
- Session persistence with localStorage

### 👥 Agent Management
- Create new agents with name, email, phone
- View all agents in a responsive grid
- Search and filter functionality
- Agent assignment for list items

### 📊 File Upload & Processing
- Support for CSV, XLS, and XLSX files
- Automatic file parsing and validation
- Drag-and-drop upload interface
- Progress indicators and error handling

### 📋 List Management
- View uploaded list items
- Automatic distribution among available agents
- Search and pagination
- Export functionality

### 🎨 Premium UI/UX
- Modern glassmorphism design
- Dark and light theme support
- Responsive grid layouts
- Smooth animations and transitions
- Loading states and feedback

## API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### POST /auth/login
Admin login endpoint.

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "admin@example.com",
    "isAdmin": true
  }
}
```

### Agent Endpoints

#### GET /agents
Retrieve all agents.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "agents": [
    {
      "_id": "agent_id",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "createdAt": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /agents
Create a new agent.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890"
}
```

### List Endpoints

#### POST /lists/upload
Upload and process a file.

**Request:**
- Content-Type: multipart/form-data
- File field: 'file'

**Response:**
```json
{
  "message": "File uploaded and processed successfully",
  "processedItems": 150,
  "distributedAmongAgents": 5
}
```

#### GET /lists
Retrieve all list items.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term

## Frontend Components

### Page Components

#### Login.js
- Admin authentication form
- JWT token handling
- Redirect logic after successful login
- Form validation and error handling

#### Dashboard.js
- Main application dashboard
- Statistics overview
- Quick action buttons
- Recent activity display

#### EnhancedAgents.js
- Agent creation form
- Agent listing with search
- Responsive card layout
- Form validation

#### UploadList.js
- File upload interface
- Drag-and-drop functionality
- File type validation
- Upload progress tracking

#### AgentLists.js
- Display uploaded list items
- Pagination and search
- Agent assignment information
- Export functionality

### Reusable Components

#### Header.js
- Navigation bar
- Theme toggle button
- User profile section
- Responsive mobile menu

#### ProtectedRoute.js
- Route protection middleware
- JWT token validation
- Automatic redirects

### Context Providers

#### ThemeContext.js
- Global theme state management
- Dark/light mode toggle
- System theme detection
- localStorage persistence

## Database Schema

### User Model
```javascript
{
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}
```

### Agent Model
```javascript
{
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
}
```

### ListItem Model
```javascript
{
  data: { type: mongoose.Schema.Types.Mixed, required: true },
  assignedAgent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Agent', 
    required: true 
  },
  uploadDate: { type: Date, default: Date.now },
  fileName: { type: String, required: true }
}
```

## Authentication

### JWT Implementation
- Tokens expire in 24 hours
- Stored in localStorage on frontend
- Automatically included in API requests
- Protected routes check token validity

### Admin Credentials
```
Email: admin@example.com
Password: Admin@123
```

### Middleware Protection
```javascript
// Backend middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid token' });
  }
};
```

## File Upload System

### Supported Formats
- CSV (.csv)
- Excel (.xls, .xlsx)

### Processing Flow
1. File validation (type, size)
2. Parse file content using appropriate library
3. Validate data structure
4. Distribute items among available agents
5. Save to database
6. Return processing results

### File Upload Configuration
```javascript
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 
                          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    cb(null, allowedTypes.includes(file.mimetype));
  }
});
```

## Theme System

### CSS Variables Architecture
The application uses a comprehensive CSS variables system for theming:

```css
:root {
  /* Light Theme Colors */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --text-color: #1a202c;
  
  /* Spacing & Layout */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --border-radius: 12px;
  
  /* Shadows & Effects */
  --shadow-light: 0 4px 6px rgba(0, 0, 0, 0.05);
  --shadow-medium: 0 10px 25px rgba(0, 0, 0, 0.1);
}

[data-theme="dark"] {
  --background-color: #0f172a;
  --surface-color: #1e293b;
  --text-color: #f1f5f9;
  /* ... other dark theme variables */
}
```

### Theme Context Implementation
```javascript
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

## Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
```

#### Backend Environment
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your_production_jwt_secret
PORT=5000
```

### Deployment Options

1. **Heroku**: Easy deployment with Git integration
2. **Vercel/Netlify**: Frontend deployment with serverless functions
3. **DigitalOcean**: VPS deployment with PM2 process manager
4. **AWS**: EC2 with Load Balancer and RDS

### PM2 Configuration
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'mern-backend',
    script: './backend/index.js',
    instances: 'max',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    }
  }]
};
```

## Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make changes and commit: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Code Style
- Use ESLint for JavaScript linting
- Follow React best practices
- Use meaningful component and variable names
- Add comments for complex logic

### Testing
```bash
# Frontend tests
cd frontend
npm test

# Backend tests (if implemented)
cd backend
npm test
```

## Troubleshooting

### Common Issues

#### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB service
net start MongoDB  # Windows
sudo systemctl start mongod  # Linux/Mac
```

#### "JWT token invalid"
- Check if JWT_SECRET is properly set in .env
- Clear localStorage in browser
- Re-login to get fresh token

#### "File upload fails"
- Check file size (max 10MB)
- Verify file format (CSV, XLS, XLSX only)
- Check backend uploads directory permissions

#### "CSS styles not loading"
- Clear browser cache
- Check if style.css is imported in index.js
- Verify CSS variables are defined

### Performance Optimization

#### Frontend
- Implement React.memo for expensive components
- Use lazy loading for routes
- Optimize images and assets
- Enable gzip compression

#### Backend
- Add database indexing
- Implement API caching
- Use MongoDB aggregation pipelines
- Add rate limiting

### Monitoring
- Add error logging with Winston
- Implement health check endpoints
- Monitor MongoDB performance
- Set up alerts for critical errors

## Version History

- **v1.0.0**: Initial release with basic CRUD operations
- **v1.1.0**: Added premium UI design and theme system
- **v1.2.0**: Enhanced file upload with better error handling
- **v1.3.0**: Added responsive design and mobile optimization

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@example.com
- GitHub Issues: [Create an issue](https://github.com/KRITHIKR007/mern/issues)
- Documentation: [View docs](https://github.com/KRITHIKR007/mern/wiki)

---

*Built with ❤️ using the MERN Stack*
