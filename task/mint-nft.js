const { task } = require("hardhat/config");

task("mint-nft", "mint NFT task")
    .setAction(async (taskArgs, hre) => {
        const firstAccount = (await hre.getNamedAccounts()).firstAccount;
        const nft = await hre.ethers.getContract("MyToken", firstAccount);

        await nft.safeMint(firstAccount);
    })

module.exports = {};