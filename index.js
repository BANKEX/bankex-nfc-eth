const config = require('config-yml');
const Web3Utils = require('web3-utils');
const nfc = require('./nfc');
const eth = require('./eth');

const readline = require('readline');
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

console.log("Loading...");

eth.init(config.eth.provider.url, config.contract.address, function () {
});

nfc.init(function (uid) {
	console.log(`Card ${uid} applied`);
	
	eth.balanceOf(uid, function (balance) {
		console.log(`Current balance: ${web3.utils.fromWei(balance, 'Kwei')} L`);
		
		rl.question('Please specify the amount to deposit in liters: ', (amountString) => {
			if (amountString.length > 0) {
				const amount = new Web3Utils.BN(Math.floor(parseFloat(amountString) * 1000.0));
				console.log(`${amount} ml will be deposited to ${uid}...`);
				eth.deposit(uid, amount);
			} else {
				console.log("Cancelled");
			}
		});
	});
});
