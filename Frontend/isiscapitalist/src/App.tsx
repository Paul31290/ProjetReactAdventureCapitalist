import React, { ChangeEvent, useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import Main from './Main';
import { Product, World } from './world';
import ProductComponent from './Product';

function App() {
  const [username, setUsername] = useState("")
  const client = useApolloClient();
  //On génère un identifiant aléatoire à l'ouverture de la session
  useEffect(() => {
    let first_username = localStorage.getItem("username")
    if (!first_username) {
      let x = Math.floor(Math.random() * 10000);
      first_username = "Captain" + x;
      localStorage.setItem("username", first_username)
    }
    setUsername(first_username)
  },[])

  //Le nom est remis à jour sur le serveur à chaque fois que l'utilisateur tape un caractère.
  function onUserNameChanged(event : ChangeEvent<HTMLInputElement>){
    let new_userN = event.target.value
    setUsername(new_userN)
    localStorage.setItem("username", new_userN);
    client.resetStore();
  }

  //On charge le monde stocké dans le serveur.
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
