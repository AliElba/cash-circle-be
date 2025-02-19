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
- **Swagger**: An open-source software framework backed by a large ecosystem of tools that helps developers design, build, document, and consume RESTful web services.
- **OpenAPI Generator**: A code generator that takes an OpenAPI Specification and generates client libraries, server stubs, and documentation.

## Scripts

### Restart DB container o(`db:dev:restart`) this will run the below commands:
1. `npm run db:dev:rm`: Remove the development database container.
2. `npm run db:dev:up`: Start the development database container.
3. `sleep 1`: Wait for 1 second.
4. `npm run prisma:dev:deploy`: Deploy the Prisma migrations.

### Modify Prisma schema
1. **Generate a new migration**: Create a new migration based on the changes in the Prisma schema.
   ```bash
   npx prisma migrate dev --name <migration_name>
   ```
2. **Deploy the migration**: Apply the generated migration to the database.
   ```bash
   npx prisma migrate deploy
   ```
3. **Generate the Prisma client**: Update the Prisma client to reflect the new schema changes.
   ```bash
   npx prisma generate
   ```
4. **Verify the changes**: Optionally, you can use Prisma Studio to verify the changes in the database.
   ```bash
   npx prisma studio
   ``` 

### Start Backend App
- `npm run start:dev`: Start the application in development mode with hot-reloading.
- `npm run build`: Build the application.

### Git Commands
- `git status`: Check the status of the repository.
- `git add .`: Add all changes to the staging area.
- `git commit -m "message"`: Commit changes with a message.
- `git push origin main`: Push changes to the main branch.
- `git pull origin main`: Pull changes from the main branch.

### Docker Commands
- `docker ps`: List all running containers.
- `docker-compose up -d`: Start the application in detached mode.

### Prisma (DB) Commands

- `prisma migrate dev --name xyz`: Create a new migration based on the changes in the Prisma schema.
- `prisma generate`: Generate the Prisma client based on the Prisma schema. The generated client will be stored in the `node_modules/.prisma/client` directory.
- `prisma db push`: Deploy the Prisma migrations to the database.
- `prisma studio`: Open the Prisma Studio to view and edit the database.


### Setup Cloud DB
- install `cross-env`
- add `DATABASE_URL_CLOUD` to `.env`
- run `npm run prisma:migrate:cloud`