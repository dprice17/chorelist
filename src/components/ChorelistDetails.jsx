import React from "react";
import { ChorelistContext } from "./Chorelist";

export default function ChorelistDetails() {
  const {
    handleAddBtnClick,
    handleDelButtonClick,
    choreData,
    handleInputChange,
    userInput,
    handleDelSelectedChore,
  } = React.useContext(ChorelistContext);


  return (
    <div>
      <h1>Chorelist</h1>
      <div className="input-field-container">
        <input
          type="text"
          placeholder="Do dishes"
          className="input-field"
          value={userInput}
          onChange={handleInputChange}
        />

        <button className="primary-btn add-btn" onClick={handleAddBtnClick}>
          ADD
        </button>

        <button className="primary-btn del-btn" onClick={handleDelButtonClick}>
          DEL
        </button>

        <div>
          {Object.entries(choreData).map(([key, chore]) =>
                <button
                  className="chore-rendering-btn"
                  key={key}
                  onClick={() => handleDelSelectedChore(key)}
              >   
                  {chore}
                  <span className="delete-icon">X</span>
                </button>
            ) 
          }
          {choreData.length === 0 && <p className="add-chores-notification">Add chores to your list</p>}
        </div>

      </div>
    </div>
  );
}
