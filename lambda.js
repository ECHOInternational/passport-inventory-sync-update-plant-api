var AWS = require("aws-sdk");
AWS.config.update({region: 'us-east-1'});
const request = require("request-promise-native");

const sqs = new AWS.SQS();

const incoming_queue_url = process.env.TASK_QUEUE_URL;

var options = {
	url: process.env.API_BASE_URL + "plant-stock-items/touch/",
	json: true,
	auth: {
		'user': process.env.USERNAME,
		'pass': process.env.PASSWORD,
		'sendImmediately': true
	},
	data: null
};

exports.handler = function(event, context, callback) {
	records = event.Records;

	options.data = JSON.parse(records[0].body);
	console.log(options.data);

	request.post(options).then(
		function(response){
			console.log(response);
			finish(records[0].receiptHandle, callback);
		},
		callback
	);
};

function finish(receipt_handle, callback){
	sqs.deleteMessage({
      ReceiptHandle: receipt_handle,
      QueueUrl: incoming_queue_url
    }, callback);
}