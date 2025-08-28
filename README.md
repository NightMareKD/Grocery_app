# Smart Grocery - Pantry Management Application

A modern, responsive web application for managing pantry items with expiry tracking, built with React, TypeScript, and Node.js.

![Smart Grocery App](https://images.pexels.com/photos/4099235/pexels-photo-4099235.jpeg?auto=compress&cs=tinysrgb&w=1200&h=600&fit=crop)

## Features

### ✨ Core Features
- **Full CRUD Operations**: Add, view, edit, and delete pantry items
- **Expiry Tracking**: Visual indicators for items expiring soon
- **Smart Sorting**: Sort by expiry date, quantity, or name
- **Quick Filtering**: Filter items expiring within 7 days
- **Responsive Design**: Mobile-first design that works on all devices

### 🎨 User Experience
- **Premium UI/UX**: Glass morphism effects and smooth animations
- **Toast Notifications**: Success, error, and undo notifications
- **Optimistic Updates**: Instant UI feedback for better user experience
- **Accessibility**: Full keyboard navigation and screen reader support
- **Empty States**: Helpful messaging when no items are available

### 🔧 Technical Features
- **TypeScript**: Full type safety across frontend and backend
- **SQLite Database**: Lightweight, embedded database
- **RESTful API**: Clean, well-documented API endpoints
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling and user feedback

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** with custom design system
- **Headless UI** for accessible components
- **Heroicons** for consistent iconography

### Backend
- **Node.js** with Express
- **SQLite3** for data persistence
- **RESTful API** design
- **CORS** enabled for cross-origin requests

### Development Tools
- **ESLint** + **Prettier** for code quality
- **Vitest** for frontend testing
- **Jest** for backend testing
- **Concurrently** for running both servers
- **Nodemon** for backend development

## Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-grocery-pantry
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Seed the database** (optional - adds sample data)
   ```bash
   npm run seed
   ```

4. **Start the application**
   ```bash
   npm run demo
   ```

   This will start both the backend server (http://localhost:3001) and frontend development server (http://localhost:5173).

5. **Open your browser**
   Navigate to `http://localhost:5173` to use the application.

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start frontend development server only |
| `npm run server` | Start backend server only |
| `npm run demo` | **Start both frontend and backend** (recommended) |
| `npm run build` | Build frontend for production |
| `npm test` | Run frontend tests |
| `npm run test:server` | Run backend tests |
| `npm run seed` | Populate database with sample data |
| `npm run lint` | Run ESLint code analysis |

## API Documentation

### Base URL
```
http://localhost:3001/api
```

### Endpoints

#### Get All Items
```http
GET /pantry
```
Returns array of all pantry items, sorted by expiry date.

#### Get Single Item
```http
GET /pantry/:id
```
Returns a single pantry item by ID.

#### Create Item
```http
POST /pantry
Content-Type: application/json

{
  "name": "Organic Milk",
  "quantity": 2,
  "unit": "liters",
  "expiry_date": "2025-01-15",
  "notes": "Store in refrigerator"
}
```

#### Update Item
```http
PATCH /pantry/:id
Content-Type: application/json

{
  "quantity": 1,
  "notes": "Updated notes"
}
```

#### Delete Item
```http
DELETE /pantry/:id
```

### Response Formats

**Success Response (200/201):**
```json
{
  "id": 1,
  "name": "Organic Milk",
  "quantity": 2,
  "unit": "liters",
  "expiry_date": "2025-01-15",
  "notes": "Store in refrigerator",
  "created_at": "2025-01-01T10:00:00.000Z"
}
```

**Error Response (400/404/500):**
```json
{
  "error": "Error message description"
}
```

## Database Schema

```sql
CREATE TABLE pantry_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  quantity REAL NOT NULL DEFAULT 1,
  unit TEXT,
  expiry_date DATE NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Design System

### Color Palette
- **Primary**: Blue tones (#5B82FF, #2F4BFF)
- **Accent**: Orange tones (#FF8A3C, #FF6A00)
- **Status Colors**: Green (good), Amber (warning), Red (critical)
- **Neutrals**: Slate tones for text and backgrounds

### Typography
- **Font Weights**: 3 maximum (normal, medium, bold)
- **Line Heights**: 150% for body text, 120% for headings
- **Hierarchy**: Clear heading structure with consistent spacing

### Spacing System
- **Base Unit**: 8px grid system
- **Consistent Margins**: Multiples of 8px (8, 16, 24, 32...)
- **Component Padding**: Standardized across all UI elements

## Component Architecture

```
src/
├── components/
│   ├── Header.jsx              # Navigation header
│   ├── PantryList.jsx          # Main item list view  
│   ├── PantryItemCard.jsx      # Individual item display
│   ├── ItemFormModal.jsx       # Add/edit form modal
│   ├── ConfirmDialog.jsx       # Delete confirmation
│   ├── SortFilterBar.jsx       # Sorting and filtering
│   └── NotificationToast.jsx   # Toast notifications
├── pages/
│   └── Dashboard.jsx           # Main application page
├── api/
│   └── api.js                  # API wrapper functions
├── utils/
│   └── dateUtils.js            # Date formatting utilities
└── App.tsx                     # Root component
```

## Sample Data

The application includes 6 sample items with varied scenarios:
- Items with different expiry statuses (expired, warning, good, no expiry)
- Out of stock item (quantity = 0)
- Items with detailed notes
- Various units and quantities

Run `npm run seed` to populate the database with sample data.

## Testing

### Frontend Tests
```bash
npm test
```
Tests include:
- Component rendering
- Form validation
- User interactions
- API integration

### Backend Tests
```bash
npm run test:server
```
Tests include:
- API endpoint functionality
- Database operations
- Input validation
- Error handling

## Accessibility Features

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Logical focus order in modals and forms
- **Color Contrast**: WCAG AA compliant color ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Responsive**: Optimized for screens 320px to 2560px wide

## Performance

- **Fast Loading**: Optimized bundle splitting with Vite
- **Smooth Animations**: 60fps animations with CSS transforms
- **Efficient Rendering**: React optimizations for large lists
- **Cached Assets**: Browser caching for static resources

## Security

- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **CORS Configuration**: Controlled cross-origin access
- **Error Handling**: No sensitive data leaked in error messages

## Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Commit** changes: `git commit -am 'Add feature'`
4. **Push** to branch: `git push origin feature-name`
5. **Submit** a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for modern pantry management**