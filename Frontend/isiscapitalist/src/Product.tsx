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

    
    let run = true;
    function startFabrication() {
        setTimeleft(product.vitesse)
        lastupdate.current=Date.now()
        //while (timeleft > 0)
            
        /*run est un booléen qui quand il est vrai anime la production de la barre, et quand il est faux la
        remet à zéro. Il faut donc le mettre en vrai quand le produit est en production, autrement dit quand
        sa propriété timeleft est strictement positive (ou, comme nous le verrons plus tard, quand le
        manager du produit est débloqué).*/ 

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
   