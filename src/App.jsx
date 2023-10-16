import React from "react";
import Chorelist from "./components/Chorelist.jsx";
import ChorelistDetails from "./components/ChorelistDetails.jsx";

export default function App() {
  return (
    <div className="container">
      <Chorelist>
        <ChorelistDetails />
      </Chorelist>
    </div>
  );
}
