const formParser = require('lambda-multipart-parser');
const { makeResponse } = require('../helpers/makeResponse');
const AWS = require('aws-sdk');

const BUCKET_NAME = process.env.APP_S3BUCKET_NAME;
const DYNAMODB_TABLE = process.env.APP_DYNAMODB_TABLE;

module.exports.handler = async (event) => {
  const formData = await formParser.parse(event);
  const {
    files,
    name,
    dob,
    role,
    email,
  } = formData || {};

  if (!files.length || !name || !dob) {
    return makeResponse({
      statusCode: 400,
      message: 'Picture, name, dob required',
    });
  }

  console.log('Validate data success');

  try {
    const s3 = new AWS.S3();
    const dynamoDB = new AWS.DynamoDB();

    await s3.putObject({
      Bucket: BUCKET_NAME,
      Key: files[0].filename,
      Body: files[0].content,
      ACL:'public-read',
    }).promise();

    await dynamoDB.putItem({
      TableName: DYNAMODB_TABLE,
      Item: {
        email: { S: email },
        role: { S: role },
        userData: { S: JSON.stringify({ name, dob, avatar: files[0].filename }) },
      }
    }).promise();

    return makeResponse({
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);

    return makeResponse({
      statusCode: 500,
      message: error,
    });
  }
};
