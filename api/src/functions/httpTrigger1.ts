import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
// import fs from "fs";
// import path from "path";
// import dotenv from "dotenv";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";
import { createLanguageModel, createJsonTranslator, processRequests } from "typechat";
import { Cart } from "../examples/coffeeShop/src/coffeeShopSchema";


// // TODO: use local .env file.
dotenv.config({ path: path.join(__dirname, "../../../../.env") });

const model = createLanguageModel(process.env);
const schema = fs.readFileSync(path.join(__dirname, "coffeeShopSchema.ts"), "utf8");
const translator = createJsonTranslator<Cart>(model, schema, "Cart");

function processOrder(cart: Cart) {
    // Process the items in the cart
    void cart;
}

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

    const response = await translator.translate(prompt);
    if (!response.success) {
        console.log(response);
        return;
    }
    const cart = response.data;
    console.log(JSON.stringify(cart, undefined, 2));

    return {
        body: JSON.stringify(cart, undefined, 2),
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
