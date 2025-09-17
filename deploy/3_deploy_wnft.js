const { Contract } = require("ethers");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts();
    const { deploy, log } = deployments;

    log("----------------------------------------------------");
    log("Deploying WrappedMyToken contract and waiting for confirmations...");
    const wnft = await deploy("WrappedMyToken", {
        Contract: "WrappedMyToken",
        from: firstAccount,
        args: ["WrappedMyToken", "WMTK"], // Constructor arguments
        log: true,
        // waitConfirmations: 1,
    });
    log(`WrappedMyToken contract deployed at ${wnft.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["destchain", "all"];