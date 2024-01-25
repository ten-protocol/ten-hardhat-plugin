import { extendConfig, extendEnvironment, extendProvider } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { EIP1193Provider, EthereumProvider, HardhatConfig, HardhatUserConfig, HttpNetworkConfig, HttpNetworkUserConfig, NetworkConfig } from "hardhat/types";
import { task } from "hardhat/config";
import { createProvider } from "hardhat/internal/core/providers/construction";


import "@nomicfoundation/hardhat-ethers";

import { TenGatewayClient } from "./TenGatewayClient";
// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";
import "./tasks";
import { TenProvider } from "./TenProvider";

extendEnvironment((hre) => {
  var httpConfig = (hre.network.config as HttpNetworkConfig);
  if (httpConfig.url == null) {
    return;
  }

  if (!(httpConfig.useGateway != null && httpConfig.useGateway === true && httpConfig.url.includes('127.0.0.1'))) {
    if (httpConfig.useGateway != null && httpConfig.useGateway !== true) {
      return;
    }

    if (!httpConfig.url.includes("obscu.ro") && !httpConfig.url.includes("ten.xyz")) {
      return;
    }
  }
  console.log("Obscuro URL detected! Initializing plugin.");

  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.gateway = lazyObject(() => new TenGatewayClient(httpConfig.url, httpConfig.gatewayID));

  const initializeGateway = new Promise<EthereumProvider>(async (resolve)=>{
    const url = await hre.run("ten:gateway:join");
    httpConfig.url = url;
    httpConfig.gatewayID = hre.gateway.token;
    await hre.run("ten:gateway:authenticate");
    resolve(await createProvider(hre.config, hre.network.name, hre.artifacts));
  });

  extendProvider(async(provider: EIP1193Provider, config, network)=>{
    return new TenProvider(provider, initializeGateway);
  });

  Object.keys(hre.tasks).forEach((key: string)=>{
    const skipTasks = [
      "ten:gateway:join", 
      "ten:gateway:authenticate",
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


export const tenSepolia = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://testnet.obscu.ro/v1/";
  return cfg;
}


export const ten = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://testnet.obscu.ro/v1/";
  return cfg;
}


export const tenUAT = function(cfg: HttpNetworkUserConfig) : HttpNetworkUserConfig {
  cfg.url = "https://uat-testnet.obscu.ro/v1/";
  return cfg;
}
