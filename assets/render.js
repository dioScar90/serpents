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

    #mountCreate() {
        const createForm = document.querySelector("#create-form");
        // const inputId = createForm.querySelector("#id");
        // const inputPopularName = createForm.querySelector("#popular-name");
        // const inputCientificName = createForm.querySelector("#cientific-name");
        const selectFamilyType = createForm.querySelector("#family-type");
        // let serpent = Utils.getSerpentAfterJson(id);
        
        // if (serpent === false)
        //     return false;
        
        // inputId.value = id;
        // inputPopularName.value = serpent.popularName;
        // inputCientificName.value = serpent.cientificName;

        let families = Utils.getObjectKeysAsArray(Family);
        for (let i = 0; i < families.length; i++) {
            const option = document.createElement("option");
            option.value = families[i];
            option.innerHTML = families[i];
            
            selectFamilyType.append(option);
        }
        
        return true;
    }

    #mountDetails(id) {
        const details = document.querySelector("#dl-details");
        const aEdit = document.querySelector("#edit");
        let serpent = Utils.getSerpentAfterJson(id);
        
        if (serpent === false)
            return false;
        
        const allDd = details.querySelectorAll("dd");
        allDd[0].innerHTML = serpent.popularName;
        allDd[1].innerHTML = serpent.cientificName;
        allDd[2].innerHTML = serpent.familyType;
        aEdit.setAttribute("href", `edit.html?id=${id}`);
    
        return true;
    }

    #mountEdit(id) {
        const editForm = document.querySelector("#edit-form");
        const inputId = editForm.querySelector("#id");
        const inputPopularName = editForm.querySelector("#popular-name");
        const inputCientificName = editForm.querySelector("#cientific-name");
        const selectFamilyType = editForm.querySelector("#family-type");
        let serpent = Utils.getSerpentAfterJson(id);
        
        if (serpent === false)
            return false;
        
        inputId.value = id;
        inputPopularName.value = serpent.popularName;
        inputCientificName.value = serpent.cientificName;

        let families = Utils.getObjectKeysAsArray(Family);
        for (let i = 0; i < families.length; i++) {
            const option = document.createElement("option");
            option.value = families[i];
            option.innerHTML = families[i];

            if (families[i] == serpent.familyType)
                option.selected = true;
            
            selectFamilyType.append(option);
        }
        
        return true;
    }

    #mountTable() {
        let sessionKeys = Utils.getObjectKeysAsArray(window.sessionStorage).sort();
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
            let serpent = Utils.getSerpentAfterJson(sessionKeys[i], true);
            
            if (serpent !== false) {
                const tr = this.#getNewTrTbody();
                const trLinks = tr.lastElementChild;
                let id = Utils.getIdWithZero(serpent.id);
    
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
            case enumTemplate.Create :
                this.#mountCreate();
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
    create = () => this.#mount(this.#enumTemplate.Create);
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

    #backToHomePage = (homePageUrl) => Utils.reloadPage(homePageUrl);

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

    #caseEdit(title, actualUrl, homePageUrl) {
        this.#checkSessionLength();
        document.title = title;

        let id = actualUrl.searchParams.get("id");
        let detailsOk = this.#mountItem.edit(id);

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

        let createOk = this.#mountItem.create();

        if (createOk === false)
            this.#backToHomePage(homePageUrl);
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
                this.#caseEdit("Editar", this.#actualUrl, this.#homePageUrl);            
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
    let actualUrl = Utils.getActualUrl();
    let fileName = Utils.getFileName(actualUrl);
    let homePageUrl = Utils.getHomePageUrl(actualUrl);

    const mountItem = new MountItem(Template);
    const render = new Render(actualUrl, fileName, homePageUrl, Pages, mountItem);

    render.renderPage();
}