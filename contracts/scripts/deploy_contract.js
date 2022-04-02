async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    console.log("Account balance:", (await deployer.getBalance()).toString());

    const Token = await ethers.getContractFactory("LotteryContract");
    const token = await Token.deploy();

    console.log("Token address:", token.address);
}
// 0xF0cEE374bf186d2d0d8841F8d4a0ad696B09C39C
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
