import { extendConfig, extendEnvironment, extendProvider } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { EIP1193Provider, HttpNetworkConfig, HttpNetworkUserConfig, NetworkConfig } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers";

import { ObscuroGatewayClient } from "./ObscuroGatewayClient";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";
import "./tasks";

extendEnvironment((hre) => {
  var httpConfig = (hre.network.config as HttpNetworkConfig);
  if (httpConfig.url == null) {
    return;
  }

  if (httpConfig.useGateway != null && httpConfig.useGateway !== true) {
    return;
  }

  if (!httpConfig.url.includes("obscu.ro")) {
    return;
  }
  
  console.log("Obscuro URL detected! Initializing plugin.");

  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.gateway = lazyObject(() => new ObscuroGatewayClient(httpConfig.url, httpConfig.gatewayID));

  const initializeGateway = new Promise(async (resolve)=>{
    const args = { };
    const url = await hre.run("obscuro:gateway:join", args);
    httpConfig.url = url;
    await hre.run("obscuro:gateway:authenticate", args);
    resolve(true);
  });

  Object.keys(hre.tasks).forEach((key: string)=>{
    const skipTasks = [
      "obscuro:gateway:join", 
      "obscuro:gateway:authenticate",
      "help",
      "compile",
      "clean"
    ];
    
    if (skipTasks.includes(key) == true) {
      return;
    }

    task(key)
    .setDescription(hre.tasks[key]?.description || "")
    .setAction(async (args, env, runSuper)=>{
      //console.log(key);
      await initializeGateway;
      return await runSuper(args);
    });
  });
});


extendProvider(async(provider: EIP1193Provider, config, network)=>{
  const cfg = (config.networks[network] as HttpNetworkConfig);
  if (!cfg?.url?.includes("obscu.ro")) {
    return provider;
  }

  console.log(`Provider override. Cfg = ${cfg.url}`);
  return provider;
});



export const obscuroSepolia = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://testnet.obscu.ro/v1/";
  return cfg;
}


export const obscuro = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://testnet.obscu.ro/v1/";
  return cfg;
}


export const obscuroUAT = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://uat-testnet.obscu.ro/v1/";
  return cfg;
}
