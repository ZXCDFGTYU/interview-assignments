'use strict';
const { fs } = require("fs");
const { request } = require("promise-request");

const FILE_PATH = "./dataset";

let dataset_str = fs.readFileSync(FILE_PATH).toString();

if (!dataset_str) {
    console.log("data empty!");
    return;
}

let dataset_list = dataset_str.split("\n");

if (!dataset_list.length) {
    console.log("dataset empty!");
    return;
}

let dataset = [];

for (let i = 0; i < dataset_list.length; i++) {
    let dataset_item_str = dataset_list[i].trim();

    // raw empty
    if (!dataset_item_str) {
        console.log("line " + (i + 1) + ": raw empty.");
        continue;
    }

    let dataset_item_set = dataset_item_str.split(" ");

    // deviceName
    let device_name = dataset_item_set[2];

    // if "deviceName" not matched, this step will be continue
    if (!device_name.match(/\w+/)) {
        console.log("line: " + (i + 1) + ": deviceName not matched.");
        continue;
    }

    // processId
    // match: (com.apple.mdworker.bundles[12610])
    let process_id = "";

    let match_ref = dataset_item_str.match(/\(\w+\.{2}\w+[\[|\.]\d+\]]\)/);

    if (match_ref && match_ref[1].search(/\(\w+\.{2,}\w+[\[|\.]\d+\]]\)/)) {
        console.log("Line " + (i + 1) + ": " + match_ref[1]);
        dataset.push(match_ref[1]);
    }

    // match: com.apple.xpc.launchd[1]
    if (!match_ref) {
        dataset.push(dataset_item_set[4].replace(":", ""));
    }
}

let ref = sendDataToUrl(dataset);

console.log(ref);

function sendDataToUrl(data) {
    let resp = await request({
        scheme: "https",
        url: "https://foo.com/bar",
        method: "post",
        body: dataset
    });
}