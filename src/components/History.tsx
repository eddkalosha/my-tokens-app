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
import { useContext, useEffect, useState } from 'react'
import {
    DEFAULT_ETH_DECIMALS,
    UPDATE_TOKEN_DATA_INTERVAL,
    WATCH_TRANSACTION_URL,
} from '../helpers/constants'
import { AppContext } from '../context'
import { HistoryList, HistoryListItem } from '../types'
import {
    addressWithMidEll,
    getAccountHistory,
    timeSince,
} from '../helpers/utils'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'

const History = () => {
    const {
        state: { account, tokens, balances },
    } = useContext(AppContext)
    const [history, setHistory] = useState<HistoryList>([])

    const tokensList = tokens.reduce(
        (acc: Record<string, string>, tokenData) => {
            if (tokenData.address) {
                acc[tokenData.address.toLowerCase()] = tokenData.symbol
            }
            return acc
        },
        {}
    )

    const getHistory = async () => {
        if (account?.address) {
            try {
                const history = await getAccountHistory(account.address)
                setHistory(
                    history
                        .filter((historyItem) =>
                            Boolean(
                                tokensList[historyItem.address.toLowerCase()]
                            )
                        )
                        .sort((a, b) => +b.timeStamp - +a.timeStamp)
                )
            } catch (error) {
                console.error(error)
            }
        }
    }

    useEffect(() => {
        getHistory()

        const updateDataHistory = setInterval(async () => {
            getHistory()
        }, UPDATE_TOKEN_DATA_INTERVAL)

        return () => clearInterval(updateDataHistory)
    }, [account?.address, tokens, balances])

    return (
        <Card sx={{ minWidth: 300, minHeight: 220 }}>
            <CardContent>
                <Typography
                    sx={{ fontSize: 14 }}
                    color="text.secondary"
                    gutterBottom
                >
                    Transactions by custom wallet tokens ({history.length}){' '}
                </Typography>
                <Typography variant="h5" component="div">
                    Transaction History
                </Typography>
                <Typography variant="body2">
                    <List
                        sx={{
                            width: '100%',
                            bgcolor: 'background.paper',
                            maxHeight: 300,
                            overflowY: 'scroll',
                        }}
                    >
                        {history.length > 0 ? (
                            history.map(
                                (historyItem: HistoryListItem, index) => (
                                    <ListItem key={index}>
                                        <ListItemAvatar>
                                            <Avatar>
                                                <ArrowUpwardIcon />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <div>
                                                    <div>
                                                        <b>
                                                            Sent{' '}
                                                            {parseInt(
                                                                historyItem.data,
                                                                16
                                                            ) /
                                                                10 **
                                                                    DEFAULT_ETH_DECIMALS}
                                                            {
                                                                tokensList[
                                                                    historyItem.address.toLowerCase()
                                                                ]
                                                            }
                                                        </b>
                                                        <span>
                                                            {' '}
                                                            to{' '}
                                                            {addressWithMidEll(
                                                                historyItem
                                                                    .topics[2]
                                                            )}
                                                        </span>
                                                        <span>
                                                            {' '}
                                                            -{' '}
                                                            {timeSince(
                                                                +historyItem.timeStamp *
                                                                    1000
                                                            )}
                                                        </span>{' '}
                                                        <a
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            href={`${WATCH_TRANSACTION_URL}/${historyItem.transactionHash}`}
                                                        >
                                                            <IconButton>
                                                                <ArrowForwardIcon />
                                                            </IconButton>
                                                        </a>
                                                    </div>
                                                </div>
                                            }
                                        />
                                    </ListItem>
                                )
                            )
                        ) : (
                            <Typography sx={{ mt: 4 }} textAlign="center">
                                {' '}
                                - You have no transactions -{' '}
                            </Typography>
                        )}
                    </List>
                </Typography>
            </CardContent>
        </Card>
    )
}

export default History
