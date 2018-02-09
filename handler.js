'use strict';

const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'})

module.exports.hello = (event, context, callback) => {
  const TableName = 'booksTable'

  switch (event.httpMethod) {
    case 'GET': {
      dynamodb.scan({TableName}).promise()
        .then(result => {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              result,
              input: event
            })
          })
        })
        .catch(callback)
      break
    }
    case 'POST': {

      break
    }
    default: {
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({message: `This API doesn't support HTTP Method '${event.httpMethod}'`})
      })
    }
  }

}
