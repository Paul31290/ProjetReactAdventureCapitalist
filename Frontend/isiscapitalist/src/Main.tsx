import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { World } from './world';
import Product from './Product';
import Manager from './Manager';
import { transform } from './utils';
import { click } from '@testing-library/user-event/dist/click';
import ProductComponent from './Product';

type MainProps = {
  loadworld: World
  username: string
}
  export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
    useEffect(() => {
      setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
     }, [loadworld])

    function onProductionDone(p: Product, qt:number): void {
      let gain = p.revenu * p.quantite * qt
      addToScore(gain)
    }
  
    function addToScore(gain:number){
      world.money += gain
    }
    
    return (
        <><div className="header">
        <div><img className='image' src={"http://localhost:4000/" + world.logo} /> <span> {world.name} </span></div>
        <div><img className='image' src={"http://localhost:4000/icones/Bandeau.png"} /></div>
        <div><span dangerouslySetInnerHTML={{ __html: transform(world.money) }} /></div>
        <div><img className='image' src={"http://localhost:4000/icones/Multiplicateur.png"} /></div>
        <div>multiplicateur</div>
        <div className="main" />
        <div>liste des boutons de menu</div>
        <div className="product" />
        <ProductComponent onProductionDone={onProductionDone} product={world.products[0]} />
        <ProductComponent onProductionDone={onProductionDone} product={world.products[1]} />
        <div>troisième produit</div>
        <div>quatrième produit</div>
        <div>cinquième produit</div>
        <div>sixième produit</div>
      </div>
      <button class="manager" onClick ={"showManagers = !showManagers"}>
        Managers
      </button>
      <Manager showManagers = "false"></Manager> 
      <Manager showManagers = "true"></Manager>  
    );
}