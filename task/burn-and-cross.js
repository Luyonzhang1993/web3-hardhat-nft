const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("burn-and-cross", "Burn NFT and cross chain")
    .addOptionalParam("chainselector", "chainSelector of destination chain")
    .addOptionalParam("receiver", "receiver address on destination chain")
    .addParam("tokenid", "tokenId of the NFT to lock and cross")
    .setAction(async (taskArgs, hre) => {
        const firstAccount = (await hre.getNamedAccounts()).firstAccount;
        const tokenId = taskArgs.tokenid
        let chainSelector = taskArgs.chainselector
        if (!chainSelector) {
            const chainId = hre.network.config.chainId;
            chainSelector = networkConfig[chainId]["companionChainSelector"];
        }

        let receiverAddr = taskArgs.receiver
        if (!receiverAddr) {
            const destPoolContract =
                await hre.companionNetworks['destChain'].deployments.get("NFTPoolLockAndRelease");
            receiverAddr = destPoolContract.address;
        }

        const linkTokenAddr = networkConfig[hre.network.config.chainId]["linkToken"];
        const linkToken = await hre.ethers.getContractAt("LinkToken", linkTokenAddr);
        const burnContract = await hre.ethers.getContract("NFTPoolBurnAndMint", firstAccount);
        const burnContractAddr = burnContract.target;

        const transferTx = await linkToken.transfer(burnContractAddr, hre.ethers.parseEther("1"));
        await transferTx.wait(6);
        const balance = await linkToken.balanceOf(burnContractAddr);
        console.log("Burn contract LINK balance:", hre.ethers.formatEther(balance));

        const wnft = await hre.ethers.getContract("WrappedMyToken", firstAccount);
        await wnft.approve(burnContractAddr, tokenId);

        const tx = await burnContract.burnAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiverAddr
        );
        await tx.wait(6);
        console.log("Burn and cross chain tx:", tx.hash);
    })

module.exports = {};