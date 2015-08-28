$(function() {

    var cellSize = 0,
        cellMaxSize = 1,
        format = d3.time.format("%Y-%m-%d");

    var colors = ['#ff0000', '#00ffff', '#ff8000', '#0080ff', '#ffff00', '#0000ff', '#80ff00', '#8000ff', '#00ff00', '#ff00ff', '#00ff80', '#ff0080'];
    var barPadding = 4;
    var dotNum = 10000;
    var dotRoot = Math.sqrt(dotNum);
    var datasets = new Array(dotNum);

    var width = dotRoot * cellMaxSize + (dotRoot - 1) * (barPadding - 1);
    var height = dotRoot * cellMaxSize + (dotRoot - 1) * (barPadding - 1);

    var AUDIO_LIST = {
        "se00": new Audio("sound/button70.mp3"),
    };

    var svg = d3.select("#svg")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

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
        .each("end", myCallback);

    function myCallback() {
        //console.log(Math.floor(new Date().getTime() / 1000));
        /*
         var data = "se00";
         AUDIO_LIST[data].play();
         AUDIO_LIST[data] = new Audio(AUDIO_LIST[data].src);
         */
    }

    $('#button').click(function() {
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