module.exports = async ({ getNamedAccounts, deployments }) => {
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
};

module.exports.tags = ["all", "test", "CCIPSimulator"];