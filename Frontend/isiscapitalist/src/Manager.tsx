import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './Manager.css';
import { World, Palier} from './world';


type ManagerProps = {
    world: World
    showManager: Boolean
    hiringManager: (manager: Palier) => void
    seeManagers: () => void
   }
   export default function ManagerComponent({world, showManager, hiringManager, seeManagers} : ManagerProps) {

    const [showMangager, setShowManager] = useState(showManager)

    // On utilise le hook d'effet qui nous permet de récupérer le showManager pour afficher la page
    useEffect(() => {
        setShowManager(showManager);
    }, [showManager]);

    // On utilise la fonction pour pouvoir engager un manager
    function hireManager(manager: Palier){
        if(manager.seuil < world.money){
            hiringManager(manager)
        }
    }

    // On utilse cette fonction pour pouvoir fermer la fenetre grâce à showManager
    function fermerLaFenetre(){
        setShowManager(!showManager)
        seeManagers()
    }
    
    return(
    <div className="modal">
        <div>
            <h1 className="title">La liste des Managers:</h1>
        </div>
        <div> 
            {world.managers.filter( (manager) => !manager.unlocked).map(manager  =>
                <div key={manager.idcible} className="managergrid">
                    <div>
                        <div className="logo">
                            <img alt="manager logo" className="round" src= {"http://localhost:4000/"+ manager.logo} />
                        </div>
                    </div>
                    <div className="infosmanager">
                        <div className="managername"> Nom: { manager.name} </div>
                        <div className="managercible"> Agit sur: {world.products[manager.idcible-1].name}</div>
                        <div className="managercost"> Argent demandé: {manager.seuil} </div>
                    </div>
                <div>
                    <button disabled={world.money < manager.seuil} onClick={() => hireManager(manager)}> Engager ?</button>
                </div>
            </div>
        )
    }
    <button className="closebutton" onClick={fermerLaFenetre}> Fermer </button>
    </div>
    </div>
    )
} 