/**
 * Created by Baishi Wu on 4/25/2015.
 */

var metrics = ["prevalence", "deaths"];

Trends = function(_parentElement, _aidsData, _country){
    this.parentElement = _parentElement;
    this.aidsData = _aidsData;
    this.country = _country;    
    this.metric = metrics[0];    
    this.duration = 500;
    this.margin = {top: 20, right: 50, bottom: 50, left: 50};
    this.width = 700 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;

    this.sum_all = [];
    this.sum_adolescent = [];

    this.wrangleData();
    this.initVis();
    this.updateVis();
}

Trends.prototype.wrangleData = function() {

    var that = this;

    var all_data = this.aidsData.filter(function(d) {
        return (d.sex_name == 'Both sexes' && d.location_name == 'India');
    //  return (d.sex_name == 'Both sexes' && d.location_name == that.country); 
    })

    that.sum_all = d3.nest().key(function(d){return d.year;})
        .rollup(function(leaves){return {"prevalence": d3.sum(leaves, function(d){return d.hiv_population_total;}), "deaths": d3.sum(leaves, function(d){return d.hiv_deaths_total;})};})
        .entries(all_data);

    var adolescent_data = this.aidsData.filter(function(d) {
        return (d.sex_name == 'Both sexes' && (d.age_group_name == '10-14' || d.age_group_name == '15-19'));
    })

    that.sum_adolescent = d3.nest().key(function(d){return d.year;})
        .rollup(function(leaves){return {"prevalence": d3.sum(leaves, function(d){return d.hiv_population_total;}), "deaths": d3.sum(leaves, function(d){return d.hiv_deaths_total;})};})
        .entries(adolescent_data);

}

Trends.prototype.initVis = function() {
    var that = this;
    
    that.svg = this.parentElement.append("svg")
        .attr("width", that.width + that.margin.left + that.margin.right)
        .attr("height", that.height + that.margin.top + that.margin.bottom)
    	.append("g")
        .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
    
    that.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ",0)");

    that.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + that.width + ",0)");
    
    that.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + that.height + ")")

    that.x = d3.scale.linear()
    	.range([0, that.width]);

    that.y0 = d3.scale.linear()
    	.range([that.height, 0]);

    that.y1 = d3.scale.linear()
    	.range([that.height, 0]);

    that.xAxis = d3.svg.axis()
    	.scale(that.x)
    	.orient("bottom");

    that.yAxisLeft = d3.svg.axis()
    	.scale(that.y0)
    	.orient("left");

    that.yAxisRight = d3.svg.axis()
    	.scale(that.y1)
    	.orient("right");

}

Trends.prototype.updateVis = function(){
    var that = this;

    that.x.domain([1990, 2010]);
    that.y0.domain([0, d3.max(that.sum_all, function(d) {return d.values[that.metric];})]);
    that.y1.domain([0, d3.max(that.sum_adolescent, function(d) {return d.values[that.metric];})]);
    
    var line0 = d3.svg.line()
        .x(function(d) {return that.x(d.key)})
        .y(function(d) {return that.y0(d.values[that.metric])});

    var line1 = d3.svg.line()
        .x(function(d) {return that.x(d.key)})
        .y(function(d) {return that.y1(d.values[that.metric])});

    var path0 = that.svg.append("path")
        .attr("d", function(d) {return line0(that.sum_all)})

    var path1 = that.svg.append("path")
        .attr("d", function(d) {return line1(that.sum_adolescent)})

    // ENTER

    // AXES

    that.svg.select(".x.axis")
        .call(that.xAxis)

    that.svg.select(".y.axis")
        .call(that.yAxisLeft)

    that.svg.select(".y.axis")
        .call(that.yAxisRight)

}

/**
 * Update object metric parameter
 */
Trends.prototype.updateMetric = function(selection){
    if(selection == metrics[0])
        this.metric = metrics[0];
    else
        this.metric = metrics[1];

    this.updateVis();
}

/**
 * Update object country parameter
 */
Trends.prototype.onSelectionChange = function(country){
    this.country = country;
    this.wrangleData();
    this.updateVis();
}