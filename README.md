# Digitizing Patient Data - Mid-Fi Prototype

A comprehensive patient data collection system with offline sync capability, built for Team 5317's Junior Design project with Emory University.

## 🎯 Project Overview

This system addresses the critical need for reliable patient data collection in remote locations where internet connectivity is unreliable. The application provides:

- **Offline-first data collection** with automatic sync when online
- **HIPAA-compliant** secure data handling
- **Role-based access control** for different user types
- **Multiple export formats** (PDF, CSV) for data analysis
- **Real-time sync status** monitoring

## 🚀 Features Implemented

### Sprint 1: Offline Form Capability ✅
- ✅ Offline data entry forms with local storage
- ✅ Automatic sync to REDCap when online
- ✅ Sync status tracking and error handling
- ✅ Offline application caching (PWA-ready)

### Sprint 2: Export Functionality ✅
- ✅ Individual patient PDF exports
- ✅ Bulk CSV exports with filtering
- ✅ Date-range based exports
- ✅ Dedicated Reports & Exports page

### Sprint 3: Authentication & Access Control ✅
- ✅ Secure user authentication
- ✅ Role-based permissions (Researcher/Administrator)
- ✅ User management panel for administrators
- ✅ Password reset functionality

## 🎨 Usability Heuristics Implementation

This prototype emphasizes all 10 Nielsen usability heuristics:

1. **Visibility of System Status** - Multi-level connection indicators, prominent offline banners, interactive status displays, real-time sync indicators, loading states
2. **Match Between System and Real World** - Natural language, familiar medical terminology
3. **User Control and Freedom** - Easy navigation, undo capabilities, clear exit options
4. **Consistency and Standards** - Uniform design patterns, consistent navigation
5. **Error Prevention** - Form validation, confirmation dialogs, input constraints
6. **Recognition Rather Than Recall** - Clear labels, visual cues, status indicators
7. **Flexibility and Efficiency** - Multiple export options, keyboard shortcuts, bulk operations
8. **Aesthetic and Minimalist Design** - Clean interface, focused content, proper spacing
9. **Help Users Recognize, Diagnose, and Recover from Errors** - Clear error messages, recovery suggestions
10. **Help and Documentation** - Contextual help, demo credentials, inline guidance

## 🛠 Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for local storage
- **JWT** authentication
- **Puppeteer** for PDF generation
- **Nodemailer** for email functionality
- **Helmet** for security headers
- **Rate limiting** for API protection

### Frontend
- **React 18** with modern hooks
- **React Router** for navigation
- **React Hook Form** for form management
- **React Toastify** for notifications
- **Lucide React** for consistent icons
- **CSS Grid/Flexbox** for responsive design

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with JavaScript enabled

## 🚀 Quick Start (Frontend-Only Prototype)

### Option 1: Local Development
1. **Install Dependencies**
   ```bash
   cd client && npm install && npm start
   ```

2. **Access the Application**
   - Frontend: http://localhost:3000
   - No backend required - uses mock data for demonstration

### Option 2: Auto-Deploy to GitHub Pages (Recommended for Demos)
1. **Follow the auto-deploy guide**: See [AUTO-DEPLOY-SETUP.md](./AUTO-DEPLOY-SETUP.md)
2. **Push to main branch** - GitHub Actions handles everything automatically
3. **Live demo**: Your app will be available at `https://atian2018.github.io`

## 👤 Demo Credentials

### Administrator Account
- **Email:** admin@clinic.com
- **Password:** admin123
- **Permissions:** Full access to all features, user management

### Researcher Account
- **Email:** researcher@clinic.com
- **Password:** researcher123
- **Permissions:** Data entry, viewing, limited exports

## 📱 Core User Flows

### 1. Offline Data Collection
1. User opens application (online or offline)
2. Navigates to Patient Form
3. Fills out patient information
4. Clicks "Save" - data stored locally if offline
5. When online, data automatically syncs to central database

### 2. Data Export Workflow
1. User navigates to Reports page
2. Selects export type (PDF for individual, CSV for bulk)
3. Applies filters if needed (date range, search terms)
4. Downloads formatted file

### 3. User Management (Admin)
1. Admin logs in with elevated permissions
2. Accesses Admin Panel
3. Creates new users, assigns roles
4. Manages user access and permissions

## 🔒 Security Features

- **Authentication:** JWT-based secure sessions
- **Authorization:** Role-based access control
- **Data Protection:** Encrypted local storage
- **HIPAA Compliance:** Secure data handling practices
- **Rate Limiting:** API protection against abuse
- **Input Validation:** Comprehensive form validation

## 📊 Offline Sync Architecture

The system implements a sophisticated offline-first architecture:

1. **Local Storage:** Patient data stored in browser's localStorage
2. **Sync Queue:** Pending records tracked with status indicators
3. **Conflict Resolution:** Server-side validation and conflict handling
4. **Audit Trail:** Complete sync attempt logging
5. **Error Recovery:** Automatic retry mechanisms for failed syncs

## 🎯 REDCap Integration

- **API Compatibility:** Designed for REDCap REST API integration
- **Data Mapping:** Structured data format compatible with REDCap
- **Batch Operations:** Efficient bulk data transfer
- **Error Handling:** Comprehensive error logging and recovery

## 📈 Performance Optimizations

- **Lazy Loading:** Components loaded on demand
- **Data Caching:** Intelligent caching strategies
- **Compression:** Gzip compression for API responses
- **Responsive Design:** Optimized for mobile and desktop

## 🧪 Testing Strategy

The application includes:
- **Unit Tests:** Component and service testing
- **Integration Tests:** API endpoint testing
- **E2E Testing:** Complete user workflow testing
- **Offline Testing:** Network failure simulation

## 🚀 Deployment Considerations

### Production Checklist
- [ ] Environment variables for secrets
- [ ] HTTPS configuration
- [ ] Database backup strategy
- [ ] Monitoring and logging
- [ ] Performance optimization
- [ ] Security audit

### Environment Variables
```bash
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

## 📝 Development Notes

### Project Structure
```
├── server.js              # Main server file
├── package.json           # Backend dependencies
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── services/      # API and data services
│   │   └── utils/         # Utility functions
│   └── package.json       # Frontend dependencies
└── README.md              # This file
```

### Key Design Decisions

1. **Offline-First Approach:** Ensures data collection works regardless of connectivity
2. **Progressive Web App:** Can be installed and used like a native app
3. **Role-Based Security:** Different permission levels for different user types
4. **Responsive Design:** Works on tablets and mobile devices in the field

## 🤝 Contributing

This is a prototype for academic purposes. For production deployment, consider:
- Additional security measures
- Comprehensive testing
- Performance monitoring
- User feedback integration

## 📞 Support

For questions about this prototype, contact Team 5317 or refer to the project documentation.

---

**Built with ❤️ by Team 5317 for Emory University Junior Design Project**
