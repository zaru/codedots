
var AUDIO_LIST = {
    "SYS_KEY": new Audio("sound/button07.mp3"),
    "TYPE": new Audio("sound/meka_ge_keyborad01.mp3"),
    "1": new Audio("sound/button11.mp3"),
    "2": new Audio("sound/button14.mp3"),
    "3": new Audio("sound/button15.mp3"),
    "4": new Audio("sound/button18.mp3"),
    "5": new Audio("sound/button19.mp3"),
    "6": new Audio("sound/button23.mp3"),
    "7": new Audio("sound/button25.mp3"),
    "8": new Audio("sound/button26.mp3"),
    "9": new Audio("sound/button33.mp3"),
    "10": new Audio("sound/button39.mp3"),
    "11": new Audio("sound/button70.mp3"),
};

function drawCode(colors) {

    var cellSize = 0,
        cellMaxSize = 3

    var barPadding = 12;
    var dotNum = colors.length;
    var dotRoot = Math.ceil(Math.sqrt(dotNum));
    var datasets =colors;

    console.log(colors.length);
    console.log(dotRoot);
    var width = dotRoot * cellMaxSize + (dotRoot) * (barPadding - cellMaxSize);
    var height = dotRoot * cellMaxSize + (dotRoot) * (barPadding - cellMaxSize);

    var COM_LIST = {
        "#000000" : "SYS_KEY",
        "#F0F8FF" : "SYS_KEY",
        "#008B8B" : "SYS_KEY",
        "#FFFFE0" : "SYS_KEY",
        "#FF7F50" : "SYS_KEY",
        "#696969" : "SYS_KEY",
        "#E6E6FA" : "SYS_KEY",
        "#008080" : "SYS_KEY",
        "#FAFAD2" : "SYS_KEY",
        "#FF6347" : "SYS_KEY",
        "#808080" : "SYS_KEY",
        "#B0C4DE" : "SYS_KEY",
        "#2F4F4F" : "SYS_KEY",
        "#FFFACD" : "SYS_KEY",
        "#FF4500" : "SYS_KEY",
        "#A9A9A9" : "SYS_KEY",
        "#778899" : "SYS_KEY",
        "#006400" : "SYS_KEY",
        "#F5DEB3" : "SYS_KEY",
        "#FF0000" : "SYS_KEY",
        "#C0C0C0" : "SYS_KEY",
        "#708090" : "SYS_KEY",
        "#008000" : "SYS_KEY",
        "#DEB887" : "SYS_KEY",
        "#DC143C" : "SYS_KEY",
        "#D3D3D3" : "SYS_KEY",
        "#4682B4" : "SYS_KEY",
        "#228B22" : "SYS_KEY",
        "#D2B48C" : "SYS_KEY",
        "#C71585" : "SYS_KEY",
        "#DCDCDC" : "SYS_KEY",
        "#4169E1" : "SYS_KEY",
        "#2E8B57" : "SYS_KEY",
        "#F0E68C" : "SYS_KEY",
        "#FF1493" : "SYS_KEY",
        "#F5F5F5" : "SYS_KEY",
        "#191970" : "SYS_KEY",
        "#3CB371" : "SYS_KEY",
        "#FFFF00" : "SYS_KEY",
        "#FF69B4" : "SYS_KEY",
        "#000080" : "SYS_KEY"
    };

    function playSound() {
        var count = 0;
        return function(color) {
            color = color.toUpperCase();
            count = count + 1;
            if (color in COM_LIST) {
                AUDIO_LIST[COM_LIST[color]].play();
            }else if (count % 35 == 0 || count % 60 == 0) {
                var idx = Math.floor(Math.random() * 10) + 1;
                AUDIO_LIST[idx].play();
                AUDIO_LIST[idx] = new Audio(AUDIO_LIST[idx].src);
            }
            if (count == dotNum) {
                $('#download_button').show();
            }
        };
    };
    var p = playSound();

    var svg = d3.select("#svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr("style", "width: " + width + "px; height: " + height + "px;");

    var rect = svg.selectAll("rect")
        .data(datasets)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
            var col = Math.floor(i / dotRoot);
            return col * cellSize + (col + 0) * barPadding;
        })
        .attr("y", function (d, i) {
            var row = i % dotRoot;
            return row * cellSize + (row + 0) * barPadding;
        })
        .attr("width", cellSize)
        .attr("height", cellSize)
        .attr("class", function (d, i) {
            return 'cell';
        })
        .attr("style", function (d, i) {
            return 'fill: ' + d;
        })
        .transition()
        .delay(function(d, i) {
            return i * 10;
        })
        .duration(function (d, i) {
            return 1500;
        })
        .attr("width", function(d) {
            return cellMaxSize;
        })
        .attr("height", function (d) {
            return cellMaxSize;
        })
        .each("end", function (d) {
            p(d);
        });
}

function downloadImage() {
    console.log('hoge');
    var svgText = $('#svg')[0].innerHTML;
    canvg('canvas', svgText);

    var canvas = document.getElementById('canvas');
    canvas.toBlob(function (blob) {
        saveAs(blob, "code.png");
    }, "image/png");
}

function uploadFiles(files) {
    var fd = new FormData();
    var filesLength = files.length;
    for (var i = 0; i < filesLength; i++) {
        fd.append("files[]", files[i]);
    }
    $.ajax({
        url: '/parse',
        type: 'POST',
        data: fd,
        processData: false,
        contentType: false,
        dataType: 'json',
        success: function(data) {
            console.log('ファイルがアップロードされました。');
            console.log(data);
            if (data['kind'] == 'code') {
                console.log(data['code']);
                $('#code').text(data['code']);
                $("#code").typewrite({
                    callback: function() {
                        AUDIO_LIST['TYPE'].pause();
                    }
                });
                AUDIO_LIST['TYPE'].loop = true;
                AUDIO_LIST['TYPE'].play();
            } else {
                drawCode(data['color']);
            }
        }
    });
}

$(function() {
    $('#download_button').click(function() {
        downloadImage();
    });

    $('#drop_zone').bind('drop', function(e){
        $('#drop_zone').css('background-color', '#000000');
        // デフォルトの挙動を停止
        e.preventDefault();

        // ファイル情報を取得
        var files = e.originalEvent.dataTransfer.files;
        console.log(files);
        uploadFiles(files);

    }).bind('dragenter', function(){
        return false;
    }).bind('dragover', function(){
        $('#drop_zone').css('background-color', '#e81052');
        return false;
    });
});