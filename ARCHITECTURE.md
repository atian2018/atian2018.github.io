# System Architecture Overview

## 🏗️ Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (React)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Login     │  │  Dashboard  │  │ PatientForm │             │
│  │    Page     │  │    Page     │  │    Page     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  Reports    │  │    Admin    │  │   Offline   │             │
│  │    Page     │  │    Panel    │  │   Storage   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Services Layer                             │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │   │
│  │  │   Auth      │  │  Patient    │  │    Sync     │    │   │
│  │  │  Service    │  │  Service    │  │  Service    │    │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST API
                                │
┌─────────────────────────────────────────────────────────────────┐
│                      SERVER (Node.js)                          │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Auth      │  │  Patient    │  │   Export    │             │
│  │  Routes     │  │   Routes    │  │   Routes    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Admin    │  │  Middleware │  │   Security  │             │
│  │   Routes    │  │   Layer     │  │   Layer     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Database Operations
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE (SQLite)                           │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │    Users    │  │  Patient    │  │   Sync      │             │
│  │   Table     │  │  Records    │  │   Audit     │             │
│  │             │  │   Table     │  │   Log       │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│  ┌─────────────┐                                               │
│  │  Password   │                                               │
│  │   Reset     │                                               │
│  │  Tokens     │                                               │
│  └─────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Future Integration
                                │
┌─────────────────────────────────────────────────────────────────┐
│                    REDCap System                               │
├─────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   REST      │  │   Data      │  │   Project   │             │
│  │    API      │  │   Import    │  │  Settings   │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow

### 1. Offline Data Collection Flow
```
User Input → Form Validation → Local Storage → Sync Queue → REDCap API
     ↓              ↓              ↓            ↓           ↓
   Client      Client-Side    Browser     Background    External
   Validation   Validation    Storage      Process      System
```

### 2. Authentication Flow
```
Login Request → JWT Generation → Token Storage → Protected Routes
      ↓              ↓               ↓              ↓
   Credentials    Server Auth    Browser       Route Guards
   Validation     Validation     Storage       Middleware
```

### 3. Export Flow
```
Export Request → Data Query → Format Generation → File Download
      ↓              ↓             ↓                ↓
   User Action   Database      PDF/CSV         Browser
   Selection     Retrieval     Creation        Download
```

## 🎯 Usability Heuristics Implementation

### 1. Visibility of System Status
- **Connection Status**: Online/Offline indicators throughout the app
- **Sync Status**: Real-time sync progress and status for each record
- **Loading States**: Spinners and progress indicators for all async operations
- **Form Validation**: Immediate feedback on form field errors

### 2. Match Between System and Real World
- **Medical Terminology**: Uses familiar healthcare language and concepts
- **Natural Language**: Clear, conversational error messages and instructions
- **Familiar Patterns**: Standard form layouts and navigation patterns
- **Real-world Metaphors**: "Sync", "Export", "Archive" concepts

### 3. User Control and Freedom
- **Navigation**: Clear back buttons and breadcrumbs
- **Form Reset**: Ability to clear forms and start over
- **Cancel Actions**: Cancel buttons on all long-running operations
- **Undo Capability**: Confirmation dialogs for destructive actions

### 4. Consistency and Standards
- **Design System**: Consistent colors, typography, and spacing
- **Navigation**: Uniform navigation structure across all pages
- **Button Styles**: Consistent button appearance and behavior
- **Form Elements**: Standardized form input styling and validation

### 5. Error Prevention
- **Form Validation**: Real-time validation prevents invalid submissions
- **Input Constraints**: Date pickers, dropdowns, and character limits
- **Confirmation Dialogs**: Prevents accidental data loss
- **Auto-save**: Prevents data loss during network interruptions

### 6. Recognition Rather Than Recall
- **Clear Labels**: All form fields have descriptive labels
- **Visual Cues**: Icons and colors indicate status and actions
- **Status Indicators**: Clear visual representation of sync status
- **Contextual Information**: Helpful hints and examples in forms

### 7. Flexibility and Efficiency of Use
- **Multiple Export Options**: PDF, CSV, and filtered exports
- **Bulk Operations**: Export multiple records at once
- **Keyboard Shortcuts**: Tab navigation and Enter key support
- **Responsive Design**: Works on desktop, tablet, and mobile

### 8. Aesthetic and Minimalist Design
- **Clean Interface**: Uncluttered, focused design
- **Proper Spacing**: Adequate whitespace and visual breathing room
- **Color Hierarchy**: Strategic use of color to guide attention
- **Typography**: Clear, readable fonts and text sizing

### 9. Help Users Recognize, Diagnose, and Recover from Errors
- **Clear Error Messages**: Specific, actionable error descriptions
- **Recovery Suggestions**: Steps to resolve common issues
- **Error Logging**: Detailed error information for debugging
- **Graceful Degradation**: System continues to work with reduced functionality

### 10. Help and Documentation
- **Demo Credentials**: Clearly displayed test accounts
- **Contextual Help**: Inline help text and tooltips
- **Documentation**: Comprehensive README and setup instructions
- **Onboarding**: Clear first-time user experience

## 🔒 Security Architecture

### Authentication & Authorization
- **JWT Tokens**: Secure, stateless authentication
- **Role-Based Access**: Different permission levels for different users
- **Password Hashing**: bcrypt for secure password storage
- **Session Management**: Automatic token expiration and refresh

### Data Protection
- **Input Validation**: Comprehensive server-side validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **CSRF Protection**: SameSite cookie attributes

### HIPAA Compliance Features
- **Data Encryption**: Encrypted data transmission and storage
- **Audit Logging**: Complete audit trail of all data access
- **Access Controls**: Role-based permissions and data isolation
- **Secure Communication**: HTTPS-only data transmission

## 🚀 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Compressed and optimized assets
- **Caching Strategy**: Intelligent browser caching
- **Bundle Optimization**: Minified and compressed JavaScript

### Backend Optimizations
- **Database Indexing**: Optimized database queries
- **Response Compression**: Gzip compression for API responses
- **Rate Limiting**: Protection against API abuse
- **Connection Pooling**: Efficient database connections

## 📱 Offline-First Architecture

### Local Storage Strategy
- **Browser Storage**: localStorage for persistent data
- **Data Synchronization**: Conflict resolution and merge strategies
- **Offline Indicators**: Clear visual feedback about connection status
- **Progressive Enhancement**: Core functionality works offline

### Sync Mechanism
- **Queue Management**: Ordered processing of sync operations
- **Conflict Resolution**: Server-side conflict detection and resolution
- **Retry Logic**: Automatic retry for failed sync operations
- **Batch Operations**: Efficient bulk data synchronization

This architecture ensures a robust, user-friendly, and secure patient data collection system that works reliably in both online and offline environments.
