/**
 * Created by Shannon Milroy on 4/22/2015.
 */

var metrics = ["prevalence", "deaths"];

Population = function(_parentElement, _aidsData, _year, _country){
    this.parentElement = _parentElement;
    this.year = _year;
    this.country = _country;
    this.metric = metrics[0];
    this.aidsData = _aidsData;
    this.popData = [];
    this.duration = 500;
    this.margin = {top: 20, right: 50, bottom: 50, left: 50};
    this.width = 500 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;
    this.barWidth = Math.floor(this.width/17) - 1;
    this.ageGroups = ["0-4", "5-9","10-14","15-19","20-24","25-29","30-34","35-39","40-44","45-49","50-54","55-59","60-64","65-69","70-74","75-79","80+"];
    this.sexNames = ["Females","Males","Both sexes"]
    
    this.x = d3.scale.ordinal()
                .domain(this.ageGroups)
                .rangeRoundBands([0,this.width], 0.05);
    
    this.y = d3.scale.linear()
                .range([this.height,0]);
    
    this.yAxis = d3.svg.axis()
                    .scale(this.y)
                    .orient("left")
                    .tickSize(-this.width)
                    .tickFormat(function(d) {return Math.round(d/1e04) + "K";});
    
    this.xAxis = d3.svg.axis()
                    .scale(this.x)
                    .orient("bottom");

    this.wrangleData();
    this.initVis();
    this.updateVis();
}

/**
 * Filter data as necessary
 * by year and metric
 * @param selectedYear
 */
Population.prototype.wrangleData = function()
{
    var that = this;
    
    if(this.country=="world"){
        var year_data = this.aidsData.filter(function(d){
                return (d.year==that.year && d.sex_name!= "Both sexes");
        })    
    }else{
        var year_data = this.aidsData.filter(function(d){
                return (d.year==that.year && d.sex_name!= "Both sexes" && d.location_name==this.country);
        })
    }
       
    
    var sumData = d3.nest().key(function(d){return d.sex_name;})
                        .key(function(d){return d.age_group_name;})
                        .rollup(function(leaves){return {"prevalence": d3.sum(leaves, function(d){return d.hiv_population_total;}), "deaths": d3.sum(leaves, function(d){return d.hiv_deaths_total;})};})
                        .entries(year_data);
    
    that.popData = {females: sumData[0].values, males: sumData[1].values};
}

Population.prototype.initVis = function() {
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
        .attr("class", "x axis")
        .attr("transform", "translate(0," + this.height + ")")
}

Population.prototype.update = function(){
    
    

}

Population.prototype.updateVis = function(){
    var that = this;
    
    max_female = d3.max(that.popData['females'], function(d){return d.values[that.metric];});
    max_male = d3.max(that.popData['males'], function(d){return d.values.hiv_population_total;});
    that.y.domain([0, d3.max([max_female,max_male])]);
    
    // updates graph
    var barsFemale = that.svg
                     .selectAll("rect.barFemale")
                     .data(that.popData['females'], function(d){return d.key;});
    
    var barsMale = that.svg
                     .selectAll("rect.barMale")
                     .data(that.popData['males'], function(d){return d.key;});

    // ENTER
        var barEnterFemale = barsFemale.enter()
                             .append("rect")
                             .attr("class","barFemale")
                            .attr("x", function(d) {return that.x(d.key);})
                            .attr("y", function(d) {return that.y(d.values[that.metric]);})
                             .attr("height", function(d){return that.height - that.y(d.values[that.metric]);})
                            .attr("width", that.barWidth);
    
      
    var barEnterMale = barsMale.enter()
                             .append("rect")
                             .attr("class","barMale")
                            .attr("x", function(d) {return that.x(d.key);})
                            .attr("y", function(d) {return that.y(d.values[that.metric]);})
                             .attr("height", function(d){return that.height - that.y(d.values[that.metric]);})
                            .attr("width", that.barWidth);
            
           
    //ENTER + UPDATE
    barsFemale.transition()
         .duration(this.duration)
         .attr("y", function(d) {return that.y(d.values[that.metric]);})
         .attr("height", function(d){return that.height - that.y(d.values[that.metric]);});
    
    barsMale.transition()
         .duration(this.duration)
         .attr("y", function(d) {return that.y(d.values[that.metric]);})
         .attr("height", function(d){return that.height - that.y(d.values[that.metric]);});
    
    //Exit
    barsFemale.exit()
        .transition()
        .duration(this.duration)
        .attr("height",0)
        .remove();
    
    barsMale.exit()
        .transition()
        .duration(this.duration)
        .attr("height",0)
        .remove();
    
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

Population.prototype.updateMetric = function(selection){
    
//    this.update();
}


Population.prototype.updateYear= function(selection, updatedData){
//    this.data = updatedData;
//    this.wrangleData();
//    this.update();
}