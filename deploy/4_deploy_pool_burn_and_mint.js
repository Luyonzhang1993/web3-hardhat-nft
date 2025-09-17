const { getNamedAccounts } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { firstAccount } = await getNamedAccounts()
    const { deploy, log } = deployments;

    log("----------------------------------------------------");
    log("Deploying NFTPoolBurnAndMint contract and waiting for confirmations...");
    const ccipLocalSimulatorDeployment = await deployments.get("CCIPLocalSimulator");
    const ccipLocalSimulator = await ethers.getContractAt("CCIPLocalSimulator", ccipLocalSimulatorDeployment.address);
    const ccipConfig = await ccipLocalSimulator.configuration();
    const wnftAddress = (await deployments.get("WrappedMyToken")).address;

    const ntfPoolBurnAndMint = await deploy("NFTPoolBurnAndMint", {
        contract: "NFTPoolBurnAndMint",
        from: firstAccount,
        // address _router, address _link, address nftAddr
        args: [ccipConfig.destinationRouter_, ccipConfig.linkToken_, wnftAddress],
        log: true,
    });
    log(`NFTPoolBurnAndMint contract deployed at ${ntfPoolBurnAndMint.address}`);
    log("----------------------------------------------------");
};

module.exports.tags = ["destchain", "all"];