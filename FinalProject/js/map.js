/**
 * Created by Sabina Prajapati on 4/6/2015.
 */

var metrics = ["prevalence", "deaths"];

Map = function(_parentElement, _data, _aidsData, _eventHandler){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metric = metrics[0];
    this.aidsData = _aidsData;
    this.margin = {top: 20, right: 20, bottom: 20, left: 0};
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;
    this.eventHandler = _eventHandler;
    this.initMap();
}

/**
 * Filter data as necessary
 * by year and metric
 * @param selectedYear
 */
Map.prototype.wrangleData = function()
{
    var that = this;
    var total_prevalence = d3.sum(that.data.features, function(d){return d.properties.aids_prevalence});
    var total_deaths = d3.sum(that.data.features, function(d){return d.properties.aids_deaths});
     // Add ratio for deaths and prevalence
    that.data.features.forEach(function (d){
        console.log(d.properties.name);
        var prevalence_ratio = 0, death_ratio = 0;
        if(total_prevalence > 0)
            d.properties.prevalence_ratio = d.properties.aids_prevalence/total_prevalence * 100;
        else
            d.properties.prevalence_ratio = 0;
        if(total_deaths > 0)
            d.properties.death_ratio = d.properties.aids_deaths/total_deaths * 100;
        else
            d.properties.death_ratio = 0;
    })
     var prevalence_ratio_range = d3.extent(that.data.features, function(d){return d.properties.prevalence_ratio})

}

Map.prototype.initMap = function() {
    var projection = d3.geo.mercator().translate([this.width / 2 , this.height / 2]).scale([100]);

    this.path = d3.geo.path().projection(projection);

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    // Color Scale
    this.color = d3.scale.quantize().range(colorbrewer.Oranges[6]);

    this.wrangleData();
    this.update();
}

Map.prototype.update = function(){
    var that = this;

    // Set domain for scale
    if(this.metric == metrics[0])
    {
        this.color.domain(d3.extent(that.data.features, function (d) {
            return d.properties.prevalence_ratio
            }
        ));

    }
    else
    {
        this.color.domain(d3.extent(that.data.features, function (d) {return d.properties.death_ratio}));
    }

    // Update vis
    this.updateVis();
}

Map.prototype.updateVis = function(){
    var that = this;
    d3.selectAll(".c_path").remove();
    d3.selectAll(".l_text").remove();
    this.svg.selectAll("path")
        .data(that.data.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .attr("class", "c_path")
        .attr("id", function(d){return d.properties.name;})
        .style("fill", function(d) {
            if(that.metric == metrics[0])
                return that.color(d.properties.prevalence_ratio);
            else
                return that.color(d.properties.death_ratio);
       })
       .on("click", function (d){
            //Add event handler to update population chart
            $(that.eventHandler).trigger("selectionChanged", d.properties.name);
        })
        // Add mouseover event or click event to the path
        .on("mouseover", function (d){
            // Update tooltip
            var data;
            if(that.metric == metrics[0]) {
                data = "Prevalence: " + d3.format(',')(d.properties.aids_prevalence);
            }
            else{
                data = "Deaths: " + d3.format(',')(d.properties.aids_deaths);
            }
            d3.select(".tooltip").transition()
                .duration(20)
                .style("opacity", .9);
            d3.select(".tooltip").html(d.properties.name + "<br/>"  + data + "<br/>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function (d){
            // Remove tooltip
            d3.select(".tooltip").transition()
                .duration(50)
                .style("opacity", 0);
        });
    var color_range = colorbrewer.Oranges[6].map(function(d, i){
        return that.color.invertExtent(d);
    })

    this.svg.selectAll("rect").data(color_range).enter().append("rect")
        .attr("x", function (d) { return 0;})
        .attr("width", function(d){return 10;})
        .style("fill", function(d,i) {
            return  colorbrewer.Oranges[6][i];
        })
        .transition()
        .attr("height", function (d){
           return 8;
        })
        .attr("y", function(d, i) {
                return i * 10 + 250;
        });

    this.svg.selectAll("text").data(color_range).enter().append("text").attr("class", "l_text")
     .text(function(d, i){
        return d3.round(d[0], 1) + " - " +d3.round(d[1], 1) + " %";
     })
     .attr("x", 15)
     .attr("y", function(d, i){
     return i * 10 + 258;
     })
     .style("font-size", 9);

    // Add legend info
    this.svg.append("g").append("text").text("% contribution on overall").attr("class", "l_info").attr("x", 0).attr("y", 230);
    this.svg.append("g").append("text").text("adolescent AIDS burden").attr("class", "l_info").attr("x", 0).attr("y", 240);
}

Map.prototype.updateMetric = function(selection){
    if(selection == metrics[0])
        this.metric = metrics[0];
    else
        this.metric = metrics[1];
    this.update();
}


Map.prototype.updateYear= function(selection, updatedData){
    this.data = updatedData;
    this.wrangleData();
    this.update();
}