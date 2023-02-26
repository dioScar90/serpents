function initializeSerpents() {
    let serpentsToPush = [
        ["Surucucu", "Lachesis muta", true, Family.Viperidae],
        ["Cascavel", "Crotalus durissus", true, Family.Viperidae],
        ["Jararaca-da-mata", "Bothrops jararaca", true, Family.Viperidae],
        ["Jararaca-do-norte", "Bothrops atrox", true, Family.Viperidae],
        ["Jararaca-da-seca", "Bothrops erythromelas", true, Family.Viperidae],
        ["Jararaca-ilhoa", "Bothrops insularis", true, Family.Viperidae],
        ["Jararacuçu", "Bothrops jararacussu", true, Family.Viperidae],
        ["Urutu-cruzeiro", "Bothrops alternatus", true, Family.Viperidae],
        ["Cobra-coral (Caatinga)", "Micrurus ibiboboca", true, Family.Elapidae],
        ["Cobra-coral (Mata Atlântica)", "Micrurus corallinus", true, Family.Elapidae],
        ["Cobra-coral (Amazônia)", "Micrurus albicintus", true, Family.Elapidae],
        ["Jiboia", "Boa constrictor", false, Family.Boidae],
        ["Jiboia-arco-íris", "Epicrates assisi", false, Family.Boidae],
        ["Sucuri-verde", "Eunectes murinus", false, Family.Boidae],
        ["Sucuri-amarela", "Eunectes notaeus", false, Family.Boidae],
        ["Píton-reticulada", "Malayopython reticulatus", false, Family.Pythonidae],
        ["Cobra-rei", "Ophiophagus hannah", true, Family.Elapidae],
        ["Taipan-do-interior", "Oxyuranus microlepidotus", true, Family.Elapidae],
        ["Mamba-negra", "Dendroaspis polylepis", true, Family.Elapidae],
        ["Mamba-verde-oriental", "Dendroaspis angusticeps", true, Family.Elapidae],
        ["Naja-cuspideira", "Hemachatus haemachatus", true, Family.Elapidae],
        ["Naja-egípcia", "Naja haje", true, Family.Elapidae],
        ["Naja-de-monóculo", "Naja kaouthia", true, Family.Elapidae],
        ["Víbora-do-gabão", "Bitis gabonica", true, Family.Viperidae],
        ["Periquitamboia", "Corallus caninus", false, Family.Boidae],
        ["Muçurana", "Clelia clelia", false, Family.Dipsadidae],
        ["Caninana", "Spilotes pullatus", false, Family.Colubridae],
        ["Cobra-cipó-marrom", "Chironius quadricarinatus", false, Family.Colubridae],
        ["Jararacuçu-do-brejo", "Palusophis bifossatus", false, Family.Colubridae],
        ["Titanoboa", "Titanoboa cerrejonensis", false, Family.Boidae],
        ["Cobra-cipó-verde", "Chironius bicarinatus", false, Family.Colubridae],
        ["Suaçuboia", "Corallus hortulanus", false, Family.Boidae],
        ["Cobra d'água", "Helicops angulatus", false, Family.Colubridae],
        ["Naja-indiana", "Naja naja", true, Family.Elapidae],
        ["Cobra-verde", "Philodryas olfersii", true, Family.Colubridae],
        ["Pelágio (cobra-marinha)", "Hydrophis belcheri", true, Family.Elapidae]
    ];

    let serpentarium = new Serpentarium();
    serpentsToPush.forEach((serpent) => {
        const lenSerp = serpentarium.getAllSerpents().length > 0 ? serpentarium.getAllSerpents().at(-1).getId() : 0;
        serpentarium.setNewSerpent(new Serpent(serpent[0], serpent[1], serpent[2], serpent[3], lenSerp));
    });
    
    serpentarium.getAllSerpents().forEach((serpent) => {
        console.log("Id: " + serpent.getId() + "\n" +
        "Nome popular: " + serpent.getPopularName() + "\n" +
        "Nome científico: " + serpent.getCientificName() + "\n" +
        "Interesse médico: " + (serpent.getMedicalInterest() === true ? "sim" : "não") + "\n" +
        "Família: " + serpent.getFamilyType() + "\n");
    });
}

function pushNewSerpent(serpent) {
    serpentarium.setNewSerpent(serpent);
}

function startCreateNewSerpent(e) {
    e.preventDefault();
    
    const formValues = new FormValues(e.target);
    let newSerpentObj = formValues.getValues(true);
    let serpentCreated = Utils.createNewSerpent(newSerpentObj);
    
    if (serpentCreated === true) {
        Utils.backToHomePage();
    }
}

function startEditSerpent(e) {
    e.preventDefault();

    const formValues = new FormValues(e.target);
    let serpentObj = formValues.getValues();
    let serpentUpdated = Utils.updateSerpent(serpentObj);

    if (serpentUpdated === true) {
        Utils.backToHomePage();
    }
}

function startDeleteSerpent(e) {
    e.preventDefault();
    
    const formValues = new FormValues(e.target);
    let serpentObj = formValues.getValues();
    let serpentUpdated = Utils.deleteSerpent(serpentObj.id);

    if (serpentUpdated === true) {
        Utils.backToHomePage();
    }
}

const backToHomePage = () => Utils.backToHomePage();
const goToPage = (pageName) => Utils.goToPage(pageName);