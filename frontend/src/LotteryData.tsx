import {Dispatch, FC, SetStateAction, useEffect, useState} from "react";
import ContractApi from "./ContractApi";
// @ts-ignore
import Web3 from 'web3/dist/web3.min.js';
// @ts-ignore
import {useQuery} from "react-query";
import {Button} from "react-bootstrap";
import ContractDataTable from "./ContractDataTable";

interface Props {
    web3: Web3;
    contractAddress: string;
    shouldRefetch: boolean
    setShouldRefetch?: Dispatch<SetStateAction<boolean>>
}

const LotteryData: FC<Props> = ({web3, contractAddress, shouldRefetch}): JSX.Element => {
    const contractApi = new ContractApi(web3, contractAddress)
    const [lotteryId, setLotteryID] = useState<number | null>(null)
    const [winningAddresses, setWinningAddresses] = useState<Array<string>>([]);
    const [allPools, setAllPools] = useState<Array<string>>([]);
    const [currentPool, setCurrentPool] = useState<number | null>(null)
    const [tableData, setTableData] = useState<Array<Object>>([])

    const {
        isSuccess: isLotteryIdSuccess, error: lotteryIdError, data: lotteryIdData, refetch:
            refetchLotteryId
    } = useQuery(
        'lotteryId', () => contractApi.getLotteryId())
    useEffect(() => {
        if (isLotteryIdSuccess) {
            setLotteryID(lotteryIdData)
        } else if (lotteryIdError) {
            console.log("Something went wrong fetching your lottery")
        }
    }, [isLotteryIdSuccess, lotteryIdData, lotteryIdError])


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
        }
    }, [isWinningAddressSuccess, winningAddressData, winningAddressError])

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
        }
    }, [isCurrentPoolSuccess, currentPoolData, currentPoolError])

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
        }
    }, [allPoolsData, allPoolsError, isGetAllPoolsSuccess])

    const refreshContractData = () => {
        // Bad practice todo
        refetchLotteryId().catch()
        refetchWinningAddresses().catch()
        refetchIsCurrentPool().catch()
        refetchAllPools().catch()
    }

    useEffect(() => {
        refreshContractData()
        // This should have been done better todo
    }, [shouldRefetch])


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
        {/*Winning Addresses: {winningAddresses} <br/>*/}
        {/*All Pools: {allPools} <br/>*/}
        <ContractDataTable tableData={tableData}/>
    </>)
}
export default LotteryData