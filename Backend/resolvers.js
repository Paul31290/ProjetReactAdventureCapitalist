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
        }
    )
};

function calcScore(context) {
    for (var p in context.world.products) {
        var tempsEcoule = Date.now() - context.world.lastupdate + tempsEcoule
        var nombreExecution = 0
        if (p.managerUnlocked) {
            var production = tempsEcoule % p.vitesse
            nombreExecution = (tempsEcoule - production) / p.vitesse
            tempsEcoule = production
        } else if (p.timeleft > 0) {
            if (p.timeleft > tempsEcoule) {
                p.timeleft -= tempsEcoule
            } else {
                p.timeleft = 0
                nombreExecution = 1
            }
        }
    }
};

function debloquer(context) {
    for (var p in context.world.products) {
        if (p.quantite >= 20) {
            pallier[0].unlocked = true
        }
        if (p.quantite >= 50) {
            pallier[1].unlocked = true
        }
        if (p.quantite >= 75) {
            pallier[2].unlocked = true
        }
    }
};


module.exports = {
        Query: {
            getWorld(parent, args, context, info) {
                saveWorld(context)
                return context.world
            }
        },
        Mutation: {
            acheterQtProduit(parent, args, context) {
                calcScore(context)
                let produit = context.world.products.find(p => p.id == args.id)
                if (produit == undefined) {
                    throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
                } else {
                    produit.quantite += args.quantite
                    context.world.money -= produit.cout
                    produit.cout = produit.cout * produit.croissance
                    context.world.lastupdate = Date.now()
                }
                return produit
            },

            lancerProductionProduit(parent, args, context) {
                calcScore(context)
                let produit = context.world.products.find(p => p.id == args.id)
                if (produit == undefined) {
                    throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
                } else {
                    produit.timeleft = produit.vitesse
                    context.world.lastupdate = Date.now()
                }
                return produit
            },

            engagerManager(parent, args, context) {
                calcScore(context)
                let manager = context.world.managers.find(m => m.name == args.name)
                if (manager == undefined) {
                    throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
                } else {
                    let produitManager = context.world.products.find(p => p.id == manager.idcible)
                    manager.unlocked = !manager.unlocked
                    produitManager.managerUnlocked = !produitManager.managerUnlocked
                    context.world.lastupdate = Date.now()
                }
                return manager
            },

            acheterCashUpgrade(parent, args, context) {
                calcScore(context)
            }
        };