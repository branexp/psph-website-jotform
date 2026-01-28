// parser.js

const districtFileInput = document.getElementById('district-file');
const schoolFileInput = document.getElementById('school-file');
const processButton = document.getElementById('process-button');
const districtOutput = document.getElementById('district-output');
const schoolOutput = document.getElementById('school-output');

processButton.addEventListener('click', () => {
  const districtFile = districtFileInput.files[0];
  const schoolFile = schoolFileInput.files[0];

  if (districtFile) {
    processFile(districtFile, 'LEA_NAME', districtOutput);
  } else {
    alert('Please select a district file.');
  }

  if (schoolFile) {
    processFile(schoolFile, 'SCH_NAME', schoolOutput);
  } else {
    alert('Please select a school file.');
  }
});

function processFile(file, columnName, outputElement) {
  outputElement.value = `Parsing ${file.name}...`;

  Papa.parse(file, {
    header: true, // Treat the first row as headers
    skipEmptyLines: true,
    complete: (results) => {
      if (!results.meta.fields.includes(columnName)) {
        outputElement.value = `ERROR: Column "${columnName}" not found in ${file.name}. \n\nAvailable columns are: ${results.meta.fields.join(', ')}`;
        return;
      }

      const names = results.data.map(row => row[columnName].trim());
      const uniqueNames = [...new Set(names)].sort();

      // Format for easy copy-pasting as a JS array
      const formattedOutput = '[\n' + uniqueNames.map(name => `    "${name.replace(/"/g, '\\"')}"`).join(',\n') + '\n]';

      outputElement.value = formattedOutput;
      console.log(`Successfully processed ${uniqueNames.length} unique names from ${file.name}.`);
    },
    error: (error) => {
      outputElement.value = `An error occurred: ${error.message}`;
      console.error(error);
    }
  });
}