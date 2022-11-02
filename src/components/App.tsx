import { useContext } from 'react'
import Web3 from 'web3'
import AccountCard from './AccountCard'
import History from './History'
import TokenList from './TokenList'
import useAuthService from './hooks/useAuthService'
import { AppContext } from '../context'
import LoginForm from './LoginForm'
import { Box, Grid } from '@mui/material'

const web3Ref = new Web3(Web3.givenProvider)

function App() {
    const {
        state: { account },
    } = useContext(AppContext)
    const {
        logoutWallet,
        getContractByAddress,
        loginWallet,
        addToken,
        updateTokenBalance,
    } = useAuthService(web3Ref)

    return (
        <Box sx={{ mx: 20 }}>
            {account?.address ? (
                <Grid container spacing={2}>
                    <Grid item sm={12}>
                        <AccountCard
                            account={account}
                            logoutWallet={logoutWallet}
                        />
                    </Grid>
                    <Grid item lg={4} sm={12}>
                        <TokenList
                            getContractByAddress={getContractByAddress}
                            updateTokenBalance={updateTokenBalance}
                            addToken={addToken}
                        />
                    </Grid>
                    <Grid item lg={8} sm={12}>
                        <History />
                    </Grid>
                </Grid>
            ) : (
                <LoginForm loginWallet={loginWallet} />
            )}
        </Box>
    )
}

export default App
