import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from '@apollo/client';


//const [username, setUsername] = useState("")
//localStorage.setItem("username", username);

function onUserNameChanged(){
  let username = localStorage.getItem("username");

  return username;
}

function App() {
  const GET_WORLD = gql
  return (
    <div></div>
  );
}

export default App;
