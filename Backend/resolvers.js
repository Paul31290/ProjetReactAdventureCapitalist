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
        tempsEcoule = Date.now().toString - parseInt(context.world.lastupdate)
        tempsEcouleInt = tempsEcoule -= p.timeleft
        if (tempsEcoule < 0) {
            p.timeleft = -tempsEcoule
        } else [
            p.timeleft = Math.floor((tempsEcoule) / p.vitesse)
        ]
        if (p.managerUnlocked == false) {
            if (p.timeleft != 0) {
                if (p.timeleft < tempsEcoule) {
                    context.world.score += p.cout
                } else {
                    p.timeleft = p.timeleft - tempsEcouleInt
                }
            } else {
                if (p.timeleft < tempsEcoule) {
                    context.world.score += p.cout
                } else {
                    p.timeleft = Math.floor((tempsEcoule) / p.vitesse)
                }
            }
        }
    }
};


module.exports = {
    Query: {
        getWorld(parent, args, context, info) {
            calcScore(context)
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
                calcScore(context)
                produit.quantite += args.quantite
                context.world.money -= produit.cout
                produit.cout = produit.cout * produit.croissance
                context.world.lastupdate = Date.now().toString
            }
            return produit
        },

        lancerProductionProduit(parent, args, context) {
            let produit = context.world.products.find(p => p.id == args.id)
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                calcScore(context)
                produit.vitesse = produit.timeleft
                context.world.lastupdate = Date.now().toString
            }
            return produit
        },

        engagerManager(parent, args, context) {
            let manager = context.world.managers.find(m => m.name == args.name)
            if (manager == undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                calcScore(context)
                let produitManager = context.world.products.find(p => p.id == manager.idcible)
                manager.unlocked = !manager.unlocked
                produitManager.managerUnlocked = !produitManager.managerUnlocked
                context.world.lastupdate = Date.now().toString
            }
            return manager
        }

    }
};