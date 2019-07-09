window.getDataApi = "https://wx.twtstudio.com/light.php";
window.postDataApi = "https://wx.twtstudio.com/light.php";

// TEST BEFORE PRODUCTION, IF THE FORMAT OF INTERFACE (API) IS CORRECT AND ALLOWS CROSS-DOMAIN ACCESS, THIS SHOULD BE DONE AUTOMATICALLY
// IF NOT, THROW THE POT TO HAI-CHI WANG

// CODE OF POST & GET PROCESSING IS AT LINE 78-84, LINE 148-158

var shadePanel = $('#shade-panel');
var bgs = [$('#bg-a'), $('#bg-b'), $('#bg-c')];
var mains = [$('#main-a'), $('#main-b'), $('#main-c')];
var lightCount = $('#light-count');
var lighten = false;
var beenThere = [true, false, false];
var sharePanel = $('#share-panel');
window.geoAvailable = false;
window.dataSeries = [];


function revealPage() {
    shadePanel.fadeOut();
}

function hidePage() {
    shadePanel.fadeIn();
}

function showShareQuote() {
    sharePanel.fadeIn();
}

function geoOnSuccess(pos) {
    window.geoAvailable = true;
    window.crd = pos.coords;
    iqwerty.toast.Toast("已获取地理位置");
    $('#c-bar-loc-text').text("已获取地理位置");

    console.log(crd.longitude, crd.latitude);


    var locApiUrl = "https://api.map.baidu.com/geocoder/v2/?callback=renderReverse&location=" + crd.latitude + "," + crd.longitude + "&output=json&pois=1&ak=tvtloxURCYXVrb79pRKDGwT6DwtxjQis";

    $.ajax({
        url: locApiUrl,
        type: 'GET',
        data: {
        },
        dataType: "JSONP",
        complete: function (data) {
            var v = data.responseJSON.result.addressComponent;
            $('#c-bar-loc-text').text(v.country + ' ' + v.city + ' ' + v.district);
        }
    })
}

function geoOnError(pos) {
    iqwerty.toast.Toast("地理位置获取失败。请给予权限，或尝试在微信端或浏览器内打开。");
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

            $.getJSON({
                url: getDataApi,
                complete: function (res) {
                    if (res.status == 200) {
                        console.log(res);
                        console.log("above res");

                        window.dataSeries = res.responseJSON;
                        lightCount.text(window.dataSeries[0]);
                        option.series[0].data = window.dataSeries;

                    }
                    window.seriesContainer = echarts.init(document.getElementById('c-map'));
                    seriesContainer.setOption(option);
                }
            });

            var geoOptions = {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 0
            };

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

sharePanel.click(function () {
   sharePanel.fadeOut();
});

$('#share-self').click(function () {
    showShareQuote();
});

// var clipLink = new Clipboard('#share-self', {
//     text: function (a) {
//         return window.location.href;
//     }
// });

// clipLink.on('success', function(e) {
//     iqwerty.toast.Toast('✎ 链接已复制到剪贴板');
// });
//
// clipLink.on('error', function(e) {
//     iqwerty.toast.Toast('✎ 链接复制失败，请手动选中复制');
// });

$('#c-button').click(function () {
    if (geoAvailable) {
        if (lighten) {
            iqwerty.toast.Toast('✎ 已经点亮啦');
        }
        else {
            lighten = true;
            option.bmap.center = [crd.longitude, crd.latitude];
            option.bmap.zoom = 5;
            seriesContainer.setOption(option);
            option.series[1].data = [[crd.longitude, crd.latitude]];
            seriesContainer.setOption(option);
            iqwerty.toast.Toast('✎ 点亮啦');

            crd.longitude += (Math.random()-0.5) * 0.0005;
            crd.latitude += (Math.random()-0.5) * 0.0005;
            $.ajax({
                url: postDataApi,
                type: 'POST',
                data: {
                    light: "["+(parseFloat(crd.longitude.toFixed(4)))+","+(parseFloat(crd.latitude.toFixed(4)))+"]"
                },
                complete: function (data) {
                    if (!isNaN(parseInt(lightCount.text()))) {
                        lightCount.text(parseInt(lightCount.text()) + 1);
                    }
                    console.log("Wow");
                    wx.ready(function(){
                        wx.onMenuShareAppMessage({
                            title: title, // 分享标题
                            desc: "我是第 " + $('#light-count').text() + " 位点亮天大校友地图的人", // 分享描述
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                        wx.onMenuShareTimeline({
                            title: "我是第 " + $('#light-count').text() + " 位点亮天大校友地图的人", // 分享标题
                            link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                            imgUrl: imgUrl, // 分享图标
                            success: function () {
                                // 用户确认分享后执行的回调函数
                            },
                            cancel: function () {
                                // 用户取消分享后执行的回调函数
                            }
                        });
                    })
                }
            });
            setTimeout(showShareQuote, 3900);
        }
    }
    else {
        iqwerty.toast.Toast('✎ 尚无法获取您的地理位置，请稍后重试');
    }
});
