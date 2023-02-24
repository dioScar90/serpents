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

function mountHeader() {
    const header = document.querySelector("header");
    header.innerHTML = `
        <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-light bg-white border-bottom box-shadow mb-3">
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html"> Serpents </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                        aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                    <ul class="navbar-nav flex-grow-1">
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="index.html"> Home </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link text-dark" href="create.html"> Create New </a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `;
}

function mountFooter() {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
        <div class="container">
            &copy; 2023 - Serpents - <a href="privacy.html"> Privacy </a>
        </div>
    `;
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

const backToHomePage = (homePageUrl) => window.location = homePageUrl;

function checkSessionLength() {
    if (window.sessionStorage.length == 0)
        backToHomePage(homePageUrl);
}

function caseIndex(title) {
    document.title = title;

    if (window.sessionStorage.length == 0)
        inicializeSerpents();
    
    mountTable();
}

function caseEdit(title) {
    checkSessionLength();

    document.title = title;
}

function caseDetails(title, actualUrl, homePageUrl) {
    checkSessionLength();

    document.title = title;

    let id = actualUrl.searchParams.get("id");
    let detailsOk = mountDetails(id);

    if (detailsOk === false)
        backToHomePage(homePageUrl);
}

function caseDelete(title) {
    checkSessionLength();

    document.title = title;
}

function caseCreate(title) {
    checkSessionLength();
    
    document.title = title;
}

window.onload = function() {
    let actualUrl = new URL(location.href);
    let fileName = actualUrl.pathname.split(`/`).at(-1);
    let homePageUrl = actualUrl.pathname.substring(0, actualUrl.pathname.lastIndexOf(`/`) + 1) + "index.html";

    mountHeader();
    mountFooter();

    switch (fileName) {
        case "index.html" :
            caseIndex("Serpentário");
            break;
        case "edit.html" :
            caseEdit("Editar");            
            break;
        case "details.html" :
            caseDetails("Detalhes", actualUrl, homePageUrl);            
            break;
        case "delete.html" :
            caseDelete("Remover serpente");
            break;
        case "create.html" :
            caseCreate("Criar serpente");
            break;
        default:
            backToHomePage(homePageUrl);
    }
}