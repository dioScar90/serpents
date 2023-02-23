class Serpent {
    #id;
    #popularName;
    #cientificName;
    #familyType;

    constructor(popularName, cientificName, familyType, serpentsArrayLength) {
        this.#id = ++serpentsArrayLength;
        this.#popularName = popularName;
        this.#cientificName = cientificName;
        this.#familyType = familyType;
    }

    getId = () => this.#id;

    getPopularName = () => this.#popularName;
    setPopularName = (value) => this.#popularName = value;

    getCientificName = () => this.#cientificName;
    setCientificName = (value) => this.#cientificName = value;

    getFamilyType = () => this.#familyType;
    setFamilyType = (value) => this.#familyType = value;
}

class Serpentario {
    #serpentsArray;

    constructor() {
        this.#serpentsArray = [];
    }

    getSerpentsArray = () => this.#serpentsArray;
    setNewSerpent = (value) => this.#serpentsArray.push(value);
}

function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
}
const Family = createEnum(['Boidae','Viperidae','Elapidae','Colubridae','Dipsadidae','Pythonidae']);

