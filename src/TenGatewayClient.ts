import fetch from 'node-fetch';

export class TenGatewayClient {
  url: string;
  userId: string;

  constructor(url?: string, userId?: string) {
    this.url = url || "";
    this.userId = userId || "";
  }

  public initialize(url?: string, userId?: string) {
    this.url = url || "";
    this.userId = userId || "";
  }

  public async join() {
    if (this.userId != "") {
      return this.userId;
    }

    const response = await fetch(`${this.url}/join`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    this.userId = await (await response.blob()).text();
    return this.userId;
  }

  public setURL(url:string) {
    this.url = url;
  }

  public async register(address: string, sign:(arg:string)=>Promise<string>) {
    await this.ensureJoined();

    const message = `Register ${this.userId} for ${address.toLowerCase()}`;
    const body = JSON.stringify({
      message: message,
      signature: await sign(message) 
    });

    const response = await fetch(this.authenticateURL(), {
      method: 'POST',
      body: body,
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      const errStr = `Error status: ${response.status} ${await (await response.blob()).text()}`;
      console.log(errStr);
      throw new Error(errStr);
    }
  }

  public async query(address: string) {
    await this.ensureJoined();

    const response = await fetch(this.queryURL(address), {
      method: 'GET'
    })
    if (!response.ok) {
      throw new Error(`Error status: ${response.status} ${await (await response.blob()).text()}`);
    }

    const respJson = await response.json();
    return respJson.status;
  }

  public hasJoined() {
    return this.userId != "";
  }

  private async ensureJoined() {
    if (!this.hasJoined()) {
      throw new Error("Obscuro Gateway has not been joined yet!");
    }
  }

  private queryURL(address: string) {
    var url = new URL(`${this.url}query/address`);
    url.searchParams.append("u", this.userId);
    url.searchParams.append("a", address);
    return url;
  }

  private authenticateURL() {
    var url = new URL(`${this.url}authenticate/`);
    url.searchParams.append("u", this.userId);
    return url;
  }

  public proxyURL() {
    return this.url + this.userId;
  }
}
