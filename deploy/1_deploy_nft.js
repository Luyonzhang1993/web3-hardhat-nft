const { Contract } = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("----------------------------------------------------");
    log("Deploying NFT contract and waiting for confirmations...");
    const nft = await deploy("MyToken", {
        Contract: "MyToken",
        from: firstAccount,
        args: ["MyToken", "MTK"], // Constructor arguments
        log: true,
        // waitConfirmations: 1,
    });
    log(`NFT contract deployed at ${nft.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["sourcechain", "all"];