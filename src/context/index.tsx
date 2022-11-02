import React, { createContext, Dispatch, useEffect, useReducer } from 'react'
import { LOCAL_STORE_NAME } from '../helpers/constants'
import { AccountReducer } from '../reducers/account'
import { BalanceReducer } from '../reducers/balances'
import { TokenReducer } from '../reducers/tokens'
import {
    AccountActions,
    AccountData,
    BalanceList,
    TokenListItem,
    Types,
} from '../reducers/types'

type InitialStateType = {
    account?: AccountData
    tokens: TokenListItem[]
    balances: BalanceList
}

const initialState: InitialStateType = {
    account: undefined,
    tokens: [],
    balances: {},
}

const AppContext = createContext<{
    state: InitialStateType
    dispatch: Dispatch<AccountActions>
}>({
    state: initialState,
    dispatch: () => null,
})

const AppReducer = (
    { account, tokens, balances }: InitialStateType,
    action: AccountActions
) => ({
    account: AccountReducer(account, action),
    tokens: TokenReducer(tokens, action),
    balances: BalanceReducer(balances, action),
})

const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(AppReducer, initialState, () => {
        const appData = localStorage.getItem(LOCAL_STORE_NAME)
        return appData ? JSON.parse(appData) : initialState
    })

    useEffect(() => {
        if (state.account?.address && state.account?.privateKey) {
            localStorage.setItem(LOCAL_STORE_NAME, JSON.stringify(state))
        } else {
            localStorage.removeItem(LOCAL_STORE_NAME)
            dispatch({ type: Types.RESET_TOKEN_LIST })
            dispatch({ type: Types.RESET_BALANCE_LIST })
        }
    }, [state])

    return (
        <AppContext.Provider value={{ state, dispatch }}>
            {children}
        </AppContext.Provider>
    )
}

export { AppProvider, AppContext }
