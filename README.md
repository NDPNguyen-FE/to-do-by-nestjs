# 📝 Full-Stack Todo Application

A modern full-stack Todo application built with **NestJS**, **React**, **MySQL**, **Docker**, and **Tailwind CSS**.

![Tech Stack](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

---

## ✨ Features

- 🔐 **Authentication**: JWT-based login system
- ✅ **Todo CRUD**: Create, Read, Update, Delete todos
- ⏰ **Auto-expiration**: Background job automatically marks expired todos as inactive
- 🎨 **Modern UI**: Responsive design with Tailwind CSS
- 🐳 **Dockerized**: Easy deployment with Docker Compose
- 📊 **Database Migrations**: TypeORM migrations for schema management
- 🔄 **Real-time Updates**: Frontend auto-refreshes every 5 seconds

---

## 🚀 Quick Start

### Prerequisites

- Docker Desktop installed and running
- Ports 3000, 3001, 3306 available

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd to-do-nestjs
   ```

```
to-do-nestjs/
├── backend/                 # NestJS backend
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── todo/           # Todo module
│   │   ├── migrations/     # Database migrations
│   │   ├── app.module.ts   # Main app module
│   │   └── main.ts         # Entry point
│   ├── ormconfig.ts        # TypeORM config
│   └── Dockerfile
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── api.ts          # Axios API client
│   │   └── App.tsx         # Main app component
│   ├── tailwind.config.js  # Tailwind config
│   └── Dockerfile
└── docker-compose.yml      # Docker orchestration
```

---

## 🛠️ Tech Stack

### Backend

- **NestJS** - Progressive Node.js framework
- **TypeORM** - ORM for TypeScript
- **MySQL** - Relational database
- **JWT** - Authentication
- **Passport** - Authentication middleware

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client
- **React Router** - Routing

### DevOps

- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration

---

## 🎯 Usage

### Login

1. Navigate to <http://localhost:3001>
2. Enter credentials: `admin` / `admin`
3. Click "Login"

### Create Todo

1. Fill in the form:
   - **Title**: Todo title
   - **Description**: Todo description
   - **Time**: Expiration time
2. Click "Add Todo"

### Todo Status

- **Green border**: Active todo
- **Red border**: Expired/Inactive todo

### Delete Todo

Click the trash icon to delete a todo

---

## 🐳 Docker Commands

### Start containers

```bash
docker-compose up -d
```

### View logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop containers

```bash
docker-compose down
```

### Restart a service

```bash
docker-compose restart backend
```

### Reset database

```bash
docker-compose down -v
docker-compose up -d --build
```

---

## 📊 Database Migrations

### Run migrations

```bash
cd backend
npm run migration:run
```

### Create new migration

```bash
npm run migration:create src/migrations/MigrationName
```

### Generate migration from entity changes

```bash
npm run migration:generate src/migrations/MigrationName
```

### Rollback last migration

```bash
npm run migration:revert
```

### View migration status

```bash
npm run migration:show
```

---

## 🔧 Development

### Run backend locally

```bash
cd backend
npm install
npm run start:dev
```

### Run frontend locally

```bash
cd frontend
npm install
npm run dev
```

### Run MySQL locally

Ensure MySQL is running on port 3306 with database `todo_db`

---

## 🌐 API Endpoints

### Authentication

- `POST /auth/login` - Login with username and password

### Todos

- `GET /todo` - Get all todos
- `POST /todo` - Create a new todo
- `DELETE /todo/:id` - Delete a todo

---

## 🎨 UI Screenshots

### Login Page

Clean, centered login form with modern design

### Todo Dashboard

- Horizontal form for creating todos
- Color-coded todo items (green = active, red = expired)
- Responsive layout
- Delete button with trash icon

---

## ⚙️ Configuration

### Environment Variables

**Backend** (`backend/.env`):

```env
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=root
DB_DATABASE=todo_db
```

**Frontend** (`frontend/.env`):

```env
VITE_API_URL=http://localhost:3000
```

---

## 🐛 Troubleshooting

### Port already in use

```bash
# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :3001
netstat -ano | findstr :3306

# Kill process
taskkill /PID <PID> /F
```

### Database connection error

- Ensure MySQL container is running
- Check `docker-compose logs mysql`
- Verify environment variables

### Frontend not loading

```bash
docker-compose logs frontend
docker-compose restart frontend
```

### Backend crash

```bash
docker-compose logs backend
# Check for TypeScript errors or database connection issues
```

---

## 📝 Notes

- The backend uses `setInterval` instead of `@nestjs/schedule` for the cron job due to Docker compatibility
- `synchronize: false` is used with migrations for production-ready schema management
- Frontend polls the API every 5 seconds for real-time updates

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Your Name - [Your GitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- NestJS Documentation
- React Documentation
- Tailwind CSS
- TypeORM
- Docker

---

**Made with ❤️ using NestJS, React, and Docker**
