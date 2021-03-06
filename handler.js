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
              result
            })
          })
        })
        .catch(callback)
      break
    }
    case 'POST': {
      if (event.body) {
        let name
        try {
          name = JSON.parse(event.body).name
          if (!name) {
            callback(null, {
              statusCode: 400,
              body: JSON.stringify({message: `Parameter 'name' is required!`})
            })
            break
          }
        } catch (err) {
          callback(null, {
            statusCode: 400,
            body: JSON.stringify({message: `Expected to receive JSON string as a request body.`})
          })
          break
        }
        dynamodb.putItem({
          Item: {
            'name': {
              S: name
            }
          },
          ReturnConsumedCapacity: 'TOTAL',
          TableName
        })
          .promise()
          .then(result => {
            callback(null, {
              statusCode: 200,
              body: JSON.stringify({
                result
              })
            })
          })
          .catch(callback)
      } else {
        callback(null, {
          statusCode: 400,
          body: JSON.stringify({message: `Parameter 'name' is required!`})
        })
      }
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
