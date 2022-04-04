import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import Web3 from "web3";
import {Button} from "react-bootstrap";
import ContractApi from "./ContractApi";
import {useQuery} from "react-query";
// @ts-ignore
import {useAlert} from "react-alert";


interface Props {
    web3: Web3
    contractAddress: string;
    userAddress: string | null
    shouldRefetch: boolean
    ticketCost: number
    setShouldRefetch: Dispatch<SetStateAction<boolean>>
}

interface EventObject {
    buyerAddress: string,
    winningPool: string,
    hasWon: boolean
}

const JoinLottery: FC<Props> = ({web3, contractAddress, userAddress,
                                     shouldRefetch, ticketCost, setShouldRefetch}): JSX.Element => {
    const alert = useAlert()
    const contractApi = new ContractApi(web3, contractAddress);
    const [isPending, setIsPending] = useState(false);
    const [eventData, setEventData] = useState<EventObject | null>(null);
    const [lotteryData, setLotteryData] = useState<any>(null)

    const {
        data: enterLotteryData, refetch: fetchLottery, isSuccess: isLotteryEnterSuccess,
        error: enterLotteryError
    } = useQuery(
        [userAddress, ticketCost],
        contractApi.enterLottery,
        {
            retry: false,
            refetchOnWindowFocus: false,
            enabled: false
        });

    useEffect(() => {
        if (isLotteryEnterSuccess) {
            alert.show("Success your transaction was confirmed on the chain!")
            console.log("LotteryData", enterLotteryData.events.LotteryTicket.returnValues)
            console.log(enterLotteryData)
            setLotteryData(enterLotteryData)
            const event: EventObject = enterLotteryData.events.LotteryTicket.returnValues
            setEventData(event)
            setShouldRefetch(true)
            setIsPending(false)
        }
        if (enterLotteryError) {
            // Bad practice, but I need to read more how to handle this situation
            // @ts-ignore
            if (enterLotteryError.code === 4001) {
                alert.show("You rejected the transaction")
            }
            else {
                alert.show("Something went wrong")
            }
            setIsPending(false)
        }
    }, [alert, enterLotteryData, enterLotteryError, isLotteryEnterSuccess, setShouldRefetch])

    const handleEnterLottery = async () => {
        if (!isPending) {
            setIsPending(true)
            await fetchLottery()
        } else {
            alert.show("Your transaction is already pending")
        }
    }

    if (isPending) {
        return (<>
            <br/>
            <Button onClick={handleEnterLottery}>Enter Lottery</Button> <br/>
            Your transaction is pending...
        </>)
    } else if (!isPending) {
        if (!eventData) {
            return (<>
                <br/>
                <Button onClick={handleEnterLottery}>Enter Lottery</Button>
            </>)
        } else {
            return (<>
                <br/>
                <Button onClick={handleEnterLottery}>Enter Lottery</Button> <br/>
                Have you won? {eventData.hasWon ? "True" : "False"} <br/>
                What was the winning pool? {eventData.winningPool} <br/>
                What is the address of ticket buyer: {eventData.buyerAddress} <br/>
                <a style={{display: "table-cell"}} href={"https://ropsten.etherscan.io/tx/" + lotteryData.transactionHash} target="_blank" rel="noreferrer">
                    Link to your transaction on etherscan</a>
            </>)
        }

    } else return <></>

}
export default JoinLottery