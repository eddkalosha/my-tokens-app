import { AccountActions, BalanceList, Types } from './types'

export const BalanceReducer = (state: BalanceList, action: AccountActions) => {
    switch (action.type) {
        case Types.TOKEN_BALANCE_UPDATE:
            return { ...state, [action.payload.symbol]: action.payload.balance }
        case Types.RESET_BALANCE_LIST:
            return {}
        default:
            return state
    }
}
