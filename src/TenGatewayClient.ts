import fetch from 'node-fetch';

export class TenGatewayClient {
  url: string;
  token: string;

  constructor(url?: string, userId?: string) {
    this.url = url || "";
    this.token = userId || "";
  }

  public initialize(url?: string, userId?: string) {
    this.url = url || "";
    this.token = userId || "";
  }

  public async join() {
    if (this.token != "") {
      return this.token;
    }

    const response = await fetch(`${this.url}/join`, {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    this.token = await (await response.blob()).text();
    return this.token;
  }

  public setURL(url:string) {
    this.url = url;
  }

  public async register(address: string, sign:(arg:string)=>Promise<string>) {
    await this.ensureJoined();

    const token = `${this.token}`;
    const body = JSON.stringify({
      address: address,
      signature: await sign(token) 
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
    return this.token != "";
  }

  private async ensureJoined() {
    if (!this.hasJoined()) {
      throw new Error("Obscuro Gateway has not been joined yet!");
    }
  }

  private queryURL(address: string) {
    var url = new URL(`${this.url}query/address`);
    url.searchParams.append("token", this.token);
    url.searchParams.append("a", address);
    return url;
  }

  private authenticateURL() {
    var url = new URL(`${this.url}authenticate/`);
    url.searchParams.append("token", this.token);
    return url;
  }

  public proxyURL() {
    var url = new URL(`${this.url}`);
    url.searchParams.append("token", this.token);
    return url.toString()
  }
}
