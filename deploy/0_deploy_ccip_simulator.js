const { network } = require("hardhat");
const { developmentChain } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const isLocal = developmentChain.local.includes(network.name);
    if (isLocal) {
        const { firstAccount } = await getNamedAccounts();
        const { deploy, log } = deployments;

        log("----------------------------------------------------");
        log("Deploying CCIPLocalSimulator contract and waiting for confirmations...");
        const contract = await deploy("CCIPLocalSimulator", {
            Contract: "CCIPLocalSimulator",
            from: firstAccount,
            args: [],
            log: true
        });
        log(`CCIPLocalSimulator contract deployed at ${contract.address}`);
        log("----------------------------------------------------");
    }
};

module.exports.tags = ["all", "test", "CCIPSimulator"];