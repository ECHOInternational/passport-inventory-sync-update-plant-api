var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const request = require("request-promise-native");

const sqs = new AWS.SQS();

const incoming_queue_url = process.env.TASK_QUEUE_URL;

const headers = {
  'Accept': 'application/vnd.api+json'
};

exports.handler = function(event, context, callback) {
	records = event.Records;
	data = records[0].body;

	console.log(data);

	finish(records[0].receiptHandle, callback);
};

function finish(receipt_handle, callback){
	sqs.deleteMessage({
      ReceiptHandle: receipt_handle,
      QueueUrl: incoming_queue_url
    }, callback);
}