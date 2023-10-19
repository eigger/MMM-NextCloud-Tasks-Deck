/* eslint-disable indent */
const { createClient } = require("webdav");
const ical = require('node-ical');
const transformer = require("./transformer");

function initWebDav(config) {
    return client = createClient(config.listUrl, config.webDavAuth);
}

function parseList(icsStrings) {
    let elements = [];
    for (const icsStr of icsStrings) {
        const icsObj = ical.sync.parseICS(icsStr);
        Object.values(icsObj).forEach(element => {
            
            if (element.type === 'VTODO')
            {
                //console.log(element);
                elements.push(element);
            }
            else if (element.type === 'VCALENDAR')
            {
                Object.values(element).forEach(value => {
                    if (value.type === 'VTODO')
                    {
                        //console.log(value);
                        elements.push(value);
                    }
                });
            }
            //elements.push(element);
        });
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
    return icsStrings;
}

module.exports = {
    parseList: parseList,
    fetchList: fetchList
};
