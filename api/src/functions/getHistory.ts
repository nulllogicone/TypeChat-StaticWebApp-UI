import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { HistoryEntity, tableInput } from "./utils/HistoryEntity";

export async function getHistory(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`getHistory processed request for url "${request.url}"`);

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
