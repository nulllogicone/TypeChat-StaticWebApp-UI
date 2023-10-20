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
