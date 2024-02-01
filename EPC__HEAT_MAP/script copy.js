import * as d3 from "https://cdn.skypack.dev/d3@7.8.2";

document.addEventListener("DOMContentLoaded", async () => {
  const getData = async () => {
    try {
      await fetch(
        "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json"
      )
        .then((res) => res.json())
        .then((data) => addData(data));
    } catch (error) {
      console.error(error);
    }
  };

  const addData = (data) => {
    const w = 1200;
    const h = 700;
    const p = 100;
    const dataArr = data.monthlyVariance;
    const baseTemp = data.baseTemperature;

    const svg = d3
      .select("div")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "heatmap");

    // X-axis related code

    const xScale = d3
      .scaleLinear()
      .domain([d3.min(dataArr, (d) => d.year), d3.max(dataArr, (d) => d.year)])
      .range([p, w - p]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .call(xAxis)
      .attr("transform", "translate(0," + (h - p) + ")")
      .style("font-family", "'Montserrat', sans-serif");

    // Y-axis related code

    const yScale = d3
      .scaleTime()
      .domain([new Date(0, 0, 0, 0, 0, 0, 0), new Date(0, 12, 0, 0, 0, 0, 0)])
      .range([p, h - p]);

    const yAxis = d3
      .axisLeft(yScale)
      .tickFormat(d3.timeFormat("%B"))
      .tickSize(10, 1);

    svg
      .append("g")
      .attr("id", "y-axis")
      .call(yAxis)
      .attr("transform", "translate(" + p + ",0)")
      .style("font-family", "'Montserrat', sans-serif");

    // legend

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", "translate(" + 100 + "," + (h - 20) + ")")
      .attr("fill", "black");

    const text = legend.append("text");

    text.append("tspan").text("-3 or less | ");
    text.append("tspan").text("-2 or less | ");
    text.append("tspan").text("-1 or less | ");
    text.append("tspan").text("0 or less | ");
    text.append("tspan").text("+1 or less | ");
    text.append("tspan").text("+2 or less | ");
    text.append("tspan").text("+3 or less | ");
    text.append("tspan").text("+3 or more");

    legend
      .append("rect")
      .attr("width", 76)
      .attr("height", 20)
      .attr("fill", "#03306Cff")
      .attr("stroke", "black")
      .attr("y", -35);

    legend
      .append("rect")
      .attr("width", 82)
      .attr("height", 20)
      .attr("fill", "#2170B4ff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76);

    legend
      .append("rect")
      .attr("width", 79)
      .attr("height", 20)
      .attr("fill", "#6BABD7ff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82);

    legend
      .append("rect")
      .attr("width", 78)
      .attr("height", 20)
      .attr("fill", "#C5DBF0ff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82 + 79);

    legend
      .append("rect")
      .attr("width", 84)
      .attr("height", 20)
      .attr("fill", "#FDE1D2ff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82 + 79 + 78);
    legend
      .append("rect")
      .attr("width", 85)
      .attr("height", 20)
      .attr("fill", "#FC916Fff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82 + 79 + 78 + 84);

    legend
      .append("rect")
      .attr("width", 85)
      .attr("height", 20)
      .attr("fill", "#C8181Bff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82 + 79 + 78 + 84 + 85);
      
    legend
      .append("rect")
      .attr("width", 92)
      .attr("height", 20)
      .attr("fill", "#600005ff")
      .attr("stroke", "black")
      .attr("y", -35)
      .attr("x", 76 + 82 + 79 + 78 + 84 + 85 + 85);

    // text
    svg
      .append("text")
      .text("Monthly Global Land-Surface Temperature")
      .attr("x", w / 2 - 220)
      .attr("y", 50)
      .attr("font-size", 20)
      .attr("id", "title");

    svg
      .append("text")
      .text(
        `${dataArr[0].year} - ${
          dataArr[dataArr.length - 1].year
        }: base temperature ${baseTemp}°C`
      )
      .attr("x", w / 2 - 110)
      .attr("y", 75)
      .attr("font-size", 12)
      .attr("id", "description");

    // tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);

    // cells
    svg
      .selectAll("rect")
      .data(dataArr)
      .enter()
      .append("rect")
      .attr("class", "cell")
      .attr("cursor", "pointer")
      .attr("fill", (d) => {
        if (d.variance <= -3) {
          return "#03306Cff";
        } else if (d.variance <= -2) {
          return "#2170B4ff";
        } else if (d.variance <= -1) {
          return "#6BABD7ff";
        } else if (d.variance <= 0) {
          return "#C5DBF0ff";
        } else if (d.variance <= 1) {
          return "#FDE1D2ff";
        } else if (d.variance <= 2) {
          return "#FC916Fff";
        } else if (d.variance <= 3) {
          return "#600005ff";
        } else {
          return "#C8181Bff";
        }
      })
      .attr("data-month", (d) => d.month - 1)
      .attr("data-year", (d) => d.year)
      .attr("data-temp", (d) => (baseTemp + d.variance).toFixed(1))
      .attr("index", (d, i) => i)
      .attr("height", (h - 2 * p) / 12)
      .attr("width", 4)
      .attr("x", (d) => xScale(d.year))
      .attr("y", (item) => {
        return yScale(new Date(0, item["month"] - 1, 0, 0, 0, 0, 0));
      })
      .on("mouseover", function (e) {
        const i = this.getAttribute("index");
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(function () {
          const date = new Date(0, dataArr[i].month - 1, 0);
          const month = date.toLocaleString("default", { month: "long" });
          return `${dataArr[i].year} - ${month} <br>
                  ${baseTemp}°C <br>
                  ${dataArr[i].variance.toFixed(2)}°C`;
        });
        tooltip
          .style("left", e.clientX - 50 + "px")
          .style("top", e.clientY + "px")
          .style("transform", "translateX(60px)")
          .attr("data-year", dataArr[i].year);
      })
      .on("mouseout", function () {
        tooltip.transition().duration(400).style("opacity", 0);
      });
  };

  getData();
});
