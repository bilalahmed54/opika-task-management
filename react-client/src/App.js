import "./App.css";
import { Route, Routes } from "react-router-dom";
import React from "react";
import CreateUpdateTask from "./containers/CreateUpdateTask";
import TaskListing from "./containers/TaskListing";
import Header from "./componets/Header";

function App() {
  return (
    <React.Fragment>
      <header>
        <Header />
      </header>
      <main>
        <Routes>
          <Route
            path="/task"
            element={<CreateUpdateTask />}
          ></Route>
          <Route
            path="/task/:id"
            element={<CreateUpdateTask />}
          ></Route>
          <Route
            path="/"
            element={<TaskListing />}
          ></Route>
        </Routes>
      </main>
    </React.Fragment>
  );
}

export default App;
