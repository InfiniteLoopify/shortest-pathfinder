var graph = [

    /*0. Gulistan-e-Johar*/
    [0.00, 6.80, 0.00, 8.20, 0.00, 0.00, 0.00, 14.8, 0.00, 0.00],

    /*1. Gulshan-e-Iqbal*/
    [6.80, 0.00, 0.00, 11.4, 0.00, 3.50, 0.00, 11.1, 0.00, 0.00],

    /*2. Malir*/
    [0.00, 0.00, 0.00, 7.70, 0.00, 0.00, 0.00, 0.00, 23.0, 0.00],

    /*3. Shah Faisal Town*/
    [8.20, 11.4, 7.70, 0.00, 0.00, 0.00, 0.00, 16.5, 0.00, 0.00],

    /*4. North Nazimabad*/
    [0.00, 0.00, 0.00, 0.00, 0.00, 5.50, 0.00, 11.3, 0.00, 8.40],

    /*5. F.B. Area*/
    [0.00, 3.50, 0.00, 0.00, 5.50, 0.00, 0.00, 11.2, 0.00, 11.2],

    /*6. Clifton*/
    [0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 4.90, 0.00, 0.00],

    /*7. Saddar*/
    [14.8, 11.1, 0.00, 16.5, 11.3, 11.2, 4.90, 0.00, 0.00, 0.00],

    /*8. Gulshan-e-Hadeed*/
    [0.00, 0.00, 23.0, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.00],

    /*9. New Karachi*/
    [0.00, 0.00, 0.00, 0.00, 8.40, 11.2, 0.00, 0.00, 0.00, 0.00]
];

var graphSize = graph.length;

//display graph matrix on colsole
function logGraph() {
    for (var i = 0; i < graphSize; ++i) {
        var combinedRow = "";
        for (var j = 0; j < graphSize; ++j) {
            combinedRow += (graph[i][j].toPrecision(3) + "\t");
        }
        console.log(combinedRow);
    }
    console.log("\n");
}

logGraph();

//=============================================
//On Event function links
//=============================================

//when window is loaded
window.onload = function () {
    hideStartDest()
}

//when calculate button is clicked
document.getElementById("calc").onclick = function () {
    dijkstra(document.getElementById("source").value, document.getElementById("dest").value),
        markLine(),
        showInfo()
};

//=============================================
//Dijkstra Algo
//=============================================

//find min distance to all neighbours in dijkstra algo
function minDistance(distance, spt) {
    var min = Infinity;
    var minIndex;
    for (var i = 0; i < graphSize; ++i) {
        if (spt[i] == false && distance[i] <= min) {
            min = distance[i];
            minIndex = i;
        }
    }
    return minIndex;
}

//global arrays to hold graph data
var graphDistance = [];
var graphSpt = [];
var graphParent = [];
var graphCheckpoint = [];

//calculates the shortest distance from source to all nodes
function dijkstra(src, dest) {
    graphDistance = [];
    graphSpt = [];
    graphParent = [];
    graphCheckpoint = [];

    for (var i = 0; i < graphSize; ++i) {
        graphDistance.push(Infinity);
        graphSpt.push(false);
        graphParent.push(0);
    }
    graphDistance[src] = 0;

    for (var i = 0; i < graphSize - 1; ++i) {
        var u = minDistance(graphDistance, graphSpt);
        graphSpt[u] = true;

        for (var v = 0; v < graphSize; ++v)
            if (graphSpt[v] == false && graph[u][v] != 0 && graphDistance[u] != Infinity && graphDistance[u] + graph[u][v] < graphDistance[v]) {
                graphDistance[v] = graphDistance[u] + graph[u][v];
                graphParent[v] = u;
            }
    }
    var temp = dest;
    while (temp != src) {
        graphCheckpoint.push(temp);
        temp = graphParent[temp];
    }
    graphCheckpoint.push(src);
    graphCheckpoint = graphCheckpoint.reverse();

    logData(src, dest);
}

//display data on console
function logData(src, dest) {
    console.log("=====================================================\n");

    console.log("Vertex\tDistance");
    for (var i = 0; i < graphSize; ++i) {
        console.log(i + "\t\t" + graphDistance[i].toPrecision(3));
    }

    console.log("\nParent Array:");
    console.log(graphParent);
    console.log("\nSrc\tDest\n" + src + "\t" + dest);

    var combinedDist = "";
    for (var i = 0; i < graphCheckpoint.length - 1; ++i) {
        combinedDist += graph[graphCheckpoint[i]][graphCheckpoint[i + 1]] + " ";
        if (i + 2 != graphCheckpoint.length) {
            combinedDist += "+ ";
        } else {
            combinedDist += "= ";
        }
    }
    console.log("\nDistance: \n" + combinedDist + graphDistance[dest] + "km");

    console.log("\nGraph Path\n" + graphCheckpoint);
}

//=============================================
//Dropdown Option hide/show
//=============================================

var g_sourceValPrev = 0;
var g_destValPrev = 1;
var isPathMarked = false;

//hide node-1 for source and node-0 for dest 
function hideStartDest() {
    document.getElementById("source").value = g_sourceValPrev;
    document.getElementById("source").options[g_destValPrev].disabled = true;
    document.getElementById("dest").value = g_destValPrev;
    document.getElementById("dest").options[g_sourceValPrev].disabled = true;
}

//hide same elements in dropdown menu
function hideSameDest(menuCicked) {
    var sourceVal = document.getElementById("source").value;
    var destVal = document.getElementById("dest").value;

    document.getElementById("dest").options[g_sourceValPrev].disabled = false;
    document.getElementById("dest").options[sourceVal].disabled = true;

    document.getElementById("source").options[g_destValPrev].disabled = false;
    document.getElementById("source").options[destVal].disabled = true;

    if (isPathMarked && (
            ((sourceVal != g_sourceValPrev) && !menuCicked) ||
            ((destVal != g_destValPrev) && menuCicked)
        )) {
        var line = document.getElementById("pathGraph").getElementsByTagName("line");
        for (var i = 0; i < line.length; ++i) {
            if (line[i].style.strokeWidth >= "4") {
                // line[i].style.strokeWidth = "1";
                lineWidthDecrease(line[i], 4, 1, 0.03);
                line[i].style.stroke = "rgb(167, 162, 162)";
            }
        }
        isPathMarked = false;
    }

    g_sourceValPrev = sourceVal;
    g_destValPrev = destVal;
}

//generate google directions link from source to destination
function generateGoogleLink() {

    /* https://www.google.com/maps/dir/Gulistan-e-Johar,+Karachi/Gulshan-e-Iqbal,+Karachi/ */

    var link = "https://www.google.com/maps/dir/";
    var city = ",+Karachi/";

    var src = document.getElementById("source")[document.getElementById("source").value];
    var dest = document.getElementById("dest")[document.getElementById("dest").value];

    link += src.innerHTML.replace(/ /g, '+') + city;
    link += dest.innerHTML.replace(/ /g, '+') + city;

    document.getElementById("googleLink").href = link;
}

//=============================================
//Change color of source and dest nodes
//=============================================

var prevMarkedSource = 0;
var prevMarkedDest = 1;

var prevNodeColor = [
    "rgb(204, 204, 70)",
    "yellow",
    "3px"
]
var sourceNodeColor = [
    "rgb(122, 204, 231)",
    "rgb(14, 160, 209)",
    "4px"
]
var destNodeColor = [
    "rgb(79, 255, 79)",
    "rgb(0, 173, 0)",
    "4px"
]

//change node-0 (src) and node-1 (dest) colors
function markStartNode() {
    var node = document.getElementById("pathGraph").getElementsByTagName("circle");

    node[0].style.fill = sourceNodeColor[0];
    node[0].style.stroke = sourceNodeColor[1];
    node[0].style.strokeWidth = sourceNodeColor[2];

    node[1].style.fill = destNodeColor[0];
    node[1].style.stroke = destNodeColor[1];
    node[1].style.strokeWidth = destNodeColor[2];
}

//change nodes color according to options selected
function markNode(nodeType) {
    var nodeVal = document.getElementById(nodeType).value;
    var node = document.getElementById("pathGraph").getElementsByTagName("circle");

    var colorRef;
    var markedRef;
    if (nodeType == "source") {
        colorRef = sourceNodeColor;
        markedRef = prevMarkedSource;
    } else if (nodeType == "dest") {
        colorRef = destNodeColor;
        markedRef = prevMarkedDest;
    } else {
        console.log("invalid nodeType entered in markNode Function");
        return -1;
    }

    if (nodeVal != markedRef) {
        circleFadeOut(node[nodeVal], colorRef);
        setTimeout(function () {
            circleFadeIn(node[nodeVal])
        }, 500);

        circleFadeOut(node[markedRef], prevNodeColor);
        setTimeout(function () {
            circleFadeIn(node[markedRef])
        }, 500);
    }

    if (nodeType == "source") {
        prevMarkedSource = nodeVal;
    } else {
        prevMarkedDest = nodeVal;
    }
}

//=============================================
// Calculate button
//=============================================

//change line color for path
function markLine() {
    var node = document.getElementById("pathGraph").getElementsByTagName("circle");
    var line = document.getElementById("pathGraph").getElementsByTagName("line");

    isPathMarked = true;

    for (var i = 0; i < graphCheckpoint.length - 1; ++i) {
        var sourcePos = [
            node[graphCheckpoint[i]].getAttribute("cx"),
            node[graphCheckpoint[i]].getAttribute("cy")
        ]
        var destPos = [
            node[graphCheckpoint[i + 1]].getAttribute("cx"),
            node[graphCheckpoint[i + 1]].getAttribute("cy")
        ]
        for (var j = 0; j < line.length; ++j) {
            if ((sourcePos[0] === line[j].getAttribute("x1") &&
                    sourcePos[1] === line[j].getAttribute("y1") &&
                    destPos[0] === line[j].getAttribute("x2") &&
                    destPos[1] === line[j].getAttribute("y2")) ||
                (sourcePos[0] === line[j].getAttribute("x2") &&
                    sourcePos[1] === line[j].getAttribute("y2") &&
                    destPos[0] === line[j].getAttribute("x1") &&
                    destPos[1] === line[j].getAttribute("y1"))) {
                // line[j].style.strokeWidth = "4";
                lineWidthIncrease(line[j], 0, 4, 0.03);
                line[j].style.stroke = "rgb(255, 77, 77)";
            }
        }
    }
}

//display best path and distance on screen
function showInfo() {
    var opt = document.getElementById("source").getElementsByTagName("option");
    var path = document.getElementById("info").getElementsByTagName("p");
    //document.getElementById("123").innerHTML = "1245f";

    path[0].innerHTML = "";
    for (var i = 0; i < graphCheckpoint.length; ++i) {
        path[0].innerHTML += opt[graphCheckpoint[i]].innerHTML.replace(/ /g, '-') + "&nbsp&nbsp";
        if (i + 1 != graphCheckpoint.length) {
            path[0].innerHTML += "&#8594;&nbsp&nbsp";
        }
    }

    //var replaced = str.replace(' ', '+');
    path[1].innerHTML = "";
    path[1].innerHTML += graphDistance[document.getElementById("dest").value].toPrecision(3) + " km";
}

//=============================================
// Animations
//=============================================

//fade out the circle opacity and change its color to new color
function circleFadeOut(circle, colorRef) {
    var op = 1;
    var id = setInterval(frame, 10);

    function frame() {
        if (op <= 0.1) {
            clearInterval(id);
            circle.style.fill = colorRef[0];
            circle.style.stroke = colorRef[1];
            circle.style.strokeWidth = colorRef[2];
        } else {
            circle.style.opacity = op;
            op -= 0.02;
        }
    }
}

//fade in the circle opacity
function circleFadeIn(circle) {
    var op = 0.1;
    var id = setInterval(frame, 10);

    function frame() {
        if (op >= 1) {
            clearInterval(id);
        } else {
            circle.style.opacity = op;
            op += 0.02;
        }
    }
}

//increase line width gradually
function lineWidthIncrease(line, start, end, step) {
    var id = setInterval(frame, 10);

    function frame() {
        if (start >= end) {
            clearInterval(id);
        } else {
            start += step;
            line.style.strokeWidth = start;
        }
    }
}

//decrease line width gradually
function lineWidthDecrease(line, start, end, step) {
    var id = setInterval(frame, 10);

    function frame() {
        if (start <= end) {
            clearInterval(id);
        } else {
            start -= step;
            line.style.strokeWidth = start;
        }
    }
}

//=============================================
// Google Map API
//=============================================

/* function initMap() {
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 7,
        center: {
            lat: 41.85,
            lng: -87.65
        }
    });
    directionsDisplay.setMap(map);

    var onChangeHandler = function () {
        calculateAndDisplayRoute(directionsService, directionsDisplay);
    };
    document.getElementById('source').addEventListener('change', onChangeHandler);
    document.getElementById('dest').addEventListener('change', onChangeHandler);
}

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
    directionsService.route({
        origin: document.getElementById('source').innerHTML + ", Karachi",
        destination: document.getElementById('dest').innerHTML + ", Karachi",
        travelMode: 'DRIVING'
    }, function (response, status) {
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
} */