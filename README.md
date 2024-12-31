# Chore Management App

This project is a web-based chore management application that allows users to add, update, delete, and track chores. The app uses Node.js, Express.js, PostgreSQL, and EJS templates for rendering the user interface.

## Features
- **User Management**: Add and select users.
- **Chore Management**: Add, edit, delete, and view chores for specific users.
- **Duplicate Checking**: Prevents duplicate chore entries.
- **Persistent Storage**: All data is stored in a PostgreSQL database.
- **Error Handling**: Includes error messages for user-friendly feedback.

---

## Technologies Used
- **Node.js**: Server-side JavaScript runtime.
- **Express.js**: Web framework for building routes and handling HTTP requests.
- **PostgreSQL**: Relational database for storing users and chores.
- **EJS**: Templating engine for rendering dynamic HTML pages.
- **dotenv**: For managing environment variables securely.
- **Body-Parser**: Middleware to parse incoming request bodies.

---

## Prerequisites
To run this project, ensure you have the following installed:
- Node.js
- PostgreSQL

Additionally, set up a `.env` file in the root directory with the following keys:

```env
DB_USER=<your-database-username>
DB_PASSWORD=<your-database-password>
DB_HOST=<your-database-host>
DB_PORT=<your-database-port>
DB_NAME=<your-database-name>
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd <project-folder>
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Set up the database:
   - Create a PostgreSQL database.
   - Use the following schema to create the required tables:
     ```sql
     CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name VARCHAR(255) NOT NULL
     );

     CREATE TABLE chores (
       id SERIAL PRIMARY KEY,
       chore TEXT NOT NULL,
       user_id INTEGER REFERENCES users(id)
     );
     ```

5. Run the application:
   ```bash
   node index.js
   ```
6. Open the browser and navigate to:
   ```
   http://localhost:3000
   ```

---

## Folder Structure
```
.
├── public/                 # Static assets (CSS, JS, etc.)
├── views/                  # EJS template files
├── index.js                  # Main application file
├── .env                    # Environment variables
├── package.json            # Project dependencies and metadata
└── README.md               # Documentation
```

---

## Routes
### `GET /`
- Renders the main page displaying the chore list.

### `POST /submit`
- Adds a new chore to the current user's list.

### `POST /delete`
- Deletes a chore based on its ID.

### `POST /save`
- Updates an existing chore based on its ID.

### `POST /selectuser`
- Handles user selection or redirects to the add user page.

### `POST /adduser`
- Adds a new user to the database.

---

## Error Handling
The app provides meaningful error messages displayed on the UI for:
- Database connection issues.
- Duplicate user or chore entries.
- Chore update or deletion failures.

---

## Contributions
Contributions are welcome! Feel free to fork the repository and submit a pull request.

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.

---

## Contact
For questions or support, please contact pricedeonte2009@yahoo.com

