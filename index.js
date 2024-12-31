import express from "express";
import bodyParser from "body-parser";
import "dotenv/config"; /// Loads environment variables
import pg from "pg"; /// Imports PostgreSQL

const app = express();
const port = 3000;
let choreData; /// Holds the chore list data for the current user
let users; /// Stores the list of users retrieved from the database
let currentUser; /// Tracks the currently selected user
let error; /// Holds error messages to display in the UI
let selectedUser; /// Tracks the user selected from the dropdown
let userExists = false; /// Indicates if a user already exists in the database
let isSelectAccountClicked = true; /// Tracks if the "Select Account" option is chosen

// Middleware to parse form data (url-encoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static("public"));

/// Connect your PostgreSQL to project with credentials stored in environment variables
const db = new pg.Client({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  database: process.env.DB_NAME,
});

/// Establishes database connection
db.connect();

/// Add new member/user to database
const addUser = async (name) => {
  const userExists = await checkUserExists(name);

  if (!userExists) {
    try {
      await db.query("INSERT INTO users (name) VALUES($1)", [name]);
    } catch (err) {
      error = "Error adding new member to database.";
      console.log("Error adding new member to database.", err);
    }
  } else {
    error = "User name already exists. Please enter another name.";
  }
};

/// Checks new user against database to see if it matches saved names
const checkUserExists = async (name) => {
  let match;
  try {
    const result = await db.query("SELECT * FROM users WHERE name = $1", [
      name,
    ]);
    match = result.rows;
  } catch (err) {
    error = "Error checking if user name exists.";
    console.log("Error verifying if new user name exists.", err);
  }

  if (match.length > 0) {
    userExists = true;
    return userExists;
  }
  return userExists;
};

/// Retrieves users from database
const getUsers = async () => {
  try {
    const result = await db.query("SELECT * FROM users");
    users = result.rows;
  } catch (err) {
    error = "Error retrieving data from database.";
    console.log("Error retrieving users from database", err);
  }
};

/// Load chores from database for the current user
const loadChoreData = async () => {
  try {
    const result = await db.query("SELECT * FROM chores WHERE user_id = $1", [
      currentUser,
    ]);
    choreData = result.rows;
  } catch (err) {
    error = "Error loading chore list.";
    console.log("Error loading chore list", err);
  }
};

/// Saves new chore to the database
const saveToDatabase = async (chore) => {
  try {
    await db.query("INSERT INTO chores (chore, user_id) VALUES($1, $2)", [
      chore,
      currentUser,
    ]);
  } catch (err) {
    error = "Error saving chore list item.";
    console.log("Error saving chore list item", err);
  }
};

/// Updates an existing chore in the database
const updateDatabase = async (id, chore) => {
  const isDuplicate = choreData.some(
    (item) => sanitizeChore(item.chore) === sanitizeChore(chore)
  );

  try {
    if (!isDuplicate) {
      await db.query("UPDATE chores SET chore = $1 WHERE id = $2", [chore, id]);
    } else {
      error = `${chore} is already on your chore list.`;
    }
  } catch (err) {
    error = "Error editing chore list item.";
    console.log("Error editing chore list item", err);
  }
};

/// Sanitizes chore input by removing non-alphanumeric characters and converting to lowercase
const sanitizeChore = (chore) => {
  return chore.toLowerCase().replace(/[^a-z0-9]/gi, "");
};

/// Deletes a chore from the database based on its id
const deleteChore = async (id) => {
  const num = parseInt(id, 10);

  try {
    await db.query("DELETE FROM chores WHERE id = $1", [num]);
  } catch (err) {
    error = "Chore list item could not be deleted.";
    console.log("Chore list item could not be deleted", err);
  }
};

/// Checks for duplicate chores before adding a new one
const checkForDuplicates = (chore) => {
  if (choreData.length === 0) {
    saveToDatabase(chore);
  } else {
    const isDuplicate = choreData.some(
      (item) => sanitizeChore(item.chore) === sanitizeChore(chore)
    );
    if (!isDuplicate) {
      saveToDatabase(chore);
    } else {
      error = `${chore} is already on your chore list.`;
    }
  }
};

/// Route to render the main page (displays chores)
app.get("/", (req, res) => {
  try {
    error = "";
    isSelectAccountClicked = true;
    selectedUser = undefined;
    choreData = undefined;
    res.render("index.ejs", {
      choreData: choreData,
      selectedUser: selectedUser,
      isSelectAccountClicked: isSelectAccountClicked,
      users: users,
      error: error,
    });
  } catch (err) {
    console.log("Error rendering main page:", err);
    res.status(500).send("Internal Server Error");
  }
});

/// Route to handle new chore submissions (from the form)
app.post("/submit", async (req, res) => {
  try {
    error = "";
    checkForDuplicates(req.body.chore);
    await loadChoreData();
    res.render("index.ejs", {
      choreData: choreData,
      users: users,
      selectedUser: selectedUser,
      error: error,
    });
  } catch (err) {
    console.log("Error handling chore submission:", err);
    res.status(500).send("Internal Server Error");
  }
});

/// Route to handle chore deletion
app.post("/delete", async (req, res) => {
  try {
    error = "";
    deleteChore(req.body.id);
    await loadChoreData();
    res.render("index.ejs", {
      choreData: choreData,
      users: users,
      selectedUser: selectedUser,
      error: error,
    });
  } catch (err) {
    console.log("Error deleting chore:", err);
    res.status(500).send("Internal Server Error");
  }
});

/// Route to handle updating a chore
app.post("/save", async (req, res) => {
  try {
    error = "";
    updateDatabase(req.body.id, req.body.updatedChore);
    await loadChoreData();
    res.render("index.ejs", {
      choreData: choreData,
      users: users,
      selectedUser: selectedUser,
      error: error,
    });
  } catch (err) {
    console.log("Error saving chore update:", err);
    res.status(500).send("Internal Server Error");
  }
});

/// Route to handle user selection
app.post("/selectuser", async (req, res) => {
  try {
    error = "";

    req.body.options == 0
      ? (isSelectAccountClicked = true)
      : (isSelectAccountClicked = false);

    if (req.body.options === "add") {
      res.render("adduser.ejs");
    } else {
      currentUser = parseInt(req.body.options);
      selectedUser = currentUser;
      await loadChoreData();
      res.render("index.ejs", {
        choreData: choreData,
        users: users,
        error: error,
        selectedUser: selectedUser,
        isSelectAccountClicked: isSelectAccountClicked,
      });
    }
  } catch (err) {
    console.log("Error selecting user:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/adduser", async (req, res) => {
  try {
    const name = req.body.user;
    error = "";
    userExists = false;

    // Perform database operations
    await addUser(name);
    await getUsers();
    await loadChoreData();

    if (userExists) {
      res.render("adduser.ejs", { error: error });
    } else {
      // Set `selectedUser` and `currentUser` to the newly added user
      const newUser = users.find((user) => user.name === name);
      selectedUser = newUser.id;
      currentUser = newUser.id;

      res.render("index.ejs", {
        choreData: choreData,
        users: users,
        selectedUser: selectedUser,
        error: error,
      });
    }
  } catch (err) {
    console.log("Error adding user:", err);
    res.status(500).send("Internal Server Error");
  }
});

getUsers();

// Start the server on the defined port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
