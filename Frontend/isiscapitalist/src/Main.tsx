import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { World } from './world';

type MainProps = {
  loadworld: World
  username: string
}
  export default function Main({ loadworld, username } : MainProps) {
    const [world, setWorld] = useState(JSON.parse(JSON.stringify(loadworld)) as World)
    useEffect(() => {
      setWorld(JSON.parse(JSON.stringify(loadworld)) as World)
     }, [loadworld])
    return (
        <div className="header">
          <div>logo monde</div>
          <div>argent</div>
          <div>multiplicateur</div>
        <div className="main" />
          <div>liste des boutons de menu</div>
        <div className="product"/>
          <div>premier produit</div>
          <div>second produit</div>
          <div>troisième produit</div>
          <div>quatrième produit</div>
          <div>cinquième produit</div>
          <div>sixième produit</div>
        </div>
    );
}