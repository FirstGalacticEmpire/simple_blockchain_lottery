import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import ContractApi from "./ContractApi";
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js';
// @ts-ignore
import {useQuery} from "react-query";
// @ts-ignore
import {useAlert} from "react-alert";
import {Button} from "react-bootstrap";
import ContractDataTable from "./ContractDataTable";

interface Props {
    web3: Web3;
    contractAddress: string
    shouldRefetch: boolean
    ticketCost: number
    setTicketCost:Dispatch<SetStateAction<number>>
    setShouldRefetch?: Dispatch<SetStateAction<boolean>>
}

const LotteryData: FC<Props> = ({web3, contractAddress, shouldRefetch, ticketCost, setTicketCost}): JSX.Element => {
    const alert = useAlert()
    const contractApi = new ContractApi(web3, contractAddress)
    const [lotteryId, setLotteryID] = useState<number | null>(null)
    const [winningAddresses, setWinningAddresses] = useState<Array<string>>([])
    const [allPools, setAllPools] = useState<Array<string>>([])
    const [currentPool, setCurrentPool] = useState<number | null>(null)
    const [tableData, setTableData] = useState<Array<Object>>([])
    const [winningProbability] = useState<number>(500)
    
    
    // This should be made into a custom hook, to avoid redundant code
    const {
        isSuccess: isLotteryIdSuccess, error: lotteryIdError, data: lotteryIdData, refetch:
            refetchLotteryId
    } = useQuery(
        'lotteryId', () => contractApi.getLotteryId())
    useEffect(() => {
        if (isLotteryIdSuccess) {
            setLotteryID(lotteryIdData)
        } else if (lotteryIdError) {
            console.log("Something went wrong fetching your lottery", lotteryIdError)
            alert.show("Something went wrong fetching data")
        }
    }, [alert, isLotteryIdSuccess, lotteryIdData, lotteryIdError])

    
    const {
        isSuccess: isWinningAddressSuccess, error: winningAddressError, data: winningAddressData,
        refetch: refetchWinningAddresses
    } = useQuery(
        'winningAddress', () => contractApi.getAllWinningAddresses())
    useEffect(() => {
        if (isWinningAddressSuccess) {
            setWinningAddresses(winningAddressData)
        } else if (winningAddressError) {
            console.log("Something went wrong fetching your lottery")
            alert.show("Something went wrong fetching data")
        }
    }, [alert, isWinningAddressSuccess, winningAddressData, winningAddressError])

    const {
        isSuccess: isCurrentPoolSuccess,
        error: currentPoolError,
        data: currentPoolData,
        refetch: refetchIsCurrentPool
    } = useQuery(
        'currentPool', () => contractApi.getCurrentPool())
    useEffect(() => {
        if (isCurrentPoolSuccess) {
            setCurrentPool(currentPoolData)
        } else if (currentPoolError) {
            console.log("Something went wrong fetching your lottery")
            alert.show("Something went wrong fetching data")
        }
    }, [isCurrentPoolSuccess, currentPoolData, currentPoolError, alert])

    const {
        isSuccess: isGetAllPoolsSuccess,
        error: allPoolsError,
        data: allPoolsData,
        refetch: refetchAllPools
    } = useQuery(
        'allPools', () => contractApi.getAllPools())
    useEffect(() => {
        if (isGetAllPoolsSuccess) {
            setAllPools(allPoolsData)
        } else if (allPoolsError) {
            console.log("Something went wrong fetching your lottery")
            alert.show("Something went wrong fetching data")
        }
    }, [alert, allPoolsData, allPoolsError, isGetAllPoolsSuccess])
    
    const {
        isSuccess: ticketCostSuccess, error: ticketCostError, data: ticketCostData,
    } = useQuery(
        'ticketCost', () => contractApi.getTicketCost())
    useEffect(() => {
        if (ticketCostSuccess) {
            setTicketCost(ticketCostData)
        } else if (ticketCostError) {
            console.log("React Query error:", ticketCostError)
            alert.show("Something went wrong fetching data")
        }
    }, [alert, setTicketCost, ticketCostData, ticketCostError, ticketCostSuccess])

    const refreshContractData = () => {
        refetchLotteryId().then()
        refetchWinningAddresses().then()
        refetchIsCurrentPool().then()
        refetchAllPools().then()
    }

    useEffect(() => {
        const refreshContractData = () => {
            refetchLotteryId().then()
            refetchWinningAddresses().then()
            refetchIsCurrentPool().then()
            refetchAllPools().then()
        }
        refreshContractData()
        // This should have been done better todo
    }, [refetchAllPools, refetchIsCurrentPool, refetchLotteryId, refetchWinningAddresses, shouldRefetch])


    useEffect(() =>{
        if(isWinningAddressSuccess && isGetAllPoolsSuccess){
            setTableData(() => {
                const winningArray: Array<Object> = new Array<Object>()
                if (winningAddresses != null && allPools != null) {
                    for (let i = 0; i < winningAddresses.length; i++) {
                        winningArray[i] = {
                            'WinningAddress': winningAddresses[i],
                            'WinningPool': allPools[i],
                            'NumberOfLotteryTicketsBought': Number(allPools[i]) / 1e7
                        }
                    }
                    return winningArray
                }
                return winningArray
            })
        }
    },[isGetAllPoolsSuccess, isWinningAddressSuccess, allPools, winningAddresses])

    return (<>
        <br/>
        <Button onClick={refreshContractData}>Refresh contract data</Button> <br/>
        Fetched contract data: <br/>
        LotteryId (Which lottery series is it): {lotteryId} <br/>
        Current pool: {currentPool} wei <br/>
        Ticket cost: {ticketCost} wei (Can be changed through contract owner call to contract)<br/>
        Winning probability: {winningProbability/1000*100}% (Can be changed through contract owner call to contract)<br/>
        {/*Winning Addresses: {winningAddresses} <br/>*/}
        {/*All Pools: {allPools} <br/>*/}
        <ContractDataTable tableData={tableData}/>
    </>)
}
export default LotteryData