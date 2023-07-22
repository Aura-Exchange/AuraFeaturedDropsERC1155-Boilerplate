import {
  useActiveClaimCondition,
  useActiveClaimConditionForWallet,
  useClaimedNFTSupply,
  useContract,
  useContractMetadata,
  useNFT,
  useTotalCirculatingSupply,
  useUnclaimedNFTSupply,
} from '@thirdweb-dev/react';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import { ERC1155ClaimButton } from './components/Erc1155ClaimButton';
import { HeadingImage } from './components/HeadingImage';
import { renderPaperCheckoutLink } from '@paperxyz/js-client-sdk';

const urlParams = new URL(window.location.toString()).searchParams;
const contractAddress = urlParams.get('contractAddress') || '0x7b4B550d6cbf55441f6153c71A5D173d860d83fE';
const tokenId = urlParams.get('tokenId') || '3';

export default function Home() {
  const contractQuery = useContract(contractAddress);
  const contractMetadata = useContractMetadata(contractQuery.contract);
  const nft = useNFT(contractQuery.contract, tokenId);
  const openCheckout = () => renderPaperCheckoutLink({
    checkoutLinkUrl: "https://withpaper.com/checkout/2c679063-1ac2-42a6-a390-94bfe284e46e",
  });

  const claimedSupply = useTotalCirculatingSupply(
    contractQuery.contract,
    tokenId,
  );

  const activeClaimCondition = useActiveClaimCondition(
    contractQuery.contract,
    tokenId,
  );

  const totalAvailableSupply = useMemo(() => {
    try {
      return BigNumber.from(activeClaimCondition.data?.availableSupply || 0);
    } catch {
      return BigNumber.from(1_000_000);
    }
  }, [activeClaimCondition.data?.availableSupply]);

  const numberClaimed = useMemo(() => {
    return BigNumber.from(claimedSupply.data || 0).toString();
  }, [claimedSupply]);

  const numberTotal = useMemo(() => {
    const n = totalAvailableSupply.add(BigNumber.from(claimedSupply.data || 0));
    if (n.gte(1_000_000)) {
      return '';
    }
    return n.toString();
  }, [totalAvailableSupply, claimedSupply]);

  const isLoading = activeClaimCondition.isLoading || claimedSupply.isLoading;

  if (!contractAddress) {
    return (
      <div className="flex items-center justify-center h-full">
        No contract address provided
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="grid h-screen grid-cols-1 lg:grid-cols-12">
        <div className="items-center justify-center hidden w-full h-full lg:flex lg:col-span-5 lg:px-12">
          {nft.data?.metadata.image ? (
            <HeadingImage src={nft.data.metadata.image} isLoading={isLoading} />
          ) : null}
        </div>
        <div className="flex items-center justify-center w-full h-full col-span-1 lg:col-span-7">
          <div className="flex flex-col gap-4 p-12 lg:border rounded-xl lg:border-gray-800">
            <div className="flex w-full mb-8 lg:hidden">
              {nft.data?.metadata.image ? (
                <HeadingImage
                  src={nft.data.metadata.image}
                  isLoading={isLoading}
                />
              ) : null}
            </div>
            <div className="flex flex-col gap-4">
              {isLoading ? (
                <div
                  role="status"
                  className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                >
                  <div className="w-full">
                    <div className="w-24 h-10 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                  </div>
                </div>
              ) : (
                <p>
                  <span className="text-2xl font-bold tracking-wider text-gray-500">
                    {numberClaimed}
                  </span>{' '}
                  <span className="text-2xl font-bold tracking-wider">
                    {numberTotal !== '' && '/ '} {numberTotal} minted
                  </span>
                </p>
              )}
              <h1 className="text-4xl font-bold line-clamp-1">
                {contractMetadata.isLoading ? (
                  <div
                    role="status"
                    className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                  >
                    <div className="w-full">
                      <div className="w-48 h-8 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  contractMetadata.data?.name
                )}
              </h1>
              {contractMetadata.data?.description ||
                contractMetadata.isLoading ? (
                <div className="text-gray-500 line-clamp-2">
                  {contractMetadata.isLoading ? (
                    <div
                      role="status"
                      className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
                    >
                      <div className="w-full">
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                        <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                      </div>
                      <span className="sr-only">Loading...</span>
                    </div>
                  ) : (
                    contractMetadata.data?.description
                  )}
                </div>
              ) : null}
            </div>
            <div className="flex w-full gap-4">
              <ERC1155ClaimButton
                contract={contractQuery.contract}
                tokenId={tokenId}
              />
              <button
                onClick={openCheckout}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  color: 'black',
                  minWidth: '150px',
                  minHeight: '43px',
                }}
              >
                Mint with Paper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
