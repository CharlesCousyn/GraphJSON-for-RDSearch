let data;



let bubbleChart = function () {
    let width = 600;
    let height = 400;

    function chart(selection)
    {
        // you gonna get here
        let data = selection.datum();
        let svg = selection.selectAll('svg');

        let scaleRadius = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return +d.Recall; }),
                d3.max(data, function(d) { return +d.Recall; })])
            .range([5,18]);


        let simulation = d3.forceSimulation(data)
            .force("charge", d3.forceManyBody().strength([-50]))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
            .on("tick", ticked);


        let node = svg
            .selectAll("circle")
            .data(data.perDisease)
            .enter()
            .append("circle")
            .attr('r', d => scaleRadius(d.Recall));
    }

    chart.width = value =>
    {
        if (!arguments.length) { return width; }
        width = value;

        return chart;
    };

    chart.height = value =>{
        if (!arguments.length) { return height; }
        height = value;

        return chart;
    };

    return chart;
};


function ticked(e) {
    node.attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; });
}


window.onload = ()=>
{
    document.getElementById('loadResults').addEventListener(
        'change',
        evt =>
        {
            let files = evt.target.files;
            let file = files[0];
            let reader = new FileReader();
            reader.onload = event =>
            {
                let data = JSON.parse(event.target.result);
                let monChar = bubbleChart();

                //Config monChar
                d3.select("#chart").data(data.perDisease).call(monChar);


            };
            reader.readAsText(file)
        },
        false);
};