import { Contract } from 'web3-eth-contract'
import { ContractTokenInfo, HistoryList } from '../types'
import { API_HISTORY, API_HISTORY_KEY, TOPIC_FORMAT } from './constants'

export const getContractTokenInfo = async (
    tokenContract: Contract
): Promise<ContractTokenInfo> => {
    const [symbol, decimals, name] = await Promise.all([
        tokenContract.methods.symbol().call(),
        tokenContract.methods.decimals().call(),
        tokenContract.methods.name().call(),
    ])
    return { decimals, name, symbol }
}

export const checkPrivateKey = (key: string) => String(key).length >= 32

export const isNumber = (value: string | number | undefined | null) =>
    typeof value === 'number' && isFinite(value)

export const getAccountHistory = async (
    address: string
): Promise<HistoryList> => {
    const res = await fetch(
        `${API_HISTORY}?module=logs&action=getLogs&sort=desc&fromBlock=0&toBlock=9999999999&apikey=${API_HISTORY_KEY}&topic1=${TOPIC_FORMAT}${address.replace(
            '0x',
            ''
        )}`
    )
    const { result } = await res.json()
    return result
}

export const addressWithMidEll = (str: string) => {
    const strAddrFixed = str.replace(TOPIC_FORMAT, '0x')
    const correctorLen = 10
    return strAddrFixed.length > correctorLen * 2
        ? strAddrFixed.substr(0, correctorLen) +
              '...' +
              strAddrFixed.substr(
                  strAddrFixed.length - correctorLen,
                  strAddrFixed.length
              )
        : strAddrFixed
}

export const timeSince = (date: number) => {
    const seconds = Math.floor((new Date().getTime() - date) / 1000)
    let interval = seconds / 31536000

    if (interval > 1) {
        return Math.floor(interval) + ' year(-s) ago'
    }
    interval = seconds / 2592000
    if (interval > 1) {
        return Math.floor(interval) + ' month(-s) ago'
    }
    interval = seconds / 86400
    if (interval > 1) {
        return Math.floor(interval) + ' day(-s) ago'
    }
    interval = seconds / 3600
    if (interval > 1) {
        return Math.floor(interval) + ' hour(-s) ago'
    }
    interval = seconds / 60
    if (interval > 1) {
        return Math.floor(interval) + ' minute(-s) ago'
    }
    return Math.floor(seconds) + ' second(-s) ago'
}

export const numberFormatter = (num: string | number) =>
    num ? Intl.NumberFormat('en-US').format(+num) : num
