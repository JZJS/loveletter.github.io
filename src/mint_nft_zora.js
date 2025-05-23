// ✅ This function uses Zora Protocol SDK to mint an NFT to a wallet via a deployed 1155 contract
// Replace IMAGE_URI and WALLET_ADDRESS with your actual values
// Requires: viem, wagmi, @zoralabs/protocol-sdk, ethers

import { createPublicClient, createWalletClient, http } from 'viem'
import { sepolia } from 'viem/chains'
// import { mainnet } from 'viem/chains'
import { privateKeyToAccount } from 'viem/accounts'
import { createMintTo1155 } from '@zoralabs/protocol-sdk'
import { ethers } from 'ethers'

export async function mintNFT() {
  const imageURI = 'https://drive.google.com/file/d/14s0-ZWhySbXmWm2NtzARbsCjIQRyo52k/view?usp=sharing' // ← put your IPFS image URI here
  const mintToAddress = '0xXXXX' // ← put your wallet address here

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http("https://sepolia.rpc.zora.energy")
  });

  const walletClient = createWalletClient({
    chain: sepolia,
    transport: http(),
    account: privateKeyToAccount('0xXXXX') // ⚠️ Use env var or injected wallet in real app
  });

  const contractAddress = '0x16d8aA1A80dA1c8B73786d9c05Be258e622Aa8f6' // ← Your deployed 1155 contract address

  const tx = await createMintTo1155({
    publicClient,
    walletClient,
    contractAddress,
    mintToAddress,
    quantity: 1,
    uri: imageURI
  });

  console.log('✅ NFT mint tx:', tx);
}
