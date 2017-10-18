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

function geoOnSuccess(pos) {
    var crd = pos.coords;
    iqwerty.toast.Toast("已获取地理位置");
    $('#c-bar-loc-text').text("已获取地理位置");
    console.log(crd.longitude, crd.latitude);

    var locApiUrl = "https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + crd.latitude + "," + crd.longitude + "&output=json&pois=1&ak=iTXj7xIWimk26VaXAWMMlRPU1bk35h8t";

    $.ajax({
        url: locApiUrl,
        type: 'GET',
        data: {
        },
        dataType: 'JSONP',
        complete: function (data) {
            var v = data.responseJSON.result.addressComponent;
            $('#c-bar-loc-text').text(v.country + ' ' + v.city + ' ' + v.district);
        }
    })

}

function geoOnError(pos) {
    var crd = pos.coords;
    iqwerty.toast.Toast("没有权限，地理位置获取失败");
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
            var geoOptions = {
                enableHighAccuracy: false,
                timeout: 5000,
                maximumAge: 0
            };
            var seriesContainer = echarts.init(document.getElementById('c-map'));
            seriesContainer.setOption(option);
            navigator.geolocation.getCurrentPosition(geoOnSuccess, geoOnError, geoOptions);
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
