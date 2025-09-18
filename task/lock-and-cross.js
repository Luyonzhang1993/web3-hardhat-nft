const { task } = require("hardhat/config");
const { networkConfig } = require("../helper-hardhat-config");

task("lock-and-cross", "Lock NFT and cross chain")
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
                await hre.companionNetworks['destChain'].deployments.get("NFTPoolBurnAndMint");
            receiverAddr = destPoolContract.address;
        }

        const linkTokenAddr = networkConfig[hre.network.config.chainId]["linkToken"];
        const linkToken = await hre.ethers.getContractAt("LinkToken", linkTokenAddr);
        const lockContract = await hre.ethers.getContract("NFTPoolLockAndRelease", firstAccount);
        const lockContractAddr = lockContract.target;

        // const transferTx = await linkToken.transfer(lockContractAddr, hre.ethers.parseEther("1"));
        // await transferTx.wait(6);
        const balance = await linkToken.balanceOf(lockContractAddr);
        console.log("Lock contract LINK balance:", hre.ethers.formatEther(balance));

        const nft = await hre.ethers.getContract("MyToken", firstAccount);
        await nft.approve(lockContractAddr, tokenId);

        const tx = await lockContract.lockAndSendNFT(
            tokenId,
            firstAccount,
            chainSelector,
            receiverAddr
        );
        await tx.wait(6);
        console.log("Lock and cross chain tx:", tx.hash);
    })

module.exports = {};