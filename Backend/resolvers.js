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
        let tempsEcoule = Date.now() - context.world.lastupdate + tempsEcoule
        let nombreExecution = 0
        let revenuDuProduit = p.revenu
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
        if (context.world.angelupgrade.unlocked) {
            revenuDuProduit = p.quantite * revenuDuProduit * (1 + context.world.activeangels * context.world.angelbonus / 100)
        }
        context.world.money += nombreExecution * revenuDuProduit
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
            saveWorld(context)
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
            saveWorld(context)
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
            saveWorld(context)
            return manager
        },

        acheterCashUpgrade(parent, args, context) {
            calcScore(context)
            let upgrade = context.world.upgrades.find(u => u.name == args.name)
            if (upgrade == undefined) {
                throw new Error(`L'upgrade avec le nom ${args.name} n'existe pas`)
            } else {
                upgrade.unlocked = !upgrade.unlocked
                context.world.lastupdate = Date.now()
            }
            saveWorld(context)
            return upgrade
        },

        resetWorld(parent, args, context) {
            calcScore(context)
            let angelAdd = 150 * Math.sqrt(context.world.score / Math.pow(10, 15)) - context.world.totalangels
            context.world.activeangels = angelAdd
            context.world.totalangels += angelAdd
            let angesEnActivite = context.world.activeangels
            let angesAuTotal = context.world.totalangels
            let scoreTotal = context.world.score
            context.world = world
            context.world.activeangels = angesEnActivite
            context.world.totalangels = angesAuTotal
            context.world = scoreTotal
            saveWorld(context)
            return context.world
        },

        acheterAngelUpgrade(parent, args, context) {

        }
    }
}