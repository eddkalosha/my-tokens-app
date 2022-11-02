export type HistoryListItem = {
    topics: string[]
    data: string
    address: string
    transactionHash: string
    timeStamp: string
}

export type HistoryList = HistoryListItem[]

export type ContractTokenInfo = {
    decimals: string
    name: string
    symbol: string
}
