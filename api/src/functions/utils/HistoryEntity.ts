import { HttpRequest, HttpResponseInit, InvocationContext, input, output } from "@azure/functions";


export interface HistoryEntity {
    PartitionKey: string;
    RowKey: string;
    Prompt: string;
    Response: string;
    User: object;
}
export const tableOutput = output.table({
    tableName: 'History',
    connection: 'MyStorageConnectionAppSetting'
});

export const tableInput = input.table({
    tableName: 'History',
    partitionKey: '{paramValue}',
    connection: 'MyStorageConnectionAppSetting',
    take: 5
});

const maxDate = new Date("9999-12-31");

// Returns a value that can be used as RowKey to order entities by data descending (newest first).
// It calculates the difference between maxDate and the current date, and returns it as a string.
export function getRowKeyValue(): string {
    return (maxDate.getTime() - (new Date()).getTime()).toString();
}

