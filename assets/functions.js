function inicializeSerpents() {
    let serpentsToPush = [
        ["Surucucu", "Lachesis muta", Family.Viperidae],
        ["Cascavel", "Crotalus durissus", Family.Viperidae],
        ["Jararaca-da-mata", "Bothrops jararaca", Family.Viperidae],
        ["Jararaca-do-norte", "Bothrops atrox", Family.Viperidae],
        ["Jararaca-da-seca", "Bothrops erythromelas", Family.Viperidae],
        ["Jararaca-ilhoa", "Bothrops insularis", Family.Viperidae],
        ["Jararacuçu", "Bothrops jararacussu", Family.Viperidae],
        ["Urutu-cruzeiro", "Bothrops alternatus", Family.Viperidae],
        ["Cobra-coral (Caatinga)", "Micrurus ibiboboca", Family.Elapidae],
        ["Cobra-coral (Mata Atlântica)", "Micrurus corallinus", Family.Elapidae],
        ["Cobra-coral (Amazônia)", "Micrurus albicintus", Family.Elapidae],
        ["Jiboia", "Boa constrictor", Family.Boidae],
        ["Jiboia-arco-íris", "Epicrates assisi", Family.Boidae],
        ["Sucuri-verde", "Eunectes murinus", Family.Boidae],
        ["Sucuri-amarela", "Eunectes notaeus", Family.Boidae],
        ["Píton-reticulada", "Malayopython reticulatus", Family.Pythonidae],
        ["Cobra-rei", "Ophiophagus hannah", Family.Elapidae],
        ["Taipan-do-interior", "Oxyuranus microlepidotus", Family.Elapidae],
        ["Mamba-negra", "Dendroaspis polylepis", Family.Elapidae],
        ["Mamba-verde-oriental", "Dendroaspis angusticeps", Family.Elapidae],
        ["Naja-cuspideira", "Hemachatus haemachatus", Family.Elapidae],
        ["Naja-egípcia", "Naja haje", Family.Elapidae],
        ["Naja-de-monóculo", "Naja kaouthia", Family.Elapidae],
        ["Víbora-do-gabão", "Bitis gabonica", Family.Viperidae],
        ["Periquitamboia", "Corallus caninus", Family.Boidae],
        ["Cobra-verde", "Liophis typhlus", Family.Dipsadidae],
        ["Muçurana", "Clelia clelia", Family.Dipsadidae],
        ["Caninana", "Spilotes pullatus", Family.Colubridae],
        ["Cobra-cipó-marrom", "Chironius quadricarinatus", Family.Colubridae],
        ["Jararacuçu-do-brejo", "Palusophis bifossatus", Family.Colubridae],
        ["Titanoboa", "Titanoboa cerrejonensis", Family.Boidae],
        ["Cobra-cipó-verde", "Chironius bicarinatus", Family.Colubridae],
        ["Suaçuboia", "Corallus hortulanus", Family.Boidae],
        ["Cobra d'água", "Helicops angulatus", Family.Colubridae],
        ["Naja-indiana", "Naja naja", Family.Elapidae],
        ["Cobra-verde", "Philodryas olfersii", Family.Colubridae]
    ];

    let serpentarium = new Serpentarium();
    serpentsToPush.forEach((serpent) => {
        const lenSerp = serpentarium.getAllSerpents().length > 0 ? serpentarium.getAllSerpents().at(-1).getId() : 0;
        serpentarium.setNewSerpent(new Serpent(serpent[0], serpent[1], serpent[2], lenSerp));
    });
    
    serpentarium.getAllSerpents().forEach((serpent) => {
        console.log("Id: " + serpent.getId() + "\n" +
        "Nome popular: " + serpent.getPopularName() + "\n" +
        "Nome científico: " + serpent.getCientificName() + "\n" +
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