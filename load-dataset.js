// Array of drug names
const drugs = [
  "Aspirin",
  "Ibuprofen",
  "Paracetamol",
  "Lisinopril",
  "Simvastatin",
  "Levothyroxine",
  "Metformin",
  "Amlodipine",
  "Atorvastatin",
  "Omeprazole",
  "Metoprolol",
  "Losartan",
  "Gabapentin",
  "Hydrochlorothiazide",
  "Furosemide",
  "Warfarin",
  "Clopidogrel",
  "Duloxetine",
  "Escitalopram",
  "Metronidazole",
];

// Array of sample types
const sampleTypes = [
  "Blood",
  "Urine",
  "Tissue",
  "Saliva",
  "Cerebrospinal Fluid",
  "Sputum",
  "Swab",
  "Stool",
  "Synovial Fluid",
  "Hair",
];

// Array of study populations
const studyPopulations = [
  "Pediatric",
  "Adult",
  "Elderly",
  "Male",
  "Female",
  "Pregnant Women",
  "Healthy Volunteers",
  "Patients with Chronic Conditions",
  "Specific Ethnic Group",
  "Other",
];

// Array of routes of administration
const routesOfAdmin = [
  "Oral",
  "Intravenous (IV)",
  "Intramuscular (IM)",
  "Subcutaneous (SC)",
  "Topical",
  "Inhalation",
  "Rectal",
  "Transdermal",
  "Intradermal",
  "Other",
];

// Array of formulations
const formulations = [
  "Tablet",
  "Capsule",
  "Liquid",
  "Injection",
  "Cream",
  "Ointment",
  "Patch",
  "Gel",
  "Powder",
  "Other",
];

// Array of trimesters
const trimesters = ["1st Trimester", "2nd Trimester", "3rd Trimester"];

// Function to generate random data
const generateRandomData = () => {
  const randomData = {
    drug_name: getRandomElement(drugs),
    sample_type: getRandomElement(sampleTypes),
    study_population: getRandomElement(studyPopulations),
    route_of_administration: getRandomElement(routesOfAdmin),
    formulation: getRandomElement(formulations),
    trimester: getRandomElement(trimesters),
    time_after_dose: Math.floor(Math.random() * 24), // Random integer between 0 and 23
    drug_concentration:
      Math.floor(Math.random() * 500) + Math.floor(Math.random() * 1000), // Random integer between 0 and 999
  };
  return randomData;
};

// Helper function to get a random element from an array
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

exports.default = (numberOfRows) => {
  const rows = [];

  for (let i = 0; i < numberOfRows; i++) {
    rows.push(generateRandomData());
  }

  return rows;
};
