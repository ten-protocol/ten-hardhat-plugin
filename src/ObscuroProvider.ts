import { ProviderWrapper } from 'hardhat/plugins'
import { EIP1193Provider, EthereumProvider, RequestArguments } from 'hardhat/types';


export class ObscuroProvider extends ProviderWrapper {

  shadow: Promise<EIP1193Provider>

  constructor(_wrappedProvider: EIP1193Provider, initializationPromise: Promise<EthereumProvider>) {
    super(_wrappedProvider);
    this.shadow = initializationPromise;
  }

  public async request(args: RequestArguments) {
    console.log(JSON.stringify(args));
    return (await this.shadow).request(args);
  }
}
