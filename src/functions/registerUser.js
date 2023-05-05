const formParser = require('lambda-multipart-parser');
const { makeResponse } = require('../helpers/makeResponse');
const AWS = require('aws-sdk');

module.exports.handler = async (event) => {
  const formData = await formParser.parse(event);
  const {
    files,
    name,
    dob,
  } = formData || {};

  if (!files.length || !name || !dob) {
    return makeResponse({
      statusCode: 400,
      message: 'Picture, name, dob required',
    });
  }
  try {
    const s3 = new AWS.S3();
    await s3.putObject({
      Bucket: 'local-bucket',
      Key: 'test.txt',
      Body: new Buffer("abcd")
    }).promise;

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

  // console.log(2222222);

  // return makeResponse({
  //   statusCode: 200,
  // });
};
