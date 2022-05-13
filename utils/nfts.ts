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
    // console.log('getNFTExternalMetadata:', {
    //   externalMetadata,
    // })
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
    const nftsOnchainMetadata: any = await Promise.allSettled(promisesNFTOnchainMetadata)
    console.log('getNFTMetadataForMany:', {
      nftsOnchainMetadata,
    })
    // @ts-ignore
    const arrayForFilter = nftsOnchainMetadata.map((item) => !!item.value &&
    // @ts-ignore
    item.value.data.data.name.includes('OG Astro Baby') &&
    // @ts-ignore
    item.value.data.data.symbol === 'OG')
    const nftsOnchainMetadataFiltered = nftsOnchainMetadata.filter((item, i) => arrayForFilter[i])
    const tokensFiltered = tokens.filter((item, i) => arrayForFilter[i])

    const promisesNFTExternalMetadata: Promise<any>[] = []
    nftsOnchainMetadataFiltered.forEach((item: any) => {
      // @ts-ignore
      promisesNFTExternalMetadata.push(getNFTExternalMetadata(item.value.data.data.uri))
    })
    const nftsExternalMetadata = await Promise.allSettled(promisesNFTExternalMetadata)
    console.log('getNFTMetadataForMany:', {
      tokensFiltered,
      nftsExternalMetadata,
    })

    const result: NFT[] = nftsOnchainMetadataFiltered.map((item: any, i: number) => {
      const externalMetadataResult: any = nftsExternalMetadata[i]
      const pubkey = tokensFiltered[i].pubkey
      const mint = tokensFiltered[i].mint
      return {
        pubkey: pubkey ? new PublicKey(pubkey) : undefined,
        mint: new PublicKey(mint),
        // @ts-ignore
        onchainMetadata: item.value.data,
        externalMetadata: externalMetadataResult.value,
      }
    })
    console.log('getNFTMetadataForMany:', { result })
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
