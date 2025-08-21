# Frontend Component Documentation

## Overview

This document provides detailed information about all React components used in the MERN Stack Agent Management System. The frontend follows modern React patterns with hooks, context API, and functional components.

---

## Application Structure

```
src/
├── App.js                 # Main application component
├── index.js              # Entry point
├── style.css             # Global styles and CSS variables
├── ProtectedRoute.js     # Route protection component
├── components/           # Reusable UI components
│   └── Header.js        # Navigation header
├── contexts/            # Global state management
│   └── ThemeContext.js  # Theme switching context
└── pages/               # Route-based page components
    ├── Login.js         # Authentication page
    ├── Dashboard.js     # Main dashboard
    ├── EnhancedAgents.js # Agent management
    ├── UploadList.js    # File upload interface
    └── AgentLists.js    # List items display
```

---

## Core Components

### App.js

**Purpose**: Main application component that handles routing and theme application.

**Props**: None

**State**: 
- Theme state from ThemeContext

**Key Features**:
- React Router setup
- Theme detection and application
- Protected route configuration
- Global theme class management

```javascript
// Key implementation details
const App = () => {
  const { isDark } = useTheme();
  
  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.body.className = isDark ? 'dark-theme' : 'light-theme';
  }, [isDark]);

  return (
    <Router>
      <div className={`App ${isDark ? 'dark-theme' : 'light-theme'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          {/* Other protected routes */}
        </Routes>
      </div>
    </Router>
  );
};
```

**Dependencies**:
- `react-router-dom`
- `ThemeContext`
- All page components

---

## Page Components

### Login.js

**Purpose**: Admin authentication interface with form validation and JWT handling.

**Props**: None

**State**:
```javascript
const [formData, setFormData] = useState({
  email: '',
  password: ''
});
const [loading, setLoading] = useState(false);
const [error, setError] = useState('');
```

**Key Features**:
- Form validation
- JWT token storage
- Automatic redirect after login
- Error handling and display
- Loading states
- Premium form styling

**API Calls**:
- `POST /api/auth/login`

**Form Validation Rules**:
- Email: Required, valid email format
- Password: Required, minimum 6 characters

```javascript
// Key methods
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const response = await axios.post('/api/auth/login', formData);
    localStorage.setItem('token', response.data.token);
    navigate('/');
  } catch (error) {
    setError(error.response?.data?.error || 'Login failed');
  } finally {
    setLoading(false);
  }
};
```

**CSS Classes Used**:
- `.login-container`
- `.login-card`
- `.form-group`
- `.btn-primary`
- `.error-message`

### Dashboard.js

**Purpose**: Main application dashboard with statistics and navigation.

**Props**: None

**State**:
```javascript
const [stats, setStats] = useState({
  totalAgents: 0,
  totalLists: 0,
  recentUploads: 0
});
const [loading, setLoading] = useState(true);
```

**Key Features**:
- Statistics overview cards
- Quick action buttons
- Recent activity display
- Responsive grid layout
- Loading states

**API Calls**:
- `GET /api/agents` (for count)
- `GET /api/lists` (for count)

```javascript
// Statistics calculation
useEffect(() => {
  const fetchStats = async () => {
    try {
      const [agentsRes, listsRes] = await Promise.all([
        axios.get('/api/agents'),
        axios.get('/api/lists')
      ]);
      
      setStats({
        totalAgents: agentsRes.data.agents.length,
        totalLists: listsRes.data.lists.length,
        recentUploads: listsRes.data.lists.filter(/* recent filter */).length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };
  
  fetchStats();
}, []);
```

**CSS Classes Used**:
- `.dashboard`
- `.stats-grid`
- `.stat-card`
- `.quick-actions`
- `.recent-activity`

### EnhancedAgents.js

**Purpose**: Agent management interface with creation form and listing.

**Props**: None

**State**:
```javascript
const [agents, setAgents] = useState([]);
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: ''
});
const [loading, setLoading] = useState(false);
const [searchTerm, setSearchTerm] = useState('');
const [showForm, setShowForm] = useState(false);
```

**Key Features**:
- Agent creation form with validation
- Real-time search functionality
- Responsive card grid
- Form toggle animation
- Success/error messaging
- Loading states

**API Calls**:
- `GET /api/agents`
- `POST /api/agents`

**Form Validation**:
```javascript
const validateForm = () => {
  const errors = {};
  
  if (!formData.name.trim()) errors.name = 'Name is required';
  if (!formData.email.trim()) errors.email = 'Email is required';
  else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Invalid email format';
  if (!formData.phone.trim()) errors.phone = 'Phone is required';
  else if (formData.phone.length < 10) errors.phone = 'Phone must be at least 10 characters';
  
  return errors;
};
```

**Search Implementation**:
```javascript
const filteredAgents = agents.filter(agent =>
  agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  agent.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  agent.phone.includes(searchTerm)
);
```

**CSS Classes Used**:
- `.agents-page`
- `.agents-header`
- `.agent-form`
- `.agents-grid`
- `.agent-card`
- `.search-box`

### UploadList.js

**Purpose**: File upload interface with drag-and-drop functionality.

**Props**: None

**State**:
```javascript
const [selectedFile, setSelectedFile] = useState(null);
const [uploading, setUploading] = useState(false);
const [uploadProgress, setUploadProgress] = useState(0);
const [message, setMessage] = useState('');
const [dragActive, setDragActive] = useState(false);
```

**Key Features**:
- Drag-and-drop file upload
- File type validation (CSV, Excel)
- Upload progress tracking
- Preview of selected file
- Success/error messaging
- File size validation (max 10MB)

**Supported File Types**:
- CSV (`.csv`)
- Excel (`.xls`, `.xlsx`)

**File Validation**:
```javascript
const validateFile = (file) => {
  const allowedTypes = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];
  
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Only CSV and Excel files are allowed');
  }
  
  if (file.size > 10 * 1024 * 1024) { // 10MB
    throw new Error('File size must be less than 10MB');
  }
  
  return true;
};
```

**Upload Implementation**:
```javascript
const handleUpload = async () => {
  if (!selectedFile) return;
  
  setUploading(true);
  setUploadProgress(0);
  
  const formData = new FormData();
  formData.append('file', selectedFile);
  
  try {
    const response = await axios.post('/api/lists/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(progress);
      }
    });
    
    setMessage(`Success: ${response.data.message}`);
    setSelectedFile(null);
  } catch (error) {
    setMessage(`Error: ${error.response?.data?.error || 'Upload failed'}`);
  } finally {
    setUploading(false);
  }
};
```

**Drag and Drop Handlers**:
```javascript
const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (e.type === 'dragenter' || e.type === 'dragover') {
    setDragActive(true);
  } else if (e.type === 'dragleave') {
    setDragActive(false);
  }
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  
  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
    handleFileSelect(e.dataTransfer.files[0]);
  }
};
```

**CSS Classes Used**:
- `.upload-page`
- `.upload-card`
- `.drop-zone`
- `.drop-zone.active`
- `.file-preview`
- `.progress-bar`

### AgentLists.js

**Purpose**: Display uploaded list items with search and pagination.

**Props**: None

**State**:
```javascript
const [lists, setLists] = useState([]);
const [loading, setLoading] = useState(true);
const [searchTerm, setSearchTerm] = useState('');
const [currentPage, setCurrentPage] = useState(1);
const [pagination, setPagination] = useState({});
const itemsPerPage = 10;
```

**Key Features**:
- Paginated list display
- Search functionality
- Agent assignment display
- Responsive table/card layout
- Export functionality
- Loading states

**API Calls**:
- `GET /api/lists` (with pagination and search)

**Search Implementation**:
```javascript
const handleSearch = debounce((term) => {
  setSearchTerm(term);
  setCurrentPage(1);
  fetchLists(1, term);
}, 300);
```

**Pagination**:
```javascript
const fetchLists = async (page = 1, search = '') => {
  setLoading(true);
  try {
    const response = await axios.get('/api/lists', {
      params: {
        page,
        limit: itemsPerPage,
        search
      }
    });
    
    setLists(response.data.lists);
    setPagination(response.data.pagination);
  } catch (error) {
    console.error('Error fetching lists:', error);
  } finally {
    setLoading(false);
  }
};
```

**CSS Classes Used**:
- `.lists-page`
- `.lists-header`
- `.lists-table`
- `.list-card`
- `.pagination`
- `.search-controls`

---

## Reusable Components

### Header.js

**Purpose**: Application navigation header with theme toggle.

**Props**: None

**State**:
```javascript
const [user, setUser] = useState(null);
```

**Key Features**:
- Navigation menu
- Theme toggle button
- User profile display
- Logout functionality
- Responsive mobile menu
- Active route highlighting

**Theme Toggle Implementation**:
```javascript
const { isDark, toggleTheme } = useTheme();

const ThemeToggle = () => (
  <button 
    className="theme-toggle" 
    onClick={toggleTheme}
    aria-label="Toggle theme"
  >
    {isDark ? '🌙' : '☀️'}
  </button>
);
```

**Navigation Links**:
```javascript
const navLinks = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/agents', label: 'Agents', icon: '👥' },
  { path: '/upload', label: 'Upload', icon: '📁' },
  { path: '/lists', label: 'Lists', icon: '📋' }
];
```

**CSS Classes Used**:
- `.header`
- `.nav-menu`
- `.theme-toggle`
- `.user-profile`
- `.mobile-menu`

### ProtectedRoute.js

**Purpose**: Route protection component for authenticated access.

**Props**:
- `children`: React components to render if authenticated

**Key Features**:
- JWT token validation
- Automatic redirect to login
- Loading state during validation
- Token expiry handling

```javascript
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      // Validate token (decode and check expiry)
      try {
        const decoded = jwt_decode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);
  
  if (loading) return <div className="loading-spinner">Loading...</div>;
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};
```

---

## Context Providers

### ThemeContext.js

**Purpose**: Global theme state management with persistence.

**State**:
```javascript
const [isDark, setIsDark] = useState(() => {
  // Check localStorage first
  const saved = localStorage.getItem('theme');
  if (saved) return saved === 'dark';
  
  // Fall back to system preference
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
});
```

**Methods**:
```javascript
const toggleTheme = () => {
  setIsDark(prev => {
    const newTheme = !prev;
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
    return newTheme;
  });
};
```

**Context Value**:
```javascript
const contextValue = {
  isDark,
  toggleTheme,
  theme: isDark ? 'dark' : 'light'
};
```

**Usage Hook**:
```javascript
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
```

---

## Styling System

### CSS Variables Architecture

The application uses a comprehensive CSS variables system defined in `style.css`:

```css
:root {
  /* Color Palette */
  --primary-color: #667eea;
  --primary-dark: #5a6fd8;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  
  /* Backgrounds */
  --background-color: #ffffff;
  --surface-color: #f8fafc;
  --card-background: rgba(255, 255, 255, 0.95);
  
  /* Text Colors */
  --text-primary: #1a202c;
  --text-secondary: #4a5568;
  --text-muted: #718096;
  
  /* Interactive Elements */
  --border-color: #e2e8f0;
  --hover-color: #f7fafc;
  --focus-color: #667eea;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.15);
  
  /* Borders */
  --border-radius: 12px;
  --border-radius-sm: 6px;
  --border-radius-lg: 16px;
  
  /* Animations */
  --transition-fast: 0.15s ease-in-out;
  --transition-normal: 0.3s ease-in-out;
  --transition-slow: 0.5s ease-in-out;
}
```

### Dark Theme Variables

```css
[data-theme="dark"] {
  --background-color: #0f172a;
  --surface-color: #1e293b;
  --card-background: rgba(30, 41, 59, 0.95);
  
  --text-primary: #f1f5f9;
  --text-secondary: #cbd5e1;
  --text-muted: #94a3b8;
  
  --border-color: #334155;
  --hover-color: #334155;
}
```

### Component-Specific Styles

Each component uses a consistent naming convention:

- **Page containers**: `.page-name` (e.g., `.login-page`, `.dashboard`)
- **Cards**: `.component-card` (e.g., `.login-card`, `.agent-card`)
- **Forms**: `.form-group`, `.form-control`, `.form-label`
- **Buttons**: `.btn`, `.btn-primary`, `.btn-secondary`
- **Grid layouts**: `.grid`, `.grid-2`, `.grid-3`

---

## State Management Patterns

### Local State (useState)
Used for:
- Form inputs
- Loading states
- UI toggles
- Component-specific data

### Context API (ThemeContext)
Used for:
- Global theme state
- User authentication state
- Application-wide settings

### API State Management
```javascript
// Standard pattern for API calls
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/endpoint');
      setData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

---

## Performance Optimizations

### Component Memoization
```javascript
// Expensive components
const ExpensiveComponent = memo(({ data }) => {
  // Component logic
});

// Callback memoization
const handleSearch = useCallback(
  debounce((term) => {
    setSearchTerm(term);
  }, 300),
  []
);
```

### Lazy Loading
```javascript
// Route-based code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Agents = lazy(() => import('./pages/EnhancedAgents'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <Dashboard />
</Suspense>
```

### Image Optimization
```javascript
// Lazy loading images
const LazyImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  return (
    <div className="image-container">
      {!isLoaded && !error && <div className="image-placeholder" />}
      <img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
        {...props}
      />
    </div>
  );
};
```

---

## Testing Guidelines

### Component Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '../contexts/ThemeContext';
import Login from '../pages/Login';

// Test with providers
const renderWithProviders = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

test('renders login form', () => {
  renderWithProviders(<Login />);
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});
```

### Integration Testing
```javascript
test('full authentication flow', async () => {
  renderWithProviders(<App />);
  
  // Navigate to login
  expect(screen.getByText(/login/i)).toBeInTheDocument();
  
  // Fill form
  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: 'admin@example.com' }
  });
  
  // Submit and wait for redirect
  fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
  // Check for dashboard
  await waitFor(() => {
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
  });
});
```

---

## Accessibility Features

### ARIA Labels
```javascript
<button 
  className="theme-toggle"
  onClick={toggleTheme}
  aria-label="Toggle between light and dark theme"
  aria-pressed={isDark}
>
  {isDark ? '🌙' : '☀️'}
</button>
```

### Form Accessibility
```javascript
<div className="form-group">
  <label htmlFor="email" className="form-label">
    Email Address *
  </label>
  <input
    id="email"
    type="email"
    className="form-control"
    value={formData.email}
    onChange={handleChange}
    aria-required="true"
    aria-describedby="email-error"
  />
  {errors.email && (
    <div id="email-error" className="error-message" role="alert">
      {errors.email}
    </div>
  )}
</div>
```

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus indicators are clearly visible
- Tab order is logical and intuitive
- Escape key closes modals and dropdowns

---

## Browser Support

### Supported Browsers
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Polyfills Used
- CSS Grid fallbacks for older browsers
- Intersection Observer polyfill
- ResizeObserver polyfill

---

## Component Dependencies

### External Libraries
- **React Router DOM**: Navigation and routing
- **Axios**: HTTP client for API calls
- **React**: Core framework

### Internal Dependencies
- **ThemeContext**: Theme management
- **ProtectedRoute**: Authentication wrapper
- **style.css**: Global styles and variables

---

## Future Enhancements

### Planned Features
1. **Component Library**: Extract reusable components into a separate package
2. **Storybook**: Component documentation and testing
3. **Error Boundaries**: Better error handling and recovery
4. **PWA**: Progressive Web App capabilities
5. **i18n**: Internationalization support

### Performance Improvements
1. **Virtual Scrolling**: For large lists
2. **Image Lazy Loading**: Optimize image loading
3. **Bundle Splitting**: Reduce initial bundle size
4. **Service Workers**: Offline functionality

---

*Component documentation last updated: January 2024*
