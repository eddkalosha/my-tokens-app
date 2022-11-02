import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { isNumber, numberFormatter } from '../helpers/utils'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew'
import { AccountCardPropsType } from './types'

const AccountCard: React.FC<AccountCardPropsType> = ({
    account,
    logoutWallet,
}) => (
    <Card sx={{ minWidth: 300 }}>
        <CardContent>
            <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
            >
                Test challenge wallet
            </Typography>
            <Typography variant="h5" component="div">
                {' '}
                My Account
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                {isNumber(account?.balance) ? (
                    <div>
                        Balance: {numberFormatter(account?.balance || 0)} ETH
                    </div>
                ) : null}
            </Typography>
            <Typography variant="body2">
                Account address: {account?.address}
            </Typography>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', mr: 3 }}>
            <Button
                size="small"
                variant="outlined"
                startIcon={<PowerSettingsNewIcon />}
                onClick={logoutWallet}
            >
                Log out
            </Button>
        </CardActions>
    </Card>
)

export default AccountCard
