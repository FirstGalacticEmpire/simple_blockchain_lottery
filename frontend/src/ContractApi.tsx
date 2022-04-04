// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
// Probably should be fetched from some kind of backend.
const contract = require("./LotteryContract.json")

class ContractApi {
    private web3: Web3;
    private readonly contractAddress: string;
    private LotteryContract: Web3.eth.Contract;

    constructor(web3: Web3, contractAddress: string) {
        this.web3 = web3;
        this.contractAddress = contractAddress;
        this.LotteryContract = new this.web3.eth.Contract(contract.abi, contractAddress)
        this.enterLottery = this.enterLottery.bind(this)
    }

    async getLotteryId(): Promise<number>{
        return await this.LotteryContract.methods.lotteryId().call()
    }

    async getAllWinningAddresses(): Promise<Array<string>>{
        return await this.LotteryContract.methods.getAllWinningAddresses().call()
    }

    async getAllPools(): Promise<Array<string>>{
        return await this.LotteryContract.methods.getAllPools().call()
    }

    async getCurrentPool(): Promise<number>{
        return await this.web3.eth.getBalance(this.contractAddress)
    }

    // async getProbabilityOfWinning(): Promise<number>{
    //     return await this.web3.eth.getWinningProbability().call()
    // }

    async getTicketCost(): Promise<number>{
        return await this.LotteryContract.methods.ticketCost().call()
    }

    async enterLottery(params: any): Promise<any>{
        const userAddress: string = params.queryKey[0]
        const transactionValue: number = params.queryKey[1]
        return await this.LotteryContract.methods.enter().send({
            from: userAddress,
            gas: 1e6,
            value:transactionValue
        });
    }

}
export default ContractApi;
