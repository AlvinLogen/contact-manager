# Contact Manager Application

A professional full-stack contact management application built with Node.js, Express, and SQL Server, featuring advanced security, testing, and modern JavaScript patterns.

Home Page: http://contactmanager.corp.logenix.com/

## 🚀 Features

### Core Functionality
- ✅ Full CRUD operations (Create, Read, Update, Delete)
- ✅ Search functionality with real-time filtering
- ✅ Pagination support for large datasets
- ✅ Responsive modal-based UI
- ✅ Real-time notifications

### Architecture
- ✅ RESTful API with proper status codes
- ✅ Module Pattern with separation of concerns
- ✅ Centralized error handling
- ✅ Async/await throughout
- ✅ SQL Server with optimized indexing

### Security
- ✅ Helmet.js for HTTP security headers
- ✅ Rate limiting (general + write-specific)
- ✅ Content Security Policy (CSP)
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection (HTML escaping)
- ✅ Input sanitization and validation
- ✅ Environment variable protection

### Testing
- ✅ Jest test framework configured
- ✅ API endpoint testing
- ✅ Validation middleware testing
- ✅ Code coverage reporting

## Prerequisites

- Node.js (v18 or higher)
- SQL Server (2016 or higher)
- npm or yarn package manager
- Git

## Installation

### 1. Clone the repository
\`\`\`bash
git clone https://github.com/AlvinLogen/contact-manager.git
cd contact_manager_app
\`\`\`

### 2. Install backend dependencies
\`\`\`bash
cd backend
npm install
\`\`\`

### 3. Configure environment variables
Create a \`.env\` file in the \`backend\` directory:
\`\`\`env
DB_SERVER=localhost
DB_DATABASE=ContactDB
DB_USER=your_username
DB_PASSWORD=your_password
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
PORT=3000
NODE_ENV=development
\`\`\`

### 4. Set up the database
Run the SQL scripts in order:
\`\`\`bash
# Execute in SQL Server Management Studio or VS Code SQL extension
database/schema.sql   # Creates database and tables
database/seed.sql     # Inserts sample data (optional)
\`\`\`

### 5. Start the application
\`\`\`bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
\`\`\`

### 6. Access the application
Open your browser and navigate to:
\`\`\`
http://localhost:3000
\`\`\`

## Project Structure

\`\`\`
contact_manager_app/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection configuration
│   ├── database/
│   │   ├── schema.sql         # Database schema
│   │   ├── seed.sql           # Sample data
│   │   └── queries.sql        # Useful queries for testing
│   ├── server.js              # Express server
│   ├── .env                   # Environment variables (not in Git)
│   ├── .env.example           # Environment template
│   ├── requests.http          # API test requests
│   └── package.json           # Node.js dependencies
├── frontend/
│   └── public/
│       ├── index.html         # Frontend HTML
│       ├── style.css          # Styles
│       └── app.js             # Frontend JavaScript
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
\`\`\`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Contacts
- **GET** `/api/contacts` - Get all contacts
  - Query params: `?search=term&page=1&limit=10`
- **GET** `/api/contacts/:id` - Get contact by ID
- **POST** `/api/contacts` - Create new contact (rate limited: 50/15min)
- **PUT** `/api/contacts/:id` - Update contact (rate limited: 50/15min)
- **DELETE** `/api/contacts/:id` - Delete contact (rate limited: 50/15min)

### Rate Limits
- General API: 100 requests per 15 minutes
- Write operations (POST/PUT/DELETE): 50 requests per 15 minutes

### Example API Request
\`\`\`bash
curl -X POST http://localhost:3000/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0101"
  }'
\`\`\`

## Testing

### Automated Tests
```bash
cd backend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Test Coverage:**
- API endpoint tests (GET, POST, PUT, DELETE)
- Validation middleware tests
- Error handling tests

### Manual Testing
1. Use the provided `requests.http` file with VS Code REST Client extension
2. Or use Postman/Insomnia with the endpoints above

### Browser Testing
1. Navigate to http://localhost:3000
2. Test CRUD operations, search, and pagination through the UI

## Technologies Used

### Backend
- **Runtime:** Node.js v23.x
- **Framework:** Express.js v4.x
- **Database:** Microsoft SQL Server (mssql driver)
- **Security:** Helmet.js, express-rate-limit
- **Testing:** Jest v29.x
- **Process Manager:** PM2

### Frontend
- **Core:** HTML5, CSS3, Vanilla JavaScript
- **Pattern:** Module Pattern (IIFE)
- **Architecture:** Separation of concerns (API layer + Business logic)

### Dev Tools
- nodemon, REST Client, Git/GitHub

## Security Features

### HTTP Security
- **Helmet.js** - Security headers (CSP, X-Frame-Options, etc.)
- **Rate Limiting** - Prevents brute force attacks
  - General: 100 requests/15min
  - Write ops: 50 requests/15min
- **CORS** - Cross-origin resource sharing configured

### Input Security
- **SQL Injection Prevention** - Parameterized queries
- **XSS Protection** - HTML escaping on output
- **Input Validation** - Server-side validation middleware
- **Data Sanitization** - Trim and normalize inputs

### Best Practices
- Environment variables for sensitive data
- Graceful shutdown handling
- Centralized error handling
- No sensitive data in logs

## Deployment Options

### Option 1: Local Network (IIS)
See deployment guide in journey/deployment.md

### Option 2: Cloud Deployment
- Azure App Service (recommended for SQL Server)
- Heroku
- DigitalOcean

## Troubleshooting

### Database Connection Issues
- Verify SQL Server is running
- Check connection string in `.env`
- Ensure firewall allows connections
- Verify SQL Server authentication mode

### Port Already in Use
\`\`\`bash
# Find and kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <process_id> /F

# Linux/Mac
lsof -i :3000
kill -9 <process_id>
\`\`\`

## Author

Alvin Logenstein
