// Get the elements from the DOM
const textbox: HTMLInputElement = document.getElementById('inputText') as HTMLInputElement;
const btnSubmit: HTMLButtonElement = document.getElementById('invokeApi') as HTMLButtonElement;
const responseBox: HTMLInputElement = document.getElementById('outputText') as HTMLInputElement;
const spinner: HTMLElement = document.getElementById('spinner') as HTMLElement;
const tableBody = document.getElementById("dataTable") as HTMLTableSectionElement;

btnSubmit.addEventListener('click', () => {
    const textValue = textbox.value;
    btnSubmit.disabled = true;
    spinner.style.display = 'inline';

    fetch('/api/coffeeShopChat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: textValue })
    })
        .then(response => response.json())
        .then(data => {
            responseBox.value = JSON.stringify(data, null, 2);
            const row = tableBody.insertRow(0);
            row.insertCell(0).textContent = textValue;
            row.insertCell(1).textContent = JSON.stringify(data);
        })
        .catch(error => {
            console.error('Error:', error);
        })
        .finally(() => {
            btnSubmit.disabled = false;
            spinner.style.display = 'none';
        });
});



async function fetchDataAndPopulateTable() {
    try {
        const response = await fetch("/api/getHistory");
        const data = await response.json();

        data.forEach(entry => {
            const row = tableBody.insertRow();
            const promptCell = row.insertCell(0);
            promptCell.textContent = entry.Prompt;

            // const responseObj = JSON.parse(entry.Response);
            // const responseCell = row.insertCell(1);
            // // Here, we're simplifying the display to show only product names and quantities. You can customize this.
            // responseObj.items.forEach(item => {
            //     responseCell.textContent += `${item.quantity} x ${item.product.name}, `;
            // });
            row.insertCell(1).textContent = entry.Response;
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to populate the table
fetchDataAndPopulateTable();



