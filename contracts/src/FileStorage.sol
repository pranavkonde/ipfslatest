// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title FileStorage
 * @dev A smart contract for storing IPFS file hashes on Rootstock
 * @notice This contract allows users to upload file metadata to IPFS and store the hash on-chain
 */
contract FileStorage {
    // Events
    event FileUploaded(
        address indexed uploader,
        string ipfsHash,
        string fileName,
        uint256 fileSize,
        uint256 timestamp,
        uint256 fileId
    );

    event FileDeleted(
        address indexed owner,
        uint256 indexed fileId,
        string ipfsHash
    );

    // Struct to store file information
    struct FileInfo {
        string ipfsHash;
        string fileName;
        uint256 fileSize;
        address uploader;
        uint256 timestamp;
        bool exists;
    }

    // State variables
    mapping(uint256 => FileInfo) public files;
    mapping(address => uint256[]) public userFiles;
    mapping(string => bool) public ipfsHashExists;
    
    uint256 public totalFiles;
    uint256 public nextFileId;

    // Modifiers
    modifier onlyFileOwner(uint256 _fileId) {
        require(files[_fileId].exists, "File does not exist");
        require(files[_fileId].uploader == msg.sender, "Not the file owner");
        _;
    }

    modifier validFileId(uint256 _fileId) {
        require(files[_fileId].exists, "File does not exist");
        _;
    }

    /**
     * @dev Upload a file's metadata to the blockchain
     * @param _ipfsHash The IPFS hash of the uploaded file
     * @param _fileName The name of the file
     * @param _fileSize The size of the file in bytes
     */
    function uploadFile(
        string memory _ipfsHash,
        string memory _fileName,
        uint256 _fileSize
    ) external {
        require(bytes(_ipfsHash).length > 0, "IPFS hash cannot be empty");
        require(bytes(_fileName).length > 0, "File name cannot be empty");
        require(_fileSize > 0, "File size must be greater than 0");
        require(!ipfsHashExists[_ipfsHash], "File with this IPFS hash already exists");

        uint256 fileId = nextFileId;
        
        files[fileId] = FileInfo({
            ipfsHash: _ipfsHash,
            fileName: _fileName,
            fileSize: _fileSize,
            uploader: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });

        userFiles[msg.sender].push(fileId);
        ipfsHashExists[_ipfsHash] = true;
        
        nextFileId++;
        totalFiles++;

        emit FileUploaded(
            msg.sender,
            _ipfsHash,
            _fileName,
            _fileSize,
            block.timestamp,
            fileId
        );
    }

    /**
     * @dev Delete a file (only the owner can delete)
     * @param _fileId The ID of the file to delete
     */
    function deleteFile(uint256 _fileId) external onlyFileOwner(_fileId) {
        string memory ipfsHash = files[_fileId].ipfsHash;
        
        // Remove from user's file list
        uint256[] storage userFileList = userFiles[msg.sender];
        for (uint256 i = 0; i < userFileList.length; i++) {
            if (userFileList[i] == _fileId) {
                userFileList[i] = userFileList[userFileList.length - 1];
                userFileList.pop();
                break;
            }
        }

        // Mark as deleted and remove IPFS hash mapping
        ipfsHashExists[ipfsHash] = false;
        files[_fileId].exists = false;
        totalFiles--;

        emit FileDeleted(msg.sender, _fileId, ipfsHash);
    }

    /**
     * @dev Get file information by ID
     * @param _fileId The ID of the file
     * @return FileInfo struct containing file details
     */
    function getFile(uint256 _fileId) external view validFileId(_fileId) returns (FileInfo memory) {
        return files[_fileId];
    }

    /**
     * @dev Get all files uploaded by a specific user
     * @param _user The address of the user
     * @return Array of file IDs belonging to the user
     */
    function getUserFiles(address _user) external view returns (uint256[] memory) {
        return userFiles[_user];
    }

    /**
     * @dev Get the total number of files uploaded by a user
     * @param _user The address of the user
     * @return Number of files uploaded by the user
     */
    function getUserFileCount(address _user) external view returns (uint256) {
        return userFiles[_user].length;
    }

    /**
     * @dev Get file information for multiple files
     * @param _fileIds Array of file IDs
     * @return Array of FileInfo structs
     */
    function getFiles(uint256[] memory _fileIds) external view returns (FileInfo[] memory) {
        FileInfo[] memory result = new FileInfo[](_fileIds.length);
        
        for (uint256 i = 0; i < _fileIds.length; i++) {
            if (files[_fileIds[i]].exists) {
                result[i] = files[_fileIds[i]];
            }
        }
        
        return result;
    }

    /**
     * @dev Check if a file exists
     * @param _fileId The ID of the file
     * @return True if the file exists, false otherwise
     */
    function fileExists(uint256 _fileId) external view returns (bool) {
        return files[_fileId].exists;
    }

    /**
     * @dev Get contract statistics
     * @return totalFiles The total number of files stored
     * @return nextFileId The next available file ID
     */
    function getStats() external view returns (uint256, uint256) {
        return (totalFiles, nextFileId);
    }
}

