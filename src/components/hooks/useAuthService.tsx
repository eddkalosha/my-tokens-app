import { useContext, useEffect } from 'react'
import Web3 from 'web3'
import { AppContext } from '../../context'
import { TokenBalance, TokenListItem, Types } from '../../reducers/types'
import { DEFAULT_ETH_DECIMALS, STANDARD_ABI } from '../../helpers/constants'

const useAuthService = (web3Ref: Web3) => {
    const { state, dispatch } = useContext(AppContext)
    const { account } = state

    useEffect(() => {
        if (account?.address && account?.privateKey) {
            getAuthSession(account.privateKey)
            getAccountBalance(account.address)
        }
    }, [account?.address, account?.privateKey])

    const getAuthSession = async (privateKey: string) => {
        const account = await web3Ref.eth.accounts.privateKeyToAccount(
            privateKey
        )
        web3Ref.eth.accounts.wallet.add(account)
        web3Ref.eth.defaultAccount = account.address
        return account
    }

    const getAccountBalance = async (accountAddress: string) => {
        try {
            const userBalance = await web3Ref.eth.getBalance(accountAddress)
            dispatch({
                type: Types.BALANCE_UPDATE,
                payload: +userBalance / 10 ** DEFAULT_ETH_DECIMALS,
            })
        } catch (error) {
            console.error(error)
        }
    }

    const loginWallet = async (privateKey: string) => {
        try {
            const account = await getAuthSession(privateKey)
            dispatch({
                type: Types.LOGIN,
                payload: account,
            })
        } catch (error) {
            console.error(error)
        }
    }

    const logoutWallet = () => {
        dispatch({ type: Types.LOGOUT })
        web3Ref.eth.accounts.wallet.clear()
    }

    const addToken = (tokenContractData: TokenListItem) => {
        dispatch({
            type: Types.ADD_TOKEN,
            payload: tokenContractData,
        })
    }
    const updateTokenBalance = (tokenBalanceData: TokenBalance) => {
        dispatch({
            type: Types.TOKEN_BALANCE_UPDATE,
            payload: tokenBalanceData,
        })
    }

    const getContractByAddress = (tokenAddress: string) =>
        new web3Ref.eth.Contract(STANDARD_ABI, tokenAddress)

    return {
        addToken,
        logoutWallet,
        loginWallet,
        updateTokenBalance,
        getContractByAddress,
    }
}

export default useAuthService
