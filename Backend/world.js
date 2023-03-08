module.exports = {
    "name": "Pokemon",
    "logo": "icones/logomonde.png",
    "money": 65,
    "score": 0,
    "totalangels": 0,
    "activeangels": 0,
    "angelbonus": 2,
    "lastupdate": 0,
    "products": [{
            "id": 1,
            "name": "Vipelierre",
            "logo": "icones/vipelierre.png",
            "cout": 1,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [{
                    "name": "Poké Ball",
                    "logo": "icones/pokeball.png",
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
                {
                    "name": "Pierre Plante",
                    "logo": "icones/pierreplante.png",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
                {
                    "name": "Grain Miracle",
                    "logo": "icones/grainmiracle.png",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
            ]
        },
        {
            "id": 2,
            "name": "Grenousse",
            "logo": "icones/grenousse.png",
            "cout": 4,
            "croissance": 1.07,
            "revenu": 1,
            "vitesse": 500,
            "quantite": 1,
            "timeleft": 0,
            "managerUnlocked": false,
            "palliers": [{
                    "name": "Super Ball",
                    "logo": "icones/superball.png",
                    "seuil": 20,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
                {
                    "name": "Pierre Eau",
                    "logo": "icones/pierreeau.png",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
                {
                    "name": "Eau Mystique",
                    "logo": "icones/eaumystique.png",
                    "seuil": 75,
                    "idcible": 1,
                    "ratio": 2,
                    "typeratio": "VITESSE",
                    "unlocked": false
                },
            ]
        },
    ],
    "allunlocks": [{
        "name": "Fouet Liane",
        "logo": "icones/fouetliane.png",
        "seuil": 30,
        "idcible": 1,
        "ratio": 2,
        "typeratio": "GAIN",
        "unlocked": false
    }, ],
    "upgrades": [{
            "name": "Pierre Feu",
            "logo": "icones/pierrefeu.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "GAIN",
            "unlocked": false
        },
        {
            "name": "Pierre Eau",
            "logo": "icones/pierreeau.png",
            "seuil": 1e3,
            "idcible": 1,
            "ratio": 3,
            "typeratio": "GAIN",
            "unlocked": false
        },
    ],
    "angelupgrades": [{
        "name": "Mew",
        "logo": "icones/mew.png",
        "seuil": 10,
        "idcible": 0,
        "ratio": 3,
        "typeratio": "GAIN",
        "unlocked": false
    }, ],
    "managers": [{
            "name": "Keteleeria",
            "logo": "icones/keteleeria.png",
            "seuil": 10,
            "idcible": 1,
            "ratio": 0,
            "typeratio": "GAIN",
            "unlocked": false
        },
        {
            "name": "Sacha",
            "logo": "icones/sacha.png",
            "seuil": 10,
            "idcible": 2,
            "ratio": 0,
            "typeratio": "GAIN",
            "unlocked": false
        }
    ]
};