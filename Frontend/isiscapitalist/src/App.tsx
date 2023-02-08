import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql } from '@apollo/client';
import Main from './Main';

//const [username, setUsername] = useState("")
//localStorage.setItem("username", username);

/*function onUserNameChanged(){
  let username = localStorage.getItem("username");

  return username;
}*/

function App() {
  const GET_WORLD = gql`
    query getWorld {
      getWorld {
        activeangels
        allunlocks {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        angelbonus
        angelupgrades {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        lastupdate
        logo
        managers {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
        money
        name
        products {
          cout
          croissance
          logo
          id
          managerUnlocked
          name
          paliers {
            idcible
            logo
            name
            ratio
            seuil
            typeratio
            unlocked
          }
          quantite
          revenu
          timeleft
          vitesse
        }
        score
        totalangels
        upgrades {
          idcible
          logo
          name
          ratio
          seuil
          typeratio
          unlocked
        }
      }
  }`

  return (
    <><div><Main></Main></div>
    <div><input /*className='Main' type="text" value={username} onChange={onUserNameChanged}*/ /></div></>
    
  );
}

export default App;
