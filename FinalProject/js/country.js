/**
 * Created by Sabina Prajapati on 4/16/2015.
 */


Country = function(_parentElement){
    this.parentElement = _parentElement;
    this.margin = {top: 50, right: 5, bottom: 5, left: 0};
    this.width = 300 - this.margin.left - this.margin.right;
    this.height = 100 - this.margin.top - this.margin.bottom;
    this.svg = this.parentElement.append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom);
}

Country.prototype.updateVis = function(countryData, metric){
    d3.select(".g_country").remove();
    var c = this.svg.append("g").attr("transform", "translate(" + 0 + "," + 20 + ")").attr("class", "g_country")

     var line2, line3;
    if(metric == "prevalence") {
        line2 = "Prevalence: " + countryData.aids_prevalence;
        line3 = "Ratio: " + d3.round(countryData.prevalence_ratio, 2);
    }
    else{
        line2 = "Deaths: " + countryData.aids_deaths;
        line3 = "Ratio: " + d3.round(countryData.death_ratio, 2);
    }

    c.append("text")
        .text(function (d){
                return countryData.name;
        })
        .attr("y", 0);
    c.append("text")
        .text(line2)
        .attr("y", 15);
    c.append("text")
        .text(line3)
        .attr("y", 30);
}