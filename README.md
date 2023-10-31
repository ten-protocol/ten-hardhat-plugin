# Obscuro Connection Plugin

This is the Obscuro Connection Plugin for Hardhat written in hardhat.

## Setup

To use the plugin you can run the following command:

```bash
npm install hh-obscuro-plugin
```

Note that the plugin has minimum requirements for the hardhat peer dependency version as older versions do not have the ability to override the web3 provider.

Once the dependency is installed you can just import it with:

```
import 'hh-obscuro-plugin'
```

This will add new options to the network config and run the plugin on startup whenever the target network is obscuro one. Note that the plugin scans the URL automatically. If you want to stop this behaviour you should set:

```json
network {
  useGateway:false
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
