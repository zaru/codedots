$(function() {

    var cellSize = 0,
        cellMaxSize = 1,
        format = d3.time.format("%Y-%m-%d");

    var colors = ['#ff0000', '#00ffff', '#ff8000', '#0080ff', '#ffff00', '#0000ff', '#80ff00', '#8000ff', '#00ff00', '#ff00ff', '#00ff80', '#ff0080'];
    var barPadding = 4;
    var dotNum = 500;
    var dotRoot = Math.sqrt(dotNum);
    var datasets = new Array(dotNum);

    var width = dotRoot * cellMaxSize + (dotRoot - 1) * (barPadding - 1);
    var height = dotRoot * cellMaxSize + (dotRoot - 1) * (barPadding - 1);

    var AUDIO_LIST = {
        "0": new Audio("sound/button07.mp3"),
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

    var playSound = function() {
        var count = 0;
        return function() {
            count = count + 1;
            if (count % 15 == 0 || count % 35 == 0) {
                var idx = Math.floor(Math.random() * 11);
                //AUDIO_LIST[idx].play();
                //AUDIO_LIST[idx] = new Audio(AUDIO_LIST[idx].src);
            }

            console.log("count = " + count + " / dotNum = " + dotNum);
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
            return 'fill: ' + colors[Math.floor(Math.random() * colors.length)];
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
        .each("end", function () {
            p();
        });

    $('#download_button').click(function() {
        downloadImage();
    });

    function downloadImage() {
        var svgText = $('#svg')[0].innerHTML;
        canvg('canvas', svgText);

        var canvas = document.getElementById('canvas');
        canvas.toBlob(function (blob) {
            saveAs(blob, "code.png");
        }, "image/png");
    }
});