// Get the elements from the DOM
const textbox: HTMLInputElement = document.getElementById('inputText') as HTMLInputElement;
const btnSubmit: HTMLButtonElement = document.getElementById('invokeApi') as HTMLButtonElement;
const responseBox: HTMLInputElement = document.getElementById('outputText') as HTMLInputElement;
const spinner: HTMLElement = document.getElementById('spinner') as HTMLElement;

btnSubmit.addEventListener('click', () => {

    const textValue = textbox.value;
    spinner.style.display = 'inline';

    // Make an API call (replace the URL and method according to your needs)
    fetch('/api/httpTrigger1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: textValue })
    })
    .then(response => response.json())
    .then(data => {
        responseBox.value = JSON.stringify(data, null, 2);
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        // Hide the spinner
        spinner.style.display = 'none';
    });
});


// Assuming you have an endpoint named "apiEndpoint" to fetch the data
const apiEndpoint = "/api/getHistory";

// Fetch data from the API and populate the table
async function fetchDataAndPopulateTable() {
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        const tableBody = document.getElementById("dataTable") as HTMLTableSectionElement;

        data.forEach(entry => {
            const row = tableBody.insertRow();

            const promptCell = row.insertCell(0);
            promptCell.textContent = entry.Prompt;

            const responseObj = JSON.parse(entry.Response);
            const responseCell = row.insertCell(1);
            // Here, we're simplifying the display to show only product names and quantities. You can customize this.
            responseObj.items.forEach(item => {
                responseCell.textContent += `${item.quantity} x ${item.product.name}`;
            });
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to populate the table
fetchDataAndPopulateTable();



