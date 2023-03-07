import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Manager.css';
import {Product, World, Palier} from './world';

type ManagerProps = {
    manager: Palier
    showManagers: Boolean
   }
   export default function ManagerComponent(this: any, {manager} : ManagerProps) { 

if (manager.showManagers){
    return(<div class="modal">
    <div>
        <h1 class="title">Managers make you feel better !</h1>
    </div>
 <div>
    world.managers.pallier.filter( manager => !manager.unlocked).map(
        manager =>
    <div key={manager.idcible} className="managergrid">
        <div>
            <div className="logo">
                <img alt="manager logo" className="round" src= { 
                this.props.services.server + manager.logo} />
            </div>
        </div>
    <div className="infosmanager">
        <div className="managername"> { manager.name} </div>
        <div className="managercible"> { 
            this.props.world.products.product[manager.idcible-1].name } </div>
    <div className="managercost"> { manager.seuil} </div>
    </div>
    <div onClick={() => this.hireManager(manager)}>
        <Button disabled={this.props.world.money < manager.seuil}> 
Hire !</Button>
 </div>
 </div>
)
 <button class="closebutton" onClick={"manager.showManagers = !manager.showManagers"}> Close</button>

        </div>
    </div>
)
        } else return (null)
}



