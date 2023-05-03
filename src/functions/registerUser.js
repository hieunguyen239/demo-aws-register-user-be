const formParser = require('lambda-multipart-parser');
const {makeResponse} = require('../helpers/makeResponse');

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

  return makeResponse({
    statusCode: 200,
  });
};
