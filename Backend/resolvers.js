var fs = require('fs');
const world = require('./world');
const { products } = require('./world');

function saveWorld(context) {
    fs.writeFile("userworlds/" + context.user + "-world.json",
        JSON.stringify(context.world), err => {
            if (err) {
                console.error(err)
                throw new Error(
                    `Erreur d'écriture du monde coté serveur`)
            }
        })
};

function calcScore(context) {
    for (var p in context.world.products) {
        if (p.timeleft != 0) {
            if (context.world.lastupdate - p.timeleft < 0) {
                context.world.score += p.cout
            } else {

            }
        }
    }
};


module.exports = {
    Query: {
        getWorld(parent, args, context, info) {
            calcScore()
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, args, context) {
            let produit = context.world.products.find(p => p.id == args.id)
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                tempsEcoule = context.world.lastupdate - Date.now()
                if (tempsEcoule >= produit.timeleft) {
                    calcScore()
                    produit.quantite += args.quantite
                    context.world.money -= produit.cout
                    produit.cout = produit.cout * produit.croissance
                    context.world.lastupdate = Date.now()
                }
            }
            return produit
        },

        lancerProductionProduit(parent, args, context) {
            let produit = context.world.products.find(p => p.id == args.id)
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.vitesse = produit.timeleft
                context.world.lastupdate = Date.now()
            }
            return produit
        },

        engagerManager(parent, args, context) {
            let manager = context.world.managers.find(m => m.name == args.name)
            if (manager == undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                let produitManager = context.world.products.find(p => p.id == manager.idcible)
                manager.unlocked = !manager.unlocked
                produitManager.managerUnlocked = !produitManager.managerUnlocked
            }
            return manager
        }
    }
};