var svg = d3.select("svg");

d3.json("json/graph.json").then(function (data) {
    const varX = 100;
    const varY = 40;

    // Line between nodes
    var link = svg
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("x1", function (d) {
            return data.nodes[d.source].x * varX;
        })
        .attr("y1", function (d) {
            return data.nodes[d.source].y * varY;
        })
        .attr("x2", function (d) {
            return data.nodes[d.target].x * varX;
        })
        .attr("y2", function (d) {
            return data.nodes[d.target].y * varY;
        });

    //create circles, representing nodes
    var node = svg
        .selectAll("circle")
        .data(data.nodes)
        .enter()
        .append("circle")
        .attr("r", 18)
        .attr("cx", function (d) {
            return d.x * varX;
        })
        .attr("cy", function (d) {
            return d.y * varY;
        })

    //add label to the nodes
    var text = svg
        .selectAll("text")
        .data(data.nodes)
        .enter()
        .append("text")
        .attr("text-anchor", "middle")
        .text(function (d) {
            return d.name;
        })
        .attr("x", function (d) {
            return d.x * varX;
        })
        .attr("y", function (d) {
            return d.y * varY - 24;
        });


    const legendX = 850;
    const legendY = 50;
    const legendR = 10;

    //add legends for graph
    svg
        .append("circle")
        .attr("cx", legendX)
        .attr("cy", legendY + 30 * 0)
        .style("r", legendR)
        .style("fill", "rgb(204, 204, 70)")
        .style("stroke", "yellow")
        .style("stroke-width", 2);
    svg
        .append("circle")
        .attr("cx", legendX)
        .attr("cy", legendY + 30 * 1)
        .style("r", legendR)
        .style("fill", "rgb(122, 204, 231)")
        .style("stroke", "rgb(14, 160, 209)")
        .style("stroke-width", 3);
    svg
        .append("circle")
        .attr("cx", legendX)
        .attr("cy", legendY + 30 * 2)
        .style("r", legendR)
        .style("fill", "rgb(79, 255, 79)")
        .style("stroke", "rgb(0, 173, 0)")
        .style("stroke-width", 3);
    svg
        .append("line")
        .attr("x1", legendX - 10)
        .attr("x2", legendX + 10)
        .attr("y1", legendY + 30 * 3)
        .attr("y2", legendY + 30 * 3)
        .style("stroke", "rgb(167, 162, 162)")
        .style("stroke-width", "1");
    svg
        .append("line")
        .attr("x1", legendX - 10)
        .attr("x2", legendX + 10)
        .attr("y1", legendY + 30 * 4)
        .attr("y2", legendY + 30 * 4)
        .style("stroke", "rgb(255, 77, 77)")
        .style("stroke-width", "3");

    //add desciption text to legends
    svg
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * 0 + 5)
        .text("Location");
    svg
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * 1 + 5)
        .text("Source");
    svg
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * 2 + 5)
        .text("Destination");
    svg
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * 3 + 5)
        .text("Route");
    svg
        .append("text")
        .attr("x", legendX + 20)
        .attr("y", legendY + 30 * 4 + 5)
        .text("Best Route");

    //mark and color the starting node at page load (node-0 and node-1)
    markStartNode();

    //change radius of the circles in legend
    var legendCircle = document.getElementById("pathGraph").getElementsByTagName("svg")[0].getElementsByTagName("circle");

    legendCircle[legendCircle.length - 1].setAttribute("r", legendR);
    legendCircle[legendCircle.length - 2].setAttribute("r", legendR);
    legendCircle[legendCircle.length - 3].setAttribute("r", legendR);
});