const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_URL = process.env.API_URL
// console.log(PUBLIC_KEY)
const {createAlchemyWeb3} = require("@alch/alchemy-web3")

const web3 = createAlchemyWeb3(API_URL)
const contract = require("../artifacts/contracts/old/LotteryContract3.sol/LotteryContract3.json")
const contractAddress = "0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc"
const LotteryContract = new web3.eth.Contract(contract.abi, contractAddress)

async function enterLottery() {
    console.log("Ticket Cost: ", await LotteryContract.methods.ticketCost().call())
    let transaction = LotteryContract.methods.enter();
    let options = {
        value: 1e7,
        to  : transaction._parent._address,
        data: transaction.encodeABI(),
        gas : 1e6,
    };
    let signedTransaction = await web3.eth.accounts.signTransaction(options, PRIVATE_KEY);
    let transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    console.log(transactionReceipt)
}
enterLottery()