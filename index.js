const express = require("express");
const app = express();
const port = 80;

app.post("/histogram-data", (req, res) => {
  // Generate sample data for the histogram
  const data = Array.from({ length: 1000 }, () =>
    Math.floor(Math.random() * 100)
  );

  res.json(data);
});

app.get("/histogram-data", (req, res) => {
  // Extract query parameters from the request
  const numBins = parseInt(req.query.numBins) || 50; // Default to 10 bins if not provided
  const minValue = parseInt(req.query.minValue) || 0; // Default to 0 if not provided
  const maxValue = parseInt(req.query.maxValue) || 100; // Default to 100 if not provided

  // Generate dynamic histogram data
  const histogramData = generateHistogramData(numBins, minValue, maxValue);

  // Send the histogram data as JSON
  res.json(histogramData);
});

// Function to generate dynamic histogram data
function generateHistogramData(numBins, minValue, maxValue) {
  // Generate random data for the histogram
  const histogramValues = Array.from(
    { length: numBins },
    () => Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
  );

  return { values: histogramValues };
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
