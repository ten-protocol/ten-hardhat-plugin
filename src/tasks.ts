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
    return;
  }

  const signers = await hre.ethers.getSigners();

  const promises = signers.map(async (signer) => {
    const isRegistered: boolean = await hre.gateway.query(signer.address);
    if (isRegistered == true) {
      return Promise.resolve();
    }

    if (args?.verbose != null) {
      console.log(`Registering account ${signer.address}...`);
    }
    const sign = async (arg: string)=>{ 
      return await signer.signMessage(arg);
    };

    await hre.gateway.register(signer.address, sign);
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
