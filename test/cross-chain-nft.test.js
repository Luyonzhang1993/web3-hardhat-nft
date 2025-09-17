const { getNamedAccounts, deployments } = require("hardhat");
const { expect } = require("chai");

let firstAccount;
let ccipLocalSimulator;
let nft;
let nftPoolLockAndRelease;
let wNft;
let nftPoolBurnAndMint;
let chainSelector;

/**
 * source chain -----> dest chain
 * */

before("source chain -----> dest chain", async function () {
    firstAccount = (await getNamedAccounts()).firstAccount;
    await deployments.fixture(["all"]);
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount);
    nft = await ethers.getContract("MyToken", firstAccount);
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
    wNft = await ethers.getContract("WrappedMyToken", firstAccount);
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);
    const config = await ccipLocalSimulator.configuration();
    chainSelector = config.chainSelector_;
});

describe("source chain -----> dest chain", async function () {
    it(
        "test if user can mint a nft from nft contract successfully.",
        async function () {
            await nft.safeMint(firstAccount);
            const owner = await nft.ownerOf(0);
            expect(owner).to.equal(firstAccount);
        }
    )

    it(
        "test if user lock nft in the pool contract and send a ccip message on source chain",
        async function () {
            await nft.approve(nftPoolLockAndRelease.target, 0);
            await ccipLocalSimulator.requestLinkFromFaucet(
                nftPoolLockAndRelease,
                ethers.parseEther("10")
            );
            await nftPoolLockAndRelease.lockAndSendNFT(
                0,
                firstAccount,
                chainSelector,
                nftPoolBurnAndMint.target
            )
            const owner = await nft.ownerOf(0);
            expect(owner).to.equal(nftPoolLockAndRelease.target);
        }
    )

    it(
        "test if user can get wrapped nft on dest chain.",
        async function () {
            const owner = await wNft.ownerOf(0)
            expect(owner).to.equal(firstAccount);
        }
    )
});

/**
 * dest chain -----> source chain
 * */

describe("dest chain -----> source chain", async function () {
    it(
        "test if user can burn the wnft and send ccip message on the dest chain.",
        async function () {
            await wNft.approve(nftPoolBurnAndMint.target, 0);
            await ccipLocalSimulator.requestLinkFromFaucet(
                nftPoolBurnAndMint,
                ethers.parseEther("10")
            );
            await nftPoolBurnAndMint.burnAndSendNFT(
                0,
                firstAccount,
                chainSelector,
                nftPoolLockAndRelease.target
            )
            const owner = await nft.ownerOf(0);
            const totalSupply = await wNft.totalSupply();
            expect(totalSupply).to.equal(0);
        }
    );

    it(
        "test if user have the nft unlock on source chain.",
        async function () {
            const owner = await nft.ownerOf(0);
            expect(owner).to.equal(firstAccount);
        }
    )
})