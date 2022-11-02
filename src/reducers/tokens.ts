import { AccountActions, TokenListItem, Types } from './types'

export const TokenReducer = (
    state: TokenListItem[],
    action: AccountActions
) => {
    switch (action.type) {
        case Types.ADD_TOKEN:
            return [...state, action.payload]
        case Types.REMOVE_TOKEN:
            return state.filter(
                (token) => token.symbol !== action.payload.symbol
            )
        case Types.RESET_TOKEN_LIST:
            return []
        default:
            return state
    }
}
