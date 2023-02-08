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
        acheterQtProduit(args) {
            for (var n in products) {
                if (n.id != world.products.includes(id)) {
                    throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
                } else {
                    args.quantite += args.quantite
                    world.money -= args.cout
                    args.cout = args.cout * args.croissance
                    saveWorld(context)
                }
            }
            return args
        },

        lancerProductionProduit(args) {
            if (args.id != world.products.includes(id)) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                args.vitesse = args.timeleft
            }
            return args
        },

        engagerManager(args) {
            if (args.name != world.managers.includes(name)) {
                throw new Error(`Le manager avec l'id ${args.name} n'existe pas`)
            }

        }
    }
};