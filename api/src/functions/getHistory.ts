import { app, HttpRequest, HttpResponseInit, InvocationContext, input } from "@azure/functions";

const tableInput = input.table({
    tableName: 'History',
    partitionKey: 'CoffeeShop',
    connection: 'MyStorageConnectionAppSetting'
});

interface HistoryEntity {
    PartitionKey: string;
    RowKey: string;
    Prompt: string;
    Response: string;
}

export async function getHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    const history = <HistoryEntity>context.extraInputs.get(tableInput);

    return { 
        body: JSON.stringify(history, undefined, 2),
        headers: {
            'Content-Type': 'application/json'
        } 
    };
};

app.http('getHistory', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [tableInput],
    handler: getHistory
});
