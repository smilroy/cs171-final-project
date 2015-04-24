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

    this.wrangleData();
    this.initVis();
    this.updateVis();
}

Trends.prototype.wrangleData = function() {
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

    that.x = d3.time.scale()
    	.range([0, that.width]);

    that.y0 = d3.scale.linear()
    	.range([that.height, 0]);

    that.y1 = d3.scale.linear()
    	.range([that.height, 0]);

    that.xAxis = d3.svg.axis()
    	.scale(that.x)
    	.orient("bottom");

    that.yAxisLeft = d3.svg.axis()
    	.scale(that.y)
    	.orient("left");

    that.yAxisRight = d3.svg.axis()
    	.scale(that.y)
    	.orient("right");

    that.line0 = d3.svg.line()
    	.x()
    	.y();

    that.line2 = d3.svg.line()
    	.x()
    	.y();

}

Trends.prototype.updateVis = function(){
    var that = this;

    that.x.domain();
    that.y0.domain();
    that.y1.domain();

    that.svg.select(".x.axis")
        .call(this.xAxis);

    that.svg.select(".y.axis")
        .call(this.yAxisLeft)

    that.svg.select(".y.axis")
        .call(this.yAxisRight)        

}

Trends.prototype.updateMetric = function(selection){
}