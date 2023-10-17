import React from "react";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  set,
  onValue,
  remove,
  child,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const ChorelistContext = React.createContext();

export default function Chorelist({ children }) {
  const appSettings = {
    databaseURL: "https://chorelist-e6990-default-rtdb.firebaseio.com/",
  };

  const app = initializeApp(appSettings);
  const database = getDatabase(app);
  const choresInDB = ref(database, "chorelist");

  const [choreData, setChoreData] = React.useState([]);
  const [userInput, setUserInput] = React.useState("");

  React.useEffect(() => {
    const fetchChoreData = () => {
      onValue(choresInDB, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setChoreData(data);
        } else {
          setChoreData([]);
        }
      });
    };
    fetchChoreData();
  }, [userInput]);


  const handleInputChange = (event) => {
    const userInput = event.target.value;
    setUserInput(userInput);
  };

  const handleAddBtnClick = () => {
    if (userInput.length > 0) {
      push(choresInDB, userInput);
    }
    setUserInput("");
  };


  const handleDelButtonClick = (choreIds) => {
    const rootRef = ref(database);
    const choresInDBRef = child(rootRef, "chorelist");
    set(choresInDBRef, null);
  };

  const handleDelSelectedChore = (key) => {
    const rootRef = ref(database);
      const selectedChore = child(rootRef, "chorelist/" + key);
      remove(selectedChore);
  };


  return (
    <ChorelistContext.Provider
      value={{
        handleAddBtnClick,
        handleDelButtonClick,
        choreData,
        handleInputChange,
        userInput,
        handleDelSelectedChore,
      }}
    >
      {children}
    </ChorelistContext.Provider>
  );
}

export { ChorelistContext };
