import { AccountActions, AccountData, Types } from './types'

export const AccountReducer = (
    state: AccountData | undefined,
    action: AccountActions
) => {
    switch (action.type) {
        case Types.LOGIN:
            return action.payload
        case Types.LOGOUT:
            return undefined
        case Types.BALANCE_UPDATE:
            return state ? { ...state, balance: action.payload } : state
        default:
            return state
    }
}
