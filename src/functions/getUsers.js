const { makeResponse } = require('../helpers/makeResponse');
const AWS = require('aws-sdk');

const DYNAMODB_TABLE = process.env.APP_DYNAMODB_TABLE;

module.exports.handler = async () => {
  console.log('Starting get users....');

  try {
    const docClient = new AWS.DynamoDB.DocumentClient();

    let params = { TableName: DYNAMODB_TABLE };

    let scanResults = [];
    let items;

    do {
        items = await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey = items.LastEvaluatedKey;
    } while (typeof items.LastEvaluatedKey != "undefined");

    return makeResponse({
      statusCode: 200,
      data: items.Items,
    });
  } catch (error) {
    console.log(error);

    return makeResponse({
      statusCode: 500,
      message: error,
    });
  }
};
