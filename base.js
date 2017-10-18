var shadePanel = $('#shade-panel');
var bgs = [$('#bg-a'), $('#bg-b'), $('#bg-c')];
var mains = [$('#main-a'), $('#main-b'), $('#main-c')];
var beenThere = [true, false, false];

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
        if (destination == 1 && beenThere[destination] == false) {
            const mySiema = new Siema({
            });
        }
        if (destination == 2 && beenThere[destination] == false) {
            var seriesContainer = echarts.init(document.getElementById('c-map'));
            seriesContainer.setOption(option);
        }
        beenThere[destination] = true;
        revealPage();
    }, 1000)
}

$('#a-button-self').click(function () {
    toPage(0,1);
});

$('#b-button').click(function () {
    toPage(1,2);
});

var clipLink = new Clipboard('#share-self', {
    text: function (a) {
        return window.location.href;
    }
});

clipLink.on('success', function(e) {
    iqwerty.toast.Toast('✎ 链接已复制到剪贴板');
});

clipLink.on('error', function(e) {
    iqwerty.toast.Toast('✎ 链接复制失败，请手动选中复制');
});
