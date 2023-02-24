class Serpent {
    #id;
    #popularName;
    #cientificName;
    #familyType;
    #isActive;

    constructor(popularName, cientificName, familyType, serpentsArrayLength) {
        this.#id = ++serpentsArrayLength;
        this.#popularName = popularName;
        this.#cientificName = cientificName;
        this.#familyType = familyType;
        this.#isActive = true;
    }

    getId = () => this.#id;

    getPopularName = () => this.#popularName;
    setPopularName = (value) => this.#popularName = value;

    getCientificName = () => this.#cientificName;
    setCientificName = (value) => this.#cientificName = value;

    getFamilyType = () => this.#familyType;
    setFamilyType = (value) => this.#familyType = value;

    getIsActive = () => this.#isActive;
    deleteSerpent = () => this.#isActive = false;
}

class Serpentario {
    #serpentsArray;

    constructor() {
        this.#serpentsArray = [];
    }

    #findSerpent(id, onlyActives = false) {
        let idxToReturn = false;

        this.#serpentsArray.forEach((serpent, idx) => {
            if (serpent.getId() == id) {
                if (onlyActives === true) {
                    idxToReturn = serpent.getIsActive() === true ? idx : false;
                    return;
                }
                
                idxToReturn = idx;
                return;
            }
        });

        return idxToReturn;
    }

    getAllSerpents(onlyActives = false) {
        if (onlyActives === true) {
            let activeSerpents = [];

            this.#serpentsArray.forEach((serpent) => {
                if (serpent.getIsActive() === true)
                    activeSerpents.push(serpent);
            });

            return activeSerpents;
        }

        return this.#serpentsArray;
    }

    getSerpent(id = -1) {
        const idxToReturn = id == -1 ? id : this.#findSerpent(id);
        return this.#serpentsArray.at(idxToReturn);
    }

    setNewSerpent(serpent) {
        this.#serpentsArray.push(serpent);

        let serpId = "serp_" + serpent.getId();
        let serpData = JSON.stringify(serpent);
        let isSerpentAlreadySetted = window.sessionStorage.getItem(serpId);

        if (isSerpentAlreadySetted === false)
            throw "Serpent is already setted on sessionStorage()";
        
        window.sessionStorage.setItem(serpId, serpData);
    }
    
    deleteSerpent(id = -1) {
        const indexToDelete = id == -1 ? id : this.#findSerpent(id, true);

        if (indexToDelete === false)
            throw "Serpent doesn't exist or had been already deleted.";
        
        this.#serpentsArray.at(indexToDelete).deleteSerpent();

        let serpId = "serp_" + this.#serpentsArray.at(indexToDelete).getId();
        let serpData = JSON.stringify(false);
        window.sessionStorage.setItem(serpId, serpData);
    }
}

function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
      enumObject[val] = val;
    }
    return Object.freeze(enumObject);
}
const Family = createEnum(['Boidae','Viperidae','Elapidae','Colubridae','Dipsadidae','Pythonidae']);

