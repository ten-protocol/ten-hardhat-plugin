// If your plugin extends types from another plugin, you should import the plugin here.

// To extend one of Hardhat's types, you need to import the module where it has been defined, and redeclare it.
import { EIP1193Provider } from "hardhat/types";
import "hardhat/types/config";
import "hardhat/types/runtime";

import { TenGatewayClient } from "./TenGatewayClient";

declare module "hardhat/types/config" {
  // This is an example of an extension to one of the Hardhat config values.

  export interface HttpNetworkUserConfig {
    useGateway?: boolean;
    gatewayID?: string;
  }

  export interface HttpNetworkConfig {
    useGateway?: boolean;
    gatewayID?: string;
    initialized: Promise<boolean>;
  }
}

declare module "hardhat/types/runtime" {
  // This is an example of an extension to the Hardhat Runtime Environment.
  // This new field will be available in tasks' actions, scripts, and tests.
  export interface HardhatRuntimeEnvironment {
    gateway: TenGatewayClient;
  }
}
