import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;
let choreData = [];

// Middleware to parse form data (url-encoded)
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static("public"));

// Function to load chore data from 'choreData.json' file
const loadChoreData = () => {
  try {
    const dataBuffer = fs.readFileSync("choreData.json");
    const dataJSON = dataBuffer.toString();
    choreData = JSON.parse(dataJSON);
  } catch (e) {
    choreData = [];
  }
};

// Function to save the current state of 'choreData' to 'choreData.json' file
const saveToLocalStorage = () => {
  const dataJSON = JSON.stringify(choreData);
  fs.writeFileSync("choreData.json", dataJSON);
};

// Function to sanitize chore input (removes non-alphanumeric characters and converts to lowercase)
const sanitizeChore = (chore) => {
  const updatedChore = chore.toLowerCase().replace(/[^a-z0-9]/gi, "");
  return updatedChore;
};

// Function to update a chore in 'choreData' based on its id
const updateChoreData = (id, updatedChore) => {
  const num = parseInt(id, 10);

  const isDuplicate = choreData.some(
    (item) => sanitizeChore(item.chore) === sanitizeChore(updatedChore)
  );

  if (!isDuplicate) {
    choreData[num].chore = updatedChore;
  }

  saveToLocalStorage();
};

// Function to delete a chore from the list based on its id
const deleteChore = (id) => {
  const num = parseInt(id, 10);

  choreData = choreData.filter((chore) => chore.id !== num);
  saveToLocalStorage();
};

// Function to check for duplicate chores before adding new ones
const checkForDuplicates = (chore) => {
  if (choreData.length === 0) {
    choreData.push({ chore: chore });
  } else {
    const isDuplicate = choreData.some(
      (item) => sanitizeChore(item.chore) === sanitizeChore(chore)
    );

    if (!isDuplicate) {
      choreData.push({ chore: chore });
    }
  }

  choreData = choreData.map((chore, index) => ({
    id: index,
    ...chore,
  }));

  saveToLocalStorage();
};

// Route to render the main page (displays chores)
app.get("/", (req, res) => {
  res.render("index.ejs", { choreData: choreData });
});

// Route to handle new chore submissions (from the form)
app.post("/submit", (req, res) => {
  checkForDuplicates(req.body["chore"]);
  res.render("index.ejs", { choreData: choreData });
});

// Route to handle chore deletion
app.post("/delete", (req, res) => {
  deleteChore(req.body.id);
  res.render("index.ejs", { choreData: choreData });
});

// Route to handle updating a chore
app.post("/save", (req, res) => {
  updateChoreData(req.body.id, req.body["updatedChore"]);
  res.render("index.ejs", { choreData: choreData });
});

// Load initial chore data from file when the server starts
loadChoreData();

// Start the server on the defined port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
