const { gql } = require("apollo-server-express");
module.exports = gql `
 
enum RatioType {
    GAIN
    VITESSE
    ANGE
}
 
type Pallier {
    name: String!
    logo: String
    seuil: Float
    idcible: Int
    ratio: Int
    typeratio: RatioType
    unlocked: Boolean
}

type Product {
    id: Int!
    name: String
    logo: String
    cout: Float
    croissance: Float
    revenu: Float
    vitesse: Int
    quantite: Int
    timeleft: Int
    managerUnlocked: Boolean
    paliers: [Pallier]
}

type World {
    name: String!
    logo: String
    money: Float
    score: Float
    totalangels: Int
    activeangels: Int
    angelbonus: Int
    lastupdate: String
    products: [Product]
    allunlocks: [Pallier]
    upgrades: [Pallier]
    angelupgrades: [Pallier]
    managers: [Pallier]
}

type Query {
    getWorld: World
}

type Mutation {
    acheterQtProduit(id: Int!, quantite: Int!): Product
    lancerProductionProduit(id: Int!): Product
    engagerManager(name: String!): Pallier
    acheterCashUpgrade(name: String!): Pallier 
    acheterAngelUpgrade(name: String!): Pallier
    resetWorld: World
}

 `;