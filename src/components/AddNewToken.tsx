import { useContext, useRef, useState } from 'react'
import { ContractDataType } from '../reducers/types'
import Web3 from 'web3'
import { getContractTokenInfo } from '../helpers/utils'
import { AppContext } from '../context'
import { Contract } from 'web3-eth-contract'
import { ContractTokenInfo } from '../types'
import {
    Alert,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormHelperText,
    InputLabel,
    OutlinedInput,
    Typography,
} from '@mui/material'
import { AddNewTokenPropsType } from './types'

const AddNewToken: React.FC<AddNewTokenPropsType> = ({
    addToken,
    updateTokenBalance,
    getContractByAddress,
}) => {
    const [tokenAddress, setTokenAddress] = useState<string>('')
    const [tokenData, setTokenData] = useState<ContractDataType>()
    const [modalAdd, setModalAdd] = useState(false)
    const {
        state: { account, tokens },
    } = useContext(AppContext)
    const tokenContractRef = useRef<Contract>()
    const contractDataRef = useRef<ContractTokenInfo>()

    const onAddNewToken = async () => {
        if (contractDataRef.current) {
            addToken({ ...contractDataRef.current, address: tokenAddress })
            try {
                const customTokenBalance =
                    await tokenContractRef.current?.methods
                        .balanceOf(account?.address)
                        .call()
                const balanceToDecimals =
                    +customTokenBalance /
                    10 ** Number(contractDataRef.current?.decimals || 0)
                updateTokenBalance({
                    symbol: contractDataRef.current?.symbol || '',
                    balance: balanceToDecimals,
                })
            } catch (error) {
                console.error(error)
            }

            onCloseModalHandler()
        }
    }

    const onChangeHandler = async (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const address = event.target.value
        setTokenAddress(address)
        if (Web3.utils.isAddress(address)) {
            const tokenContract = getContractByAddress(address)
            tokenContractRef.current = tokenContract
            try {
                const contractdata = await getContractTokenInfo(tokenContract)
                contractDataRef.current = contractdata
                setTokenData(contractdata)
            } catch (error) {
                console.warn(error)
            }
        } else {
            setTokenData(void 0)
        }
    }

    const onCloseModalHandler = () => {
        setTokenAddress('')
        setTokenData(void 0)
        setModalAdd(false)
    }

    const tokenAlreadyExists = tokens.some(
        ({ address }) => address === tokenAddress
    )
    const tokenAddressInvalid =
        tokenAlreadyExists ||
        !Web3.utils.isAddress(tokenAddress) ||
        !contractDataRef.current
    const tokenWasFound = !tokenAddressInvalid && tokenData

    return (
        <>
            <Typography
                sx={{ fontSize: 14, mt: 2.6 }}
                textAlign="center"
                color="text.secondary"
                gutterBottom
            >
                Don't see your token in list?
            </Typography>
            <Button fullWidth onClick={() => setModalAdd(true)}>
                {' '}
                Import Token
            </Button>
            {modalAdd ? (
                <Dialog
                    open
                    onClose={onCloseModalHandler}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    fullWidth
                >
                    <DialogTitle id="alert-dialog-title">
                        {' '}
                        Add new token{' '}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            <Alert severity="info">
                                For add new custom token to your Portfolio you
                                have to provide a valid address of smart
                                contract according to needed token. In most
                                cases you get this address right after deploy
                                the smart contract to blockchain network.
                            </Alert>
                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel
                                    size="small"
                                    htmlFor="outlined-adornment-amount"
                                >
                                    Token/contract address
                                </InputLabel>
                                <OutlinedInput
                                    size="small"
                                    value={tokenAddress}
                                    placeholder="ex. 0x746dF14A6C42Bc03BC26bc50eF07B89108F528Fd"
                                    onChange={onChangeHandler}
                                    label="Address"
                                    error={
                                        tokenAddress
                                            ? tokenAddressInvalid
                                            : false
                                    }
                                    color={
                                        tokenWasFound ? 'success' : undefined
                                    }
                                />
                                <FormHelperText id="component-helper-text">
                                    {tokenAlreadyExists
                                        ? `This token is already exist in your Portfolio`
                                        : tokenWasFound
                                        ? `Token was found! ${tokenData?.symbol} (${tokenData?.name} - ${tokenData.decimals} Decimals)`
                                        : `Please provide a correct address of smart contract or token.`}
                                </FormHelperText>
                            </FormControl>
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={onCloseModalHandler}>Cancel</Button>
                        <Button
                            disabled={tokenAddressInvalid}
                            onClick={onAddNewToken}
                            autoFocus
                        >
                            {' '}
                            Add token{' '}
                        </Button>
                    </DialogActions>
                </Dialog>
            ) : null}
        </>
    )
}

export default AddNewToken
