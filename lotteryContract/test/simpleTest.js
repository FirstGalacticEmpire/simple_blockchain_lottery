const { expect } = require("chai");

describe("Token contract", function () {
    let contractFactory;
    let contract;
    let owner;

    beforeEach(async function () {
        contractFactory = await ethers.getContractFactory("LotteryContract2");
        [owner] = await ethers.getSigners();
        contract = await contractFactory.deploy();
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await contract.owner()).to.equal(owner.address);
        });
    });

});