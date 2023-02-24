function getNewTrThead() {
    const trThead = document.createElement('template');
    trThead.innerHTML = `<tr> <th> Nome Popular </th> <th> Nome Científico </th> <th> Família </th> <th></th> </tr>`;
    return trThead.content.firstElementChild;
}

function getNewTrTbody() {
    const trTbody = document.createElement('template');
    trTbody.innerHTML = `<tr> <td></td> <td></td> <td></td> <td> <a>Edit</a> | <a>Details</a> | <a>Delete</a> </td> </tr>`;
    return trTbody.content.firstElementChild;
}

function mountDetails(id) {
    const details = document.querySelector("#dl-details");
    const aEdit = document.querySelector("#edit");
    let strToJson = window.sessionStorage.getItem("serp_" + id);
    let serpent = JSON.parse(strToJson);
    
    if (serpent === false)
        return false;
    
    const allDd = details.querySelectorAll("dd");
    allDd[0].innerHTML = serpent.popularName;
    allDd[1].innerHTML = serpent.cientificName;
    allDd[2].innerHTML = serpent.familyType;
    aEdit.setAttribute("href", `delete.html?id=${id}`);

    return true;
}

function mountTable() {
    let sessionKeys = Object.keys(window.sessionStorage).sort();
    let totalSerpents = 0;

    if (sessionKeys.length == 0)
    return;
    
    const thead = document.querySelector("#thead");
    thead.innerHTML = '';
    const tbody = document.querySelector("#tbody");
    tbody.innerHTML = '';
    const total = document.querySelector("#total");

    const trThead = getNewTrThead();
    thead.append(trThead);
    
    for (let i = 0; i < sessionKeys.length; i++) {
        let serpent = JSON.parse(window.sessionStorage.getItem(sessionKeys[i]));
        
        if (serpent !== false) {
            const tr = getNewTrTbody();
            const trLinks = tr.lastElementChild;
            let idWithZero = '0' + serpent.id;
            let id = idWithZero.slice(-2);

            tr.children[0].innerHTML = serpent.popularName;
            tr.children[1].innerHTML = serpent.cientificName;
            tr.children[2].innerHTML = serpent.familyType;
            
            trLinks.children[0].setAttribute("href", `edit.html?id=${id}`);
            trLinks.children[1].setAttribute("href", `details.html?id=${id}`);
            trLinks.children[2].setAttribute("href", `delete.html?id=${id}`);
            
            tbody.append(tr);

            totalSerpents++;
        }
    }

    total.firstElementChild.innerHTML = totalSerpents;
}

window.onload = function() {
    let actualUrl = new URL(location.href);
    let fileName = actualUrl.pathname.split(`/`).at(-1);
    let homePageUrl = actualUrl.pathname.substring(0, actualUrl.pathname.lastIndexOf(`/`) + 1) + "index.html";

    switch(fileName) {
        case "index.html" :
            if (window.sessionStorage.length == 0)
                inicializeSerpents();
            mountTable();
            break;
        case "edit.html" :
            if (window.sessionStorage.length == 0)
                window.location = homePageUrl;
            break;
        case "details.html" :
            if (window.sessionStorage.length == 0)
                window.location = homePageUrl;
            
            let id = actualUrl.searchParams.get("id");
            let detailsOk = mountDetails(id);

            if (detailsOk === false)
                window.location = homePageUrl;

            break;
        case "delete.html" :
            if (window.sessionStorage.length == 0)
                window.location = homePageUrl;
            break;
        case "create.html" :
            break;
        default:
            throw "Error 404";
    }

    // if (window.sessionStorage.length == 0)
    //     inicializeSerpents();

    // mountTable();
}