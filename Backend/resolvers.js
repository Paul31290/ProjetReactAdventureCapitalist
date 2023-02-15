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
}


module.exports = {
    Query: {
        getWorld(parent, args, context, info) {
            saveWorld(context)
            return context.world
        }
    },
    Mutation: {
        acheterQtProduit(parent, context, args) {
            let produit = context.world.products.find(p => p.id = args.id)
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                args.quantite += args.quantite
                context.world.money -= args.cout
                args.cout = args.cout * args.croissance
                saveWorld(context)
            }
            return produit
        },

        lancerProductionProduit(parent, context, args) {
            let produit = context.world.products.find(p => p.id = args.id)
            if (produit == undefined) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                produit.vitesse = produit.timeleft
            }
            return produit
        },

        engagerManager(parent, context, args) {
            let manager = context.world.manager.find(m => m.name = args.name)
            if (manager == undefined) {
                throw new Error(`Le manager avec le nom ${args.name} n'existe pas`)
            } else {
                let produit = context.world.products.find(p => p.id = args.id)
                produit.managerUnlocked != produit.managerUnlocked;
                manager.unlocked != manager.unlocked
            }
            return manager
        }
    }
};