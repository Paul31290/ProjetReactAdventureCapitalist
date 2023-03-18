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
   export default function ProduitComponent({ product, onProductionDone, onProductBuy, username, money
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
    const [pion] = useMutation(lancerProductionProduit,{
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
        if(product.timeleft == 0 && product.quantite > 0){
            product.timeleft = product.vitesse
            setLancer(true)
            setLastUpdate(Date.now())
        }
    }
        
    /* On fait une fonction d'achat de produit. Si la quantité maximale d'un produit 
    est supérieur à un seuil, alors on n'achète pas la produit*/
    function produitDisponible(): boolean{
        let quantiteMaximum = maximumQtProduit()
        if(product.cout > quantiteMaximum){
            return true
        } else {
            return false
        }
    }
    /*On fait une fonction pour calculer la quantité de produit maximum que l'on peut
     acheter en fonction de l'argent de notre monde*/
    function maximumQtProduit(): number{
        let prix = product.cout
        let nouveauPrix = product.cout
        let maxQtProduit = 0
        
        while(money > nouveauPrix){
            prix *= product.croissance
            nouveauPrix += prix
            maxQtProduit++
        }
        return maxQtProduit
    }

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
                pion({variables : {id: product.id}});
                product.timeleft = 0
                setLancer(false)
            }
        }
        onProductionDone(product)
    }

   return (
    <div style={{backgroundColor:'azure', borderWidth:10, borderBlockColor:'black'}}>
        <img className='imageProduit' src={"http://localhost:4000/" + product.logo} onClick = {produireProduit}/>
        <div> {product.name} </div>
        <div> {product.quantite}</div>{
            product.quantite > 0 &&
        <MyProgressbar className="barstyle" vitesse={product.vitesse}
        initialvalue={product.vitesse - product.timeleft}
        run={lancer} frontcolor="#ff8800" backcolor="#ffffff"
        auto={product.managerUnlocked}
        orientation={Orientation.horizontal} />
        }
        <button disabled={produitDisponible()} onClick={acheterProduit} id={"acheterLeProduit" + product.id.toString()}> Acheter </button>
    </div>
   )
}
   