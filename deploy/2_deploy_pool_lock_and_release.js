const { getNamedAccounts } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments;

    log("----------------------------------------------------");
    log("Deploying NFTPoolLockAndRelease contract and waiting for confirmations...");
    const ccipLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipLocalSimulatorDeployment.address);
    const ccipConfig = await ccipLocalSimulator.configuration();
    const nftAddress = (await deployments.get("MyToken")).address;

    const nftPoolLockAndRelease = await deploy("NFTPoolLockAndRelease", {
        contract: "NFTPoolLockAndRelease",
        from: firstAccount,
        // address _router, address _link, address nftAddr
        args: [ccipConfig.sourceRouter_, ccipConfig.linkToken_, nftAddress],
        log: true,
    });
    log(`NFTPoolLockAndRelease contract deployed at ${nftPoolLockAndRelease.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["all", "sourcechain"];