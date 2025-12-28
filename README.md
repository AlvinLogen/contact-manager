# Contact Manager Application

A full-stack contact management application built with Node.js, Express, and SQL Server.

## 🚀 Features

- ✅ Create, Read, Update, Delete contacts
- ✅ Form validation (client and server-side)
- ✅ Responsive design
- ✅ RESTful API architecture
- ✅ SQL Server database with proper indexing
- ✅ Clean code following best practices

## Prerequisites

- Node.js (v14 or higher)
- SQL Server (2016 or higher)
- Git

## Installation

### 1. Clone the repository
\`\`\`bash
git clone <your-repo-url>
cd contact_manage_app
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

### 3. Configure environment variables
Create a \`.env\` file in the root directory:
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
├── journey/
│   ├── development_journey.txt
│   └── sprint_3_plan.md
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
\`\`\`

## API Endpoints

### Health Check
- **GET** `/api/health` - Check API status

### Contacts
- **GET** `/api/contacts` - Get all contacts
- **GET** `/api/contacts/:id` - Get contact by ID
- **POST** `/api/contacts` - Create new contact
- **PUT** `/api/contacts/:id` - Update contact
- **DELETE** `/api/contacts/:id` - Delete contact

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

### Manual Testing
1. Use the provided \`requests.http\` file with VS Code REST Client extension
2. Or use Postman/Insomnia with the endpoints above

### Browser Testing
1. Navigate to http://localhost:3000
2. Test all CRUD operations through the UI

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** Microsoft SQL Server, T-SQL
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Dev Tools:** nodemon, REST Client
- **Version Control:** Git, GitHub

## Security Features

- SQL injection prevention (parameterized queries)
- Input validation (client and server-side)
- XSS protection (HTML escaping)
- Environment variable protection
- CORS configuration

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