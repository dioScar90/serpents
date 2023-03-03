var firstTimeOnThePlane = false;

class Utils {
    static createEnum(values) {
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
    
    static #compareValues(a, b, asc) {
        // return -1/0/1 based on what you "know" a and b
        // are here. Numbers, text, some custom case-insensitive
        // and natural number ordering, etc. That's up to you.
        // A typical "do whatever JS would do" is:
        if (!isNaN(a))
            a = +a;

        if (!isNaN(b))
            b = +b;
    
        if (asc === true)
            return (a < b) ? -1 : (a > b) ? 1 : 0;
        return (a > b) ? -1 : (a < b) ? 1 : 0;
    }

    static #cleanAllThAttributes(allTh, cellIndex, cellIndexException = -1) {
        // const allThClone = allTh.nodeClone(true);
        
        try {
            for (let i = 0; i < allTh.length; i++) {
                if (i != cellIndexException) {
                    const iFontAwesome = allTh[i].querySelector("i");

                    if (iFontAwesome !== null)
                        iFontAwesome.remove();

                    if (i != cellIndex)
                        allTh[i].removeAttribute("data-order-by");
                }
            }
            return true;
        } catch (e) {
            console.log(e);
        }

        // allTh.firstElementParent.innerHTML = '';
        // allTh.firstElementParent.append(allThClone);
        // return false;
    }

    /**
     * This method I copied by this Stack Overflow's answer: https://stackoverflow.com/a/55462779
     * I just added the 'asc' parameter and the second return at #compareValues();
     */
    static sortTableByColumn(thElement) {
        const theadElement = thElement.closest("thead");
        const allTh = theadElement.querySelectorAll("tr > th");
        let cellIndex = thElement.cellIndex;
        let colNum = cellIndex + 1;
        let asc = allTh[cellIndex].toggleAttribute("data-order-by");

        let allThCleaned = this.#cleanAllThAttributes(allTh, cellIndex, 1);
        if (allThCleaned !== true)
            return;
        
        const tableTbody = theadElement.nextElementSibling;
        // const thToConcatFontAwesome = theadElement.querySelectorAll("tr > th");
        
        // get all the rows in this table:
        let rows = [...tableTbody.querySelectorAll("tr")];
        
        // set up the queryselector for getting the indicated
        // column from a row, so we can compare using its value:
        let qs = `td:nth-child(${colNum})`;
        
        // and then just... sort the rows:
        rows.sort( (r1, r2) => {
            // get each row's relevant column
            let t1 = r1.querySelector(qs);
            let t1TextContent = t1.textContent.trim().toLowerCase();
            let t2 = r2.querySelector(qs);
            let t2TextContent = t2.textContent.trim().toLowerCase();
        
            // and then effect sorting by comparing their content:
            return this.#compareValues(t1TextContent, t2TextContent, asc);
        });
        
        // and then the magic part that makes the sorting appear on-page:
        rows.forEach(row => tableTbody.append(row));
        
        let iContent = asc === true ? `<i class="fa-solid fa-arrow-up-short-wide"></i>` : `<i class="fa-solid fa-arrow-down-short-wide"></i>`;
        allTh[cellIndex].innerHTML += iContent;
    }
    
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

    static deleteSerpent(id) {
        let success = false;

        try {
            let serpId = "serp_" + this.getIdWithZero(id);
            let serpentToDelete = this.getSerpentAfterJson(serpId, true);
            serpentToDelete.isActive = false;
            window.sessionStorage.setItem(serpId, JSON.stringify(serpentToDelete));
            success = true;
        } catch (e) {
            console.log(e);
        }

        return success;
    }

    static deleteAllSerpents() {
        let allSerpentDeleted = false;

        try {
            let sessionKeys = this.getObjectKeysAsArray(window.sessionStorage);
            for (let i = 0; i < sessionKeys.length; i++) {
                let serpent = Utils.getSerpentAfterJson(sessionKeys[i], true);
                
                if (serpent.isActive === true) {
                    serpent.isActive = false;
                    window.sessionStorage.setItem(sessionKeys[i], JSON.stringify(serpent));
                }
            }
            allSerpentDeleted = true;
        } catch (e) {
            console.log(e);
        }

        return allSerpentDeleted;
    }

    static getObjectKeysAsArray = (obj) => Object.keys(obj);

    static loadPage = (pageUrl) => window.location = pageUrl;
    static getActualUrl = () => new URL(location.href);
    static getFileName = (actualUrl) => actualUrl.pathname.split(`/`).at(-1);
    static getPageUrl = (actualUrl, pageName) => actualUrl.pathname.substring(0, actualUrl.pathname.lastIndexOf(`/`) + 1) + pageName;
    static getHomePageUrl = (actualUrl) => this.getPageUrl(actualUrl, "index.html");
    static backToHomePage = () => window.location = this.getHomePageUrl(this.getActualUrl());
    static goToPage = (pageName) => this.loadPage(this.getPageUrl(this.getActualUrl(), pageName));
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
            this.#newObj[name] = name == "medicalInterest" ? JSON.parse(val) : val;
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
    #medicalInterest;
    #familyType;
    #isActive;

    constructor(popularName, cientificName, medicalInterest, familyType, serpentsArrayLength) {
        this.#id = ++serpentsArrayLength;
        this.#popularName = popularName;
        this.#cientificName = cientificName;
        this.#medicalInterest = medicalInterest;
        this.#familyType = familyType;
        this.#isActive = true;
    }

    get id() { return this.#id; }

    get popularName() { return this.#popularName; }
    set popularName(value) { this.#popularName = value; }

    get cientificName() { return this.#cientificName; }
    set cientificName(value) { this.#cientificName = value; }

    get familyType() { return this.#familyType; }
    set familyType(value) { this.#familyType = value; }

    get medicalInterest() { return this.#medicalInterest; }
    set medicalInterest(condition) { this.#medicalInterest = condition; }

    get isActive() { return this.#isActive; }

    deleteSerpent = () => this.#isActive = false;

    getSerpentAsAnObjectToJson() {
        let obj = {};

        obj.id = this.#id;
        obj.popularName = this.#popularName;
        obj.cientificName = this.#cientificName;
        obj.familyType = this.#familyType;
        obj.medicalInterest = this.#medicalInterest;
        obj.isActive = this.#isActive;

        return obj;
    }
}

class Serpentarium {
    #serpentsArray;

    constructor() {
        this.#serpentsArray = [];
    }

    #findSerpent(id, onlyActives = false) {
        let idxToReturn = false;

        this.#serpentsArray.forEach((serpent, idx) => {
            if (serpent.id == id) {
                if (onlyActives === true) {
                    idxToReturn = serpent.isActive === true ? idx : false;
                    return idxToReturn;
                }
                
                idxToReturn = idx;
                return idxToReturn;
            }
        });

        return idxToReturn;
    }

    getAllSerpents(onlyActives = false) {
        if (onlyActives === true) {
            let activeSerpents = [];

            this.#serpentsArray.forEach((serpent) => {
                if (serpent.isActive === true)
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
        
        let serpId = "serp_" + Utils.getIdWithZero(serpent.id);
        let isSerpentAlreadySetted = window.sessionStorage.getItem(serpId);

        if (isSerpentAlreadySetted !== false && isSerpentAlreadySetted !== null)
            throw "Serpent is already setted on sessionStorage()";

        let serpData = JSON.stringify(serpent.getSerpentAsAnObjectToJson());
        window.sessionStorage.setItem(serpId, serpData);
    }
}