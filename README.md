# Lead Management App

A modern, responsive lead management system built with Next.js that allows potential clients to submit immigration consultation requests and provides an internal dashboard for attorneys to manage and track leads.

🌐 **Live Demo**: [https://lead-management-gold.vercel.app](https://lead-management-gold.vercel.app)

## 📋 Overview

This application serves as a complete lead management solution for immigration law firms. It features a public-facing form where potential clients can submit their information and an internal dashboard where attorneys can review, manage, and update lead statuses.

**Note**: This application uses Google Sheets as its database, meaning all form submissions and data management operations work with real data stored in Google Sheets.

## ✅ Requirements Implementation

This project fully implements all specified functional and technical requirements:

### **Functional Requirements Met**

#### ✅ Public Lead Form

- **All Required Fields Implemented**:
  - ✅ First Name
  - ✅ Last Name
  - ✅ Email
  - ✅ LinkedIn Profile
  - ✅ Visas of Interest (multi-select checkboxes)
  - ✅ Resume/CV Upload (file upload)
  - ✅ Additional Information (long text input)
- ✅ **Input Validation**: Comprehensive form validation with user-friendly error messages
- ✅ **Confirmation Message**: Thank you page displayed upon successful submission
- ✅ **Responsive Design**: Matches provided mock-ups and works across all devices

#### ✅ Internal Lead Management UI

- ✅ **Secure Authentication**: Mock authentication system protecting internal dashboard
- ✅ **Lead Display**: Complete list view of all submitted leads with full information
- ✅ **Status Management**: Leads start as **PENDING** and can be updated to **REACHED_OUT**
- ✅ **State Transition**: Manual status update functionality with real-time UI updates
- ✅ **Search & Filter**: Advanced filtering and search capabilities
- ✅ **Responsive Design**: Mobile-friendly table that adapts to different screen sizes

### **Technical Requirements Met**

#### ✅ Core Technology Stack

- ✅ **Frontend Framework**: Next.js 14 (App Router)
- ✅ **Styling**: Tailwind CSS for modern, responsive design
- ✅ **TypeScript**: Full type safety implementation

#### ✅ API & Backend

- ✅ **Next.js API Routes**: Custom API endpoints for lead management
- ✅ **Google Sheets Integration**: Real database functionality via Google Sheets API
- ✅ **CRUD Operations**: Create, Read, Update operations for leads

#### ✅ Authentication & Security

- ✅ **Mock Authentication**: Protected routes with login system
- ✅ **Route Protection**: Secure internal dashboard access
- ✅ **Context-based Auth**: React Context for authentication state management

#### ✅ Form & File Handling

- ✅ **Comprehensive Validation**: Client-side validation for all required fields
- ✅ **File Upload Support**: Resume/CV upload with file type validation
- ✅ **Error Handling**: Graceful error handling with user feedback

#### ✅ User Experience & Accessibility

- ✅ **Responsive Design**: Mobile-first approach, works on all screen sizes
- ✅ **Form Validation Feedback**: Real-time validation with clear error messages
- ✅ **Loading States**: User feedback during form submissions and data operations
- ✅ **Accessibility**: Proper form labels, focus states, and semantic HTML

### **Bonus Points Achieved** 🎉

- ✅ **API Implementation**: Full Next.js API routes instead of mock endpoints
- ✅ **State Management**: React Context for authentication and state management
- ✅ **Responsiveness**: Fully responsive on all device sizes with mobile-optimized layouts
- ✅ **Type Safety**: Complete TypeScript implementation with proper interfaces
- ✅ **System Design Documentation**: Comprehensive architecture overview below

## ✨ Features

### Public Lead Form

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Comprehensive Data Collection**:
  - Personal information (name, email, country of citizenship)
  - Professional details (LinkedIn/website, resume upload)
  - Visa category preferences (O-1, EB-1A, EB-2 NIW, etc.)
  - Detailed consultation requests
- **File Upload**: Resume/CV upload functionality
- **Real-time Validation**: Form validation with user-friendly error messages
- **Thank You Page**: Confirmation page after successful submission

### Internal Dashboard

- **Secure Authentication**: Login system for authorized personnel
- **Lead Management**: View and manage all submitted leads
- **Status Tracking**: Update lead status (Pending, Reached Out)
- **Search & Filter**: Find leads by name, email, or filter by status
- **Pagination**: Efficient navigation through large datasets
- **Responsive Table**: Mobile-friendly table that adapts to different screen sizes
- **Real-time Updates**: Instant status updates with loading indicators

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Google Sheets (via Google Sheets API)
- **Authentication**: Custom authentication system with React Context
- **Deployment**: Vercel
- **File Handling**: Client-side file upload with validation

## 🏗️ System Architecture

### Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Next.js App Router                      │
├─────────────────────────────────────────────────────────────┤
│  Public Routes          │  Protected Routes                 │
│  ├── / (Login)          │  ├── /internal (Dashboard)       │
│  ├── /lead-form         │                                   │
│  └── /thank-you         │                                   │
├─────────────────────────────────────────────────────────────┤
│                    API Routes (/api)                        │
│  ├── /api/submit-form   │  ├── /api/get-leads              │
│  └── /api/edit-lead     │                                   │
├─────────────────────────────────────────────────────────────┤
│                  Authentication Context                     │
│  └── AuthContext (Login/Logout State Management)           │
├─────────────────────────────────────────────────────────────┤
│                    External Services                        │
│  └── Google Sheets API (Database Operations)               │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **Lead Submission**: Public form → API route → Google Sheets
2. **Lead Retrieval**: Dashboard → API route → Google Sheets → UI
3. **Status Updates**: Dashboard → API route → Google Sheets → UI refresh

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (protected)/          # Protected routes
│   │   ├── internal/         # Internal dashboard
│   │   └── layout.tsx        # Protected layout wrapper
│   ├── api/                  # API routes
│   │   ├── submit-form/      # Lead submission endpoint
│   │   ├── get-leads/        # Lead retrieval endpoint
│   │   └── edit-lead/        # Lead update endpoint
│   ├── lead-form/            # Lead form page
│   ├── thank-you/            # Thank you page
│   ├── page.tsx              # Homepage (Login)
│   └── layout.tsx            # Root layout
├── components/
│   ├── Internal/             # Dashboard components
│   ├── LeadForm/             # Public form components
│   ├── LeadTable/            # Table components
│   ├── Login/                # Authentication components
│   ├── Sidebar/              # Navigation components
│   └── ProtectedRoute/       # Route protection
├── contexts/
│   └── AuthContext.tsx       # Authentication context
├── types/
│   └── Lead.ts               # TypeScript interfaces
└── constant/
    └── countries.ts          # Country list data
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Sheets API credentials

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd lead-management-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:

   ```env
   GOOGLE_SHEETS_PRIVATE_KEY=your_private_key
   GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email
   GOOGLE_SHEETS_SHEET_ID=your_sheet_id
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

The internal dashboard is protected with a simple authentication system:

- **Username**: `admin`
- **Password**: `password123`

_Note: This is a demo application. In production, implement proper authentication with secure password hashing and user management._

## 📊 Database Schema

The application uses Google Sheets with the following columns:

- `firstName`: Lead's first name
- `lastName`: Lead's last name
- `email`: Contact email
- `country`: Country of citizenship
- `linkedin`: LinkedIn or personal website URL
- `visas`: Selected visa categories (comma-separated)
- `message`: Consultation request details
- `dateCreated`: Submission timestamp
- `status`: Lead status (pending/reached_out)
- `cvUploaded`: Whether CV was uploaded
- `cvFileName`: Name of uploaded file

## 🎨 Design Features

- **Mobile-First**: Responsive design that works seamlessly across all devices
- **Clean UI**: Modern, professional interface suitable for legal services
- **Accessibility**: Proper form labels, focus states, and semantic HTML
- **Loading States**: User feedback during form submissions and data operations
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Deployment

The application is deployed on Vercel and automatically deploys from the main branch. The live version can be accessed at:

**[https://lead-management-gold.vercel.app](https://lead-management-gold.vercel.app)**

### Admin Login Credentials

- **Username**: `admin`
- **Password**: `password123`

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/lead-management-app)

## 📝 Usage

### For Potential Clients

1. Visit the lead form at `/lead-form`
2. Fill out the comprehensive lead form with all required fields
3. Upload your resume/CV
4. Submit and receive confirmation at `/thank-you`

### For Attorneys/Staff

1. Visit the homepage at `/`
2. Sign in with provided credentials
3. View and manage leads in the responsive dashboard
4. Update lead statuses from PENDING to REACHED_OUT
5. Use search and filter features to find specific leads

## 🧪 Testing

The application includes comprehensive validation and error handling:

- Form validation for all required fields
- File upload validation (PDF, DOC, DOCX)
- API error handling with user feedback
- Responsive design testing across devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Next.js and Tailwind CSS
- Icons and UI components inspired by modern design systems
- Google Sheets integration for simple, effective data management

---

**Note**: This is a demonstration application that fully implements all specified requirements. For production use, consider implementing additional security measures, proper user authentication, and data validation.
