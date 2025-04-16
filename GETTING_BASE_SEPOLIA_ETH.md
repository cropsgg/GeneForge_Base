# Getting Base Sepolia ETH

To deploy your smart contracts to Base Sepolia testnet, you need Base Sepolia ETH. Here are ways to get it:

## Option 1: Use a Base Sepolia Faucet

1. Go to the Base Sepolia Faucet: https://www.basescan.org/faucet
2. Enter your wallet address: `0x98cDc5569420a845743888E3757Ef3Ce53C76334`
3. Complete any CAPTCHA or verification steps
4. Receive Base Sepolia ETH (usually 0.1 to 0.5 ETH)

## Option 2: Bridge ETH from Sepolia to Base Sepolia

If you already have Sepolia ETH, you can bridge it to Base Sepolia:

1. Go to the Base Bridge: https://bridge.base.org/deposit
2. Connect your wallet
3. Select "Sepolia" as the source network and "Base Sepolia" as the destination
4. Enter the amount of ETH you want to bridge (e.g., 0.03 ETH)
5. Complete the transaction

## Option 3: Use Other Faucets

1. Base Testnet Tools: https://www.base.org/developers
2. QuickNode Faucet: https://faucet.quicknode.com/drip
3. OKX Testnet Faucet: https://www.okx.com/web3/build/faucet

## Verify Your Balance

After getting ETH, you can verify your balance by running:

```
cd /Users/crops/Desktop/base_HackHazards/base_hackhazards && node src/contracts/check-balance.js
```

Once your balance shows sufficient ETH (at least 0.01 ETH), you can proceed with deploying your contracts.

## Next Steps After Getting ETH

1. Run the compilation script:
   ```
   npm run compile-contracts
   ```

2. Run the deployment script:
   ```
   npm run deploy-contracts
   ```

This should deploy all your contracts to Base Sepolia and save the contract addresses to the contract-addresses.json file. 