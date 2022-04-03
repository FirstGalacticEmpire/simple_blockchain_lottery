const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, '../.env')})

const PUBLIC_KEY = process.env.PUBLIC_KEY
const PRIVATE_KEY = process.env.PRIVATE_KEY
const API_URL = process.env.API_URL
// console.log(PUBLIC_KEY)
const {createAlchemyWeb3} = require("@alch/alchemy-web3")

const web3 = createAlchemyWeb3(API_URL)

const contract = require("../../artifacts/contracts/LotteryContract3.sol/LotteryContract3.json")

const contractAddress = "0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc"

const LotteryContract = new web3.eth.Contract(contract.abi, contractAddress)


const abiDecoder = require('abi-decoder');
const TicketEvent = [
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyerAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "winningPool",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "hasWon",
                "type": "bool"
            }
        ],
        "name": "LotteryTicket",
        "type": "event"
    }
        ]

async function main() {
    let receipt = await web3.eth.getTransactionReceipt("0xe6feee9e5e0af3bef412b61fb75cd330454257391ce954b5e7ff01264dca5329")
    // console.log(receipt)
    abiDecoder.addABI(TicketEvent)
    const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
    console.log(decodedLogs[0].events)
}
main()

// const decodedLogs = abiDecoder.decodeLogs(receipt.logs);
// console.log(decodedLogs)