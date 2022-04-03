const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_URL = process.env.API_URL
const {createAlchemyWeb3} = require("@alch/alchemy-web3")

const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/LotteryContract3.sol/LotteryContract3.json")
const contractAddress = "0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc"

const LotteryContract = new web3.eth.Contract(contract.abi, contractAddress)

async function setWinningTicketCost() {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
    let transaction = LotteryContract.methods.setWinningTicketCost(1e7);
    let options = {
        nonce: nonce,
        to  : transaction._parent._address,
        data: transaction.encodeABI(),
        gas : await transaction.estimateGas({from: PUBLIC_KEY}),
    };
    let signedTransaction = await web3.eth.accounts.signTransaction(options, PRIVATE_KEY);
    let transactionReceipt = await web3.eth.sendSignedTransaction(signedTransaction.rawTransaction)
    console.log(transactionReceipt)
}
setWinningTicketCost()