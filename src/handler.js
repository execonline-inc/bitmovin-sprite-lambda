import BitmovinSpriteLambda from './BitmovinSpriteLambda';

'use strict';
require('dotenv').config();
const jf = require('jsonfile');

function processMessage(event) {
  let message = event.body;
  message = JSON.parse(message);
  return message;
}

function entry(event, context, callback) {
  const bit = new BitmovinSpriteLambda();
  console.log('Starting new bitmovin sprite creation');
  const message = processMessage(event);
  bit.start(message)
    .then((result) => {
      console.log('Successfully transferred sprite jpg and vtt files to S3', result);
      let message = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Successfully transferred sprite and completed execution of function, " + JSON.stringify(result)
      }
      callback(null, message);
    })
    .catch((error) =>{
      console.log("ERROR failed to transfer sprite to S3", error);
      let message = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
      callback(null, message);
    }
  );
}

function test() {
  const bit = new BitmovinSpriteLambda();
  console.log('Starting new bitmovin sprite creation');
  const event = jf.readFileSync('event.json');
  const message = processMessage(event);
  bit.start(message)
    .then((result) => {
      console.log('Successfully transferred sprite jpg and vtt files to S3', result);
      let message = {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Successfully transferred sprite and completed execution of function, " + JSON.stringify(result)
      }
    })
    .catch((error) =>{
      console.log("ERROR failed to transfer sprite to S3", error);
      let message = {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json"
        },
        body: "Error, " + JSON.stringify(error)
      }
    }
  );
}

module.exports = {
  entry,
  test,
};
