import React, { useCallback, useEffect, useState, useMemo } from "react"
import Head from 'next/head';
import numeral from 'numeral';
import CollectionItem from "@/components/CollectionItem/CollectionItem"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import useGemFarmStaking from "hooks/useGemFarmStaking"
import Header from "@/components/Header/Header"
import s from '../styles/index.page.module.scss'
import Dropdown from "@/components/Dropdown/Dropdown";
import { NetworksNames } from "../constants/networks";
import { MyAssociatedActions, MyState, useGlobal } from "@/hooks/useGlobalHook";

const StakePage = () => {
  const [farmId] = useState(process.env.NEXT_PUBLIC_GEMFARM_ID || "")

  const {
    loadingWalletNFTs,
    walletNFTs,
    farmAccount,
    farmerAccount,
    farmerVaultAccount,
    farmerStatus,
    selectedWalletItems,
    isLocked,
    availableA,
    feedbackStatus,
    handleStakeButtonClick,
    handleUnstakeButtonClick,
    handleClaimButtonClick,
    handleWalletItemClick,
    handleMoveToVaultButtonClick,
    farmerVaultNFTs,
    selectedVaultItems,
    handleMoveToWalletButtonClick,
    handleVaultItemClick,
    handleInitStakingButtonClick,
    // handleRefreshRewardsButtonClick,
  } = useGemFarmStaking(farmId)

  const { publicKey } = useWallet()

  useEffect(() => {
    if (!publicKey) return;
    console.log('StakePage:', {
      farmId,
      walletNFTs,
      farmAccount,
      farmerAccount,
      farmerVaultAccount,
      farmerStatus,
      selectedWalletItems,
      isLocked,
      availableA,
      feedbackStatus,
      farmerVaultNFTs,
      selectedVaultItems,
    })
  }, [publicKey, walletNFTs])

  const [theme] = useState('theme-main')

  const [network, setNetwork] = useGlobal<string, (value: string) => void>(
  (state: MyState) => state.network,
  (actions: MyAssociatedActions) => actions.setNetwork
  );
  const handleChangeNetwork = (value: string | number) => {
    setNetwork(value)
  }

  const [mode, setMode] = useState('home')
  const modes = {
    home: mode === 'home',
    connect: mode === 'connect',
  }

  const availableToClaim = useMemo(() => numeral((availableA / 1000000000).toFixed(2)).format('0,0.00'), [availableA]);
  const variableReward = useMemo(() => {
    return numeral((farmerAccount?.rewardA?.variableRate?.lastRecordedAccruedRewardPerRarityPoint?.n || 0) / 10 ** 3).format('0,0.00')
  }, [farmerAccount]);

  return (
    <div className={theme}>
      <Head>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Header />
      <div className="app">

        {!publicKey ? (
        /** Render nothing if there is no wallet connected */
        <></>
        ) : !farmerAccount ? (
        /** Farm ID is not configured */
        <></>
        ) : farmerAccount && !farmerAccount?.identity ? (
        /** If there is farmerAccount variable, but no address, it means account isn't initialized */
        <></>
        ) : (
        /** Render everything, since there is wallet and farmer account */
        <>
          {farmerAccount?.identity ? (
          /** Farmer account info section */
          <></>
          ) : (
          <></>
          )}
        </>
        )}

        {!!modes.home &&
        <section className={s.section}>
          <h1 className={s.h1}>Welcome to the Astro Babies Farm</h1>
          <div className={s.form}>
            <img className={s.nft} src="/images/nft.png" alt="NFT"/>
            <p>Click here if you’d like to stake your <span>Astro Babies</span> in the farm:</p>
            <button onClick={() => setMode('connect')}>Stake Astro Babies</button>
          </div>
          <div className={s.description}>
          </div>
        </section>
        }

        {!!modes.connect && !publicKey &&
        <section className={s.section}>
          <WalletMultiButton className={s.button}/>
          <div className={s.form}>
            <img className={s.nft} src="/images/nft.png" alt="NFT"/>
            <p>CONNECT YOUR WALLET</p>
          </div>
          <img className={s.nftLeft} src="/images/1.png" alt="NFT"/>
          <img className={s.nftRight} src="/images/2.png" alt="NFT"/>
          <div></div>
          <div></div>
          <div></div>
        </section>
        }

        {!!publicKey && !!farmerAccount && !farmerAccount?.identity &&
        <section className={s.section}>
          <div className={s.form}>
            <img className={s.nft} src="/images/nft.png" alt="NFT"/>
            <div>
              <p>
                Farmer account not found.
              </p>
              <p>
                Create a new one?
              </p>
            </div>
            <button onClick={handleInitStakingButtonClick}>New Farmer</button>
          </div>
          <img className={s.nftLeft} src="/images/1.png" alt="NFT"/>
          <img className={s.nftRight} src="/images/2.png" alt="NFT"/>
          <div></div>
        </section>
        }

        {!!publicKey && !!farmerAccount && farmerAccount?.identity &&
        <div className={s.containerStaking}>
          <div className={s.form}>
            <img className={s.nft} src="/images/nft.png" alt="NFT"/>
            <p>Staked farmer count: {farmAccount?.stakedFarmerCount?.toNumber() || 0}</p>
            <h1 className={s.h1}>Astro Babies Staked: {farmAccount?.gemsStaked?.toNumber() || 0}</h1>
            <div className={s.description}>
              Select your Astro Babies and move them into &quot;Your Stake&quot;, lock and start to begin staking
            </div>
          </div>
          <div className={s.nfts}>
            <section className={s.sectionNfts}>
              <h1>Your wallet</h1>
              <div className={s.nftsGallery}>
                {loadingWalletNFTs ?
                <div>Loading...</div> :
                walletNFTs.length ? walletNFTs.map((item) => {
                  const isSelected = selectedWalletItems.find(
                  (NFT) =>
                  NFT.onchainMetadata.mint ===
                  item.onchainMetadata.mint
                  )
                  return (
                  <CollectionItem
                  className={`${s.nftsGalleryItem} ${!!isSelected && s.nftsGalleryItemSelected}`}
                  key={item.onchainMetadata.mint}
                  item={item}
                  onClick={!isLocked ? handleWalletItemClick : () => true}
                  />
                  )
                }) : (
                <div>There are no NFTs on your wallet</div>
                )}
              </div>
            </section>
            <div className={s.arrows}>
              <div>
                {selectedVaultItems?.length ? (
                <>
                  {!isLocked ? (
                  <img
                  src="/images/arrow-left.svg"
                  alt="left"
                  onClick={handleMoveToWalletButtonClick}
                  />
                  ) : null}
                </>
                ) : null}

                {selectedWalletItems?.length && !isLocked ? (
                <img
                src="/images/arrow-right.svg"
                alt="right"
                onClick={handleMoveToVaultButtonClick}
                />
                ) : null}
              </div>
            </div>
            <section className={s.sectionNfts}>
              <h1>Your stake</h1>
              <div className={s.nftsGallery}>
                {farmerVaultNFTs?.length ? farmerVaultNFTs.map((item) => {
                  const isSelected = selectedVaultItems.find(
                  (NFT) =>
                  NFT.onchainMetadata.mint ===
                  item.onchainMetadata.mint
                  )
                  return (
                  <CollectionItem
                  className={`${s.nftsGalleryItem} ${!!isSelected && s.nftsGalleryItemSelected}`}
                  key={item.onchainMetadata.mint}
                  item={item}
                  onClick={!isLocked ? handleVaultItemClick : () => true}
                  />
                  )
                }) : (
                <div>There are no NFTs on your stake</div>
                )}
              </div>
            </section>
          </div>
          <div className={s.buttons}>

            {farmerStatus === "unstaked" &&
            <button
            onClick={handleStakeButtonClick}
            disabled={!farmerVaultNFTs?.length}
            >
              Begin staking
            </button>
            }

            {!!(farmerStatus === "staked" || farmerStatus === "pendingCooldown") &&
            <button
            onClick={handleUnstakeButtonClick}
            >
              {farmerStatus === "pendingCooldown"
              ? "End cooldown"
              : "End staking"}
            </button>
            }

            <button
            onClick={handleClaimButtonClick}
            disabled={!Number(availableA)}
            >
              CLAIM {availableToClaim}
            </button>

          </div>
        </div>
        }

        {!!publicKey && !!farmerAccount && !!farmerAccount?.identity &&
        <section className={s.sectionStaking}>
          <div>
            <div className={s.status}>
              <div>State:</div>
              <span>{farmerStatus}{!!isLocked && ' & locked'}</span>
            </div>
          </div>
          <h2 className={s.h2}>Astro Babies Staked: {farmerAccount?.gemsStaked?.toNumber() || 0}</h2>
          <div className={s.variableReward}>
            <div>Variable reward</div>
            <div>Last recorded: {variableReward}</div>
          </div>
          <div className={s.rewards}>
            <div>Total rewards:</div>
            <h1 className={s.h1}>{farmerAccount?.rewardA?.accruedReward.toNumber() || 0}</h1>
          </div>
          <div className={s.rewards}>
            <div>Claimed rewards:</div>
            <h1 className={s.h1}>{farmerAccount?.rewardA?.paidOutReward / (10 ** 6) || 0}</h1>
          </div>
          <button
          onClick={handleClaimButtonClick}
          disabled={!Number(availableA)}
          >
            CLAIM {availableToClaim}
          </button>
          <img className={s.nftLeft} src="/images/1.png" alt="NFT"/>
          <img className={s.nftRight} src="/images/2.png" alt="NFT"/>
        </section>
        }
      </div>
      {!!feedbackStatus &&
      <div className={s.message}>
        {feedbackStatus}
      </div>
      }
    </div>
  )
}

export default StakePage
