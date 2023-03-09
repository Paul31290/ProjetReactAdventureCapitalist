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
    context.world.products.forEach(function(p) {
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
        context.world.money += nombreExecution * p.revenu
        context.world.score += context.world.money
    });
}

function debloquer(context) {
    context.world.products.forEach(function(p) {
        if (p.quantite >= p.paliers[0].seuil) {
            p.paliers[0].unlocked = !p.paliers[0].unlocked
        }
        if (p.quantite >= p.paliers[1].seuil) {
            p.paliers[1].unlocked = !p.paliers[1].unlocked
        }
        if (p.quantite >= p.paliers[2].seuil) {
            p.paliers[2].unlocked = !p.paliers[2].unlocked
        }
    });
}


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
                var coutProduit = ((1 - Math.pow(produit.croissance, args.quantite)) / (1 - produit.croissance))
                context.world.money -= coutProduit
                produit.cout *= Math.pow(produit.croissance, args.quantite)
                produit.revenu *= (produit.croissance * args.quantite)
                context.world.lastupdate = Date.now()
            }
            debloquer(context)
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
            context.world.products.forEach(function(p) {
                if (p.quantite >= context.world.upgrade[0].seuil) {
                    context.world.upgrade[0].unlocked = !context.world.upgrade[0].unlocked
                }
                if (p.quantite >= context.world.upgrade[1].seuil) {
                    context.world.upgrade[1].unlocked = !context.world.upgrade[1].unlocked
                }
            });
        },

        resetWorld(context) {

        }
    }
}