const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_URL = process.env.API_URL
// console.log(PUBLIC_KEY)
const {createAlchemyWeb3} = require("@alch/alchemy-web3")

const web3 = createAlchemyWeb3(API_URL)

const contract = require("../artifacts/contracts/LotteryContract.sol/LotteryContract.json")

const contractAddress = "0xF0cEE374bf186d2d0d8841F8d4a0ad696B09C39C"

const LotteryContract = new web3.eth.Contract(contract.abi, contractAddress)

async function enterLottery() {
    // const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest") //get latest nonce
    console.log(await LotteryContract.methods.getCurrentPool().call())

}

enterLottery()