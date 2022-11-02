Created with Create React App

# For install project dependencies:

`npm i`

P.S. My node.js version is v14.17.0

# Check .env file:

This file should contain next variables:
`REACT_APP_API_HISTORY_KEY`
`REACT_APP_API_HISTORY`
`REACT_APP_WATCH_TRANSACTION_URL`

# After installing dependencies:

`npm start` and go to http://localhost:3000/

# Run test:

`npm test` or `npm run test`


For login into wallet you have to provide your wallet's private key.

I used Ethereum Mumbai testnet, so you may use my accounts or create new one.
I created few smart contracts for deal with Custom tokens (with hardhat):

`0x746dF14C6C42Bc03BC26bc70eF07A89198F518Fd (DVT)`
`0xe4e174d0FC80dea9AC9A5C622BEBAA75C6B3EEa1 (EDT)`
`0x0F41024B7bd86804e165dea19BBF7550474f0C5c (ETT)`

For history data and ethereum testnet was used Mumbai Polygon api. Credentials and urls provided inside .env file in the root of project. You may use my data or create your own as well. Don't touch urls of .env file, just history key, if need to create a new one.
You also could request my test ETH wallet for easy access to all historical data, etc.

# Add Mumbai testnet into your Metamask wallet

This part is not required but you may need for view synced data while testing:

1. Go to https://mumbai.polygonscan.com/
2. Scroll down the page
3. In Footer click button “Add Mumbai network”
4. For add some free tokens for gas transactions fees, use https://faucet.polygon.technology/. Select MATIC Token.
