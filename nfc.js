const { NFC } = require('nfc-pcsc');
const nfc = new NFC();

module.exports = {
	init: function (cardApplyCallback) {
		console.log("NFC initing...");
		
		nfc.on('reader', reader => {
			console.log(`Reader ${reader.reader.name} attached`);

			reader.on('card', card => {
				cardApplyCallback(card.uid);
			});

			reader.on('card.off', card => {
			});

			reader.on('error', err => {
				console.log('Card error');
			});

			reader.on('end', () => {
				console.log(`Reader ${reader.reader.name} removed`);
			});

		});

		nfc.on('error', err => {
			console.log('NFC error:', err);
		});
		
		console.log("NFC init done");
	}
}
