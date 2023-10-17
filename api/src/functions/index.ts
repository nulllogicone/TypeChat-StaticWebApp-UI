import { AzureFunction, Context, HttpRequest } from "@azure/functions"

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const inputText = (req.body && req.body.text) || "No Input";
    const outputText = `Hello, ${inputText}!`;

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: { text: outputText }
    };
};

export default httpTrigger;
