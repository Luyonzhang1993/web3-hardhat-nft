const { task } = require("hardhat/config");

task("check-wnft", "Check NFT balance of an address")
    .setAction(async (taskArgs, hre) => {
        const firstAccount = (await hre.getNamedAccounts()).firstAccount;
        const wnft = await hre.ethers.getContract("WrappedMyToken", firstAccount);
        const totalSupply = await wnft.totalSupply();

        console.log("check the status of Wrapped NFTs", { totalSupply });

        for (let i = 0; i < totalSupply; i++) {
            const owner = await wnft.ownerOf(i);
            console.log(`Token ID ${i} is owned by ${owner}`);
        }
    })

module.exports = {};