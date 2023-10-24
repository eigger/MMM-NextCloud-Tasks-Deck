/* eslint-disable indent */
const { createClient } = require("webdav");
const ical = require('node-ical');
const transformer = require("./transformer");

function initWebDav(config) {
    return client = createClient(config.listUrl, config.webDavAuth);
}

function extractWithSummary(obj, elements = []) {
    if (obj.summary !== undefined) {
        elements.push(obj);
    } else {
        Object.values(obj).forEach(value => {
            if (typeof value === 'object') {
                extractWithSummary(value, elements);
            }
        });
    }
    return elements;
}

function parseList(icsStrings) {
    let elements = [];
    for (const icsStr of icsStrings) {
        const icsObj = ical.sync.parseICS(icsStr);
        extractWithSummary(icsObj, elements);
    }
    return elements;
}

async function fetchList(config) {
    const client = initWebDav(config);
    const directoryItems = await client.getDirectoryContents("/");

    let icsStrings = [];
    for (const element of directoryItems) {
        const icsStr = await client.getFileContents(element.filename, { format: "text" });
        icsStrings.push(icsStr);
    }
    //console.log(icsStrings);
    return icsStrings;
}

module.exports = {
    parseList: parseList,
    fetchList: fetchList
};
