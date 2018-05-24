const async = require("async");
const Promise = require('promise');
const fs = require('fs');
const read = Promise.denodeify(fs.readFile);
const Web3 = require("web3");
const keythereum = require("keythereum");

var account;
var contract, contractAbi, contractAddress;
var keyObject, keyPassword, privateKey;

module.exports = {
	init: function (providerUrl, address, success) {
		console.log("ETH initing...");

		contractAddress = address;
		console.log("Contract address:", contractAddress)

		async.parallel([
			function (callback) {
				read('./keystore/key.json', 'utf8').then(function (str) {
					keyObject = JSON.parse(str);
					console.log('Key loaded ok');
					
					callback();
  				});
			},
			function (callback) {
				read('./keystore/password.txt', 'utf8').then(function (str) {
					keyPassword = str.trim();
					console.log('Password loaded ok');
					callback();
				});
			},
			function (callback) {
				read('./contracts/nfctoken.abi', 'utf8').then(function (str) {
					contractAbi = JSON.parse(str);
					console.log('Contract ABI loaded ok');
					callback();
				});
			}
		], function (err, results) {
			if (!err) {
				console.log('Decoding private key...');
				
				keythereum.recover(keyPassword, keyObject, function (key) {
					privateKey = `0x${key.toString('hex')}`;
					console.log('Private key ok');
					web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
					web3.eth.getGasPrice(function(err, res) {
						gasPrice = res;
						console.log('Current gas price:', res);
					});
					account = web3.eth.accounts.privateKeyToAccount(privateKey);
					console.log('Account created:', account.address);
					web3.eth.getBalance(account.address, function(err, res) {
						if (!err) {
							console.log(`Account balance: ${web3.utils.fromWei(res, 'ether')} ETH`);
						}
					});
					contract = new web3.eth.Contract(contractAbi, contractAddress);
					success();
					console.log('ETH init done');
				});
			}
		});
	},
	balanceOf: function (uid, success) {
		console.log('Retreiving balance...');
		
		if (contract) {
			contract.methods.balanceOf(uid).call(function (err, res) {
				if (!err) {
					success(res);
				}
			});
		}
	},
	deposit: function (uid, amount) {
		console.log(`Depositing ${amount}...`);
		
		if (contract) {
			web3.eth.getGasPrice(function(err, gasPrice) {
				var encodedABI = contract.methods.deposit(uid, amount).encodeABI();
				var tx = {
					from: account.address,
					to: contractAddress,
					gas: 2000000,
					gasPrice: gasPrice,
					data: encodedABI
				};
				console.log(tx);
				
				var signed = web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
					console.log('Signed TX:', signed);
					
					var tran = web3.eth.sendSignedTransaction(signed.rawTransaction);

					tran.on('confirmation', (confirmationNumber, receipt) => {
						console.log('confirmation: ' + confirmationNumber);
					});

					tran.on('transactionHash', hash => {
						console.log('hash');
						console.log(`https://etherscan.io/tx/${hash}`);
					});

					tran.on('receipt', receipt => {
						console.log('reciept');
						console.log(receipt);
					});

					tran.on('error', console.error);
				});
			});
		}
	}
}
