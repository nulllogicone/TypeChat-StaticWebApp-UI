import { app, HttpRequest, HttpResponseInit, InvocationContext, output } from "@azure/functions";

const maxDate = new Date("9999-12-31");

const tableOutput = output.table({
    tableName: 'History',
    connection: 'MyStorageConnectionAppSetting'
});

interface HistoryEntity {
    PartitionKey: string;
    RowKey: string;
    Prompt: string;
    Response: string;
}

export async function indexChat(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const requestBody = JSON.parse(await request.text());
    let prompt = requestBody.prompt;

    var fake = {
        "message": `on the index page we don't really call ChatGpt, just echo: ${prompt}`,
        "reason": "It would cost too much money"
    }

    // Save the request message to Azure Table Storage.
    const history: HistoryEntity[] = [];
    var rowKeyValue = (maxDate.getTime() - (new Date()).getTime()).toString();
    history.push({
        PartitionKey: context.functionName,
        RowKey: rowKeyValue,
        Prompt: prompt,
        Response: JSON.stringify(fake)
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
