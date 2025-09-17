const { getNamedAccounts, deployments } = require("hardhat");
const { expect } = require("chai");

let firstAccount;
let ccipLocalSimulator;
let nft;
let nftPoolLockAndRelease;
let wNft;
let nftPoolBurnAndMint;;

/**
 * source chain -----> dest chain
 * */ 

before("source chain -----> dest chain", async function() {
    firstAccount = (await getNamedAccounts()).firstAccount;
    await deployments.fixture(["all"]);
    ccipLocalSimulator = await ethers.getContract("CCIPLocalSimulator", firstAccount);
    nft = await ethers.getContract("MyToken", firstAccount);
    nftPoolLockAndRelease = await ethers.getContract("NFTPoolLockAndRelease", firstAccount);
    wNft = await ethers.getContract("WrappedMyToken", firstAccount);
    nftPoolBurnAndMint = await ethers.getContract("NFTPoolBurnAndMint", firstAccount);
});

describe("source chain -----> dest chain", async function() {
    it("test if user can mint a nft from nft contract successfully.", async function() {
        await nft.safeMint(firstAccount);
        const owner = await nft.ownerOf(0);
        expect(owner).to.equal(firstAccount);
    })

    // test if user can lock nft in the pool contract and send a ccip message on source chain

    // test if user can get wrapped nft on dest chain.
})

/**
 * dest chain -----> source chain
 * */ 
// test if user can burn the wnft and send ccip message on the dest chain.

// test if user have the nft unlock on source chain.