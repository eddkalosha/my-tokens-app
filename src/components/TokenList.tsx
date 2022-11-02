import { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context'
import TransferToken from './TransferToken'
import { getContractTokenInfo, numberFormatter } from '../helpers/utils'
import { UPDATE_TOKEN_DATA_INTERVAL } from '../helpers/constants'
import {
    Avatar,
    Card,
    CardContent,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material'
import AnimationIcon from '@mui/icons-material/Animation'
import SendIcon from '@mui/icons-material/CallMade'
import AddNewToken from './AddNewToken'
import { TokenListProps } from './types'

const TokenList: React.FC<TokenListProps> = ({
    getContractByAddress,
    updateTokenBalance,
    addToken,
}) => {
    const {
        state: { account, tokens, balances },
    } = useContext(AppContext)
    const [tokenForTransfer, setTokenForTransfer] = useState<string>()

    const balanceUpdater = async (tokenAddress: string) => {
        const tokenContract = getContractByAddress(tokenAddress)
        const contractdata = await getContractTokenInfo(tokenContract)
        const customTokenBalance = await tokenContract.methods
            .balanceOf(account?.address)
            .call()
        const balanceToDecimals =
            +customTokenBalance / 10 ** Number(contractdata.decimals || 0)
        updateTokenBalance({
            symbol: contractdata.symbol || '',
            balance: balanceToDecimals,
        })
        return { symbol: contractdata.symbol || '', balance: balanceToDecimals }
    }

    useEffect(() => {
        const updateDataBalances = setInterval(() => {
            const tokenAddrs = tokens.map(({ address }) =>
                address ? balanceUpdater(address) : null
            )
            Promise.all(tokenAddrs)
                .then((results) => {
                    console.log('balances', results)
                })
                .catch((e) => {
                    console.error(e)
                })
        }, UPDATE_TOKEN_DATA_INTERVAL)

        return () => clearInterval(updateDataBalances)
    }, [tokens])

    return (
        <>
            <Card sx={{ minWidth: 300 }}>
                <CardContent>
                    <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                    >
                        My added custom tokens ({tokens.length}){' '}
                    </Typography>
                    <Typography variant="h5" component="div">
                        My tokens
                    </Typography>
                    <Typography variant="body2">
                        <List
                            sx={{ width: '100%', bgcolor: 'background.paper' }}
                        >
                            {tokens.length > 0 ? (
                                tokens.map((tokenInfo) => (
                                    <ListItem key={tokenInfo.symbol}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <AnimationIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={tokenInfo.symbol}
                                            secondary={`Balance: ${numberFormatter(
                                                balances[tokenInfo.symbol]
                                            )}`}
                                        />
                                        <IconButton
                                            aria-haspopup="true"
                                            title="Transfer tokens"
                                            onClick={() =>
                                                setTokenForTransfer(
                                                    tokenInfo.symbol
                                                )
                                            }
                                            size="small"
                                            color="primary"
                                            aria-label="Transfer tokens"
                                        >
                                            <SendIcon />
                                        </IconButton>
                                    </ListItem>
                                ))
                            ) : (
                                <Typography textAlign="center">
                                    - You have no custom tokens -
                                </Typography>
                            )}
                        </List>
                    </Typography>
                    <AddNewToken
                        addToken={addToken}
                        updateTokenBalance={updateTokenBalance}
                        getContractByAddress={getContractByAddress}
                    />
                </CardContent>
            </Card>
            <TransferToken
                getContractByAddress={getContractByAddress}
                setTokenForTransfer={setTokenForTransfer}
                tokenForTransfer={tokenForTransfer}
            />
        </>
    )
}

export default TokenList
