import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"
import axios from "axios"
import { programs } from "@metaplex/js"

import { NFT } from "@/hooks/useWalletNFTs"

const {
  metadata: { Metadata },
} = programs

async function getNFTOnchainMetadata(
  conn: Connection,
  metadataPDA: string
): Promise<any> {
  try {
    const onchainMetadata = Metadata.load(conn, metadataPDA)
    // console.log('getNFTOnchainMetadata:', {
    //   onchainMetadata,
    // })
    return onchainMetadata
  } catch (e) {
    console.error('getNFTOnchainMetadata:', e)
    return null
  }
}

async function getNFTExternalMetadata(
  uri: string,
): Promise<NFT | undefined> {
  try {
    const externalMetadata = (await axios.get(uri)).data
    console.log('getNFTExternalMetadata:', {
      externalMetadata,
    })
    return externalMetadata
  } catch (e) {
    console.error('getNFTExternalMetadata:', e)
    return null
  }
}

export async function getNFTMetadataForMany(
  tokens: any[],
  conn: Connection
): Promise<NFT[]> {
  try {
    const promisesNFTPDA: Promise<any>[] = []
    tokens.forEach((token) => {
      promisesNFTPDA.push(Metadata.getPDA(token.mint))
    })
    const nftsPDA = await Promise.allSettled(promisesNFTPDA)
    .catch(function(err) {
      console.error(err); // some coding error in handling happened
    });
    console.log('getNFTMetadataForMany:', {
      tokens,
      promisesNFTPDA,
      nftsPDA,
    })

    const promisesNFTOnchainMetadata: Promise<any>[] = []
    tokens.forEach((token: any, i: number) => {
      promisesNFTOnchainMetadata.push(getNFTOnchainMetadata(conn, nftsPDA[i].value))
    })
    let nftsOnchainMetadata = await Promise.allSettled(promisesNFTOnchainMetadata)
    console.log('getNFTMetadataForMany:', {
      nftsOnchainMetadata,
    })
    nftsOnchainMetadata = nftsOnchainMetadata.filter((item) => {
      // @ts-ignore
      return !!item.value &&
      // @ts-ignore
      item.value.data.data.name.includes('OG Astro Baby') &&
      // @ts-ignore
      item.value.data.data.symbol === 'OG'
    })

    const promisesNFTExternalMetadata: Promise<any>[] = []
    nftsOnchainMetadata.forEach((item: any) => {
      promisesNFTExternalMetadata.push(getNFTExternalMetadata(item.value.data.data.uri))
    })
    const nftsExternalMetadata = await Promise.allSettled(promisesNFTExternalMetadata)
    console.log('getNFTMetadataForMany:', {
      nftsExternalMetadata,
    })

    const result = nftsOnchainMetadata.map((item: any, i: number) => {
      // @ts-ignore
      const pubkey = nftsOnchainMetadata[i].value.pubkey
      return {
        pubkey: pubkey ? new PublicKey(pubkey) : undefined,
        // @ts-ignore
        mint: new PublicKey(nftsOnchainMetadata[i].value.data.mint),
        // @ts-ignore
        onchainMetadata: nftsOnchainMetadata[i].value,
        // @ts-ignore
        externalMetadata: nftsExternalMetadata[i].value,
      }
    })
    return result
  } catch (e) {
    console.error('getNFTMetadataForMany:', e);
    return []
  }
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
