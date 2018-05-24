# bankex-nfc-eth

BANKEX NFC Ethereum smart contract based accounting.

NFC card's unique identifier are being used as a key in ERC-20-like smart contract.

## Prerequisites

### Hardware

* NFC tag reader (tested with ACR122U USB).
* Raspberry Pi (recommended) or any Linux-based PC (Debian/Ubuntu is recommended)

## Installing

### General

```bash
sudo apt update
sudo apt -y install subversion autoconf debhelper flex libusb-dev libpcsclite-dev libpcsclite1 libccid pcscd pcsc-tools libpcsc-perl libusb-1.0-0-dev libtool libssl-dev cmake checkinstall
```

### Node.js

* Follow the instruction to install [NVM](https://github.com/creationix/nvm)
* Install node-gyp module ```npm install -g node-gyp```

###libnfc

Download actual release of [nfclib](https://github.com/nfc-tools/libnfc/releases) library, e.g. libnfc-1.7.1.tar.bz2. Unzip it to temp directory and ```cd``` into it.

```bash
./configure --with-drivers=acr122_usb
make
sudo make install
```

### App node modules

Clone git and ```cd``` to project directory.

```bash
npm install
```

## Configuring

* Deploy contract **./contracts/nfctoken.sol** to Ethereum
* Add your local address to whitelist in deployed contract
* Place local geth keystore json key file to **./keystore/key.json**
* Place plain text password to file **./keystore/password.txt**
* ```cp config-example.yml config.yml```
* Edit **config.yml** to set up correct geth/parity node RPC address

## Running

Clone git and ```cd``` to project directory.

```bash
npm install
npm start
```