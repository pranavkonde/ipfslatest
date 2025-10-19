// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Test, console} from "forge-std/Test.sol";
import {FileStorage} from "../src/FileStorage.sol";

contract FileStorageTest is Test {
    FileStorage public fileStorage;
    
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    
    function setUp() public {
        fileStorage = new FileStorage();
    }
    
    function testUploadFile() public {
        vm.prank(user1);
        fileStorage.uploadFile("QmTestHash123", "test.txt", 1024);
        
        (uint256 totalFiles, uint256 nextFileId) = fileStorage.getStats();
        assertEq(totalFiles, 1);
        assertEq(nextFileId, 1);
        
        FileStorage.FileInfo memory file = fileStorage.getFile(0);
        assertEq(file.ipfsHash, "QmTestHash123");
        assertEq(file.fileName, "test.txt");
        assertEq(file.fileSize, 1024);
        assertEq(file.uploader, user1);
        assertTrue(file.exists);
    }
    
    function testUploadMultipleFiles() public {
        vm.startPrank(user1);
        fileStorage.uploadFile("QmHash1", "file1.txt", 512);
        fileStorage.uploadFile("QmHash2", "file2.txt", 1024);
        vm.stopPrank();
        
        vm.prank(user2);
        fileStorage.uploadFile("QmHash3", "file3.txt", 2048);
        
        (uint256 totalFiles,) = fileStorage.getStats();
        assertEq(totalFiles, 3);
        
        uint256[] memory user1Files = fileStorage.getUserFiles(user1);
        assertEq(user1Files.length, 2);
        
        uint256[] memory user2Files = fileStorage.getUserFiles(user2);
        assertEq(user2Files.length, 1);
    }
    
    function testDeleteFile() public {
        vm.prank(user1);
        fileStorage.uploadFile("QmTestHash", "test.txt", 1024);
        
        (uint256 totalFilesBefore,) = fileStorage.getStats();
        assertEq(totalFilesBefore, 1);
        
        vm.prank(user1);
        fileStorage.deleteFile(0);
        
        (uint256 totalFilesAfter,) = fileStorage.getStats();
        assertEq(totalFilesAfter, 0);
        
        assertFalse(fileStorage.fileExists(0));
    }
    
    function testCannotDeleteOthersFile() public {
        vm.prank(user1);
        fileStorage.uploadFile("QmTestHash", "test.txt", 1024);
        
        vm.prank(user2);
        vm.expectRevert("Not the file owner");
        fileStorage.deleteFile(0);
    }
    
    function testCannotUploadDuplicateHash() public {
        vm.prank(user1);
        fileStorage.uploadFile("QmTestHash", "test.txt", 1024);
        
        vm.prank(user2);
        vm.expectRevert("File with this IPFS hash already exists");
        fileStorage.uploadFile("QmTestHash", "another.txt", 2048);
    }
    
    function testCannotUploadEmptyData() public {
        vm.prank(user1);
        vm.expectRevert("IPFS hash cannot be empty");
        fileStorage.uploadFile("", "test.txt", 1024);
        
        vm.expectRevert("File name cannot be empty");
        fileStorage.uploadFile("QmHash", "", 1024);
        
        vm.expectRevert("File size must be greater than 0");
        fileStorage.uploadFile("QmHash", "test.txt", 0);
    }
    
    function testGetFiles() public {
        vm.startPrank(user1);
        fileStorage.uploadFile("QmHash1", "file1.txt", 512);
        fileStorage.uploadFile("QmHash2", "file2.txt", 1024);
        vm.stopPrank();
        
        uint256[] memory fileIds = new uint256[](2);
        fileIds[0] = 0;
        fileIds[1] = 1;
        
        FileStorage.FileInfo[] memory files = fileStorage.getFiles(fileIds);
        assertEq(files.length, 2);
        assertEq(files[0].fileName, "file1.txt");
        assertEq(files[1].fileName, "file2.txt");
    }
}

