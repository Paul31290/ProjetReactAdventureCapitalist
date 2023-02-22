import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Product, World } from './world';
import MyProgressbar, { Orientation } from './ProgressBar';

type ProductProps = {
    product: Product
   }
   export default function ProductComponent({ product} : ProductProps) {
    const lastupdate = Date.now()
    

    function startFabrication() {

    }
   return (
    <div>
        <img className='image' src={"http://localhost:4000/" + product.logo} />
        <span> {product.name} </span>
        <button onClick={startFabrication}/>
        <MyProgressbar className="barstyle" vitesse={product.vitesse}
        initialvalue={product.vitesse - product.timeleft}
        run={run} frontcolor="#ff8800" backcolor="#ffffff"
        auto={product.managerUnlocked}
        orientation={Orientation.horizontal} />
    </div>
   )
}
   