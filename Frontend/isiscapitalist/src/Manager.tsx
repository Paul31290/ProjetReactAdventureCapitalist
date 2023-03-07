import React from 'react';
import logo from './logo.svg';
import './App.css';
import './Manager.css';
import { click } from '@testing-library/user-event/dist/click';
import {Product, World, Palier} from './world';

type ManagerProps = {
    manager: Palier
    showManagers: Boolean
   }
   export default function ManagerComponent(this: any, {manager} : ManagerProps) { 

if (manager.showManagers){
    return(<div className="modal">
    <div>
        <h1 className="title">Managers make you feel better !</h1>
    </div>
 <div> {
    World.manager.pallier.filter( (manager: { unlocked: any; }) => !manager.unlocked).map((manager: { idcible: React.Key | null | undefined; logo: any; name: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; seuil: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }) =>
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
    <div className="managercost"> {manager.seuil} </div>
    </div>
    <div onClick={() => this.hireManager(manager)}>
        <button disabled={this.props.world.money < manager.seuil}> 
Hire !</button>
 </div>
 </div>
)
}
 <button className="closebutton"/> (click) = {"manager.showManagers = !manager.showManagers"} Close

        </div>
        </div>
    )
         } else return (null)
}



