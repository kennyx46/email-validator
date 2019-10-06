module.exports = [
	{
		script: './bin/www',
		name: 'app',
		exec_mode: 'cluster',
		instances: 2
	},
	{
		script: './workers/emailWorker.js',
		name: 'worker'
	}
];
