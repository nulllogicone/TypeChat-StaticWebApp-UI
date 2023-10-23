// Copyright (c) .NET Foundation. All rights reserved.
// Licensed under the MIT License.

import * as crypto from 'crypto';

export function getRandomHexString(length = 10): string {
    const buffer: Buffer = crypto.randomBytes(Math.ceil(length / 2));
    let result = buffer.toString('hex').slice(0, length);
    console.log(result);
    return result;
}

if (require.main === module) {
    const lengthArg = parseInt(process.argv[2], 10);

    // If lengthArg is a valid number, use it. Otherwise, the function will use its default.
    if (!isNaN(lengthArg)) {
        getRandomHexString(lengthArg);
    } else {
        getRandomHexString();
    }
}