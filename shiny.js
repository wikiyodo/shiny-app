const apiUrl = "https://shiny-a9e90cfe443c.herokuapp.com";

function addNewOptionsToSelectBox(boxId, data) {
  const selectElement = $(`#${boxId}`);
  const selectizeInstance = selectElement[0].selectize;
  selectizeInstance.clear();
  selectizeInstance.addOption(data);
}

const fetchSelectionFieldsAndValues = function () {
  fetch(`${apiUrl}/filters`)
    .then((response) => {
      // Check if the request was successful (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // Parse the JSON data in the response
      return response.json();
    })
    .then((data) => {
      addNewOptionsToSelectBox("drug", data.drugs);
      addNewOptionsToSelectBox("sample_type", data.sampleTypes);
      addNewOptionsToSelectBox("study_population", data.studyPopulations);
      addNewOptionsToSelectBox("route_of_admin", data.routeOfAdministration);
      addNewOptionsToSelectBox("formulation", data.formulation);

      $(`#trimesters`).append(
        data.trimesters
          .map(
            ({ label, value }) => `<label class="checkbox-inline">
            <input type="checkbox" name="trimesters" value="${value}">
            <span>${label}</span>
          </label>`
          )
          .join("")
      );
    })
    .catch((error) => {
      // Handle errors during the fetch process
      alert("could not connect to api");
    });
};

document.addEventListener("DOMContentLoaded", (event) => {
  fetchSelectionFieldsAndValues();
});
