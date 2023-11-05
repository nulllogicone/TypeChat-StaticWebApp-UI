import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import * as fs from "fs";
import * as path from "path";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { Resume } from "./resumeSchema";
import { HistoryEntity, tableOutput, getRowKeyValue } from "./utils/HistoryEntity";

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "resumeSchema.ts"), "utf8");
const translator = createJsonTranslator<Resume>(model, schema, "Resume");

export async function resumeChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function name: "${context.functionName}" processed request for url "${request.url}"`);

    const requestBody = JSON.parse(await request.text());
    let prompt = requestBody.prompt || 'say something funny';

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

app.http('resumeChat', {
    methods: ['POST'],
    authLevel: 'anonymous',
    extraOutputs: [tableOutput],
    handler: resumeChat
});
