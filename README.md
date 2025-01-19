# Express PostgreSQL User Management API

This project is a simple API using Express.js and PostgreSQL for CRUD (Create, Read, Delete) operations on user data, with a terminal-based interface for interaction.

## Requirements
1. **Node.js** (version 14 or higher)
   - [Download Node.js](https://nodejs.org/)
2. **PostgreSQL** (version 12 or higher)
   - [Download PostgreSQL](https://www.postgresql.org/download/)
3. **Node.js Packages**:
   - express
   - pg
   - inquirer
   - axios

## How to Use
1. **Clone the Repository**:
   ```bash
   git clone <YOUR_REPOSITORY_URL>
   cd <YOUR_REPOSITORY_FOLDER>
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure the Database**:
   - Create the `users` table in PostgreSQL:
     ```sql
     CREATE TABLE users (
         id SERIAL PRIMARY KEY,
         name VARCHAR(100),
         email VARCHAR(100)
     );
     ```
   - Adjust the database configuration in the code:
     ```javascript
     const client = new Client({
       user: 'postgres',
       host: 'localhost',
       database: 'testDb',
       password: '123',
       port: 5432,
     });
     ```

4. **Run the Server**:
   ```bash
   node <your_file_name>.js
   ```
   The server will run at `http://localhost:3000`.

5. **Use the Terminal Prompt**:
   Follow the prompts to:
   - Retrieve the list of users.
   - Add new users.
   - Delete users by ID.

6. **Direct API Access**:
   - **GET** `/users`: Retrieve all users.
   - **POST** `/users`: Add a new user.
     - Body: `{ "name": "User Name", "email": "User Email" }`
   - **DELETE** `/delete-item`: Delete a user by ID.
     - Body: `{ "id": "User ID" }`

## Notes
- Ensure PostgreSQL is running before starting the server.
- Use a terminal that supports interactive input for the best experience.

## License
This project is licensed under the MIT License.

