import { useContext, useState } from 'react'
import Web3 from 'web3'
import { GAS_QUANTITY, WATCH_TRANSACTION_URL } from '../helpers/constants'
import { AppContext } from '../context'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    Typography,
} from '@mui/material'
import { TransferTokenProps } from './types'

const TransferToken: React.FC<TransferTokenProps> = ({
    getContractByAddress,
    tokenForTransfer,
    setTokenForTransfer,
}) => {
    const [transferAmount, setTransferAmount] = useState<string>('')
    const [transferTo, setTransferTo] = useState<string>('')
    const [transactionHash, setTransactionHash] = useState<string>('')
    const [errors, setErrors] = useState<string[]>([])
    const {
        state: { account, tokens, balances },
    } = useContext(AppContext)

    const sendTokenHandler = async () => {
        const selectedToken = tokens.find(
            ({ symbol }) => tokenForTransfer === symbol
        )
        if (selectedToken?.address) {
            const decimals = Web3.utils.toBN(selectedToken.decimals)
            const amount = Web3.utils.toBN(transferAmount)
            const value = amount.mul(Web3.utils.toBN(10).pow(decimals))

            const tokenContract = getContractByAddress(selectedToken.address)

            tokenContract.methods
                .transfer(transferTo, value)
                .send({ from: account?.address, gas: GAS_QUANTITY })
                .on('transactionHash', function (hash: string) {
                    setTransactionHash(hash)
                })
                .on('error', function (error: string) {
                    setErrors([...errors, String(error)])
                })
        }
    }

    const closeTokenSendForm = () => {
        setTokenForTransfer(void 0)
        setTransferAmount('')
        setTransferTo('')
        setTransactionHash('')
    }

    const addressIsCorrect = Web3.utils.isAddress(transferTo)
    const amountIsCorrect = tokenForTransfer
        ? /^\d+$/.test(transferAmount) &&
          +transferAmount <= +balances[tokenForTransfer]
        : false
    const sendingIsDisabled = !(
        addressIsCorrect &&
        tokenForTransfer &&
        amountIsCorrect
    )

    return tokenForTransfer ? (
        <Dialog
            open={true}
            onClose={closeTokenSendForm}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth
        >
            <DialogTitle id="alert-dialog-title">
                {' '}
                Transfer {tokenForTransfer} tokens{' '}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {transactionHash ? (
                        <>
                            <Alert severity="success">
                                SUCCESS. <br />
                                {transferAmount}
                                {tokenForTransfer} was successfully transferred
                                to provided address. <br />
                                Your wallet balance and transaction history may
                                be updated up to 2 minutes. <br />
                            </Alert>
                            <Typography sx={{ mt: 2 }} textAlign="center">
                                <a
                                    target="_blank"
                                    rel="noreferrer"
                                    href={`${WATCH_TRANSACTION_URL}/${transactionHash}`}
                                >
                                    <Button color="success" variant="contained">
                                        {' '}
                                        View transaction details{' '}
                                    </Button>
                                </a>
                            </Typography>
                        </>
                    ) : (
                        <>
                            <FormControl fullWidth sx={{ m: 1 }}>
                                <Alert severity="info">
                                    For sending tokens to someone please provide
                                    number of tokens and recipient address in
                                    Ethereum network. Note that amount of tokens
                                    should be an integer value.
                                </Alert>
                            </FormControl>
                            <FormControl fullWidth sx={{ m: 1, mt: 2 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">
                                    Amount
                                </InputLabel>
                                <OutlinedInput
                                    value={transferAmount}
                                    type="number"
                                    inputProps={{ step: '1', lang: 'en-US' }}
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => setTransferAmount(event.target.value)}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            {tokenForTransfer}
                                        </InputAdornment>
                                    }
                                    label="Amount"
                                    error={
                                        transferAmount
                                            ? !amountIsCorrect
                                            : false
                                    }
                                />
                            </FormControl>
                            <FormControl fullWidth sx={{ m: 1, mt: 3 }}>
                                <InputLabel htmlFor="outlined-adornment-amount">
                                    Recipient
                                </InputLabel>
                                <OutlinedInput
                                    value={transferTo}
                                    placeholder="ex. 0xD1255A88D3f32FCbC3aDDAC3Ef8f6c43870755a1"
                                    onChange={(
                                        event: React.ChangeEvent<HTMLInputElement>
                                    ) => setTransferTo(event.target.value)}
                                    label="Address"
                                    error={
                                        transferTo ? !addressIsCorrect : false
                                    }
                                />
                            </FormControl>
                        </>
                    )}
                    {errors.length > 0 ? (
                        <FormControl fullWidth sx={{ m: 1 }}>
                            <Alert
                                onClose={() => setErrors([])}
                                severity="error"
                            >
                                {errors.map((error, i) => (
                                    <div>{error}</div>
                                ))}
                            </Alert>
                        </FormControl>
                    ) : null}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeTokenSendForm}>
                    {transactionHash ? 'Close' : 'Cancel'}
                </Button>
                {transactionHash ? null : (
                    <Button
                        disabled={sendingIsDisabled}
                        onClick={sendTokenHandler}
                        autoFocus
                    >
                        {' '}
                        Send tokens{' '}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    ) : null
}

export default TransferToken
