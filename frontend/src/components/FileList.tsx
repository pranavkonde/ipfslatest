'use client';

import { useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { FILESTORAGE_ABI, getContractAddress, FileInfo } from '@/lib/contracts';
import { getIPFSUrl, formatFileSize } from '@/lib/ipfs';
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface FileListProps {
  refreshTrigger?: number;
}

export default function FileList({ refreshTrigger }: FileListProps) {
  const { address, isConnected } = useAccount();
  const { writeContract, data: deleteHash, isPending: isDeletePending } = useWriteContract();
  const { isLoading: isDeleteConfirming } = useWaitForTransactionReceipt({
    hash: deleteHash,
  });

  const [userFiles, setUserFiles] = useState<FileInfo[]>([]);
  const [isLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read user's file IDs
  const { data: fileIds, refetch: refetchFileIds } = useReadContract({
    address: getContractAddress(),
    abi: FILESTORAGE_ABI,
    functionName: 'getUserFiles',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read file details for each file ID
  const { data: filesData, refetch: refetchFiles } = useReadContract({
    address: getContractAddress(),
    abi: FILESTORAGE_ABI,
    functionName: 'getFiles',
    args: fileIds ? [fileIds] : undefined,
    query: {
      enabled: !!fileIds && fileIds.length > 0,
    },
  });

  // Update user files when data changes
  useEffect(() => {
    if (filesData) {
      setUserFiles(filesData.filter(file => file.exists));
    }
  }, [filesData]);

  // Refresh data when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      refetchFileIds();
      refetchFiles();
    }
  }, [refreshTrigger, refetchFileIds, refetchFiles]);

  const handleDeleteFile = async (fileId: number) => {
    if (!isConnected) return;

    try {
      writeContract({
        address: getContractAddress(),
        abi: FILESTORAGE_ABI,
        functionName: 'deleteFile',
        args: [BigInt(fileId)],
      });
    } catch (error) {
      console.error('Delete error:', error);
      setError('Failed to delete file');
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  if (!isConnected) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Files</h2>
        <p className="text-gray-600 mb-6">
          Please connect your wallet to view your uploaded files.
        </p>
        <ConnectButton />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Files</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading your files...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Files</h2>
        <span className="text-sm text-gray-500">
          {userFiles.length} file{userFiles.length !== 1 ? 's' : ''}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 rounded-lg p-4 mb-6">
          <h3 className="font-medium text-red-800 mb-2">Error</h3>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {userFiles.length === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files uploaded yet</h3>
          <p className="text-gray-500">Upload your first file to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userFiles.map((file, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-blue-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{file.fileName}</h3>
                      <p className="text-sm text-gray-500">
                        {formatFileSize(Number(file.fileSize))} • {formatDate(file.timestamp)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">IPFS Hash:</span>
                      <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                        {file.ipfsHash}
                      </code>
                      <button
                        onClick={() => copyToClipboard(file.ipfsHash)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Copy IPFS hash"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <a
                    href={getIPFSUrl(file.ipfsHash)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    View
                  </a>
                  <button
                    onClick={() => handleDeleteFile(index)}
                    disabled={isDeletePending || isDeleteConfirming}
                    className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {isDeletePending ? 'Deleting...' : isDeleteConfirming ? 'Confirming...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
