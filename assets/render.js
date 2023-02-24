const Template = createEnum(['Table','Header','Footer','Details']);
const Pages = createEnum(["index.html", "edit.html", "details.html", "delete.html", "create.html"]);

class MountItem {
    #enumTemplate;

    constructor(template) {
        this.#enumTemplate = template;
    }

    #getNewTrThead() {
        const trThead = document.createElement('template');
        trThead.innerHTML = `<tr> <th> Nome Popular </th> <th> Nome Científico </th> <th> Família </th> <th></th> </tr>`;
        return trThead.content.firstElementChild;
    }
    
    #getNewTrTbody() {
        const trTbody = document.createElement('template');
        trTbody.innerHTML = `<tr> <td></td> <td></td> <td></td> <td> <a>Edit</a> | <a>Details</a> | <a>Delete</a> </td> </tr>`;
        return trTbody.content.firstElementChild;
    }

    #mountHeader() {
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

    #mountFooter() {
        const footer = document.querySelector("footer");
        footer.innerHTML = `
            <div class="container">
                &copy; 2023 - Serpents - <a href="privacy.html"> Privacy </a>
            </div>
        `;
    }

    #mountDetails(id) {
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

    #mountEdit(id) {
        const editForm = document.querySelector("#edit-form");
        const inputId = editForm.querySelector("#id");
        const inputPopularName = editForm.querySelector("#popular-mame");
        const inputCientificName = editForm.querySelector("#cientific-mame");
        const selectFamilyType = editForm.querySelector("#family-type");
        let strToJson = window.sessionStorage.getItem("serp_" + id);
        let serpent = JSON.parse(strToJson);
        
        if (serpent === false)
            return false;
        
        inputPopularName.value = serpent.popularName;
        inputCientificName.value = serpent.cientificName;

        let families = Object.keys(Family);
        for (let i = 0; i < families.length; i++) {
            //create options
        }
        
        const allDd = details.querySelectorAll("dd");
        allDd[0].innerHTML = serpent.popularName;
        allDd[1].innerHTML = serpent.cientificName;
        allDd[2].innerHTML = serpent.familyType;

        aEdit.setAttribute("href", `delete.html?id=${id}`);
    
        return true;
    }

    #mountTable() {
        let sessionKeys = Object.keys(window.sessionStorage).sort();
        let totalSerpents = 0;
    
        if (sessionKeys.length == 0)
            return;
        
        const thead = document.querySelector("#thead");
        thead.innerHTML = '';
        const tbody = document.querySelector("#tbody");
        tbody.innerHTML = '';
        const total = document.querySelector("#total");
    
        const trThead = this.#getNewTrThead();
        thead.append(trThead);
        
        for (let i = 0; i < sessionKeys.length; i++) {
            let serpent = JSON.parse(window.sessionStorage.getItem(sessionKeys[i]));
            
            if (serpent !== false) {
                const tr = this.#getNewTrTbody();
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

    #mount(type, id = false) {
        let enumTemplate = this.#enumTemplate;

        switch (type) {
            case enumTemplate.Table :
                this.#mountTable();
                break;
            case enumTemplate.Header :
                this.#mountHeader();
                break;
            case enumTemplate.Footer :
                this.#mountFooter();
                break;
            case enumTemplate.Details :
                return this.#mountDetails(id);
            case enumTemplate.Edit :
                return this.#mountEdit(id);
            default :
                throw "Err 404";
        }
    }

    header = () => this.#mount(this.#enumTemplate.Header);
    footer = () => this.#mount(this.#enumTemplate.Footer);
    details = (id) => this.#mount(this.#enumTemplate.Details, id);
    edit = (id) => this.#mount(this.#enumTemplate.Edit, id);
    table = () => this.#mount(this.#enumTemplate.Table);
}

class Render {
    #actualUrl;
    #fileName;
    #homePageUrl;
    #enumPages;
    #mountItem;

    constructor(actualUrl, fileName, homePageUrl, enumPages, mountItem) {
        this.#actualUrl = actualUrl;
        this.#fileName = fileName;
        this.#homePageUrl = homePageUrl;
        this.#enumPages = enumPages;
        this.#mountItem = mountItem;
    }

    #backToHomePage = (homePageUrl) => window.location = homePageUrl;

    #checkSessionLength() {
        if (window.sessionStorage.length == 0)
            this.#backToHomePage(homePageUrl);
    }

    #caseIndex(title) {
        document.title = title;

        if (window.sessionStorage.length == 0)
            inicializeSerpents();
        
        this.#mountItem.table();
    }

    #caseEdit(title) {
        this.#checkSessionLength();
        document.title = title;

        let id = actualUrl.searchParams.get("id");
        let detailsOk = this.#mountItem.edit();

        if (detailsOk === false)
            this.#backToHomePage(homePageUrl);
        
        
    }

    #caseDetails(title, actualUrl, homePageUrl) {
        this.#checkSessionLength();
        document.title = title;

        let id = actualUrl.searchParams.get("id");
        let detailsOk = this.#mountItem.details(id);

        if (detailsOk === false)
            this.#backToHomePage(homePageUrl);
    }

    #caseDelete(title) {
        this.#checkSessionLength();
        document.title = title;
    }

    #caseCreate(title) {
        this.#checkSessionLength();
        document.title = title;
    }

    renderPage() {
        this.#mountItem.header();
        this.#mountItem.footer();
        let enumPages = this.#enumPages

        switch (this.#fileName) {
            case enumPages.Index :
                this.#caseIndex("Serpentário");
                break;
            case enumPages.Edit :
                this.#caseEdit("Editar");            
                break;
            case enumPages.Details :
                this.#caseDetails("Detalhes", this.#actualUrl, this.#homePageUrl);            
                break;
            case enumPages.Delete :
                this.#caseDelete("Remover serpente");
                break;
            case enumPages.Create :
                this.#caseCreate("Criar serpente");
                break;
            default:
                this.#backToHomePage(this.#homePageUrl);
        }
    }
}

window.onload = function() {
    let actualUrl = new URL(location.href);
    let fileName = actualUrl.pathname.split(`/`).at(-1);
    let homePageUrl = actualUrl.pathname.substring(0, actualUrl.pathname.lastIndexOf(`/`) + 1) + "index.html";

    const mountItem = new MountItem(Template);
    const render = new Render(actualUrl, fileName, homePageUrl, Pages, mountItem);

    render.renderPage();
}