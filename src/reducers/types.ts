import { Account } from 'web3-core'

type ActionMap<T extends { [index: string]: any }> = {
    [Key in keyof T]: T[Key] extends undefined
        ? {
              type: Key
          }
        : {
              type: Key
              payload: T[Key]
          }
}

export type ContractDataType = {
    symbol: string
    decimals: string
    name: string
}

export enum Types {
    LOGIN = 'LOGIN',
    LOGOUT = 'LOGOUT',
    ADD_TOKEN = 'ADD_TOKEN',
    REMOVE_TOKEN = 'REMOVE_TOKEN',
    BALANCE_UPDATE = 'BALANCE_UPDATE',
    TOKEN_BALANCE_UPDATE = 'TOKEN_BALANCE_UPDATE',
    RESET_TOKEN_LIST = 'RESET_TOKEN_LIST',
    RESET_BALANCE_LIST = 'RESET_BALANCE_LIST',
}

export type TokenBalance = {
    symbol: ContractDataType['symbol']
    balance: string | number
}

type AccountPayload = {
    [Types.LOGIN]: Account
    [Types.LOGOUT]: undefined
    [Types.ADD_TOKEN]: TokenListItem
    [Types.REMOVE_TOKEN]: { symbol: ContractDataType['symbol'] }
    [Types.BALANCE_UPDATE]: number
    [Types.TOKEN_BALANCE_UPDATE]: TokenBalance
    [Types.RESET_TOKEN_LIST]: undefined
    [Types.RESET_BALANCE_LIST]: undefined
}

export type AccountActions =
    ActionMap<AccountPayload>[keyof ActionMap<AccountPayload>]

export type AccountData = Account & { balance?: number }

export type TokenListItem = ContractDataType & { balance?: number } & {
    address?: string
}

export type BalanceList = Record<
    TokenBalance['symbol'],
    TokenBalance['balance']
>
