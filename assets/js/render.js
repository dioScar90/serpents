const Family = Utils.createEnum(['Boidae','Viperidae','Elapidae','Colubridae','Dipsadidae','Pythonidae']);
const Template = Utils.createEnum(['Table','Header','Footer','Details', 'Edit', 'Create']);
const Pages = Utils.createEnum(["index.html", "edit.html", "details.html", "delete.html", "create.html"]);

class MountItem {
    #enumTemplate;

    constructor(template) {
        this.#enumTemplate = template;
    }

    #getNewTrThead() {
        const trThead = document.createElement('template');
        let trContent = '';
        trContent +=    `<tr>`;
        trContent +=        `<th class="align-middle" role="button"> Nome Popular </th>`;
        trContent +=        `<th class="align-middle"></th>`;
        trContent +=        `<th class="align-middle" role="button"> Nome Científico </th>`;
        trContent +=        `<th class="align-middle" role="button"> Família </th>`;
        trContent +=        `<th class="align-middle" role="button"> Interesse Médico </th>`;
        trContent +=    `</tr>`;
        trThead.innerHTML = trContent;
        return trThead.content.firstElementChild;
    }
    
    #getNewTrTbody() {
        const trTbody = document.createElement('template');
        let editContent = `Editar&nbsp;<i class="fa-sharp fa-solid fa-pen-to-square"></i>`;
        let editTitle = `title="Editar essa maldita serpente."`;
        let detailsContent = `Detalhes&nbsp;<i class="fa-sharp fa-solid fa-circle-info"></i>`;
        let detailsTitle = `title="Malditos detalhes dessa maldita serpente."`;
        let deleteContent = `Remover&nbsp;<i class="fa-sharp fa-solid fa-trash"></i>`;
        let deleteTitle = `title="Remover essa maldita serpente desse maldito avião".`
        let btnEdit = `<button type="button" class="btn btn-outline-warning btn-sm" ${editTitle}>${editContent}</button>`;
        let btnDetails = `<button type="button" class="btn btn-outline-info btn-sm" ${detailsTitle}>${detailsContent}</button>`;
        let btnDelete = `<button type="button" class="btn btn-outline-danger btn-sm" ${deleteTitle}>${deleteContent}</button>`;
        trTbody.innerHTML = `<tr> <td class="align-middle"></td> <td class="align-middle"> ${btnEdit} ${btnDetails} ${btnDelete} </td> <td class="align-middle"></td> <td class="align-middle"></td> <td class="align-middle"></td>  </tr>`;
        return trTbody.content.firstElementChild;
    }

    #mountHeader() {
        const header = document.querySelector("header");
        header.innerHTML = `
            <nav class="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark bg-dark border-bottom box-shadow mb-3">
                <div class="container">
                    <a class="navbar-brand" href="index.html"> Serpentes a Bordo </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="navbar-collapse collapse d-sm-inline-flex justify-content-between">
                        <ul class="navbar-nav flex-grow-1">
                            <li class="nav-item active">
                                <a class="nav-link text-light" href="index.html"> Home </a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-light" href="create.html"> Adicionar serpente </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }

    #mountDialog() {
        const footer = document.querySelector("footer");
        let modalContent = `
            <dialog id="my-modal" onclick="ifModalClick(event)" class="bg-dark bg-gradient text-white">
                <h2 class="text-white text-center"> Serpentes a bordo </h2>
                <p class="text-justify text-indent"> Olá. Aqui é Samuel L Jackson! Estou a bordo de um avião repleto de serpentes e necessito de sua ajuda. </p>
                <p class="text-justify text-indent"> Criminosos enfestaram o avião com as mais diversas serpentes, a maioria peçonhentas, e precisamos nos livrar delas. </p>
                <p class="text-justify text-indent"> Preciso por favor que remova uma a uma até que consigamos nos livrar de todas essas malditas serpentes nesse maldito avião. </p>
                <div class="d-flex justify-content-center">
                    <button id="botao-fechar" class="btn btn-light" onclick="closeModal()"> Começar </button>
                </div>
            </dialog>
        ;`

        footer.insertAdjacentHTML("beforebegin", modalContent);

        document.querySelector("#my-modal").showModal();
        setTimeout(() => document.querySelector("#my-modal button").blur(), 50);
    }

    #mountFooter() {
        const footer = document.querySelector("footer");
        let footerContent = `
            <div class="container text-light">
                &copy; 2023 - Serpentes a Bordo
            </div>
        `;
        
        footer.insertAdjacentHTML("afterbegin", footerContent);
    }

    #mountTable() {
        let sessionKeys = Utils.getObjectKeysAsArray(sessionStorage);
        let totalSerpents = 0;
    
        if (sessionKeys.length == 0)
            return;
        
        const thead = document.querySelector("thead");
        thead.replaceChildren();
        const tbody = document.querySelector("tbody");
        tbody.replaceChildren();
        const total = document.querySelector("#total");
    
        const trThead = this.#getNewTrThead();
        // thead.insertAdjacentHTML("afterbegin", trThead);
        thead.append(trThead);
        
        for (let i = 0; i < sessionKeys.length; i++) {
            let serpent = Utils.getSerpentAfterJson(sessionKeys[i], true);
            
            if (serpent.isActive !== false) {
                const tr = this.#getNewTrTbody();
                const trLinks = tr.children[1];
                let id = Utils.getIdWithZero(serpent.id);
                
                tr.children[0].innerHTML = serpent.popularName;
                tr.children[2].innerHTML = serpent.cientificName;
                tr.children[3].innerHTML = serpent.familyType;
                tr.children[4].innerHTML = serpent.medicalInterest === true ? "Sim" : "<strong>Não<strong>";
                
                trLinks.children[0].setAttribute("onclick", `location.href='edit.html?id=${id}'`);
                trLinks.children[1].setAttribute("onclick", `location.href='details.html?id=${id}'`);
                trLinks.children[2].setAttribute("onclick", `location.href='delete.html?id=${id}'`);
                
                tbody.append(tr);
                    
                totalSerpents++;
            }
        }

        if (tbody.children.length == 0) {
            const divTable = thead.closest("div");
            const divInfo = divTable.nextElementSibling;
            const btnDeleteAll = divInfo.nextElementSibling;

            divTable.classList.add("d-none");
            btnDeleteAll.classList.add("d-none");
            divInfo.classList.remove("d-none");
            total.innerHTML = "Não há mais nenhuma serpente no avião.";

            return;
        }
        
        Utils.sortTableByColumn(thead.querySelector("th"));
        
        total.firstElementChild.innerHTML = totalSerpents;
    }

    #mountCreatePage() {
        const createForm = document.querySelector("#create-form");
        const selectFamilyType = createForm.querySelector("#family-type");
        
        let families = Utils.getObjectKeysAsArray(Family);
        for (let i = 0; i < families.length; i++) {
            const option = document.createElement("option");
            option.value = families[i];
            option.innerHTML = families[i];
            
            selectFamilyType.append(option);
        }
        
        return true;
    }

    #mountDetailsPage(id) {
        const details = document.querySelector("#dl-details");
        const btnEdit = document.querySelector("#btn-edit");
        let serpent = Utils.getSerpentAfterJson(id);
        
        if (serpent === false)
            return false;
        
        const allDd = details.querySelectorAll("dd");
        allDd[0].innerHTML = serpent.popularName;
        allDd[1].innerHTML = serpent.cientificName;
        allDd[2].innerHTML = serpent.familyType;
        allDd[3].innerHTML = serpent.medicalInterest === true ? "Sim" : "Não";
        btnEdit.setAttribute("onclick", `location.href='edit.html?id=${id}'`);
    
        return true;
    }

    #mountEditPage(id) {
        const editForm = document.querySelector("#edit-form");
        const inputId = editForm.querySelector("#id");
        const inputPopularName = editForm.querySelector("#popular-name");
        const inputCientificName = editForm.querySelector("#cientific-name");
        const selectFamilyType = editForm.querySelector("#family-type");
        const radioMedicalInterest = editForm.querySelectorAll("input[type=radio]");
        let serpent = Utils.getSerpentAfterJson(id);
        
        if (serpent === false)
            return false;
        
        inputId.value = id;
        inputPopularName.value = serpent.popularName;
        inputCientificName.value = serpent.cientificName;
        if (serpent.medicalInterest === true)
            radioMedicalInterest[0].checked = true;
        else
            radioMedicalInterest[1].checked = true;

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

    #mountDeletePage(id) {
        const details = document.querySelector("#dl-delete");
        const inputId = document.querySelector("#id");
        let serpent = Utils.getSerpentAfterJson(id);
        
        if (serpent === false)
            return false;
        
        const allDd = details.querySelectorAll("dd");
        allDd[0].innerHTML = serpent.popularName;
        allDd[1].innerHTML = serpent.cientificName;
        allDd[2].innerHTML = serpent.familyType;
        allDd[3].innerHTML = serpent.medicalInterest === true ? "Sim" : "Não";
        inputId.value = id;
    
        return true;
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
                this.#mountCreatePage();
                break;
            case enumTemplate.Details :
                return this.#mountDetailsPage(id);
            case enumTemplate.Edit :
                return this.#mountEditPage(id);
            case enumTemplate.Delete :
                return this.#mountDeletePage(id);
            default :
                throw "Err 404";
        }
    }

    getEnumTemplate = () => this.#enumTemplate;

    header = () => this.#mount(this.#enumTemplate.Header);
    footer = () => this.#mount(this.#enumTemplate.Footer);
    create = () => this.#mount(this.#enumTemplate.Create);
    details = (id) => this.#mount(this.#enumTemplate.Details, id);
    edit = (id) => this.#mount(this.#enumTemplate.Edit, id);
    delete = (id) => this.#mount(this.#enumTemplate.Delete, id);
    table = () => this.#mount(this.#enumTemplate.Table);
    mountDialog = () => this.#mountDialog();
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

    #backToHomePage = (homePageUrl) => Utils.loadPage(homePageUrl);

    #checkSessionLength() {
        if (sessionStorage.length == 0)
            this.#backToHomePage(homePageUrl);
    }

    #caseIndex(title) {
        document.title = title;

        if (sessionStorage.length == 0) {
            firstTimeOnThePlane = true;
            initializeSerpents();
        }
        
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

    #caseDelete(title, actualUrl, homePageUrl) {
        this.#checkSessionLength();
        document.title = title;

        let id = actualUrl.searchParams.get("id");
        if (id == "all") {
            const divDeleteAll = document.querySelector("#remover-todas");
            const beforeDeleteAll = divDeleteAll.previousElementSibling;
            const titleH5 = document.querySelector("h5");

            beforeDeleteAll.classList.add("d-none");
            divDeleteAll.classList.remove("d-none");
            titleH5.innerHTML = `Tem certeza de que deseja remover <kbd class="btn btn-danger btn-sm pe-none fw-bold">TODAS</kbd> essas malditas serpentes desse maldito avião?`;

            return;
        }

        let detailsOk = this.#mountItem.delete(id);

        if (detailsOk === false)
            this.#backToHomePage(homePageUrl);
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
                this.#caseIndex("Serpentes a Bordo");
                break;
            case enumPages.Edit :
                this.#caseEdit("Editar", this.#actualUrl, this.#homePageUrl);            
                break;
            case enumPages.Details :
                this.#caseDetails("Detalhes", this.#actualUrl, this.#homePageUrl);            
                break;
            case enumPages.Delete :
                this.#caseDelete("Remover serpente", this.#actualUrl, this.#homePageUrl);
                break;
            case enumPages.Create :
                this.#caseCreate("Criar serpente");
                break;
            default:
                this.#backToHomePage(this.#homePageUrl);
        }
    }
}