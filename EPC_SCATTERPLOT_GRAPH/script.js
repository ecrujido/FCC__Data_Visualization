import * as d3 from "https://d3js.org/d3.v7.min.js";
// const d3 = require("https://cdn.skypack.dev/d3@7.8.2");

const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

document.addEventListener("DOMContentLoaded", async () => {
  const getData = async () => {
    try {
      const response = await fetch(url);
      const data = await response.json();
      addData(data);
    } catch (error) {
      console.error(error);
    }
  };
  
  await getData();


  const addData = (data) => {
    const w = 900;
    const h = 900;
    const p = 50;

    const scheme = d3.scaleOrdinal(d3.schemeAccent);

    const timeOffSet = 2000;
    const oneThousand = 1000;

    const yScale = d3
      .scaleTime()
      .domain([
        d3.min(data, d => new Date(d.Seconds * oneThousand - timeOffSet)),
        d3.max(data, d => new Date(d.Seconds * oneThousand + timeOffSet))
      ])
      .range([h - p, p]);
    
    const one = 1;
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, d => d.Year - one),
        d3.max(data, d => d.Year + one)
      ])
      .range([p, w - p]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat("%M:%S"));

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    const svg = d3
      .select("div")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "container");

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", "translate(" + p + ",0)")
      .call(yAxis);

    svg
      .append("g")
      .attr("transform", "translate(0," + (h - p) + ")")
      .attr("id", "x-axis")
      .call(xAxis);

    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -170)
      .attr("y", 70)
      .text("Time in minutes")
      .attr("font-size", 12);

    svg
      .append("text")
      .attr("x", w - 100)
      .attr("y", h - 60)
      .attr("font-size", 12)
      .text("Year");

    svg
      .append("text")
      .attr("x", w / 2 - 200)
      .attr("y", 20)
      .text("Doping in Professional Bicycle Racing")
      .attr("id", "title")
      .attr("font-family", "Roboto Slab")
      .attr("font-size", 25)
      .attr("font-weight", 700);

    svg
      .append("text")
      .attr("x", w / 2 - 155)
      .attr("y", 50)
      .text("35 Mabibilis na oras na naitala sa Alpe d'Huez")
      .attr("id", "title")
      .attr("font-size", 15);

      svg
      .append("text")
      .attr("x", w / 2 - 100)
      .attr("y", h - 5)
      .text("Scatterplot Graph (EPC) 2024")
      .attr("id", "copyright")
      .attr("font-size", 15);
    
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("r", 7)
    
      .attr("data-xvalue", d => d.Year)
      .attr("data-yvalue", d => new Date(d.Seconds * oneThousand))
      .attr("cx", d => xScale(d.Year))
      .attr("cy", d => yScale(new Date(d.Seconds * oneThousand)))
      .attr("fill", d => scheme(Boolean(d.Doping)))
    
      .attr("stroke", "black")
      .attr("cursor", "pointer")
      .attr("index", (d, i) => i)
      .on("mouseover", function (e) {
        const i = this.getAttribute("index");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(function () {
          if (data[i].Doping) {
            return (
              data[i].Name +
              ": " +
              data[i].Nationality +
              "<br> Year: " +
              data[i].Year +
              ", Time: " +
              data[i].Time +
              "<br></br>" +
              data[i].Doping
            );
          } else {
            return (
              data[i].Name +
              ": " +
              data[i].Nationality +
              "<br> Year: " +
              data[i].Year +
              ", Time: " +
              data[i].Time
            );
          }
        });

        tooltip
          .style("left", e.clientX - 50 + "px")
          .style("top", e.clientY + "px")
          .style("transform", "translateX(60px)")
          .attr("data-year", data[i].Year);
      })
      .on("mouseout", () => tooltip.transition().duration(400).style("opacity", 0));

    const legendContainer = svg.append("g").attr("id", "legend");

    const legend = legendContainer
      .selectAll("#legend")
      .data(scheme.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", (d, i) => `translate(0, ${h / 2 - i * 30 + 300})`);
    
    legend
      .append("circle")
      .attr("r", 7)
      .attr("cx", w - 60)
      .style("-webkit-transform", () => (navigator.appVersion.indexOf("Chrome/") !== -1 ? "translatey(35px)" : "translatey(-4px)"))
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", scheme)
      .attr("stroke", "black");

    legend
      .append("text")
      .attr("x", w - 70)
      .attr("dy", "2rem")
      .style("text-anchor", "end")
      .text(d => (d ? 
          "Riders with doping allegations" : "No doping allegations"
      ));
  };

  getData();
  
});