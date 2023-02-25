class Utils {
    static getIdWithZero(id) {
        let idWithZero = '0' + id;
        return idWithZero.slice(-2);
    }

    static getSerpentAfterJson(id, alreadyCorrectId = false) {
        let correctId = alreadyCorrectId === true ? id : "serp_" + this.getIdWithZero(id);
        let strToJson = window.sessionStorage.getItem(correctId);
        return JSON.parse(strToJson);
    }

    static createNewSerpent(newSerpentObj) {
        let success = false;

        try {
            let serpId = "serp_" + this.getIdWithZero(newSerpentObj.id);
            window.sessionStorage.setItem(serpId, JSON.stringify(newSerpentObj));
            success = true;
        } catch (e) {
            console.log(e);
        }

        return success;
    }

    static updateSerpent(serpentObj) {
        let success = false;

        try {
            let serpId = "serp_" + this.getIdWithZero(serpentObj.id);
            window.sessionStorage.setItem(serpId, JSON.stringify(serpentObj));
            success = true;
        } catch (e) {
            console.log(e);
        }

        return success;
    }

    static getObjectKeysAsArray = (obj) => Object.keys(obj);

    static reloadPage = (pageUrl) => window.location = pageUrl;
    static getActualUrl = () => new URL(location.href);
    static getFileName = (actualUrl) => actualUrl.pathname.split(`/`).at(-1);
    static getPageUrl = (actualUrl, pageName) => actualUrl.pathname.substring(0, actualUrl.pathname.lastIndexOf(`/`) + 1) + pageName;
    static getHomePageUrl = (actualUrl) => this.getPageUrl(actualUrl, "index.html");
    static backToHomePage = () => window.location = this.getHomePageUrl(this.getActualUrl());
}

class FormValues {
    #data;
    #newObj;

    constructor(form) {
        this.#data = new FormData(form);
        this.#newObj = new Object();
    }
    
    #processValues(mustCreateNewId) {
        for (let [name, val] of this.#data) {
            if (name == "id" && mustCreateNewId === true) {
                let arrKeys = Utils.getObjectKeysAsArray(window.sessionStorage).sort();
                let lastKey = arrKeys.at(-1);
                let keyAsNumber = +lastKey.split("serp_")[1];
                val = ++keyAsNumber;
            }
            this.#newObj[name] = val;
        }
    }

    getValues(mustCreateNewId = false) {
        if (Utils.getObjectKeysAsArray(this.#newObj).length == 0)
            this.#processValues(mustCreateNewId);
        return this.#newObj;
    }
}

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

    getSerpentAsAnObjectToJson() {
        let obj = {};

        obj.id = this.#id;
        obj.popularName = this.#popularName;
        obj.cientificName = this.#cientificName;
        obj.familyType = this.#familyType;
        obj.isActive = this.#isActive;

        return obj;
    }
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
        
        let serpId = "serp_" + Utils.getIdWithZero(serpent.getId());
        let serpData = JSON.stringify(serpent.getSerpentAsAnObjectToJson());
        let isSerpentAlreadySetted = window.sessionStorage.getItem(serpId);

        if (isSerpentAlreadySetted !== false && isSerpentAlreadySetted !== null)
            throw "Serpent is already setted on sessionStorage()";
        
        window.sessionStorage.setItem(serpId, serpData);
    }
    
    deleteSerpent(id = -1) {
        const indexToDelete = id == -1 ? id : this.#findSerpent(id, true);

        if (indexToDelete === false)
            throw "Serpent doesn't exist or had been already deleted.";
        
        this.#serpentsArray.at(indexToDelete).deleteSerpent();
        
        let serpId = "serp_" + Utils.getIdWithZero(this.#serpentsArray.at(indexToDelete).getId());
        let serpData = JSON.stringify(false);
        window.sessionStorage.setItem(serpId, serpData);
    }
}

function createEnum(values) {
    const enumObject = {};
    for (const val of values) {
        let name = val;
        if (val.search(`.`) > -1) {
            let correctName = val.split(`.`)[0];
            name = correctName[0].charAt(0).toUpperCase() + correctName.slice(1).toLowerCase();
        }
        
        enumObject[name] = val;
    }
    return Object.freeze(enumObject);
}
const Family = createEnum(['Boidae','Viperidae','Elapidae','Colubridae','Dipsadidae','Pythonidae']);