## Tools Used

- **NestJS**: A progressive Node.js framework for building efficient, reliable, and scalable server-side applications.
- **TypeScript**: A strongly typed programming language that builds on JavaScript.
- **npm**: A package manager for the JavaScript programming language.
- **Docker**: A platform for developing, shipping, and running applications in containers.
- **Docker Compose**: A tool for defining and running multi-container Docker applications.
- **PostgreSQL**: An open-source relational database management system.
- **Prisma**: A modern database toolkit for TypeScript & Node.js. It helps you to interact with your database by providing a clean and type-safe API for database access.
- **argon2**: A password-hashing function that includes a salt in the hash to protect against rainbow table attacks.
- **JWT**: JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.


## Scripts

`db:dev:restart`

1. Remove the development database container.
2. Start the development database container.
3. Wait for 1 second.
4. Deploy the Prisma migrations.

## Most Used Commands

Here are some of the most commonly used commands for the backend application:

- `npm run start:dev`: Start the application in development mode with hot-reloading.
- `npm run build`: Build the application.
- `npm run db:dev:restart`: Restart the development database and deploy Prisma migrations.
- 
- `git status`: Check the status of the repository.
- `git add .`: Add all changes to the staging area.
- `git commit -m "message"`: Commit changes with a message.
- `git push origin main`: Push changes to the main branch.
- `git pull origin main`: Pull changes from the main branch.
- 
- `docker ps`: List all running containers.
- `db:dev:restart`: Restart the development database and deploy Prisma migrations.
- `docker-compose up -d`: Start the application in detached mode.
- 
- `prisma studio`: Open the Prisma Studio to view and edit the database.
- `prisma migrate dev`: Create a new migration based on the changes in the Prisma schema.
- `prisma generate`: Generate the Prisma client based on the Prisma schema.
- `prisma db push`: Deploy the Prisma migrations to the database.