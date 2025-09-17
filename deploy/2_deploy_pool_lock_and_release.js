const { getNamedAccounts, network } = require("hardhat")
const { developmentChain, networkConfig } = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments;
    const isLocal = developmentChain.local.includes(network.name);
    let sourceRouter;
    let linkTokenAddr;
    log("----------------------------------------------------");
    log("Deploying NFTPoolLockAndRelease contract and waiting for confirmations...");
    if (isLocal) {
        const ccipLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
        const ccipLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipLocalSimulatorDeployment.address);
        const ccipConfig = await ccipLocalSimulator.configuration();
        sourceRouter = ccipConfig.sourceRouter_;
        linkTokenAddr = ccipConfig.linkToken_;
    } else {
        const chainId = network.config.chainId;
        const config = networkConfig[chainId];
        const { router, linkToken } = config;
        sourceRouter = router;
        linkTokenAddr = linkToken;
    }
    const nftAddress = (await deployments.get("MyToken")).address;
    const nftPoolLockAndRelease = await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        args: [sourceRouter, linkTokenAddr, nftAddress],
        log: true,
    });
    log(`NFTPoolLockAndRelease contract deployed at ${nftPoolLockAndRelease.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "sourcechain"];