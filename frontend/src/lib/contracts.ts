// Smart contract ABI and configuration
export const FILESTORAGE_ABI = [
  {
    "type": "function",
    "name": "deleteFile",
    "inputs": [
      {
        "name": "_fileId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "fileExists",
    "inputs": [
      {
        "name": "_fileId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "files",
    "inputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "ipfsHash",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "fileSize",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "uploader",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "exists",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFile",
    "inputs": [
      {
        "name": "_fileId",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple",
        "internalType": "struct FileStorage.FileInfo",
        "components": [
          {
            "name": "ipfsHash",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "fileName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "fileSize",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "uploader",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "exists",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getFiles",
    "inputs": [
      {
        "name": "_fileIds",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "tuple[]",
        "internalType": "struct FileStorage.FileInfo[]",
        "components": [
          {
            "name": "ipfsHash",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "fileName",
            "type": "string",
            "internalType": "string"
          },
          {
            "name": "fileSize",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "uploader",
            "type": "address",
            "internalType": "address"
          },
          {
            "name": "timestamp",
            "type": "uint256",
            "internalType": "uint256"
          },
          {
            "name": "exists",
            "type": "bool",
            "internalType": "bool"
          }
        ]
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getStats",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserFileCount",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "getUserFiles",
    "inputs": [
      {
        "name": "_user",
        "type": "address",
        "internalType": "address"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256[]",
        "internalType": "uint256[]"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "ipfsHashExists",
    "inputs": [
      {
        "name": "",
        "type": "string",
        "internalType": "string"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "bool",
        "internalType": "bool"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "nextFileId",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "totalFiles",
    "inputs": [],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "function",
    "name": "uploadFile",
    "inputs": [
      {
        "name": "_ipfsHash",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_fileName",
        "type": "string",
        "internalType": "string"
      },
      {
        "name": "_fileSize",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [],
    "stateMutability": "nonpayable"
  },
  {
    "type": "function",
    "name": "userFiles",
    "inputs": [
      {
        "name": "",
        "type": "address",
        "internalType": "address"
      },
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "outputs": [
      {
        "name": "",
        "type": "uint256",
        "internalType": "uint256"
      }
    ],
    "stateMutability": "view"
  },
  {
    "type": "event",
    "name": "FileDeleted",
    "inputs": [
      {
        "name": "owner",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "fileId",
        "type": "uint256",
        "indexed": true,
        "internalType": "uint256"
      },
      {
        "name": "ipfsHash",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      }
    ],
    "anonymous": false
  },
  {
    "type": "event",
    "name": "FileUploaded",
    "inputs": [
      {
        "name": "uploader",
        "type": "address",
        "indexed": true,
        "internalType": "address"
      },
      {
        "name": "ipfsHash",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "fileName",
        "type": "string",
        "indexed": false,
        "internalType": "string"
      },
      {
        "name": "fileSize",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "timestamp",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      },
      {
        "name": "fileId",
        "type": "uint256",
        "indexed": false,
        "internalType": "uint256"
      }
    ],
    "anonymous": false
  }
] as const;

// Contract addresses for different networks
export const CONTRACT_ADDRESSES = {
  // Rootstock Testnet - Deployed contract address
  'rootstock-testnet': '0xd3Fd10c95353F154AEA89DdF93a2fdF0a035bFd3',
} as const;

// Get contract address for current network
export const getContractAddress = (): `0x${string}` => {
  const address = CONTRACT_ADDRESSES['rootstock-testnet'];
  if (!address) {
    throw new Error('Contract address not set for rootstock-testnet. Please deploy the contract and update the address.');
  }
  return address as `0x${string}`;
};

export type FileInfo = {
  ipfsHash: string;
  fileName: string;
  fileSize: bigint;
  uploader: `0x${string}`;
  timestamp: bigint;
  exists: boolean;
};
