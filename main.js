import { parserAvitoProfile } from './update-list-ads.js';
import { updateProductsArray } from './db.js';
import { advancedParsingAd } from './advancedParsingAd.js';

async function run() {
    const dataProfile = await parserAvitoProfile();
    const statusIds = await updateProductsArray(dataProfile);
    const changedstatusToHigh = await advancedParsingAd();

    return changedstatusToHigh;
}
console.log(await run());