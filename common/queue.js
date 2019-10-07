const amqplib = require('amqplib');
const { rabbitmq } = require('./config');
let channel;

const initChannel = async () => {
	const connection = await amqplib.connect(rabbitmq.connectionUrl);
	channel = await connection.createChannel();
	return channel;
}

const sendMessage = async (data, options) => {
	if (!channel) {
		await initChannel();
	}

	const sendResult = await channel.sendToQueue('email-validation', Buffer.from(JSON.stringify(data)), options);

	return sendResult;
}

const consume = async (cb) => {
	if (!channel) {
		await initChannel();
	}

	channel.consume('email-validation', cb, { noAck: true });
}


module.exports.initChannel = initChannel;
module.exports.sendMessage = sendMessage;
module.exports.consume = consume;
