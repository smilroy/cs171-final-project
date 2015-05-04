/**
 * Created by Shannon Milroy on 4/22/2015.
 */

var metrics = ["prevalence", "deaths"];

Population = function(_parentElement, _aidsData, _year, _country){
    //Initialize object parameters
    this.parentElement = _parentElement;
    this.year = _year;
    this.country = _country;
    this.metric = metrics[0];
    this.aidsData = _aidsData;
    this.popData = [];
    this.duration = 500;
    this.margin = {top: 20, right: 50, bottom: 50, left: 50};
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 300 - this.margin.top - this.margin.bottom;
    this.barWidth = Math.floor(this.width/17) - 1;
    this.ageGroups = ["0-4", "5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+"];
    
    //Create scales
    this.x = d3.scale.ordinal()
                .domain(this.ageGroups)
                .rangeRoundBands([0,this.width], 0.05);
    
    this.y = d3.scale.linear()
                .range([this.height,0]);
    
    this.yAxis = d3.svg.axis()
                    .scale(this.y)
                    .orient("left")
                    .tickSize(-this.width)
                    .tickFormat(function(d) {
                        if(d>=10){
                            return d3.format(',')(d3.round(d,0));
                        }else{
                            return d3.format(',')(d3.round(d,2));    
                        }
                    });
    
    this.xAxis = d3.svg.axis()
                    .scale(this.x)
                    .orient("bottom");
    
    //Run object functions
    this.wrangleData();
    this.initVis();
    this.updateVis();
}

/**
 * Filter data as necessary
 * by year, metric and country
 */
Population.prototype.wrangleData = function()
{
    var that = this;
    
    //Filter by year and country
    if(this.country=="Global"){
        var year_data = this.aidsData.filter(function(d){
                return (d.year==that.year && d.sex_name!= "Both sexes");
        })    
    }else{
        var year_data = this.aidsData.filter(function(d){
                return (d.year==that.year && d.sex_name!= "Both sexes" && d.location_name==that.country);
        })
    }
    
    //Create sex specific datasets and set data to 0 if no country data
    if(year_data.length==0){
        var year_data = this.aidsData.filter(function(d){
                return (d.year==that.year && d.sex_name!= "Both sexes");});
            
        var sumData = d3.nest().key(function(d){return d.sex_name;})
                        .key(function(d){return d.age_group_name;})
                        .rollup(function(leaves){return {"prevalence": d3.sum(leaves, function(d){return d.hiv_population_total;}), "deaths": d3.sum(leaves, function(d){return d.hiv_deaths_total;})};})
                        .entries(year_data);
        
        sumData[0].values.forEach(function(d){d.values.prevalence=0; d.values.deaths=0;})
        sumData[1].values.forEach(function(d){d.values.prevalence=0; d.values.deaths=0;})
        that.popData = {females: sumData[0].values, males: sumData[1].values};
            
    }else{
        var sumData = d3.nest().key(function(d){return d.sex_name;})
                        .key(function(d){return d.age_group_name;})
                        .rollup(function(leaves){return {"prevalence": d3.sum(leaves, function(d){return d.hiv_population_total;}), "deaths": d3.sum(leaves, function(d){return d.hiv_deaths_total;})};})
                        .entries(year_data);
        
        that.popData = {females: sumData[0].values, males: sumData[1].values};
    }
}

/**
 * Initialize the graph visualization
 */

Population.prototype.initVis = function() {
    var that = this;
    
    //Create SVG graph container
    that.svg = this.parentElement.append("svg")
                    .attr("width", that.width + that.margin.left + that.margin.right)
                    .attr("height", that.height + that.margin.top + that.margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + that.margin.left + "," + that.margin.top + ")");
    
    //Add y axis
    that.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + ",0)");
    
    //Add x axis
    that.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
    
    //Add title
    that.svg.append("text")
        .attr("class", "title")
        .attr("x", (that.width/2))
        .attr("y", 0 - (that.margin.top/2))
        .attr("text-anchor", "middle")
    
    //Add legend
    that.legend = that.svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(" + that.width/3 + "," + 0 + ")");
    
    that.legend.selectAll("rect").data(["#f4a582", "#4393c3"]).enter().append("rect")
        .attr("x", function(d,i){return (that.width/5) * i})
        .attr("width", 10)
        .style("fill", function(d) {return  d;})
        .attr("height", 10)
        .attr("y", that.height + (that.margin.bottom/1.5));
    
    that.legend.selectAll("text").data(["Female", "Male"]).enter().append("text")
        .attr("x", function(d,i){return (that.width/5) * i + 15})
        .attr("width", 10)
        .attr("height", 10)
        .text(function(d) {return  d;})
        .attr("y", that.height + (that.margin.bottom/1.19));
}

/**
 * Update the visualization 
 * when changes are made to metric, year or country
 */

Population.prototype.updateVis = function(){
    var that = this;

    //Update chart title
    d3.selectAll("text.title")
        .text(that.country + ": " + "HIV " + that.metric + ", by age group and sex");
    
    //Find maximum bar value and set y axis domain
    max_female = d3.max(that.popData['females'], function(d){return d.values[that.metric];});
    max_male = d3.max(that.popData['males'], function(d){return d.values[that.metric];});
    that.y.domain([0, d3.max([max_female,max_male])]);
    
    //Update data bind
    var barsMale = that.svg
                     .selectAll("rect.barMale")
                     .data(that.popData['males'], function(d){return d.key;});
    
    var barsFemale = that.svg
                     .selectAll("rect.barFemale")
                     .data(that.popData['females'], function(d){return d.key;});
    
   

    //ENTER new data elements
    var barEnterMale = barsMale.enter()
                             .append("rect")
                             .attr("class","barMale")
                            .attr("x", function(d) {return that.x(d.key);})
                            .attr("y", function(d) {return that.y(d.values[that.metric]);})
                             .attr("height", function(d){return that.height - that.y(d.values[that.metric]);})
                            .attr("width", that.barWidth)
                            .attr("fill", "#4393c3")
                            .attr("opacity", "0.6");
    
    var barEnterFemale = barsFemale.enter()
                             .append("rect")
                             .attr("class","barFemale")
                            .attr("x", function(d) {return that.x(d.key);})
                            .attr("y", function(d) {return that.y(d.values[that.metric]);})
                             .attr("height", function(d){return that.height - that.y(d.values[that.metric]);})
                            .attr("width", that.barWidth)
                            .attr("fill", "#f4a582")
                            .attr("opacity", "0.6");
            
           
    //ENTER + UPDATE data elements
    barsMale.transition()
         .duration(this.duration)
         .attr("y", function(d) {return that.y(d.values[that.metric]);})
         .attr("height", function(d){return that.height - that.y(d.values[that.metric]);});
    
     barsFemale.transition()
         .duration(this.duration)
         .attr("y", function(d) {return that.y(d.values[that.metric]);})
         .attr("height", function(d){return that.height - that.y(d.values[that.metric]);});
    
    //Exit data elements
    barsMale.exit()
        .transition()
        .duration(this.duration)
        .attr("height",0)
        .remove();
    
    barsFemale.exit()
        .transition()
        .duration(this.duration)
        .attr("height",0)
        .remove();
    
    //Call axes
    this.svg.select(".y")
        .call(this.yAxis)
    
    this.svg.select(".y").selectAll("g")
            .filter(function(d){return d;})
            .classed("grid", true);
    
    this.svg.select(".x")
        .call(this.xAxis)
        .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-45)");
    
}

/**
 * Update object metric parameter
 */
Population.prototype.updateMetric = function(selection){
    if(selection == metrics[0])
        this.metric = metrics[0];
    else
        this.metric = metrics[1];

    this.updateVis();
}

/**
 * Update object year parameter
 */
Population.prototype.updateYear= function(selection){
    this.year = selection;
    this.wrangleData();
    this.updateVis();
}

/**
 * Update object country parameter
 */
Population.prototype.onSelectionChange= function(country){
    this.country = country;
    this.wrangleData();
    this.updateVis();
}