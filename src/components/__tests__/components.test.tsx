import { render, screen } from '@testing-library/react'
import { Account } from 'web3-core'
import AccountCard from '../AccountCard'
import '@testing-library/jest-dom'
import LoginForm from '../LoginForm'
import App from '../App'

describe('AccountCard component', () => {
    it('Should mount AccountCard component into DOM', () => {
        const accountData = {
            address: '',
            privateKey: '',
            balance: 100,
        } as unknown as Account

        render(<AccountCard account={accountData} logoutWallet={() => {}} />)

        expect(screen.getByText(/My Account/)).toBeInTheDocument()

        expect(screen.getByText(/Balance: 100 ETH/)).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: 'Log out' })
        ).toBeInTheDocument()
    })
})

describe('App component', () => {
    it('Should mount App component into DOM', () => {
        render(<App />)

        expect(screen.getByText(/Enter Wallet Private Key/)).toBeInTheDocument()
    })
})

describe('LoginForm component', () => {
    it('Should mount LoginForm component into DOM', () => {
        const loginWalletHandler = async (login: string) => {
            console.log(login)
        }

        render(<LoginForm loginWallet={loginWalletHandler} />)

        expect(screen.getByText(/Enter Wallet Private Key/)).toBeInTheDocument()

        expect(screen.getByText(/Example/)).toBeInTheDocument()

        expect(
            screen.getByRole('button', { name: 'Wallet login' })
        ).toBeInTheDocument()
    })

    it('Should have disabled button with no initial input data', () => {
        const loginWalletHandler = async (login: string) => {
            console.log(login)
        }

        render(<LoginForm loginWallet={loginWalletHandler} />)

        const loginButton: HTMLButtonElement = screen.getByRole('button', {
            name: /Wallet login/,
        })

        expect(loginButton.disabled).toBe(true)
    })
})
