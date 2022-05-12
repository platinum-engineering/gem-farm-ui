/** @jsxImportSource theme-ui */
import React, { useCallback, useEffect, useState, useMemo } from "react"

import { Flex, Text, Heading, Spinner, Button, Container } from "theme-ui"

import CollectionItem from "@/components/CollectionItem/CollectionItem"
import useGemFarmStaking from "hooks/useGemFarmStaking"
import { useWallet } from "@solana/wallet-adapter-react"
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui"

import { Tab, Tabs, TabList, TabPanel } from "react-tabs"
import Header from "@/components/Header/Header"
import { LoadingIcon } from "@/components/icons/LoadingIcon"
import s from '../styles/index.page.module.scss'

const StakePage = () => {
  const [farmId] = useState(process.env.NEXT_PUBLIC_GEMFARM_ID || "")
  const [walletNFTsFiltered, setWalletNFTsFiltered] = useState([])

  const {
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
    handleRefreshRewardsButtonClick,
  } = useGemFarmStaking(farmId)

  const { publicKey } = useWallet()

  const filterNFTS = useCallback(() => {
    try {
      const walletNFTsFilteredNew = walletNFTs.filter((item) => !item.externalMetadata.name.includes('MARNO'))
      setWalletNFTsFiltered(walletNFTsFilteredNew)
    } catch (e) {
      console.error(e);
    }
  }, [walletNFTs])

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
    filterNFTS();
  }, [publicKey, walletNFTs])

  useEffect(() => {
    if (!walletNFTsFiltered) return;
    console.log('StakePage:', {
      walletNFTsFiltered,
    })
  }, [walletNFTsFiltered])

  const [theme] = useState('theme-main')

  const [mode, setMode] = useState('home')
  const modes = {
    home: mode === 'home',
    connect: mode === 'connect',
  }

  const availableToClaim = useMemo(() => (availableA / 1000000000).toFixed(2), [availableA]);

  return (
    <div className={theme}>
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
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis auteLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
          </div>
        </section>
        }

        {!!modes.connect && !publicKey &&
        <section className={s.section}>
          <WalletMultiButton className={s.button}>
            Choose wallet...
          </WalletMultiButton>
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
          <div className={s.buttons}>
            <button>TESTNET</button>
            <WalletMultiButton className={s.button}>
              PHANTOM
            </WalletMultiButton>
          </div>
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
                {walletNFTs.length ? walletNFTs.map((item) => {
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
              <span>{farmerStatus}</span>
            </div>
          </div>
          <h2 className={s.h2}>Astro Babies Staked: {farmerAccount?.gemsStaked?.toNumber() || 0}</h2>
          <div className={s.variableReward}>
            <div>Variable reward:</div>
            <div>Last recorded: Nan</div>
          </div>
          <div className={s.rewards}>
            <div>Total rewards:</div>
            <h1 className={s.h1}>1040</h1>
          </div>
          <div className={s.rewards}>
            <div>Claimed rewards:</div>
            <h1 className={s.h1}>0</h1>
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
    </div>
  )

  // todo: remove after copying functionality
  return (
    <div className={theme}>
      <Header />

      <Flex
        sx={{
          flexDirection: "column",
          marginTop: "3.2rem",
          alignItems: "center",
          padding: "0 1.6rem",
        }}
      >
        <Heading>Your staking account</Heading>
        <Text>Below you can stake, unstake and collect rewards.</Text>

        {!publicKey ? (
          /** Render nothing if there is no wallet connected. */
          <Text
            sx={{
              textAlign: "center",
              margin: "3.2rem 0",
            }}
          >
            Connect your wallet first.
          </Text>
        ) : !farmerAccount ? (
          // <LoadingIcon
          //   size={"3.2rem"}
          //   sx={{
          //     margin: "3.2rem 0"
          //   }}
          // />
          <Text mt="1.6rem">Farm ID is not configured.</Text>
        ) : /** If there is farmerAccount variable, but no address, it means account isn't initialized */
        farmerAccount && !farmerAccount?.identity ? (
          <Button
            sx={{
              margin: "3.2rem 0",
            }}
            onClick={handleInitStakingButtonClick}
          >
            Init staking account
          </Button>
        ) : (
          <>
            {/** Render everything, since there is wallet and farmer account */}
            {/** Farmer account info section */}
            {farmerAccount?.identity ? (
              <>
                <Flex
                  sx={{
                    flexDirection: "column",
                    margin: "1.6rem 0",
                  }}
                >
                  <Flex
                    sx={{
                      gap: ".4rem",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      sx={{
                        maxHeight: "2.4rem",
                      }}
                      src="images/gemtransparent.gif"
                    />
                    <Text>
                      NFTs staked:&nbsp;
                      {farmerAccount?.gemsStaked.toNumber()}
                    </Text>
                  </Flex>
                  <Text
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    Vault state: <b>{isLocked ? "locked" : "unlocked"}</b>
                    <br />
                  </Text>
                  <Text
                    sx={{
                      textAlign: "center",
                    }}
                  >
                    Account status: <b>{farmerStatus}</b>
                    <br />
                  </Text>
                </Flex>

                <Flex
                  sx={{
                    gap: "1.6rem",
                    margin: "1.6rem 0",
                    flexWrap: "wrap",
                    alignItems: "center",
                    alignSelf: "stretch",
                    justifyContent: "center",

                    "@media (min-width: 768px": {
                      flexDirection: "row",
                    },
                  }}
                >
                  <Button
                    onClick={handleStakeButtonClick}
                    disabled={
                      !(farmerStatus === "unstaked" && farmerVaultNFTs?.length)
                    }
                  >
                    Stake
                  </Button>
                  <Button
                    onClick={handleUnstakeButtonClick}
                    disabled={
                      !(
                        farmerStatus === "staked" ||
                        farmerStatus === "pendingCooldown"
                      )
                    }
                  >
                    {farmerStatus === "pendingCooldown"
                      ? "End cooldown"
                      : "Unstake"}
                  </Button>
                  <Button
                    onClick={handleClaimButtonClick}
                    disabled={!Number(availableA)}
                  >
                    Claim{" "}
                    <img
                      sx={{
                        margin: "0 .4rem 0 .8rem",
                        maxHeight: "2.4rem",
                      }}
                      src="images/icon-list-item.png"
                    />
                    {availableA ? (
                      <b>{(availableA / 1000000000).toFixed(2)}</b>
                    ) : (
                      0
                    )}
                  </Button>
                  <Button onClick={handleRefreshRewardsButtonClick}>
                    Refresh
                  </Button>
                </Flex>
                <Flex
                  sx={{
                    alignItems: "center",
                    gap: ".8rem",
                    margin: ".8rem 0",
                  }}
                >
                  {feedbackStatus ? (
                    <>
                      <LoadingIcon size="1.6rem" />
                      {"  "} <Text variant="small">{feedbackStatus}</Text>
                    </>
                  ) : (
                    ""
                  )}
                  &nbsp;
                </Flex>
              </>
            ) : null}

            <Tabs
              sx={{
                margin: "3.2rem 0",
                alignSelf: "stretch",
                minHeight: "48rem",
              }}
            >
              <TabList>
                <Tab>Your wallet</Tab>
                <Tab>Your vault</Tab>
              </TabList>

              <TabPanel>
                {walletNFTs ? (
                  walletNFTs.length ? (
                    <Flex
                      sx={{
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <div
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            walletNFTs.length > 1 ? "1fr 1fr" : "1fr",
                          gap: "1.6rem",
                          alignItems: "center",

                          "@media (min-width: 768px)": {
                            gridTemplateColumns:
                              walletNFTs.length > 9
                                ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                                : walletNFTs.length > 4
                                ? "1fr 1fr 1fr 1fr 1fr"
                                : walletNFTs.map(() => "1fr").join(" "),
                          },
                        }}
                      >
                        {walletNFTs.map((item) => {
                          const isSelected = selectedWalletItems.find(
                            (NFT) =>
                              NFT.onchainMetadata.mint ===
                              item.onchainMetadata.mint
                          )

                          return (
                            <CollectionItem
                              key={item.onchainMetadata.mint}
                              item={item}
                              onClick={
                                !isLocked ? handleWalletItemClick : () => true
                              }
                              sx={{
                                maxWidth: "16rem",
                                "> img": {
                                  border: "3px solid transparent",
                                  borderColor: isSelected
                                    ? "primary"
                                    : "transparent",
                                },
                              }}
                            />
                          )
                        })}
                      </div>
                      {walletNFTs.length && !isLocked ? (
                        <Text
                          sx={{
                            margin: "3.2rem 0 .8rem 0",
                          }}
                          variant="small"
                        >
                          Select NFTs to move them to your Vault.
                        </Text>
                      ) : null}
                      <Text>
                        {/* Selected:{" "}
                    {selectedWalletItems && selectedWalletItems.length
                      ? selectedWalletItems
                          .map((NFT) => NFT.onchainMetadata.metaData.data.name)
                          .join(", ")
                      : null} */}
                        {selectedWalletItems?.length && !isLocked ? (
                          <Button onClick={handleMoveToVaultButtonClick}>
                            Deposit selected
                          </Button>
                        ) : null}
                      </Text>
                    </Flex>
                  ) : (
                    /** walletNFTs fetched but array is empty, means current wallet has no NFT. */
                    <Flex
                      sx={{
                        justifyContent: "center",
                        alignSelf: "stretch",
                      }}
                    >
                      <Text>There are no NFTs on your wallet.</Text>
                    </Flex>
                  )
                ) : /** No walletNFTs and public key, means it is loading */
                publicKey ? (
                  <Flex
                    sx={{
                      justifyContent: "center",
                      alignSelf: "stretch",
                    }}
                  >
                    <Spinner variant="styles.spinnerLarge" />
                  </Flex>
                ) : null}
              </TabPanel>
              <TabPanel>
                {farmerVaultAccount ? (
                  <>
                    {/** Vault UI section */}
                    {/* <ThemeHeading
                  variant="heading3"
                  sx={{
                    marginTop: "3.2rem",
                    textAlign: "center"
                  }}
                >
                  Your Vault
                </ThemeHeading> */}

                    {farmerVaultNFTs ? (
                      farmerVaultNFTs.length ? (
                        <Flex
                          sx={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignSelf: "stretch",
                            alignItems: "center",
                          }}
                        >
                          <div
                            sx={{
                              display: "grid",
                              gridTemplateColumns:
                                farmerVaultNFTs.length > 1 ? "1fr 1fr" : "1fr",
                              gap: "1.6rem",

                              "@media (min-width: 768px)": {
                                gridTemplateColumns:
                                  farmerVaultNFTs.length > 9
                                    ? "1fr 1fr 1fr 1fr 1fr 1fr 1fr"
                                    : farmerVaultNFTs.length > 4
                                    ? "1fr 1fr 1fr 1fr 1fr"
                                    : farmerVaultNFTs
                                        .map(() => "1fr")
                                        .join(" "),
                              },
                            }}
                          >
                            {farmerVaultNFTs.map((item) => {
                              const isSelected = selectedVaultItems.find(
                                (NFT) =>
                                  NFT.onchainMetadata.mint ===
                                  item.onchainMetadata.mint
                              )

                              return (
                                <CollectionItem
                                  key={item.onchainMetadata.mint}
                                  item={item}
                                  onClick={
                                    !isLocked
                                      ? handleVaultItemClick
                                      : () => true
                                  }
                                  sx={{
                                    maxWidth: "16rem",
                                    "> img": {
                                      border: "3px solid transparent",
                                      borderColor: isSelected
                                        ? "primary"
                                        : "transparent",
                                    },
                                  }}
                                />
                              )
                            })}
                          </div>
                          {farmerVaultNFTs.length && !isLocked ? (
                            <Text
                              sx={{
                                margin: "3.2rem 0 .8rem 0",
                              }}
                              variant="small"
                            >
                              Select NFTs to withdraw them to your wallet.
                            </Text>
                          ) : null}

                          {selectedVaultItems && selectedVaultItems.length ? (
                            <>
                              {/* Selected:{" "}
                          {selectedVaultItems
                            .map((NFT) => NFT.onchainMetadata.metaData.data.name)
                            .join(", ")} */}
                              {!isLocked ? (
                                <Button onClick={handleMoveToWalletButtonClick}>
                                  Withdraw selected
                                </Button>
                              ) : null}
                            </>
                          ) : null}
                        </Flex>
                      ) : (
                        /** vaultNFTs fetched but array is empty, means current wallet has no NFT. */
                        <Flex
                          sx={{
                            justifyContent: "center",
                            alignSelf: "stretch",
                          }}
                        >
                          <Text>There are no NFTs on your vault.</Text>
                        </Flex>
                      )
                    ) : /** No vaultNFTs and public key, means it is loading */
                    publicKey ? (
                      <Flex
                        sx={{
                          justifyContent: "center",
                          alignSelf: "stretch",
                        }}
                      >
                        <Spinner variant="styles.spinnerLarge" />
                      </Flex>
                    ) : null}
                  </>
                ) : null}
              </TabPanel>
            </Tabs>
          </>
        )}
      </Flex>
    </div>
  )
}

export default StakePage
