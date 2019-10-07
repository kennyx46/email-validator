module.exports = [
	{
		script: './server/bin/www',
		name: 'app',
		exec_mode: 'cluster',
		instances: 2
	},
	{
		script: './server/workers/emailWorker.js',
		name: 'worker'
	}
];
