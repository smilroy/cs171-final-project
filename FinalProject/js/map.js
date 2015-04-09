/**
 * Created by Sabina Prajapati on 4/6/2015.
 */

var metrics = ["prevalence", "deaths"];

Map = function(_parentElement, _data, _aidsData){
    this.parentElement = _parentElement;
    this.data = _data;
    this.metric = metrics[0];
    this.aidsData = _aidsData;
    this.margin = {top: 20, right: 20, bottom: 20, left: 5};
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 600 - this.margin.top - this.margin.bottom;
    this.initMap();

}

Map.prototype.wrangleData = function(selectedYear)
{
    var that = this;
    // Filter ages between 10-19 and remove global data
    // Also filter by selectedYear and prevalence or deaths
   // var metric = "Deaths";
   // if(isPrevalence)
    //    metric = "Prevalence";
    var adolescentData = that.aidsData.filter(function(d){
        return (d.age_group_name == "10 to 14" || d.age_group_name == "15 to 19") && d.location_name !=  "Global"
            && d.location_name != "Developed" && d.location_name != "Developing" && d.location_name != "High-income"
            && d.sex_name == "Both sexes" && d.year == selectedYear; //&& d.metric == metric;
    })
    console.log("Filtered Data" + adolescentData);

    // For each country iterate through adolescentData
    that.data.features.forEach(function (d){
        var prevalence_count = 0;
        var death_count = 0;
        adolescentData.forEach(function (a){
            if(a.location_name == d.properties.name)
            {
                if(a.metric == "Prevalence")
                    prevalence_count = prevalence_count + parseFloat(a.mean);
                else
                    death_count = death_count + parseFloat(a.mean);
            }
        })
        d.properties.aids_prevalence = prevalence_count;
        d.properties.aids_deaths = death_count;
    })

    console.log(that.data);

}

Map.prototype.initMap = function() {
    var projection = d3.geo.mercator().translate([this.width / 2, this.height / 2]).scale([100]);
    //var projection = d3.geo.equirectangular().translate([this.width / 2, this.height / 2]).scale([100]);
    this.path = d3.geo.path().projection(projection);

    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
    console.log(this.data.features);
    var colorMin = colorbrewer.Greens[3][0];
    var colorMax = colorbrewer.Greens[3][2];
    // Color Scale
    this.color = d3.scale.quantize().range(colorbrewer.Reds[7]);

    this.wrangleData("2013");
    this.update();
}

Map.prototype.update = function(){
    var that = this;
    // Set domain for scale
    if(this.metric == metrics[0])
        this.color.domain(d3.extent(that.data.features, function (d) {return d.properties.aids_prevalence}));
    else
        this.color.domain(d3.extent(that.data.features, function (d) {return d.properties.aids_deaths}));
    // Update vis
    this.initVis();
}

Map.prototype.initVis = function(){
   var that = this;

    this.svg.selectAll("path")
        .data(that.data.features)
        .enter()
        .append("path")
        .attr("d", this.path)
        .style("fill", function(d) {
            if(that.metric == metrics[0])
                return that.color(d.properties.aids_prevalence);
            else
                return that.color(d.properties.aids_deaths);
       })
        // Add mouseover event or click event to the path
        .on("mouseover", function (d){
        console.log(d.properties.name);
        })
       // .on("click", function (d){
            //console.log(d.properties.name);
       // })

}

Map.prototype.updateMetric = function(selection){
    if(selection == metrics[0])
        this.metric = metrics[0];
    else
        this.metric = metrics[1];
    console.log(this.metric);
    this.update();
}
