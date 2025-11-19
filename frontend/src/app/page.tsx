'use client';

import { useState, useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import axios from 'axios';

// Contract ABI (minimal required functions)
const ABI = [
  {
    name: 'uploadFile',
    type: 'function',
    inputs: [
      { name: '_ipfsHash', type: 'string' },
      { name: '_fileName', type: 'string' },
      { name: '_fileSize', type: 'uint256' }
    ]
  },
  {
    name: 'deleteFile',
    type: 'function',
    inputs: [{ name: '_fileId', type: 'uint256' }]
  },
  {
    name: 'getUserFiles',
    type: 'function',
    inputs: [{ name: '_user', type: 'address' }],
    outputs: [{ type: 'uint256[]' }],
    stateMutability: 'view'
  },
  {
    name: 'getFiles',
    type: 'function',
    inputs: [{ name: '_fileIds', type: 'uint256[]' }],
    outputs: [{
      type: 'tuple[]',
      components: [
        { name: 'ipfsHash', type: 'string' },
        { name: 'fileName', type: 'string' },
        { name: 'fileSize', type: 'uint256' },
        { name: 'uploader', type: 'address' },
        { name: 'timestamp', type: 'uint256' },
        { name: 'exists', type: 'bool' }
      ]
    }],
    stateMutability: 'view'
  }
] as const;

const CONTRACT_ADDRESS = '0xd3Fd10c95353F154AEA89DdF93a2fdF0a035bFd3' as const;
const PINATA_GATEWAY = process.env.NEXT_PUBLIC_PINATA_GATEWAY || 'https://gateway.pinata.cloud';

// Utility functions
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const formatDate = (timestamp: bigint): string => {
  return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// IPFS upload function
const uploadToIPFS = async (
  file: File,
  onProgress?: (percentage: number) => void
): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('pinataMetadata', JSON.stringify({ name: file.name }));
  formData.append('pinataOptions', JSON.stringify({ cidVersion: 0 }));

  const response = await axios.post(
    'https://api.pinata.cloud/pinning/pinFileToIPFS',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY!,
        pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_KEY!,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          onProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        }
      },
    }
  );
  return response.data.IpfsHash;
};

export default function Home() {
  const { address, isConnected } = useAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [error, setError] = useState<string>('');

  // Upload contract interaction
  const { writeContract: uploadFile, data: uploadHash, isPending: isUploadPending } = useWriteContract();
  const { isLoading: isUploadConfirming, isSuccess: uploadSuccess } = useWaitForTransactionReceipt({ hash: uploadHash });

  // Delete contract interaction
  const { writeContract: deleteFile, data: deleteHash, isPending: isDeletePending } = useWriteContract();
  const { isLoading: isDeleteConfirming } = useWaitForTransactionReceipt({ hash: deleteHash });

  // Read user files
  const { data: fileIds, refetch: refetchFileIds } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getUserFiles',
    args: address ? [address] : undefined,
    query: { enabled: !!address }
  });

  const { data: filesData, refetch: refetchFiles } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ABI,
    functionName: 'getFiles',
    args: fileIds ? [fileIds] : undefined,
    query: { enabled: !!fileIds && (fileIds as any[]).length > 0 }
  });

  // Update files list
  useEffect(() => {
    if (filesData && Array.isArray(filesData)) {
      setUserFiles(filesData.filter((file: any) => file.exists));
    }
  }, [filesData]);

  // Refresh after upload success
  useEffect(() => {
    if (uploadSuccess) {
      refetchFileIds();
      refetchFiles();
      setSelectedFile(null);
      setUploadProgress(0);
    }
  }, [uploadSuccess, refetchFileIds, refetchFiles]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 100 * 1024 * 1024) {
        setError('File size exceeds 100MB limit');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !isConnected) return;
    
    try {
      setIsUploading(true);
      setError('');
      
      // Upload to IPFS
      const ipfsHash = await uploadToIPFS(selectedFile, setUploadProgress);
      
      // Store on blockchain
      uploadFile({
        address: CONTRACT_ADDRESS,
        abi: ABI,
        functionName: 'uploadFile',
        args: [ipfsHash, selectedFile.name, BigInt(selectedFile.size)],
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = (fileId: number) => {
    deleteFile({
      address: CONTRACT_ADDRESS,
      abi: ABI,
      functionName: 'deleteFile',
      args: [BigInt(fileId)],
    });
  };

  return (
    <div>
      {/* Header */}
      <header>
        <h1>IPFS Storage dApp</h1>
        <ConnectButton />
      </header>

      <hr />

      {/* Main Content */}
      <main>
        {!isConnected ? (
          <div>
            <h2>Connect Your Wallet</h2>
            <p>Please connect your wallet to start using the dApp</p>
            <ConnectButton />
          </div>
        ) : (
          <div>
            {/* Upload Section */}
            <div>
              <h2>Upload File</h2>
              
              <input
                type="file"
                onChange={handleFileSelect}
                disabled={isUploading || isUploadPending || isUploadConfirming}
              />

              {selectedFile && (
                <div>
                  <p><b>Name:</b> {selectedFile.name}</p>
                  <p><b>Size:</b> {formatFileSize(selectedFile.size)}</p>
                </div>
              )}

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div>
                  <p>Uploading: {uploadProgress}%</p>
                </div>
              )}

              {error && <p style={{color: 'red'}}>{error}</p>}
              {uploadSuccess && <p style={{color: 'green'}}>File uploaded successfully!</p>}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || isUploading || isUploadPending || isUploadConfirming}
              >
                {isUploading ? 'Uploading to IPFS...' : 
                 isUploadPending ? 'Confirm Transaction...' :
                 isUploadConfirming ? 'Confirming...' : 
                 'Upload File'}
              </button>
            </div>

            <hr />

            {/* Files List */}
            <div>
              <h2>Your Files ({userFiles.length})</h2>

              {userFiles.length === 0 ? (
                <p>No files uploaded yet</p>
              ) : (
                <div>
                  {userFiles.map((file, index) => (
                    <div key={index} style={{marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px'}}>
                      <p><b>{file.fileName}</b></p>
                      <p>{formatFileSize(Number(file.fileSize))} • {formatDate(file.timestamp)}</p>
                      <p>IPFS: {file.ipfsHash}</p>
                      <a
                        href={`${PINATA_GATEWAY}/ipfs/${file.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File
                      </a>
                      {' | '}
                      <button
                        onClick={() => handleDelete(index)}
                        disabled={isDeletePending || isDeleteConfirming}
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}