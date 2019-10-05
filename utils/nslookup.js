const nslookupOriginal = require('nslookup');

const nslookup = (domain, type) => {
	return new Promise((resolve, reject) => {
		nslookupOriginal(domain).type('mx').end((err, addrs) => {
			if (err) {
				reject(err);
			} else {
				resolve(addrs);
			}
		})
	});
};

module.exports = nslookup;
