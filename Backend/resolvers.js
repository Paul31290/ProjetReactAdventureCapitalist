var fs = require('fs');
let world = require('./world');
const { products } = require('./world');

// Cette fonction sauvegarde le monde avec le username
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

/* Cette fonction calcule le score gagné entre chaque action du joueur.
   Elle sera appelée dans toutes les mutations pour mettre à jour son
   score*/
function calcScore(context) {
    let nbProd = 0
    world.products.forEach(p => {
        let tpsEcoule = Date.now() - parseInt(world.lastupdate)
            // Premier cas si un manager est débloqué pour ce produit
        if (p.managerUnlocked) {
            tpsEcoule -= p.timeleft
            if (tpsEcoule < 0) {
                p.timeleft -= tpsEcoule
            } else {
                nbProd = Math.floor(tpsEcoule / produit.vitesse)
                p.timeleft = tpsEcoule % p.vitesse
                world.money += p.quantite * revenuDuProduit * (1 + context.world.activeangels * context.world.angelbonus / 100)
                world.score = world.money
            }
            // Deuxième cas si un manager n'est pas débloqué
        } else {
            if (p.timeleft != 0) {
                if (p.timeleft <= tpsEcoule) {
                    world.money += p.revenu * p.quantite;
                    world.score = world.money
                    p.timeleft = 0;
                } else {
                    p.timeleft -= tpsEcoule;
                }
            }
        }
    });
}

// Cette fonction permettra de débloquer les paliers de chaque produits quand la quantité d'objet requise sera atteinte
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
        // On retourne le monde en cours
        getWorld(parent, args, context, info) {
            calcScore(context)
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        // On achète la quantite de produit demandée
        acheterQtProduit(parent, args, context) {
            calcScore(context)
            let produit = world.products.find(p => p.id == args.id)
                // Si le produit n'existe pas, on retourne une erreur
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.quantite += args.quantite
                    // On calcule le coût du produit en fonction de sa quantité et de sa croissance, et on l'enlève à l'argent du monde
                var coutProduit = ((1 - Math.pow(produit.croissance, args.quantite)) / (1 - produit.croissance))
                world.money -= coutProduit
                    // On calcule le nouveau coût du produit, ainsi que son nouveau revenu
                produit.cout *= Math.pow(produit.croissance, args.quantite)
                produit.revenu *= (produit.croissance * args.quantite)
            }
            debloquer(context)
            saveWorld(context)
            return produit
        },
        // On lance la production d'un produit
        lancerProductionProduit(parent, args, context) {
            calcScore(context)
            let produit = world.products.find(p => p.id == args.id)
                // Si le produit n'existe pas, on retourne une erreur
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                // On initialise le produit en mettant sa vitesse à la même valeur que son temps restant
                produit.timeleft = produit.vitesse
            }
            saveWorld(context)
            return produit
        },
        // On engage un manager en connaissant son nom
        engagerManager(parent, args, context) {
            calcScore(context)
            let manager = world.managers.find(m => m.name == args.name)
                // Si le manager n'existe pas, on retourne une erreur
            if (manager == undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                // On recheche le produit qui correspond au manager et on active les débloquages 
                let produitManager = context.world.products.find(p => p.id == manager.idcible)
                manager.unlocked = !manager.unlocked
                produitManager.managerUnlocked = !produitManager.managerUnlocked
                    // On enlève l'argent nécessaire au déblocage
                world.money -= manager.seuil
            }
            saveWorld(context)
            return manager
        },
        // On achète un cash upgrade en connaissant son nom
        acheterCashUpgrade(parent, args, context) {
            calcScore(context)
            let upgrade = world.upgrades.find(u => u.name == args.name)
                // Si le cash upgrade n'existe pas, on retourne une erreur
            if (upgrade == undefined) {
                throw new Error(`L'upgrade avec le nom ${args.name} n'existe pas`)
            } else {
                // On débloque l'upgrade 
                upgrade.unlocked = !upgrade.unlocked
                    // On enlève l'argent nécessaire au déblocage
                world.money -= upgrade.seuil
            }
            saveWorld(context)
            return upgrade
        },
        // On recommence un nouveau monde
        resetWorld(parent, args, context) {
            calcScore(context)
                // On calcule les anges nécessaires pour le nouveau monde
            let angelAdd = 150 * Math.sqrt(context.world.score / Math.pow(10, 15)) - context.world.totalangels
            world.activeangels = angelAdd
            world.totalangels += angelAdd
                // On met dans des variables les paramètres dont on a besoin pour le nouveau monde
            let angesEnActivite = world.activeangels
            let angesAuTotal = world.totalangels
            let scoreTotal = world.score
                // On met en place un nouveau monde qui va pouvoir être lancé
            context.worldNouv = world
            context.worldNouv.activeangels = angesEnActivite
            context.worldNouv.totalangels = angesAuTotal
            context.worldNouv.score = scoreTotal
            saveWorld(context)
            return context.worldNouv
        },
        // On achète un angel upgrade
        acheterAngelUpgrade(parent, args, context) {
            calcScore(context)
            let angelUpgrade = world.angelUpgrades.find(u => u.name == args.name)
                // Si le cash upgrade n'existe pas, on retourne une erreur
            if (angelUpgrade == undefined) {
                throw new Error(`L'angel upgrade avec le nom ${args.name} n'existe pas`)
            } else {
                // On débloque l'upgrade
                angelUpgrade.unlocked = !angelUpgrade.unlocked
                    // On enlève l'argent nécessaire au déblocage
                angelUpgrade.money -= angelUpgrade.seuil
            }
            saveWorld(context)
            return upgrade
        }
    }
}