module.exports = {
	port: parseInt(process.env.PORT || 3000),
	postgres: {
		dialect: 'postgres',
		database: process.env.DATABASE_NAME,
		username: process.env.DATABASE_USERNAME,
		password: process.env.DATABASE_PASSWORD,
		host: process.env.DATABASE_HOST,
		port: process.env.DATABASE_PORT,
		url: process.env.DATABASE_URL
	},
	rabbitmq: {
		connectionUrl: process.env.CLOUDAMQP_URL || process.env.RABBITMQ_URL
	}
};
