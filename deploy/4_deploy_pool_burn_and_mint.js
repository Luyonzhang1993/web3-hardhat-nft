const { getNamedAccounts, network } = require("hardhat")
const { developmentChain, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments;
    const isLocal = developmentChain.local.includes(network.name);
    let destinationRouter;
    let linkTokenAddr;
    log("----------------------------------------------------");
    log("Deploying NFTPoolBurnAndMint contract and waiting for confirmations...");

    if (isLocal) {
        const ccipLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        const ccipLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipLocalSimulatorDeployment.address);
        const ccipConfig = await ccipLocalSimulator.configuration();
        destinationRouter = ccipConfig.destinationRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        const chainId = network.config.chainId;
        const config = networkConfig[chainId];
        const { router, linkToken } = config;
        destinationRouter = router;
        linkTokenAddr = linkToken;
    }
    const wnftAddress = (await deployments.get("WrappedMyToken")).address;
    const ntfPoolBurnAndMint = await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        args: [destinationRouter, linkTokenAddr, wnftAddress],
        log: true,
    });
    log(`NFTPoolBurnAndMint contract deployed at ${ntfPoolBurnAndMint.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "destchain"];