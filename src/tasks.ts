import { task } from "hardhat/config";

task("nothing").setAction(async ()=>{});

task("obscuro:gateway:join")
.setAction(async (args: any, hre) => {
  if (hre.gateway == null) {
    console.log("Gateway is not configured properly. Perhaps the network has a bad url?");
    return;
  }

  const userId = await hre.gateway.join();

  if (args?.verbose != null) {
    console.log(`Joined gateway! UserID is ${userId}. Starting account authentication...`);
  }
});

task("obscuro:gateway:authenticate")
.setAction(async(args:any, hre)=> {
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
      return await hre.network.provider.send(
        "eth_sign",
        [signer.address, hre.ethers.hexlify(hre.ethers.toUtf8Bytes(arg))]
      );    
    };

    await hre.gateway.register(signer.address, sign);
  });

  await Promise.all(promises);
});

task("obscuro:gateway:status")
.setAction(async(args: any, hre)=> {
  const signers = await hre.ethers.getSigners();
  const promises = signers.map(async(signer)=>{
    const res = await hre.gateway.query(signer.address);
    console.log(`Address ${signer.address} = ${res}`);
  });
  await Promise.all(promises);
});
