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

    const [money, setMoney] = useState(world.money)
    const [showManager, setShowManager] = useState(false)

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

    function onProductionDone(p: Product): void {
      let gain = p.revenu * p.quantite
      addToScore(gain)
    }

    function addToScore(gain:number){
      world.money += gain
    }
    

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

    function seeManagers(){
      setShowManager(!showManager)
    }

    function hiringManager(manager: Palier){
      world.money -= manager.seuil
      setMoney(money - manager.seuil)

      manager.unlocked = true
      world.products[manager.idcible].managerUnlocked = true

      engage({ variables: {name: manager.name}})
    }
  
    return (
        <><div className="header">
          <div>
            <img className='imageLogo' src={"http://localhost:4000/" + world.logo} /> 
            <span> {world.name} </span>
          </div>
          <div>
            <img className='imageBandeau' src={"http://localhost:4000/icones/Bandeau.png"} /> 
          </div>
        <div>
            <span dangerouslySetInnerHTML={{ __html: transform(world.money) }} />
        </div>
        <div>
          <div>multiplicateur</div>
          <img className='imageMulti' src={"http://localhost:4000/icones/Multiplicateur.png"} />
        </div>
        <div className="main" />
          <div>liste des boutons de menu</div>
            <button onClick={() => setShowManager(!showManager)}>{showManager ? 'Cacher les managers' : 'Afficher les managers'}</button>{
              showManager && <ManagerComponent world={world} showManager = {showManager} hiringManager={hiringManager} seeManagers={seeManagers}/>
            }

          <div className="product" />
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