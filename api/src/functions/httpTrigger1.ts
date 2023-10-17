import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function httpTrigger1(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Http function processed request for url "${request.url}"`);

    // const name = request.query.get('text') || await request.text() || 'world';

    let prompt: string;

    if (request.method === "POST") {
        const requestBody = JSON.parse(await request.text());
        prompt = requestBody.prompt || 'world';
    } else {
        prompt = request.query.get('prompt') || 'world';
    }

    return {
        body: JSON.stringify({ message: `Hello, ${prompt}!` }),
        headers: {
            'Content-Type': 'application/json'
        }
    };
};

app.http('httpTrigger1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: httpTrigger1
});
