import { app, HttpRequest, HttpResponseInit, InvocationContext, input } from "@azure/functions";

const tableInput = input.table({
    tableName: 'History',
    partitionKey: '{paramValue}',
    connection: 'MyStorageConnectionAppSetting',
    take: 5
});

interface HistoryEntity {
    PartitionKey: string;
    RowKey: string;
    Prompt: string;
    Response: string;
}

export async function getHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`getHistory processed request for url "${request.url}"`);

    // Get the 'param' query parameter from the request
    const paramValue = request.query.get('param');
    const history = <HistoryEntity>context.extraInputs.get(tableInput);

    return { 
        body: JSON.stringify(history),
        headers: {
            'Content-Type': 'application/json'
        } 
    };
};

app.http('getHistory', {
    route: 'getHistory/{paramValue}',
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    extraInputs: [tableInput],
    handler: getHistory
});
