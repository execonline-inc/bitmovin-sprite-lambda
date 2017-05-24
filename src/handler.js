import BitmovinSpriteLambda from './BitmovinSpriteLambda';

'use strict';
require('dotenv').config();
const jf = require('jsonfile');

function processMessage(event) {
  let message = event.body;
  message = JSON.parse(message);
  return message;
}

const successMessage = (res) => {
  console.log('Successfully transferred sprite jpg and vtt files to S3', res);
  let message = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: "Successfully transferred sprite and completed execution of function, " + JSON.stringify(res)
  }
  console.log("Success message: ", message);
  return message;
}

const errorMessage = (error) => {
  console.log("ERROR failed to transfer sprite to S3", error);
  let message = {
    statusCode: 500,
    headers: {
      "Content-Type": "application/json"
    },
    body: "Error, " + JSON.stringify(error)
  }
  console.log("Error message: ", message);
  return message;
}

function entry(event, context, callback) {
  const bit = new BitmovinSpriteLambda();
  console.log('Starting new bitmovin sprite creation');
  const message = processMessage(event);
  bit.start(message)
    .then((res) => {
      callback(null, successMessage(res));
    })
    .catch((error) => {
      callback(null, errorMessage(error));
    }
  );
}

function test() {
  const bit = new BitmovinSpriteLambda();
  console.log('Starting new bitmovin sprite creation');
  const event = jf.readFileSync('event.json');
  const message = processMessage(event);
  bit.start(message)
    .then((res) => {
      successMessage(res);
    })
    .catch((error) =>{
      errorMessage(error);
    }
  );
}

module.exports = {
  entry,
  test,
};
