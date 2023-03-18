import React, { useEffect, useState } from 'react';
import './Main.css';
import { Palier, Product, World } from './world';
import { transform } from './utils';
import ProductComponent from './Product';
import { gql, useMutation } from '@apollo/client';
import ManagerComponent from './Manager';

type MainProps = {
  loadworld: World
  username: string
}
  export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
    useEffect(() => {
      setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
     }, [loadworld])

    /* On crée des hooks d'état, un pour l'argent du monde que l'on va mettre à jour,
    un pour modifier l'état d'affichage des pages de notre jeu*/
    const [money, setMoney] = useState(world.money)
    const [showManager, setShowManager] = useState(false)
    const [showUnlock, setShowUnlock] = useState(false)

    // On fait un appel au backend pour acheter la quantité de produit adapté
    const acheterQtProduit = gql`
    mutation AcheterQtProduit($acheterQtProduitId: Int!, $quantite: Int!) {
      acheterQtProduit(id: $acheterQtProduitId, quantite: $quantite){
        id
      }
    }`

    //On met les conditions nécessaires et une exception pour appeler la mutation  
    const [achatProduit] = useMutation(acheterQtProduit,{
        context: {
            headers:{
                "x-user": username
            }
        },
        onError: (error): void => {
                "Le produit ne peut pas être acheté"
            }
        }
    )
    
    // On fait un appel au backend pour engager un manager
    const engagerManager = gql`
    mutation EngagerManager($engagerManagerName: String!) {
      engagerManager(name: $engagerManagerName) {
        name
      }
    }`

    //On met les conditions nécessaires et une exception pour appeler la mutation  
    const [engage] = useMutation(engagerManager,{
        context: {
            headers:{
                "x-user": username
            }
        },
        onError: (error): void => {
                "Le manager ne peut pas être engagé"
            }
        }
    )
    
    // Quand la production est terminée, on regarde les gains du produit et on calcule le score obtenu
    function onProductionDone(p: Product): void {
      let gain = p.revenu * p.quantite
      addToScore(gain)
    }

    // Fonction du calcul du score
    function addToScore(gain:number){
      world.money += gain
    }
    
    // Quand le produit est acheté, on met à jour le prix du prochain produit
    function onProductBuy(qt: number, p: Product){
      let prix = p.cout
      let nouveauPrix = p.cout
      for(let i=0; i<qt; i++){
        prix *= p.croissance
        nouveauPrix += prix
      }
      p.quantite += qt
      p.cout *= Math.pow(p.croissance, qt)
      world.money -= nouveauPrix
      setMoney(money - nouveauPrix)

      achatProduit({ variables: {acheterQtProduitId: p.id, quantite: qt}})
      
      world.products.forEach(product => {
        product.paliers.forEach(palier => {
          if(!palier.unlocked && palier.seuil <= p.quantite){
            palier.unlocked = true
            if(palier.typeratio = "vitesse"){
              p.vitesse /= palier.ratio
            } else {
              p.revenu = p.vitesse/palier.ratio
            }
          }
        })
      }
      )
    }
    // On passe la valeur de showManager pour que le menu de manager s'affiche
    function seeManagers(){
      setShowManager(!showManager)
    }

    function seeUnlock(){
      setShowUnlock(!showUnlock)
    }

    // On peut engager un manager quand on possède assez d'argent
    function hiringManager(manager: Palier){
      world.money -= manager.seuil
      setMoney(money - manager.seuil)

      manager.unlocked = true
      world.products[manager.idcible].managerUnlocked = true

      engage({ variables: {name: manager.name}})
    }
  
    return (
        <><div className="header">
          <div className='logos'>
            <img className='imageBandeau' src={"http://localhost:4000/icones/Bandeau.png"} /> 
            <img className='imageLogo' src={"http://localhost:4000/icones/pokemon.png"} /> 
          </div>
        <div>
            <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
        </div>
        <div>
          <div>multiplicateur</div>
          <img className='imageMulti' src={"http://localhost:4000/icones/Multiplicateur.png"} />
        </div>
        <div>
          <div>
            Les managers:
            <button onClick={() => setShowManager(!showManager)}>{showManager ? 'Cacher les managers' : 'Afficher les managers'}</button>{
              showManager && <ManagerComponent world={world} showManager = {showManager} hiringManager={hiringManager} seeManagers={seeManagers}/>
            }
            Les Cash Upgrades:
            <button onClick={() => setShowUnlock(!showUnlock)}>{showUnlock ? 'Cacher les Cash Upgrade' : 'Afficher Cash Upgrade'}</button>{
              showUnlock
            }
            </div>
          </div>
        <div></div>
        <div></div>
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[0]} username={username} money = {world.money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[1]} username={username} money = {world.money}/>
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[2]} username={username} money = {world.money} />
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[3]} username={username} money = {world.money}/>
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[4]} username={username} money = {world.money}/>
            <ProductComponent onProductionDone={onProductionDone} onProductBuy={onProductBuy} product={world.products[5]} username={username} money = {world.money}/>
        </div>
      </>  
  )
}