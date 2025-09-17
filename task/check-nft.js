const { task } = require("hardhat/config");

task("check-nft", "Check NFT balance of an address")
    .setAction(async (taskArgs, hre) => {
        const firstAccount = (await hre.getNamedAccounts()).firstAccount;
        const nft = await hre.ethers.getContract("MyToken", firstAccount);
        const totalSupply = await nft.totalSupply();

        console.log("check the status of NFTs", { totalSupply });

        for (let i = 0; i < totalSupply; i++) {
            const owner = await nft.ownerOf(i);
            console.log(`Token ID ${i} is owned by ${owner}`);
        }
    })

module.exports = {};