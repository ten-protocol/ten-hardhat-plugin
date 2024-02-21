import { task } from "hardhat/config";


task("nothing").setAction(async ()=>{});

task("ten:gateway:join")
.setAction(async (args: any, hre) => {
  if (hre.gateway == null) {
    console.log("Gateway is not configured properly. Perhaps the network has a bad url?");
    return;
  }

  const userId = await hre.gateway.join();

  if (args?.verbose != null) {
    console.log(`Joined gateway! UserID is ${userId}. Starting account authentication...`);
  }

  return hre.gateway.proxyURL();
});

task("ten:gateway:authenticate")
.setAction(async(args:any, hre)=> {
  if (hre.gateway == null) {
    console.log(`Gateway not initialized; Unable to authenticate signers.`)
    return;
  }

  const signers = await hre.ethers.getSigners();
  if (args?.verbose != null) {
    console.log(`Found ${signers.length} signers configured for this network.`);
  }

  const promises = signers.map(async (signer) => {
      try {
        const isRegistered: boolean = await hre.gateway.query(signer.address);
        if (isRegistered == true) {
          console.log(`Account ${signer.address} is already registered with the gateway.`);
          return Promise.resolve();
        }

        if (args?.verbose != null) {
          console.log(`Registering account ${signer.address}...`);
        }
        const sign = async (arg: string)=>{ 
          let domain = {name: "Ten", version: "1.0", chainId: 443,}
          let types = {Authentication: [{name: "Encryption Token", type: "address"},],};
          let message = {"Encryption Token": "0x" + arg};
          return await signer.signTypedData(domain, types, message)
        };

        await hre.gateway.register(signer.address, sign);
      } catch(err) {
        console.error(`Encountered error while attempting to register with gateway: ${err}`)
        throw err
      }
  });

  await Promise.all(promises);
});

task("ten:gateway:status")
.setAction(async(args: any, hre)=> {
  if (hre.gateway == null) {
    return;
  }

  const signers = await hre.ethers.getSigners();
  const promises = signers.map(async(signer)=>{
    const res = await hre.gateway.query(signer.address);
    console.log(`Address ${signer.address} = ${res}`);
  });
  await Promise.all(promises);
});
