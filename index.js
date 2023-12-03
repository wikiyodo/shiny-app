const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { BigQuery } = require("@google-cloud/bigquery");
const path = require("path");
const fs = require("fs");
const generateData = require("./load-dataset").default;
const json2csv = require("json2csv").parse;

const bigquery = new BigQuery({
  keyFilename: `./trakoin-b658d708095a.json`,
  projectId: "trakoin",
});

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

async function loadDataIntoBigQuery() {
  const csvData = json2csv(generateData(100000), { header: false });
  fs.writeFileSync("data.csv", csvData);

  const dataset = bigquery.dataset("shiny_app");
  const table = dataset.table("dosages");

  const [apiResponse] = await table.load("./data.csv", {
    format: "csv",
  });
  // console.log(generateData(10));
  console.log(apiResponse);
}

async function runQuery(query) {
  // Queries the U.S. given names dataset for the state of Texas.
  // console.log(path.join(process.cwd(), "abc"));

  // For all options, see https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs/query
  const options = {
    query: query,
    // Location must match that of the dataset(s) referenced in the query.
    // location: "US",
  };

  // Run the query as a job
  const [job] = await bigquery.createQueryJob(options);
  console.log(`Job ${job.id} started.`);

  // Wait for the query to finish
  const [rows] = await job.getQueryResults();

  // Print the results
  console.log("Rows:");

  return rows;
}

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

app.post("/line-chart-data", async (req, res) => {
  console.log("angel:::", req.body);
  const {
    drug,
    sample_type,
    study_population,
    route_of_admin,
    formulation,
    trimesters: trimestersParams,
  } = req.body;

  const filterParams = [];

  if (drug) {
    filterParams.push(`drug_name = "${drug}"`);
  }

  if (sample_type) {
    filterParams.push(`sample_type = "${sample_type}"`);
  }

  if (study_population) {
    filterParams.push(`study_population = "${study_population}"`);
  }

  if (route_of_admin) {
    filterParams.push(`route_of_administration = "${route_of_admin}"`);
  }

  if (formulation) {
    filterParams.push(`formulation = "${formulation}"`);
  }

  if (trimestersParams) {
    const usableTrimester =
      typeof trimestersParams == "string"
        ? [trimestersParams]
        : trimestersParams;
    filterParams.push(`trimester IN ("${usableTrimester.join('","')}")`);
  }

  const lineQuery = `
    SELECT 
      trimester,time_after_dose, AVG(drug_concentration) as drug_concentration
    FROM \`trakoin.shiny_app.dosages\`
    ${filterParams.length > 0 ? `WHERE ${filterParams.join(" AND ")}` : ""}
    GROUP BY trimester,time_after_dose
    ORDER BY trimester ASC,time_after_dose ASC
  `;

  const queryResult = await runQuery(lineQuery);

  console.log(queryResult);

  const chartData = {};

  xData = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24,
  ];

  let trimesters = new Set();

  for (let row of queryResult) {
    trimesters.add(row.trimester);

    if (!chartData[row.trimester]) {
      chartData[row.trimester] = {};
    }

    chartData[row.trimester][row.time_after_dose] = row.drug_concentration;
  }

  const lineChartData = {};

  for (let trimester of [...trimesters]) {
    if (!lineChartData[trimester]) {
      lineChartData[trimester] = [];
    }

    for (let x of xData) {
      lineChartData[trimester].push(chartData[trimester][x] || null);
    }
  }

  console.log("lineChartData:::", {
    x: xData,
    ...lineChartData,
  });

  res.json({
    x: xData,
    ...lineChartData,
  });
});

app.get("/filters", async (req, res) => {
  const prepareQuery = (field) =>
    `SELECT DISTINCT ${field} as name FROM \`trakoin.shiny_app.dosages\` ORDER BY name ASC`;

  const [
    drugs,
    sampleTypes,
    studyPopulations,
    routeOfAdministration,
    formulation,
    trimesters,
  ] = await Promise.all([
    runQuery(prepareQuery("drug_name")),
    runQuery(prepareQuery("sample_type")),
    runQuery(prepareQuery("study_population")),
    runQuery(prepareQuery("route_of_administration")),
    runQuery(prepareQuery("formulation")),
    runQuery(prepareQuery("trimester")),
  ]);

  const filterFieldOptions = {
    drugs: drugs.map(({ name }) => ({ label: name, value: name })),
    sampleTypes: sampleTypes.map(({ name }) => ({ label: name, value: name })),
    studyPopulations: studyPopulations.map(({ name }) => ({
      label: name,
      value: name,
    })),
    routeOfAdministration: routeOfAdministration.map(({ name }) => ({
      label: name,
      value: name,
    })),
    formulation: formulation.map(({ name }) => ({ label: name, value: name })),
    trimesters: trimesters.map(({ name }) => ({ label: name, value: name })),
  };

  res.json(filterFieldOptions);
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Server is running at http://localhost:${process.env.PORT || port}`
  );
});
