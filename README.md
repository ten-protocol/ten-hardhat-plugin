# Ten Connection Plugin

This is the Ten protocol connection plugin for Hardhat written in typescript.

## Setup

To use the plugin you can run the following command:

```bash
npm install ten-hardhat-plugin
```

Note that the plugin has minimum requirements for the hardhat peer dependency version as older versions do not have the ability to override the web3 provider.

Once the dependency is installed you can just import it with:

```
import 'ten-hardhat-plugin'
```

This will add new options to the network config and run the plugin on startup whenever the target network is obscuro one. Note that the plugin scans the URL automatically. If you want to stop this behaviour you should set:

```json
network {
  "useGateway":false
}
```

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
