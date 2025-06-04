
export function drawTheta(globalData, testData, graphLen, divID, type, size, showBead) {


  // Declare the chart dimensions and margins.
  const margin = { top: size / 35, right: 30, bottom: size / (35 / 3), left: 60 };
  // HERE
  const width = size - margin.left - margin.right;
  const height = size - margin.top - margin.bottom;

  // const minY = d3.min(globalData.data, (d) => d.theta * 180 / Math.PI)
  // const maxY = d3.max(globalData.data, (d) => d.theta * 180 / Math.PI)
  const minY = Math.min(
    d3.min(globalData.data, (d) => d.theta * 180 / Math.PI),
    testData ? d3.min(testData.data, (d) => d.theta * 180 / Math.PI) : Infinity
  );
  const maxY = Math.max(
    d3.max(globalData.data, (d) => d.theta * 180 / Math.PI),
    testData ? d3.max(testData.data, (d) => d.theta * 180 / Math.PI) : -Infinity
  );
  // Declare the x (horizontal position) scale.
  const x = d3.scaleLinear()
    .domain([0, graphLen])
    .range([margin.left, width + margin.left]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height - margin.bottom, margin.bottom]);

  const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2f"))

  // append the svg object to the body of the page
  const svg = window.d3.select(`#${divID}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  // Instead of these, you can position the scenery Node containing the graph.
  // .append( 'g' )
  // .attr( 'transform', `translate(${margin.left},${margin.top})` );

  // Add the x-axis.
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.
  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    // .call( d3.axisLeft( y ) );
    .call(yAxis);

  svg
    .append("path")
    .datum(globalData.data)
    .attr("fill", "none")
    // .attr("stroke", "steelblue")
    .attr("stroke", type === "test" ? "blue" : "red")
    .attr("stroke-width", 1.5)
    // .attr("stroke-dasharray", type !== "test" ? "4,4" : "0")
    .attr("d", d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.theta * 180 / Math.PI) })
    )


  svg
    .append("path")
    .datum(testData.data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.theta * 180 / Math.PI) })
    );


  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", 15)
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("θ (degrees)")


  svg.append("text")
    .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2) + "," + (height + 10) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("t (s)")

  // svg.append("text")
  // .attr("x", (height/2.5))
  // .attr("y", 20)
  // .style("text-anchor", "middle")
  // .style("font-size", "15px")
  // .text(`θ over time: ${type} eqn`)

  // svg.selectAll("dot")
  //   .data([50, 50])
  //   .enter().append("circle")
  //   .attr("r", 3.5)
  //   .attr("cx", x(50) + margin.left)
  //   .attr("cy", y(50))
  //   .attr("fill", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")
  //   .attr("stroke", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")

  svg.append("circle")
    .attr("id", "dot-ref-theta")
    .attr("r", 4)
    .attr("fill", "red")
    .attr("stroke", "red")
    .attr("cx", x(0))
    .attr("cy", y(globalData.data[0].theta * 180 / Math.PI));

  if (showBead) {
    svg.append("circle")
      .attr("id", "dot-test-theta")
      .attr("r", 4)
      .attr("fill", "blue")
      .attr("stroke", "blue")
      .attr("cx", x(0))
      .attr("cy", y(testData.data[0].theta * 180 / Math.PI))

  }





  return svg.node();
}
export function drawVelocity(globalData, testData, graphLen, divID, type, size, showBead) {

  // Declare the chart dimensions and margins.
  const margin = { top: size / 35, right: 30, bottom: size / (35 / 3), left: 60 };
  const width = size - margin.left - margin.right;
  const height = size - margin.top - margin.bottom;
  // const width = 200 - margin.left - margin.right;
  // const height = 200 - margin.top - margin.bottom;
  // const minY = d3.min(globalData.data, (d) => d.velocity)
  // const maxY = d3.max(globalData.data, (d) => d.velocity)
  const minY = Math.min(
    d3.min(globalData.data, (d) => d.velocity),
    testData ? d3.min(testData.data, (d) => d.velocity) : Infinity
  );
  const maxY = Math.max(
    d3.max(globalData.data, (d) => d.velocity),
    testData ? d3.max(testData.data, (d) => d.velocity) : -Infinity
  );
  // Declare the x (horizontal position) scale.
  const x = d3.scaleLinear()
    .domain([0, graphLen])
    .range([margin.left, width + margin.left]);

  // Declare the y (vertical position) scale.
  const y = d3.scaleLinear()
    .domain([minY, maxY])
    .range([height - margin.bottom, margin.bottom]);

  const yAxis = d3.axisLeft(y)
    .tickFormat(d3.format(".2f"))

  // append the svg object to the body of the page
  const svg = window.d3.select(`#${divID}`)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  // Instead of these, you can position the scenery Node containing the graph.
  // .append( 'g' )
  // .attr( 'transform', `translate(${margin.left},${margin.top})` );

  // Add the x-axis.
  svg.append('g')
    .attr('transform', `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x));

  // Add the y-axis.

  svg.append('g')
    .attr('transform', `translate(${margin.left},0)`)
    // .call( d3.axisLeft( y ) );
    .call(yAxis);
  svg
    .append("path")
    .datum(globalData.data)
    .attr("fill", "none")
    // .attr("stroke", "steelblue")
    .attr("stroke", type === "test" ? "blue" : "red")
    .attr("stroke-width", 1.5)
    // .attr("stroke-dasharray", type !== "test" ? "4,4" : "0")
    .attr("d", d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.velocity) })
    )

  svg
    .append("path")
    .datum(testData.data)
    .attr("fill", "none")
    .attr("stroke", "blue")
    .attr("stroke-width", 1.5)
    .attr("d", d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.velocity) })
    );
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", 10)

    .style("text-anchor", "middle")
    .style("font-size", "15px")
    .text("v (m/s)")

  svg.append("text")
    .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2) + "," + (height + 10) + ")")
    .style("text-anchor", "middle")
    .style("font-size", "15px")

    .text("t (s)")




  // svg.selectAll("dot")
  //   .data([50, 50])
  //   .enter().append("circle")
  //   .attr("r", 3.5)
  //   .attr("cx", x(50) + margin.left)
  //   .attr("cy", y(50))
  //   .attr("fill", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")
  //   .attr("stroke", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")

  svg.append("circle")
    .attr("id", "dot-ref-velocity")
    .attr("r", 4)
    .attr("fill", "red")
    .attr("stroke", "red")
    .attr("cx", x(0))
    .attr("cy", y(globalData.data[0].velocity));


  if (showBead) {
    svg.append("circle")
      .attr("id", "dot-test-velocity")
      .attr("r", 4)
      .attr("fill", "blue")
      .attr("stroke", "blue")
      .attr("cx", x(0))
      .attr("cy", y(testData.data[0].velocity));

  }


  return svg.node();
}

// export function drawTheta(globalData, graphLen, divID, type, size, showBead = true) {

//   // Declare the chart dimensions and margins.
//   const margin = { top: size / 35, right: 30, bottom: size / (35 / 3), left: 60 };
//   const width = size - margin.left - margin.right;
//   const height = size - margin.top - margin.bottom;
//   const minY = d3.min(globalData.data, (d) => d.theta * 180 / Math.PI)
//   const maxY = d3.max(globalData.data, (d) => d.theta * 180 / Math.PI)
//   // Declare the x (horizontal position) scale.
//   const x = d3.scaleLinear()
//     .domain([0, graphLen])
//     .range([margin.left, width + margin.left]);

//   // Declare the y (vertical position) scale.
//   const y = d3.scaleLinear()
//     .domain([minY, maxY])
//     .range([height - margin.bottom, margin.bottom]);

//   const yAxis = d3.axisLeft(y).tickFormat(d3.format(".2f"))

//   // append the svg object to the body of the page
//   const svg = window.d3.select(`#${divID}`)
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom);

//   // Instead of these, you can position the scenery Node containing the graph.
//   // .append( 'g' )
//   // .attr( 'transform', `translate(${margin.left},${margin.top})` );

//   // Add the x-axis.
//   svg.append('g')
//     .attr('transform', `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x));

//   // Add the y-axis.
//   svg.append('g')
//     .attr('transform', `translate(${margin.left},0)`)
//     // .call( d3.axisLeft( y ) );
//     .call(yAxis);

//   svg
//     .append("path")
//     .datum(globalData.data)
//     .attr("fill", "none")
//     // .attr("stroke", "steelblue")
//     .attr("stroke", type === "test" ? "blue" : "red")
//     .attr("stroke-width", 1.5)
//     .attr("stroke-dasharray", type !== "test"?"4,4":"0")
//     .attr("d", d3.line()
//       .x(function (d) { return x(d.time) })
//       .y(function (d) { return y(d.theta * 180 / Math.PI) })
//     )
//   svg.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", -(height / 2))
//     .attr("y", 15)
//     .style("text-anchor", "middle")
//     .style("font-size", "15px")
//     .text("θ (degrees)")


//   svg.append("text")
//     .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2) + "," + (height + 10) + ")")
//     .style("text-anchor", "middle")
//     .style("font-size", "15px")
//     .text("t (s)")

//   // svg.append("text")
//   // .attr("x", (height/2.5))
//   // .attr("y", 20)
//   // .style("text-anchor", "middle")
//   // .style("font-size", "15px")
//   // .text(`θ over time: ${type} eqn`)

//   svg.selectAll("dot")
//     .data([50, 50])
//     .enter().append("circle")
//     .attr("r", 3.5)
//     .attr("cx", x(50) + margin.left)
//     .attr("cy", y(50))
//     .attr("fill", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")
//     .attr("stroke", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")
//   //   if (!Number.isNaN(globalData.data[1].theta)){
//   //     d3.interval( () => {
//   //       // console.log(ball)
//   //       svg.selectAll("circle").remove();
//   //       svg.selectAll("dot")
//   //       .data([50,50])
//   //       .enter().append("circle")
//   //         .attr("r", 3.5)
//   //         .attr("cx", x(ball.time)+margin.left)
//   //         .attr("cy", y(ball.theta))
//   //         .attr("fill", "red")
//   //         .attr("stroke", "red")
//   //     }, 5)
//   // }
//   return svg.node();
// }
// export function drawVelocity(globalData, graphLen, divID, type, size, showBead = true) {

//   // Declare the chart dimensions and margins.
//   const margin = { top: size / 35, right: 30, bottom: size / (35 / 3), left: 60 };
//   const width = size - margin.left - margin.right;
//   const height = size - margin.top - margin.bottom;
//   // const width = 200 - margin.left - margin.right;
//   // const height = 200 - margin.top - margin.bottom;
//   const minY = d3.min(globalData.data, (d) => d.velocity)
//   const maxY = d3.max(globalData.data, (d) => d.velocity)
//   // Declare the x (horizontal position) scale.
//   const x = d3.scaleLinear()
//     .domain([0, graphLen])
//     .range([margin.left, width + margin.left]);

//   // Declare the y (vertical position) scale.
//   const y = d3.scaleLinear()
//     .domain([minY, maxY])
//     .range([height - margin.bottom, margin.bottom]);

//   const yAxis = d3.axisLeft(y)
//     .tickFormat(d3.format(".2f"))

//   // append the svg object to the body of the page
//   const svg = window.d3.select(`#${divID}`)
//     .append('svg')
//     .attr('width', width + margin.left + margin.right)
//     .attr('height', height + margin.top + margin.bottom);

//   // Instead of these, you can position the scenery Node containing the graph.
//   // .append( 'g' )
//   // .attr( 'transform', `translate(${margin.left},${margin.top})` );

//   // Add the x-axis.
//   svg.append('g')
//     .attr('transform', `translate(0,${height - margin.bottom})`)
//     .call(d3.axisBottom(x));

//   // Add the y-axis.

//   svg.append('g')
//     .attr('transform', `translate(${margin.left},0)`)
//     // .call( d3.axisLeft( y ) );
//     .call(yAxis);
//   svg
//     .append("path")
//     .datum(globalData.data)
//     .attr("fill", "none")
//     // .attr("stroke", "steelblue")
//     .attr("stroke", type === "test" ? "blue" : "red")
//     .attr("stroke-width", 1.5)
//     .attr("d", d3.line()
//       .x(function (d) { return x(d.time) })
//       .y(function (d) { return y(d.velocity) })
//     )
//   svg.append("text")
//     .attr("transform", "rotate(-90)")
//     .attr("x", -(height / 2))
//     .attr("y", 10)

//     .style("text-anchor", "middle")
//     .style("font-size", "15px")
//     .text("v (m/s)")

//   svg.append("text")
//     .attr("transform", "translate(" + ((width + margin.left + margin.right) / 2) + "," + (height + 10) + ")")
//     .style("text-anchor", "middle")
//     .style("font-size", "15px")

//     .text("t (s)")

//   // svg.append("text")
//   // .attr("x", (height/2.5))
//   // .attr("y", 20)
//   // .style("text-anchor", "middle")
//   // .style("font-size", "15px")
//   // .text(`Velocity over time: ${type} eqn`)


//   svg.selectAll("dot")
//     .data([50, 50])
//     .enter().append("circle")
//     .attr("r", 3.5)
//     .attr("cx", x(50) + margin.left)
//     .attr("cy", y(50))
//     .attr("fill", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")
//     .attr("stroke", type === "test" ? showBead ? "blue" : "none" : showBead ? "red" : "none")



//   return svg.node();
// }
