import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';
import { Product } from './world';

function App() {
  const [username, setUsername] = useState("")
  const client = useApolloClient();
  useEffect(() => {
    let first_username = localStorage.getItem("username")
    if (!first_username) {
      let x = Math.floor(Math.random() * 10000);
      first_username = "Captain" + x;
      localStorage.setItem("username", first_username)
    }
    setUsername(first_username)
  },[])

  function onUserNameChanged(event : ChangeEvent<HTMLInputElement>){
    let new_userN = event.target.value
    setUsername(new_userN)
    localStorage.setItem("username", new_userN);
    client.resetStore();
  }

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

  const {loading, error, data, refetch } = useQuery(GET_WORLD, {
    context: { headers: { "x-user": username } }
  });

  let corps = undefined
  if (loading) corps = <div> Loading... </div>
  else if (error) corps = <div> Erreur de chargement du monde ! </div>
  else corps = <Main loadworld={data.getWorld} username={username} />

  /*function onProductionDone(p: Product): void {
    let gain = Product.cout * Product.quantite
    addToScore(gain)
  }*/
   

  return (
    <div>
    <div> Your ID :
    <input type="text" value={username} onChange={onUserNameChanged}/>
    { corps }
    </div>
    </div>
    
  );
}

export default App;
