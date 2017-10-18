var shadePanel = $('#shade-panel');
var bgs = [$('#bg-a'), $('#bg-b'), $('#bg-c')];
var mains = [$('#main-a'), $('#main-b'), $('#main-c')];
var beenThere = false;

function revealPage() {
    shadePanel.fadeOut();
}

function hidePage() {
    shadePanel.fadeIn();
}

function toPage(currentPage, destination) {
    hidePage();
    setTimeout(function () {
        bgs[currentPage].hide();
        mains[currentPage].hide();
        bgs[destination].show();
        mains[destination].show();
        if(destination == 1 && beenThere == false) {
            const mySiema = new Siema({
            });
            beenThere = true;
        }
        revealPage();
    }, 1000)
}

$('#a-button-self').click(function () {
    toPage(0,1);
});