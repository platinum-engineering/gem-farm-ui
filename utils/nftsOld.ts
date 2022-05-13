import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import axios from "axios"
import { programs } from "@metaplex/js"

import { NFT } from "@/hooks/useWalletNFTs"

const {
  metadata: { Metadata },
} = programs

async function getNFTMetadata(
  mint: string,
  conn: Connection,
  pubkey?: string
): Promise<NFT | undefined> {
  try {
    const metadataPDA = await Metadata.getPDA(mint)
    const onchainMetadata = (await Metadata.load(conn, metadataPDA)).data
    const externalMetadata = (await axios.get(onchainMetadata.data.uri)).data
    console.log('getNFTMetadata:', {
      onchainMetadata,
      externalMetadata,
    })
    return {
      pubkey: pubkey ? new PublicKey(pubkey) : undefined,
      mint: new PublicKey(mint),
      onchainMetadata,
      externalMetadata,
    }
  } catch (e) {
    // console.log(`failed to pull metadata for token ${mint}`)
  }
}

export async function getNFTMetadataForMany(
  tokens: any[],
  conn: Connection
): Promise<NFT[]> {
  const promises: Promise<NFT | undefined>[] = []
  tokens.forEach((token) =>
    promises.push(getNFTMetadata(token.mint, conn, token.pubkey))
  )
  const nfts = (await Promise.allSettled(promises)).filter((n) => !!n)
  console.log('getNFTMetadataForMany:', { nfts })
  // const filteredNfts = nfts.filter((nft) => {
  //   return nft.onchainMetadata.data.name.includes('OG Astro Baby') && nft.onchainMetadata.data.symbol.includes('OG')
  // });
  return []
}

/**
 *
 * @author https://github.com/gemworks/gem-farm/tree/main/app/gem-farm
 */
export async function getNFTsByOwner(
  owner: PublicKey,
  conn: Connection
): Promise<NFT[]> {
  const tokenAccounts = await conn.getParsedTokenAccountsByOwner(owner, {
    programId: TOKEN_PROGRAM_ID,
  })

  const tokens = tokenAccounts.value
    .filter((tokenAccount) => {
      const amount = tokenAccount.account.data.parsed.info.tokenAmount
      return amount.decimals === 0 && amount.uiAmount === 1
    })
    .map((tokenAccount) => {
      return {
        pubkey: tokenAccount.pubkey,
        mint: tokenAccount.account.data.parsed.info.mint,
      }
    })

  return await getNFTMetadataForMany(tokens, conn)
}
