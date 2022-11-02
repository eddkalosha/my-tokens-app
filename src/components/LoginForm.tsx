import FilledInput from '@mui/material/FilledInput'
import InputLabel from '@mui/material/InputLabel'
import FormHelperText from '@mui/material/FormHelperText'
import FormControl from '@mui/material/FormControl'
import { useState } from 'react'
import { checkPrivateKey } from '../helpers/utils'
import { Button, FormGroup } from '@mui/material'
import { LoginFormPropsType } from './types'

const LoginForm: React.FC<LoginFormPropsType> = ({ loginWallet }) => {
    const [privateKey, setPrivateKey] = useState<string>('')
    const privateKeyInvalid = !checkPrivateKey(privateKey)

    const loginHandler = () => {
        loginWallet(privateKey)
        setPrivateKey('')
    }

    return (
        <FormGroup sx={{ width: 600, margin: 'auto' }}>
            <FormControl sx={{ m: 2, mt: 10 }} variant="filled">
                <InputLabel htmlFor="filled-adornment-password">
                    Enter Wallet Private Key
                </InputLabel>
                <FilledInput
                    id="filled-adornment-password"
                    type={'text'}
                    value={privateKey}
                    fullWidth
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setPrivateKey(event.target.value)
                    }
                    error={privateKey ? privateKeyInvalid : false}
                />
                <FormHelperText id="filled-weight-helper-text">
                    Example:
                    26d203424f24a19cr1e195bed5c38a859c2b22e4d4encab2d431ac7a7f23edb3
                </FormHelperText>
            </FormControl>
            <FormControl sx={{ m: 2 }} variant="filled">
                <Button
                    disabled={privateKeyInvalid}
                    onClick={loginHandler}
                    variant="contained"
                >
                    Wallet login
                </Button>
            </FormControl>
        </FormGroup>
    )
}

export default LoginForm
