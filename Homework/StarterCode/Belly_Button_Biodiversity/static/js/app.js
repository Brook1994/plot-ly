function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  d3.json(`/metadata/${sample}`).then((data) => {
    var sampleData = d3.select("#sample-metadata")
    sampleData.html("")
    Object.entries(data).forEach(([key, value]) => {
      sampleData.append("h6").text(`${key}, ${value}`)

    });
  });
}

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);

function buildCharts(sample) {
//   TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    
    // @TODO: Build a Bubble Chart using the sample data
    const sample_values = data.sample_values
    const otu_ids = data.otu_ids
    const otu_labels = data.otu_labels
    // @TODO: Build a Pie Chart
    var piechart = [{
      type: "pie",
      values: sample_values.slice(0,10),
      labels: otu_ids.slice(0,10),
      hovertext: otu_labels.slice(0,10),
      hoverinfo: "hovertext"

    }];
    {
      var bubblechart = [{
        x: otu_ids,
        y: sample_values,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids
        }

      }]

    };
    {
      var pielayout = {

        height: 600,
        width:600,
        margin: {
          t:0, l: 0
        },
        legend: false
        

      };
      Plotly.newPlot("pie", piechart, pielayout);
    };
    {
      var bubblelayout = {
        margin: {
          t:0
        },
        hovermode: "closest",
        xaxis:{
          title: "OTU ID"
        }

      };
      Plotly.newPlot("bubble", bubblechart, bubblelayout);
    }

      
    }
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  )}
    
  

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
