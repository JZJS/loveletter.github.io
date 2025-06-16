import { useState } from "react";
import chainlove from "/assets/image/chainlove.png";
import { createWalletClient, createPublicClient, custom, http } from 'viem';
import { base } from 'viem/chains';
import { createCoin } from '@zoralabs/coins-sdk';
import {generateLoveImage} from "./generate.js";


export default function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [message, setMessage] = useState("You are my only one.");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleRefreshMessage = () => {
    const samples = [
      "You light up my world.",
      "Every day with you is a gift.",
      "You are my forever.",
    ];
    const next = samples[Math.floor(Math.random() * samples.length)];
    setMessage(next);
  };

  const handleGenerate = async () => {
    const text = to ? `To ${to},\n${message}` : message;

    // try {
    //   const response = await fetch("http://localhost:5000/generate", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ text })
    //   });
    //
    //   const result = await response.json();
    //   if (result.success) {
    //     setGeneratedImage(result.path);
    //     setShowModal(true);
    //   } else {
    //     alert("❌ Failed to generate image");
    //   }
    // } catch (err) {
    //   console.error(err);
    //   alert("❌ Error generating image");
    // }

    try {
      const res = await generateLoveImage(text)
      console.log(res.Hash)
      setGeneratedImage("https://gateway.lighthouse.storage/ipfs/" + res.Hash);
      setShowModal(true);
    } catch (err) {
      console.error(err);
      alert("❌ Error generating image");
    }
  };


  const handleMint = async () => {
    console.log("Mint button clicked");

    try {
      const providerList = window.ethereum?.providers || [window.ethereum];
      const provider = providerList.find(p => p.isMetaMask) || providerList[0];

      if (!provider) {
        alert("No Ethereum provider found");
        return;
      }

      // ✅ 检查链是否为 Base 主网，如果不是就切换
      const baseChainId = '0x2105'; // 8453
      const currentChainId = await provider.request({ method: 'eth_chainId' });
      if (currentChainId !== baseChainId) {
        try {
          await provider.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: baseChainId }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await provider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: baseChainId,
                  chainName: 'Base',
                  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                  rpcUrls: ['https://mainnet.base.org'],
                  blockExplorerUrls: ['https://basescan.org'],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      const [address] = await provider.request({ method: 'eth_requestAccounts' }); // ✅ 获取用户地址

      const walletClient = createWalletClient({
        account: address,
        chain: base,
        transport: custom(provider),
      });

      const publicClient = createPublicClient({
        chain: base,
        transport: http("https://mainnet.base.org"),
      });

      const result = await createCoin(
        {
          name: 'Chain Love Coin',
          symbol: 'LOVE',
          //uri: 'https://bafybeibo6wwsmfc36rci22mu4psfizik3pabf7u34xnekycvpznvy273oy',
          uri: generatedImage,
          payoutRecipient: address,
          platformReferrer: '0x0000000000000000000000000000000000000000',
          initialPurchaseWei: 0n
        },
        walletClient,
        publicClient
      );

      console.log('✅ Coin created:', result);
      alert('✅ Coin Created!\nHash: ' + result.hash + '\nAddress: ' + result.address);
    } catch (err) {
      console.error('❌ Error creating coin:', err);
      alert('❌ Failed: ' + (err.message || JSON.stringify(err)));
    }
  };



  return (
    <div
      className="min-h-screen w-full bg-pink-50 px-4"
      style={{ background: 'repeating-linear-gradient(45deg, #ffe4e6, #ffe4e6 10px, #fff0f3 10px, #fff0f3 20px)' }}
    >
      <div className="max-w-2xl mx-auto flex flex-col items-center justify-center min-h-screen py-12 space-y-8">
        <img src={chainlove} alt="Chain Love Logo" className="w-16 h-16 rounded-full shadow-md" />

        <div className="w-full bg-white rounded-2xl shadow-lg p-10 space-y-6">
          <div>
            <label className="block font-semibold text-lg mb-2">From (optional)</label>
            <input
              className="w-full p-4 text-lg border rounded-xl"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block font-semibold text-lg mb-2">To (optional)</label>
            <input
              className="w-full p-4 text-lg border rounded-xl"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Lover's name"
            />
          </div>

          <div>
            <label className="block font-semibold text-lg mb-2">Message</label>
            <div className="flex items-center gap-2">
              <textarea
                rows={2}
                className="flex-1 p-4 text-lg border rounded-xl resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your love letter..."
              />
              <button
                onClick={handleRefreshMessage}
                className="px-4 py-3 text-lg bg-blue-100 hover:bg-blue-200 rounded-xl"
              >
                🔄
              </button>
            </div>
          </div>

          <div className="flex justify-center mt-6">
            <button
              onClick={handleGenerate}
              className="bg-purple-500 text-white px-6 py-3 rounded-xl hover:bg-purple-600 text-lg"
            >
              Generate
            </button>
          </div>
        </div>

        {showModal && generatedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-2xl shadow-xl max-w-lg w-full text-center space-y-4">
              <h2 className="text-xl font-bold text-pink-700">Your Love Letter</h2>
              <img src={generatedImage} alt="Generated Love Letter" className="mx-auto rounded-lg shadow" />
              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMint}
                  className="bg-pink-500 text-white px-4 py-2 rounded-xl hover:bg-pink-600"
                >
                  Mint Coin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
