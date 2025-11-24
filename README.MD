# Foomlab-project-test

## Project Structure

```

backend/
    src/
        config/        # Database configuration
        controllers/   # Request handlers
        models/        # Sequelize models
        routes/        # API routes
        seeders/       # Database seeders
        services/      # Business logic
        index.js       # Application entry point
    package.json
frontend/
    app/              # Next.js app directory
    components/       # React components
    package.json
README.MD
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the backend directory:

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
```

4. Database setup:

This project uses Sequelize ORM with automatic model synchronization. There are no migration files - the database schema is created automatically based on the models when the application starts.

5. Run database seeders (optional):

```bash
npm run seed
```

6. Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Warehouses

- `GET /warehouses` - List all warehouses

### Products

- `GET /products` - List all products

### Stocks

- `GET /stocks` - List all stock records

### Purchase Requests

- `GET /purchase/request` - List all purchase requests
- `POST /purchase/request` - Create a purchase request
- `PUT /purchase/request/:id` - Update purchase request status
- `DELETE /purchase/request/:id` - Delete purchase request

### Webhooks

- `POST /webhook` - Handle webhook notifications

**Note:** Webhooks require ngrok for local development to expose local server to external systems.
**Note:** The vendor is hard coded to PT FOOM LAB GLOBAL so that would be trigger the webhook

## Development Scripts

### Backend

```bash
npm run dev      # Start development server with nodemon
npm run run      # Start production server
npm run seed     # Run database seeders
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
```
