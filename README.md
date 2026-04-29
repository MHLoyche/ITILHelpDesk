# HelpFlow ITIL Desk

Angular application for building an ITIL-style help desk interface and workflows.

## Full Stack Overview

### Frontend
- Angular 21
- TypeScript 5.9
- Angular Material + CDK
- Component-scoped CSS (Angular styles)
- Vitest (via `ng test`)

### Backend 
- Express
- MySQL 8+


### Database
- MySQL 8+ with helpflowdb schema
- See [Database Schema](#database-schema) below

## Prerequisites

- Node.js 20+
- npm 10+
- MySQL 8+ (running locally or remote connection available)

## Database Setup

1. Create the MySQL database by running the SQL schema script:

```text
Run the CreateScript.sql in the public folder ~ I also included some Sample Date in another script.
```

2. Ensure MySQL is running and accessible on localhost:3306 (or update backend .env)

## Getting Started

### Setup Frontend (Angular)

1. Navigate to the frontend folder (if not already there):

```bash
cd helpflow-frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment config (optional, defaults to localhost:4200):

```bash
# No .env needed for dev frontend; API URL is set in services
```

4. Start the dev server:

```bash
npm start
```

Frontend runs on: http://localhost:4200

### Setup Backend (Express)

1. Navigate to backend folder:

```bash
cd ../helpflow-backend
```

2. Install dependencies:

```bash
npm install
```

3. Create `.env` file in backend root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=helpflowdb
PORT=3000
CORS_ORIGIN=http://localhost:4200
```

⚠️ **Important**: Do NOT commit `.env` to version control. Add it to `.gitignore`.

4. Start the backend dev server:

```bash
npm start
```

Backend API runs on: http://localhost:3000

## Running Both Frontend & Backend

**Terminal 1 - Frontend:**
```bash
cd helpflow-frontend
npm start
```

**Terminal 2 - Backend:**
```bash
cd helpflow-backend
npm start
```

Once both are running, navigate to http://localhost:4200 in your browser.

## Available Scripts

### Frontend

- Start local development server:

```bash
npm start
# or
ng serve
```

- Build production bundle:

```bash
ng build
```

### Backend

- Start dev server:

```bash
npm start
```


- Start backend with auto-reload during development:

```bash
npm run dev
```

- Backend project structure:

```text
Express + MySQL
server.js is the entry point
```

## API Reference

All API routes are served from `http://localhost:3000/api`. Base URL: `http://localhost:3000/api`

### Tickets

#### GET `/api/tickets`
Returns all tickets with related data (status, priority, supporter, category, SLA).

#### GET `/api/tickets/:id`
Returns a single ticket by ID with full details.

**Parameters:**
- `id` (integer, required) - Ticket ID

#### POST `/api/tickets`
Creates a new ticket. Automatically sets `status_id = 1` (Open).

### Articles

#### GET `/api/articles`
Returns all articles with category names, ordered by newest first.

#### GET `/api/articles/:id`
Returns a single article by ID.

**Parameters:**
- `id` (integer, required) - Article ID

### Categories

#### GET `/api/categories`
Returns all ticket categories available for selection.

### Comments

#### GET `/api/comments?ticket_id=:id`
Returns all comments for a specific ticket, ordered by creation date.

**Query Parameters:**
- `ticket_id` (integer, required) - Ticket ID to fetch comments for

#### POST `/api/comments`
Creates a new comment on a ticket.

**Required Fields:** ticket_id, message, authorName

### Supporters

#### GET `/api/supporters`
Returns all support staff members.

### SLA (Service Level Agreements)

#### GET `/api/slas`
Returns all SLA policies with response and resolve time targets.

#### POST `/api/slas`
Creates a new SLA policy.

**Required Fields:** categoryName, responseHours, resolveHours

## Database Schema

The MySQL database includes the following core tables:

- **tickets** - Help desk tickets with priority, status, requester, assignee
- **priorities** - Ticket priority levels (Low, Medium, High, Critical)
- **status** - Ticket status values (Open, In Progress, Pending, Resolved, Closed)
- **supporters** - Support agent/staff members
- **categories** - Ticket categories
- **sla** - Service Level Agreement policies
- **articles** - Knowledge base articles
- **comments** - Comments/activity on tickets

For full schema with constraints and relationships, see the helpflowdb setup script.

## Production mode (for lighthouse test)

```bash
npm run build -- --configuration production

npx serve -s dist/helpflow/browser -l 4200
```

## Project explanation
```text
This project is made to learn about ITIL and GUI programming. 
I have tried to create an intuitive design, that is easy to understand and navigate.
The project is created as a school project during my second schoolterm.
This project is also my first attempt at using Angular and TypeScript.
```