'use client';

import { useState, useCallback } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { uploadToIPFS, validateFile, formatFileSize, UploadProgress } from '@/lib/ipfs';
import { FILESTORAGE_ABI, getContractAddress } from '@/lib/contracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface FileUploadProps {
  onUploadSuccess?: () => void;
}

export default function FileUpload({ onUploadSuccess }: FileUploadProps) {
  const { isConnected } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploadingToIPFS, setIsUploadingToIPFS] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setUploadError(validation.error || 'Invalid file');
        setSelectedFile(null);
        return;
      }
      setSelectedFile(file);
      setUploadError(null);
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile || !isConnected) return;

    try {
      setIsUploadingToIPFS(true);
      setUploadError(null);

      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(selectedFile, (progress) => {
        setUploadProgress(progress);
      });

      // Upload to blockchain
      writeContract({
        address: getContractAddress(),
        abi: FILESTORAGE_ABI,
        functionName: 'uploadFile',
        args: [ipfsHash, selectedFile.name, BigInt(selectedFile.size)],
      });
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploadingToIPFS(false);
      setUploadProgress(null);
    }
  }, [selectedFile, isConnected, writeContract]);

  const resetUpload = useCallback(() => {
    setSelectedFile(null);
    setUploadProgress(null);
    setUploadError(null);
    setIsUploadingToIPFS(false);
  }, []);

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-6">
          Please connect your wallet to upload files to IPFS and store them on the blockchain.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Upload File to IPFS</h2>
      
      <div className="space-y-4">
        {/* File Input */}
        <div>
          <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">
            Select File
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileSelect}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUploadingToIPFS || isPending || isConfirming}
          />
        </div>

        {/* Selected File Info */}
        {selectedFile && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-800 mb-2">Selected File:</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><span className="font-medium">Name:</span> {selectedFile.name}</p>
              <p><span className="font-medium">Size:</span> {formatFileSize(selectedFile.size)}</p>
              <p><span className="font-medium">Type:</span> {selectedFile.type || 'Unknown'}</p>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {uploadProgress && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Uploading to IPFS...</h3>
            <div className="w-full bg-blue-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress.percentage}%` }}
              ></div>
            </div>
            <p className="text-sm text-blue-600 mt-2">
              {uploadProgress.percentage}% - {formatFileSize(uploadProgress.loaded)} / {formatFileSize(uploadProgress.total)}
            </p>
          </div>
        )}

        {/* Transaction Status */}
        {isPending && (
          <div className="bg-yellow-50 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Transaction Pending...</h3>
            <p className="text-sm text-yellow-600">
              Please confirm the transaction in your wallet to store the file hash on the blockchain.
            </p>
          </div>
        )}

        {isConfirming && (
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">Confirming Transaction...</h3>
            <p className="text-sm text-blue-600">
              Waiting for transaction confirmation on the blockchain.
            </p>
          </div>
        )}

        {isSuccess && (
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-medium text-green-800 mb-2">Upload Successful!</h3>
            <p className="text-sm text-green-600">
              Your file has been uploaded to IPFS and the hash has been stored on the blockchain.
            </p>
            <button
              onClick={() => {
                resetUpload();
                onUploadSuccess?.();
              }}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Upload Another File
            </button>
          </div>
        )}

        {/* Error Messages */}
        {uploadError && (
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">Upload Error</h3>
            <p className="text-sm text-red-600">{uploadError}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 rounded-lg p-4">
            <h3 className="font-medium text-red-800 mb-2">Transaction Error</h3>
            <p className="text-sm text-red-600">{error.message}</p>
          </div>
        )}

        {/* Upload Button */}
        {selectedFile && !isSuccess && (
          <button
            onClick={handleUpload}
            disabled={isUploadingToIPFS || isPending || isConfirming}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isUploadingToIPFS
              ? 'Uploading to IPFS...'
              : isPending
              ? 'Confirm Transaction...'
              : isConfirming
              ? 'Confirming...'
              : 'Upload to IPFS & Blockchain'}
          </button>
        )}
      </div>
    </div>
  );
}
