# Ten Connection Plugin

This is the Ten protocol connection plugin for Hardhat, written in typescript. The plugin will automatically join and 
authenticate all accounts with Ten via the Ten Gateway, and thus these operations do not need to be performed manually 
prior to running. For more information on joining and authenticating against Ten see the user documentation to 
[set up your wallet](https://docs.ten.xyz/docs/getting-started/for-users/setup-you-wallet).

## Setup

To use the plugin you can run the following command:

```bash
npm install ten-hardhat-plugin
```

Note that the plugin has minimum requirements for the hardhat peer dependency version as older versions do not have the 
ability to override the web3 provider. Once the dependency is installed you can just import it with:

```
import 'ten-hardhat-plugin'
```

This will add new options to the network config and run the plugin on startup to join and authenticate whenever the 
target network is Ten. Note that the plugin scans the URL automatically to determine if the network is Ten. If you want 
to stop this behaviour you should set the config parameter `useGateway` to False. If you want to force it to assume the 
network is Ten (e.g. when running against a local testnet), you should set `useGateway` to True. An example config is 
given below;

```
require("@nomicfoundation/hardhat-toolbox");
require("ten-hardhat-plugin")

const { PK } = process.env;

module.exports = {
  solidity:  "0.8.19",
  defaultNetwork: "ten",
  networks: {
  ten: {
    deploy: [ "scripts/" ],
    chainId: 443,
    url: `https://testnet.ten.xyz/v1/`,
    accounts: [ `0x${PK}` ]   
   }
}
```

Note in this instance `useGateway` does not need to be supplied as the plugin will scan the URL and determine you are 
connecting to Ten. 

## Installation

To start working on your project, just run

```bash
npm install
```

## Testing the plugin during local development

First compile the plugin's typescript:

```bash
npm run build
```

And then go to the `dist` folder and create an npm sym link:

```bash
cd ./dist
npm link
```

Then in your project where you want to import the dev version of the plugin do:

```bash
npm link ../path/to/plugin/folder
```
