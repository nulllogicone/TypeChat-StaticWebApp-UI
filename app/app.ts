// Get the elements from the DOM
const textbox: HTMLInputElement = document.getElementById('inputText') as HTMLInputElement;
const btnSubmit: HTMLButtonElement = document.getElementById('invokeApi') as HTMLButtonElement;
const responseBox: HTMLInputElement = document.getElementById('outputText') as HTMLInputElement;
const spinner: HTMLElement = document.getElementById('spinner') as HTMLElement;
const tableBody = document.getElementById("dataTable") as HTMLTableSectionElement;
const toolTip = document.getElementById("tooltip");

// let toolTip = document.createElement('div');
// toolTip.classList.add('tooltip');
// document.body.appendChild(toolTip);

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
            let cell = row.insertCell(1);
            cell.textContent = JSON.stringify(data);
            cell.className = "json-cell";
            addJsonCellHoverListeners(cell);
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
            let cell = row.insertCell(1);
            cell.textContent = entry.Response;
            cell.className = "json-cell";
            addJsonCellHoverListeners(cell);
        });
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Call the function to populate the table
fetchDataAndPopulateTable();



function addJsonCellHoverListeners(cell: HTMLTableCellElement) {
    cell.addEventListener('mouseenter', function (e) {
        try {
            let rawJson = cell.textContent || '';
            let obj = JSON.parse(rawJson);
            let formattedJson = JSON.stringify(obj, null, 2);

            toolTip.textContent = formattedJson;

            // Wait for the browser to render and calculate tooltip dimensions
            setTimeout(() => {
                const tooltipRect = toolTip.getBoundingClientRect();
                let top = e.pageY + 10;
                let left = e.pageX + 10;

                // Adjust if tooltip goes beyond the right viewport edge
                if (left + tooltipRect.width > window.innerWidth) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }

                // Adjust if tooltip goes beyond the bottom viewport edge
                if (top + tooltipRect.height > window.innerHeight) {
                    top = e.pageY - tooltipRect.height - 10;
                }

                toolTip.style.top = top + 'px';
                toolTip.style.left = left + 'px';
                toolTip.style.display = 'block';
            }, 0);
        } catch (error) {
            console.error("Error parsing JSON:", error);
        }
    });

    cell.addEventListener('mousemove', function (e) {
        const tooltipRect = toolTip.getBoundingClientRect();
        let top = e.pageY + 10;
        let left = e.pageX + 10;

        if (left + tooltipRect.width > window.innerWidth) {
            left = window.innerWidth - tooltipRect.width - 10;
        }

        if (top + tooltipRect.height > window.innerHeight) {
            top = e.pageY - tooltipRect.height - 10;
        }

        toolTip.style.top = top + 'px';
        toolTip.style.left = left + 'px';
    });

    cell.addEventListener('mouseleave', function () {
        toolTip.style.display = 'none';
    });

    cell.addEventListener('dblclick', function () {
        const range = document.createRange();
        range.selectNodeContents(cell);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
        }
    });
}


