import React from "react";
import "./App.css";
import mondaySdk from "monday-sdk-js";
import "monday-ui-react-core/dist/main.css"
import MyApp from "./MyApp";
import MyLayout from "./MyLayout";
//Explore more Monday React Components here: https://style.monday.com/

const monday = mondaySdk();

interface IAppProps {
  settings?: object;
  name?: string;
}
const App: React.FC<IAppProps> = (props) => {

  return (<>
    <MyLayout />
  </>)
}

export default App;
