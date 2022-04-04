async function deployContract() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const contractFactory = await ethers.getContractFactory("LotteryContract3");
    const transactionReceipt = await contractFactory.deploy();
    console.log("Lottery Contract address:", transactionReceipt.address);
}
deployContract()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// Lottery v1
// 0xF0cEE374bf186d2d0d8841F8d4a0ad696B09C39C
// Lottery v2
// 0x86E05f342a31DCBbd4D351E2b0084A32dcb12b6c
// Lottery v3
// 0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc
// Lottery v4
// 0x21ecC9dE24143B23BF553d89F59279BE23bc695F
