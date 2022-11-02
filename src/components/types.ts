import { AccountData, TokenBalance, TokenListItem } from '../reducers/types'
import { Contract } from 'web3-eth-contract'

export type AccountCardPropsType = {
    account: AccountData
    logoutWallet: () => void
}

export type AddNewTokenPropsType = {
    addToken: (tokenContractData: TokenListItem) => void
    updateTokenBalance: (tokenBalanceData: TokenBalance) => void
    getContractByAddress: (address: string) => Contract
}

export type LoginFormPropsType = {
    loginWallet: (privateKey: string) => Promise<void>
}

export type TokenListProps = {
    getContractByAddress: (address: string) => Contract
    updateTokenBalance: (tokenBalanceData: TokenBalance) => void
    addToken: (tokenContractData: TokenListItem) => void
}

export type TransferTokenProps = {
    getContractByAddress: (address: string) => Contract
    tokenForTransfer?: string
    setTokenForTransfer: (token?: string) => void
}
