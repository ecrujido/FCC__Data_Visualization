// import * as d3 from "https://cdn.skypack.dev/d3@7.8.2";

const datasets = [
  {
    title: "Kickstarter Pledges",
    desc: "Top 100 Most Pledged Kickstarter Campaigns Grouped By Category",
    url:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/kickstarter-funding-data.json"
  },
  {
    title: "Video Game Sales",
    desc: "Top 100 Most Sold Video Games Grouped by Platform",
    url:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/video-game-sales-data.json"
  },
  {
    title: "Movie Sales",
    desc: "Top 100 Highest Grossing Movies Grouped By Genre",
    url:
      "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  }
];

  document.addEventListener("DOMContentLoaded", async () => {
  let defaultDataset = 1;

  const getData = async () => {
    try {
      const response = await fetch(datasets[defaultDataset].url);
      const data = await response.json();
      addData(data);
    } catch (error) {
      console.error(error);
    }
  };

  await getData();


    const addData = (data) => {
      document.querySelector("body > div:first-child").innerHTML = "";
  
  
    let dataset = datasets[defaultDataset];
    const w = 1400;
    const h = 1100;
    const p = 30;

    const svg = d3
      .select("div")
      .append("svg")
      .attr("width", w)
      .attr("height", h)
      .attr("class", "treemap fade-in");


    svg
      .append("text")
      .text(dataset.title)
      .attr("x", function () {
      switch (defaultDataset) {
        case 0:
        case 1:
          return w / 2 - 135;
        case 2:
          return w / 2 - 100;
        default:
          return w / 2 - 100;
      }
    })
    .attr("y", 20)
    .attr("font-size", 25)
    .attr("id", "title");


    svg
      .append("text")
      .text(dataset.desc)
      .attr("x", function () {
      switch (defaultDataset) {
        case 0:
          return w / 2 - 250;
        case 1:
        case 2:
          return w / 2 - 215;
        default:
          return w / 2 - 215;
      }
    })
    .attr("y", 45)
    .attr("font-size", 15)
    .attr("id", "description");


    svg
    .append("text")
    .text("Treemap Diagram (EPC) 2024")
    .attr("x", w - 260)
    .attr("y", h - 70)
    .attr("font-size", 12)
    .attr("id", "copyright");


    function createLinkText(text, yPosition, datasetIndex) {
      return svg
        .append("text")
        .html(`<a href="#">${text}</a>`)
        .attr("x", 40)
        .attr("y", yPosition)
        .attr("font-size", 12)
        .attr("class", "link")
        .on("click", () => {
          defaultDataset = datasetIndex;
          getData();
        });
    }
    
    createLinkText("Video Game Data Set", h - 110, 1);
    createLinkText("Movie Data Set", h - 90, 2);
    createLinkText("Kickstarter Data Set", h - 70, 0);
    

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);


    const fader = (color) => d3.interpolateRgb(color, "#fff")(0.2);
    const color = d3.scaleOrdinal().range(
      [
        "#dc5eb1",
        "#6ee157",
        "#e047cf",
        "#c4e041",
        "#ac64e9",
        "#67aa3d",
        "#6780e9",
        "#dfbb3a",
        "#af87d4",
        "#6de2a7",
        "#e74872",
        "#4fd1d4",
        "#e75b32",
        "#669cd8",
        "#d08d4b",
        "#53a36e",
        "#d685b4",
        "#cade89",
        "#d97670",
        "#979542"
      ].map(fader)
    );
  
  
    let hierarchy = d3.hierarchy(data)
      .sum((node) => node.value)
      .sort((node1, node2) => node2.value - node1.value);
  
  
    d3
      .treemap()
      .size([w - p * 4, h - 150 - p * 4])
      .padding(2)(hierarchy);

    const tiles = hierarchy.leaves();

    const cell = svg
      .selectAll("g")
      .data(tiles)
      .enter()
      .append("g")
      .attr("transform", "translate(" + p + "," + p * 2 + ")");

  
    cell
      .append("rect")
      .attr("x", (d) => d.x0)
      .attr("y", (d) => d.y0)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .attr("class", "tile")
      .attr("cursor", "pointer")
      .attr("index", (d, i) => i)
      .attr("fill", (d) => color(d.data.category))
      .attr("data-name", (d) => d.data.name)
      .attr("data-category", (d) => d.data.category)
      .attr("data-value", (d) => d.data.value)

      .on("mouseover", function (e) {
        const name = this.getAttribute("data-name");
        const category = this.getAttribute("data-category");
        const value = this.getAttribute("data-value");
      
        tooltip.transition().duration(200).style("opacity", 0.9);
        tooltip.html(`Name: ${name} <br> Category: ${category} <br> Value: ${value}`);
        tooltip
          .style("left", `${e.clientX - 50}px`)
          .style("top", `${e.clientY}px`)
          .style("transform", "translateX(60px)")
          .attr("data-value", value);
      })
      
      .on("mouseout", () => tooltip.transition().duration(400).style("opacity", 0));

      
    const info = svg
      .append("g")
      .attr("id", "info")
      .attr("transform", "translate(" + p + "," + p * 2 + ")");

    info
      .selectAll("text")
      .data(tiles)
      .enter()
      .append("text")
      .attr("data-width", (d) => d.x1 - d.x0)
      .attr("x", (d) => d.x0 + 5)
      .attr("y", (d) => d.y0 + 15)
      .attr("width", (d) => d.x1 - d.x0)
      .attr("height", (d) => d.y1 - d.y0)
      .text((d) => d.data.name.split("/").join("/ "))
      .attr("fill", "black")
      .attr("font-size", 8)
      .attr("data-width", (d) => d.x1 - d.x0)
      .attr("class", "cell-text")
      .call(wrapText);


    function wrapText(text) {
      text.each(function () {
        const width = this.getAttribute("data-width") - 20;
        let text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1,
          x = text.attr("x"),
          y = text.attr("y"),
          dy = 0,
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", x)
            .attr("y", y)
            .attr("dy", `${dy}em`);
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", x)
              .attr("y", y)
              .attr("dy", `${++lineNumber * lineHeight + dy}em`)
              .text(word);
          }
        }
      });
    }
    
   
    const categories = data.children.map((item) => item.name);
    const legend = d3
      .select("svg")
      .append("g")
      .attr("id", "legend")
      .attr("fill", "black");

  
    const text = legend
      .append("g")
      .attr("transform", `translate(300, ${h - 170})`)
      .selectAll("g")
      .data(categories)
      .enter()
      .append("g")
      .text((d) => d)
      .attr("transform", (d, i) =>
        `translate(${(i % 5) * 200}, ${Math.floor(i / 5) * 14 + 10 * Math.floor(i / 5)})`
      );


    text
      .append("rect")
      .attr("width", 14)
      .attr("height", 14)
      .attr("class", "legend-item")
      .attr("fill", (d) => color(d));
  

    text
      .append("text")
      .attr("x", 18)
      .attr("y", 13)
      .text((d) => d);
  };

  getData();

});
