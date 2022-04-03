import {FC, useEffect, useState} from "react";
import {Button} from "react-bootstrap";
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js'
// @ts-ignore
import {useAlert} from "react-alert";
import LotteryData from "./LotteryData";
import JoinLottery from "./JoinLottery";

const contractAddress = "0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc";
//todo should be fetched as rest not hardcoded
const ticketCost = 1e7;

const App: FC = (): JSX.Element => {
    const alert = useAlert()
    const [web3, setWeb3] = useState<Web3>()
    const [isMetaMaskConnected, setMetaMaskConnected] = useState(false)
    const [isMetaMaskDetected, setMetaMaskDetected] = useState(false)
    const [isChainRopsten, setIsChainRopsten] = useState(false)
    const [accountAddress, setAccountAddress] = useState<string | null>(null)
    const [shouldRefetch, setShouldRefetch] = useState(false)
    const [error, setError] = useState<any>()

    useEffect(() => {
        const checkIfMetaMask = async () => {
            if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
                setMetaMaskDetected(true)
                try {
                    const web3 = new Web3(window.ethereum)
                    setWeb3(web3)
                    setMetaMaskDetected(true)

                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    window.ethereum.on('chainChanged',  () => {window.location.reload()})
                    if (chainId === "0x3"){ //Seems that chainId is string?
                        setIsChainRopsten(true)
                    }else {
                        setIsChainRopsten(false); return;}

                    const accounts = await web3.eth.getAccounts()
                    if (accounts.length !== 0) {
                        setMetaMaskConnected(true)
                        window.ethereum.on('accountsChanged', async () => {
                            const accounts = await web3.eth.getAccounts()
                            if (accounts.length === 0) {
                                setMetaMaskConnected(false)
                            } else {
                                setAccountAddress(accounts[0])
                            }
                        })
                        setAccountAddress(accounts[0])
                    }
                } catch (error: any) {
                    setError(error.message)
                }
            } else {
                setMetaMaskDetected(false)
                console.log("No metamask connection detected.")
            }
        }
        checkIfMetaMask().catch()
    }, []);

    const tryToConnectToMetaMask = async () => {
        try {
            await window.ethereum.request({method: "eth_requestAccounts"})
            const accounts = await web3.eth.getAccounts()
            setAccountAddress(accounts[0])
            setMetaMaskConnected(true)

            // Generates warning, bc of backward compatibility
            // https://github.com/OpenZeppelin/ethernaut/issues/188
            window.ethereum.on('accountsChanged', async () => {
                const accounts = await web3.eth.getAccounts()
                if (accounts.length === 0) {
                    setMetaMaskConnected(false)
                } else {
                    setAccountAddress(accounts[0])
                }
            })

        }
        catch (error: any) {
            if (error.code === -32002) {
                alert.show("You already initiated your connection")
            }else if (error.code === 4001){
                alert.show("You declined the connection")
            }
            else{
                setError(error.message)
            }
        }
    }


    if (error) {
        return (<>
            Sorry something went wrong: {error}
        </>)
    }

    if (!isMetaMaskDetected) {
        return (<>
            MetaMask not detected - no provider
        </>)
    }

    if (!isChainRopsten){
        return (<>
            Please switch your metamask to Ropsten chain.
        </>)
    }

    if (!isMetaMaskConnected) {
        return (<>
                {/*{window.ethereum.chain}*/}
                <Button onClick={tryToConnectToMetaMask}>Connect MetaMask</Button> <br/>
                <LotteryData web3={web3} contractAddress={contractAddress} shouldRefetch={shouldRefetch}
                             setShouldRefetch={setShouldRefetch}/>
            </>
        );
    } else {
        return (<>
                Metamask is connected! <br/> <JoinLottery web3={web3} contractAddress={contractAddress}
                                                          userAddress={accountAddress} shouldRefetch={shouldRefetch}
                                                          setShouldRefetch={setShouldRefetch} ticketCost={ticketCost}/> <br/>
                <LotteryData web3={web3} contractAddress={contractAddress} shouldRefetch={shouldRefetch}
                             setShouldRefetch={setShouldRefetch}/>
            </>
        );
    }
}
export default App
