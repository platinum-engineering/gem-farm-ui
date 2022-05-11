const isProd = process.env.NODE_ENV.trim() === 'production'
const envFileName = isProd ? '.env' : '.env.' + process.env.NODE_ENV.trim()
require('dotenv').config({ path: envFileName })
console.log({
  NODE_ENV: process.env.NODE_ENV,
  envFileName,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GEMFARM_ID: process.env.NEXT_PUBLIC_GEMFARM_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_CONNECTION_NETWORK: process.env.NEXT_PUBLIC_CONNECTION_NETWORK,
    NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA,
    NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET,
  },
  publicRuntimeConfig: {
    NEXT_PUBLIC_GEMFARM_ID: process.env.NEXT_PUBLIC_GEMFARM_ID,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
    NEXT_PUBLIC_CONNECTION_NETWORK: process.env.NEXT_PUBLIC_CONNECTION_NETWORK,
    NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_MAINNET_BETA,
    NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET: process.env.NEXT_PUBLIC_SOLANA_RPC_HOST_DEVNET,
  },
}

module.exports = nextConfig
