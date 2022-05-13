import { PublicKey } from "@solana/web3.js"
import { programs } from "@metaplex/js"
import { useEffect, useState, useCallback } from "react"
import { getNFTsByOwner } from "utils/nfts"
import { useConnection, useWallet } from "@solana/wallet-adapter-react"

export type NFT = {
  pubkey?: PublicKey
  mint: PublicKey
  onchainMetadata: programs.metadata.MetadataData
  externalMetadata: {
    attributes: Array<any>
    collection: any
    description: string
    edition: number
    external_url: string
    image: string
    name: string
    properties: {
      files: Array<string>
      category: string
      creators: Array<string>
    }
    seller_fee_basis_points: number
  }
}

const useWalletNFTs = () => {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [walletNFTs, setWalletNFTs] = useState<Array<NFT>>([])
  const [loadingWalletNFTs, setLoadingWalletNFTs] = useState<boolean>(false)

  const fetchNFTs = useCallback(async () => {
    setLoadingWalletNFTs(true)
    const NFTs = await getNFTsByOwner(publicKey, connection)
    setLoadingWalletNFTs(false)
    setWalletNFTs(NFTs)
  }, [publicKey, connection])

  useEffect(() => {
    if (publicKey) {
      fetchNFTs()
    }
  }, [publicKey, fetchNFTs])

  return { walletNFTs, loadingWalletNFTs, fetchNFTs }
}

export default useWalletNFTs
