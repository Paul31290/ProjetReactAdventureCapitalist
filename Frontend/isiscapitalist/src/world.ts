
export class World {
    name : string = ""
    logo : string = ""
    money: number = 0
    score: number = 0
    totalangels: number = 0
    activeangels: number = 0
    angelbonus: number = 0
    lastupdate: string = ""
    products : Product[]
    allunlocks: Palier[]
    upgrades: Palier[]
    angelupgrades: Palier[]
    managers: Palier[]
    static manager: any
    static products: any

    constructor() {
        this.products = [ ]
        this.managers = [ ]
        this.upgrades = [ ]
        this.angelupgrades = [ ]
        this.allunlocks = [ ]
    }
}

export class Product {
    id : number = 0
    name : string = ""
    logo : string = ""
    cout : number = 0
    croissance: number = 0
    revenu: number = 0
    vitesse: number = 0
    quantite: number = 0
    timeleft: number = 0
    lastupdate: number = 0
    managerUnlocked: boolean = false
    paliers : Palier[]

    constructor() {
        this.paliers = []
    }
}

export class Palier {
    name: string = ""
    logo: string = ""
    seuil: number = 0
    idcible: number = 0
    ratio: number = 0
    typeratio: string = ""
    unlocked: boolean = false
    palier: any
}
