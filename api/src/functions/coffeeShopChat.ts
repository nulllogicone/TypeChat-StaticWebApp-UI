import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { Cart } from "./coffeeShopSchema";
import {HistoryEntity,tableOutput,getRowKeyValue} from "./utils/HistoryEntity";

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "coffeeShopSchema.ts"), "utf8");
const translator = createJsonTranslator<Cart>(model, schema, "Cart");

export async function coffeeShopChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function name: "${context.functionName}" processed request for url "${request.url}"`);

    const requestBody = JSON.parse(await request.text());
    let prompt = requestBody.prompt;

    // Get response from TypeChat
    const response = await translator.translate(prompt);
    if (!response.success) {
        console.log(response);
        context.error(response);
        return;
    }
    const cart = response.data;

    // Save the request message to Azure Table Storage.
    const history: HistoryEntity[] = [];
    history.push({
        PartitionKey: context.functionName,
        RowKey: getRowKeyValue(),
        Prompt: prompt,
        Response: JSON.stringify(cart),
        User: request.user
    });
    context.extraOutputs.set(tableOutput, history);

    return {
        body: JSON.stringify(cart, undefined, 2),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

app.http('coffeeShopChat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [tableOutput],
    handler: coffeeShopChat
});
