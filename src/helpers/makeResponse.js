module.exports = {
  makeResponse({ statusCode, message, data }) {
    return {
      statusCode,
      body: JSON.stringify(
        {
          message: statusCode === 200 ? 'ok' : message.toString(),
          data,
        },
        null,
        2
      ),
    };
  }
}
