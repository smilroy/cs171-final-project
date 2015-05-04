/**
 * Created by Sabina Prajapati on 4/15/2015.
 * Script for Info Visualization
 */
var metrics = ["prevalence", "deaths"];
var formatter = d3.format(".2s");
Info = function(_parentElement, _selectedYear, _totalPrevalence, _totalDeaths, _totalPopPrevalence, _totalPopDeaths){
    this.parentElement = _parentElement;
    this.year = _selectedYear;
    this.totalPrevalence = _totalPrevalence;
    this.totalDeaths = _totalDeaths;
    this.totalPopulationPrevalence =  _totalPopPrevalence;
    this.totalPopulationDeaths = _totalPopDeaths;
    this.metric = metrics[0];
    this.margin = {top: 50, right: 5, bottom: 5, left: 0};
    this.width = 600 - this.margin.left - this.margin.right;
    this.height = 100 - this.margin.top - this.margin.bottom;
    this.initVis();
}

Info.prototype.initVis = function(){
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
    this.rect = d3.scale.linear();
    this.rect.range([0,350]);
    this.rect.domain([0, this.totalPopulationPrevalence]);
    this.update();
}

Info.prototype.update = function(){
    var that = this;
    d3.select(".info_g").remove();
    d3.select(".text_g").remove();

    var g_info = this.svg.append("g")
        .attr("class", "info_g")
        .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    g_info.append("text")
        .text(function(){
            if(that.metric == metrics[0])
                return formatter(that.totalPrevalence).replace('M', 'million').replace('k', 'K');
            else
                return formatter(that.totalDeaths).replace('M', 'million').replace('k', 'K');
        })
        .style("font-size", 50)
        .style("fill", "red");

    this.svg.append("g").attr("transform", "translate(" + 5 + "," + 70 + ")").attr("class", "text_g").append("text")
        .text(function(){
            if(that.metric == metrics[0])
                return "Adolescents living worldwide with HIV/AIDS in the year " + that.year;
            else
                return "Adolescents deaths worldwide from HIV/AIDS in the year " + that.year;
        } )
        .style("font-size", 12);

}

Info.prototype.updateMetric = function(selection){
        var that = this;
        if(selection == metrics[0])
            this.metric = metrics[0];
        else
            this.metric = metrics[1];
        // Set the domain
        if(that.metric == metrics[0])
            that.rect.domain([0, that.totalPopulationPrevalence]);
        else
            that.rect.domain([0, that.totalPopulationDeaths]);
        //Update
        this.update();
    }



Info.prototype.updateYear= function(selection, totalPrevalence, totalDeaths){
    this.year = selection;
    this.totalPrevalence = totalPrevalence;
    this.totalDeaths = totalDeaths;

    this.update();
}