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
            if (args.id != world.products.includes(id)) {
                throw new Error(`Le produit avec l'id ${args.id} n'existe pas`)
            } else {
                world.products.quantite += args.quantite;
                world.money
            }
        }
    }
};