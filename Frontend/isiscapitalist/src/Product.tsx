import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Product, World } from './world';
import MyProgressbar, { Orientation } from './ProgressBar';
import { useInterval } from './MyInterval';

type ProductProps = {
    product: Product
    onProductionDone: (product: Product, qt: number) => void
   }
   export default function ProductComponent({ product, onProductionDone
   } : ProductProps) {
       

    useInterval(() => calcScore(), 100)
    const lastupdate = useRef(Date.now())
    const [timeleft, setTimeleft] = useState(product.timeleft)

    
    let run = false; //Le produit n'est pas en fabrication
    function startFabrication() {
        setTimeleft(product.vitesse) //On initialise le temps restant
        lastupdate.current=Date.now()
        while (timeleft !=0){
            run = true //Le produit est en fabrication
        }
        if (product.managerUnlocked = false) {
            run = false //Le produit a été fabriqué, il faut recliquer.
        }
    }

    function calcScore() {
        if (timeleft !=0) {
            let tpsecoule = Date.now() - lastupdate.current
            lastupdate.current=Date.now()
            if (tpsecoule>=timeleft) {
                onProductionDone(product, 1)
                setTimeleft(0)       
            }
            else {
                setTimeleft(timeleft-tpsecoule)
            }
        }
        while (!product.managerUnlocked) {
            setTimeleft(0)
        }        
    }

   return (
    <div style={{backgroundColor:'azure', borderWidth:10, borderBlockColor:'black'}}>
        <img className='image' src={"http://localhost:4000/" + product.logo} />
        <span> {product.name} </span>
        <button onClick={startFabrication}/>
        <MyProgressbar className="barstyle" vitesse={product.vitesse}
        initialvalue={product.vitesse - timeleft}
        run={run} frontcolor="#ff8800" backcolor="#ffffff"
        auto={product.managerUnlocked}
        orientation={Orientation.horizontal} />
    </div>
   )
}
   