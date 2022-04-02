const { expect } = require("chai");

// `describe` is a Mocha function that allows you to organize your tests. It's
// not actually needed, but having your tests organized makes debugging them
// easier. All Mocha functions are available in the global scope.

// `describe` receives the name of a section of your test suite, and a callback.
// The callback must define the tests of that section. This callback can't be
// an async function.
describe("Token contract", function () {

    let Token;
    let hardhatToken;
    let owner;


    beforeEach(async function () {
        Token = await ethers.getContractFactory("LotteryContract");
        [owner] = await ethers.getSigners();
        hardhatToken = await Token.deploy();
    });

    // You can nest describe calls to create subsections.
    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });
    });

});