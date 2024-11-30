import express from "express";
import fetch from "node-fetch";
import checklistRules from "./rules/checklistRules.js";
import path from "path";

import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

// Set up EJS as the template engine
app.set("view engine", "ejs");
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function fetchData() {
  const url =
    "http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch API data.");
  }
  return await response.json();
}

function evaluateRules(data) {
  return checklistRules.map((rule) => ({
    name: rule.name,
    status: rule.condition(data) ? "Passed" : "Failed",
  }));
}

app.get("/", async (req, res) => {
  try {
    const apiData = await fetchData();
    const results = evaluateRules(apiData); 
    res.render("dashboard", { results }); 
  } catch (error) {
    res.status(500).send("Error fetching data: " + error.message);
  }
});

app.post('http://localhost:3000/submit', (req, res) => {
    console.log('Form data received:', req.body);

    res.status(200).json({
        message: 'Form submitted successfully',
        data: req.body
    });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
