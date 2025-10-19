// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script, console} from "forge-std/Script.sol";
import {FileStorage} from "../src/FileStorage.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        FileStorage fileStorage = new FileStorage();

        vm.stopBroadcast();

        console.log("FileStorage deployed to:", address(fileStorage));
        console.log("Deployer:", vm.addr(deployerPrivateKey));
    }
}

