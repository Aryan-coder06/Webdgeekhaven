# WebGeekHaven

A full-stack web application for browsing and searching coding interview questions and DSA problems. Built with React frontend and Node.js/Express backend with MongoDB database.

## Features

- 🔍 **Smart Search** - Search questions by title with real-time results
- 📚 **Category Organization** - Questions organized in collapsible category sections
- 🎯 **Multiple Platforms** - Links to practice problems on different coding platforms
- 📱 **Responsive Design** - Mobile-friendly interface with clean CSS styling
- ⚡ **Fast API** - Optimized backend with MongoDB for quick question retrieval

## Tech Stack

### Frontend
- **React** - UI library for building interactive user interfaces
- **Vite** - Fast build tool and dev server
- **Lucide React** - Beautiful icons
- **Custom CSS** - Responsive styling with animations and transitions

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database for storing questions and categories
- **Mongoose** - MongoDB object modeling for Node.js
- **CORS** - Cross-origin resource sharing support

## Project Structure

```
webgeekhaven/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── App.jsx        # Main React component
│   │   ├── main.jsx       # Application entry point
│   │   └── index.css      # Global styles and utilities
│   ├── index.html         # HTML template
│   └── package.json       # Frontend dependencies
├── server/                 # Backend API server
│   ├── models/            # MongoDB schemas
│   │   ├── Category.js    # Category model
│   │   ├── Question.js    # Question model
│   │   └── User.js        # User model (authentication ready)
│   ├── controllers/       # Route handlers
│   ├── routes/            # API routes
│   ├── config/            # Database and environment config
│   ├── seeders/           # Database seeding scripts
│   ├── server.js          # Main server file
│   └── package.json       # Backend dependencies
├── start-dev.sh           # Development startup script
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account or local MongoDB installation
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/webgeekhaven.git
   cd webgeekhaven
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables**
   
   Create a `.env` file in the `server` directory:
   ```env
   MONGODB_URL='your-mongodb-connection-string'
   JWT_SECRET='your-jwt-secret'
   PORT=5000
   ```

5. **Seed the database** (optional)
   ```bash
   cd server
   node seeders/seeder.js
   ```

### Running the Application

#### Option 1: Use the convenience script
```bash
chmod +x start-dev.sh
./start-dev.sh
```

#### Option 2: Manual startup

**Start the backend server:**
```bash
cd server
npm run dev
# or
npm start
```

**Start the frontend development server:**
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## API Endpoints

### Questions
- `GET /api/questions` - Get all questions
- `GET /api/questions/search?search=query` - Search questions by title

### Categories
- `GET /api/categories` - Get all categories with populated questions

### Health Check
- `GET /health` - Server and database status

## Database Schema

### Question Model
```javascript
{
  title: String,           // Question title
  url: {
    yt_link: String,      // YouTube tutorial link
    p1_link: String,      // Practice platform 1 link
    p2_link: String       // Practice platform 2 link
  },
  tags: [String]          // Topic tags
}
```

### Category Model
```javascript
{
  title: String,                    // Category name
  questions: [ObjectId]            // References to Question documents
}
```

## Features in Detail

### Search Functionality
- Real-time search as you type
- Case-insensitive regex matching
- Results display with question count
- Clear and intuitive search interface

### Category Organization
- Collapsible accordion interface
- Questions grouped by programming topics
- Smooth expand/collapse animations
- Easy navigation between categories

### Responsive Design
- Mobile-first approach
- Clean card-based layout
- Smooth hover effects and transitions
- Optimized for all screen sizes

## Development

### Backend Development
- Uses ES6 modules (`"type": "module"`)
- MongoDB connection with proper error handling
- Async/await pattern for clean code
- Environment-based configuration

### Frontend Development
- React functional components with hooks
- State management for search and categories
- Axios for API communication
- Modern CSS with flexbox and grid

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Questions and problems sourced from various coding platforms
- Icons provided by Lucide React
- Built with modern web development best practices
