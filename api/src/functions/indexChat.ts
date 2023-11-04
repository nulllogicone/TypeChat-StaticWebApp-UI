import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";
import { configDotenv } from "dotenv";
import { machine } from "os";
import { env } from "process";
import { HistoryEntity } from "./HistoryEntity";


const maxDate = new Date("9999-12-31");

const tableOutput = output.table({
    tableName: 'History',
    connection: 'MyStorageConnectionAppSetting'
});


export async function indexChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const requestBody = JSON.parse(await request.text());
    let prompt = requestBody.prompt;

    var fake = {
        "message": "On the index page we don't really call ChatGpt, just echo your prompt",
        "prompt": prompt,
        "reason": "It costs money to call ChatGpt and I don't want to risk brute force abuse",
        "user": request.user
    }

    // Save the request message to Azure Table Storage.
    const history: HistoryEntity[] = [];
    var rowKeyValue = (maxDate.getTime() - (new Date()).getTime()).toString();
    history.push({
        PartitionKey: context.functionName,
        RowKey: rowKeyValue,
        Prompt: prompt,
        Response: JSON.stringify(fake),
        User: request.user
    });
    context.extraOutputs.set(tableOutput, history);

    return {
        body: JSON.stringify(fake, undefined, 2),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

app.http('indexChat', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraOutputs: [tableOutput],
    handler: indexChat
});
