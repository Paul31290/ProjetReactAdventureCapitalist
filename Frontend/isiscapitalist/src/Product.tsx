import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import './Product.css';
import { Product, World } from './world';
import MyProgressbar, { Orientation } from './ProgressBar';
import { useInterval } from './MyInterval';
import { gql, useMutation } from '@apollo/client';

type ProductProps = {
    product: Product
    onProductionDone: (product: Product) => void
    onProductBuy: (qt: number, p: Product) => void
    username: string
    money: number
   }
   export default function ProduitComponent({product, onProductionDone, onProductBuy, username, money
   } : ProductProps) {
       
    // On initialise nos hooks, lancer pour le manager automatique avec la progressBar
    const [lancer, setLancer] = useState(false)

    /* On initialise nos hooks, lastupdate pour la mise à jour du temps, 
    timeleft pour le temps restant au produit pour sa pion*/
    useInterval(() => calcScore(), 100)
    const [lastupdate, setLastUpdate] = useState(Date.now())
    const [timeleft, setTimeleft] = useState(product.timeleft)

    /*On fait un appel au back pour lancer un produit et récupérer son id*/ 
    const lancerProductionProduit = gql`
    mutation LancerpionProduit($lancerpionProduitId: Int!) {
        lancerpionProduit(id: $lancerpionProduitId) {
          id
        }
      }
    `
    //On met les conditions nécessaires et une exception pour appeler la mutation  
    const [production] = useMutation(lancerProductionProduit,{
        context: {
            headers:{
                "x-user": username
            }
        },
        onError: (error): void => {
                "Le produit ne peut pas être lancé"
            }
        }
    )
    // Fonction qui lance la pion d'un produit avec la progress bar.
    function produireProduit(){
        if(product.timeleft == 0 && product.quantite >= 0){
            setLancer(true)
            product.timeleft = product.vitesse
            setLastUpdate(Date.now())
        }
    }
        
    /* On fait une fonction d'achat de produit. Si le cout du produit
    est supérieur à notre argent disponible, alors on n'achète pas le produit*/
    function produitDisponible(): boolean{
        if(product.cout > money){
            return true
        } else {
            return false
        }
    }

    // On achète 1 produit
    function acheterProduit(){
        onProductBuy(1, product)
    }

    /* On fait une fonction qui calcule notre score, si le temps restant de notre produit
     n'est pas égal à 0, alors on update notre temps restant. Si le temps restant est 
     inférieur à 0, alors on regarde si un manager est débloqué. Si oui, on lance 
     automatiquement la progress bar et on initialise le produit. Sinon, le produit est
     lancé grâce à l'appel du back.*/
    function calcScore(): void {
        if (timeleft !==0) {
            product.timeleft -= (Date.now() - lastupdate)
            setLastUpdate(Date.now())
        }
        if (timeleft < 0) {
            setLastUpdate(Date.now())
            if(product.managerUnlocked){
                setLancer(true)
                product.timeleft = product.vitesse
            } else {
                production({variables : {id: product.id}})
                product.timeleft = 0
                setLancer(false)
            }
        }
        onProductionDone(product)
    }

   return (
    <div style={{backgroundColor:'azure', borderWidth:10, borderBlockColor:'black'}}>
        <img className='imageProduit' src={"http://localhost:4000/" + product.logo} onClick = {produireProduit}/>
        <div> Quantité actuelle: {product.quantite} </div>
        <div> Coût du produit: {product.cout} </div>
        <div> Produit: {product.name}</div>{
            product.quantite > 0 &&
        <MyProgressbar className="barstyle" vitesse={product.vitesse}
        initialvalue={product.vitesse - product.timeleft}
        run={lancer} frontcolor="#63c5da" backcolor="#ffffff"
        auto={product.managerUnlocked}
        orientation={Orientation.horizontal} />
        }
        <button disabled={produitDisponible()} onClick={acheterProduit}> Acheter </button>
    </div>
   )
}
   