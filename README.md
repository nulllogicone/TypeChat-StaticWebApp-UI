# Azure Static Web App as UI for TypeChat

This is a simple experiment to add an UI for [TypeChat](https://microsoft.github.io/TypeChat/)

There is a textbox to enter your natural language prompt, a button to invoke the API (for know I took only the CoffeeShop example)
and another box the shows the strongly typed json result.

## Configuration

To run the project locally you need to add a `local.settings.json` file to the api folder

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "MyStorageConnectionAppSetting":"UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "OPENAI_MODEL":"gpt-4",
    "OPENAI_API_KEY":"sk-12345"
  }
}
```
When you run it in Azure configure the values accordingly