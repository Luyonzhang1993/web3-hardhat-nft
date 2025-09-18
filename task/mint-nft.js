const { task } = require("hardhat/config");

task("mint-nft", "mint NFT task")
    .setAction(async (taskArgs, hre) => {
        const firstAccount = (await hre.getNamedAccounts()).firstAccount;
        const nft = await hre.ethers.getContract("MyToken", firstAccount);

        console.log("minting NFT to account:", firstAccount);
        const mintTx = await nft.safeMint(firstAccount);
        await mintTx.wait(6);
        console.log("minted! Transaction:", mintTx);
    })

module.exports = {};