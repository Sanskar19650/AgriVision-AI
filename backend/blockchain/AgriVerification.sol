// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title AgriVerification
 * @dev Immutable Agricultural Diagnostic, Soil Quality & Loss Assessment Notarization
 * B.Tech CSE Final Year Capstone Project
 * Target Networks: Ethereum Sepolia, Polygon Amoy PoS (Chain ID: 80002), Local Ganache
 */
contract AgriVerification {
    address public owner;
    
    struct AgriculturalReport {
        string reportId;
        string reportType;          // DISEASE_SCAN, DAMAGE_AUDIT, SOIL_TEST, YIELD_CERT
        bytes32 sha256Digest;       // 256-bit cryptographic digest
        address registeredBy;       // Farmer / Inspector public address
        uint256 timestamp;          // Block timestamp
        uint256 blockNumber;        // Mined block height
        string ipfsHash;            // Decentralized storage reference (optional)
        bool isValid;               // Immutability active status
    }

    // Mapping from SHA-256 digest to Report Struct
    mapping(bytes32 => AgriculturalReport) public reports;
    // Mapping from reportId to SHA-256 digest
    mapping(string => bytes32) public reportIdToDigest;
    // Total registered records
    uint256 public totalRecordsCount;

    event ReportNotarized(
        string indexed reportId,
        bytes32 indexed sha256Digest,
        address indexed farmer,
        string reportType,
        uint256 timestamp
    );

    event ReportRevoked(bytes32 indexed sha256Digest, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "AgriVerification: caller is not the owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Notarizes a new agricultural report on-chain
     * @param _reportId Unique identifier of diagnostic or survey report
     * @param _reportType Category of agricultural record
     * @param _sha256Digest 32-byte cryptographic SHA-256 digest
     * @param _ipfsHash Optional IPFS or cloud storage URI
     */
    function notarizeReport(
        string memory _reportId,
        string memory _reportType,
        bytes32 _sha256Digest,
        string memory _ipfsHash
    ) external returns (bool) {
        require(reports[_sha256Digest].timestamp == 0, "AgriVerification: digest already notarized on-chain");
        require(reportIdToDigest[_reportId] == bytes32(0), "AgriVerification: reportId already registered");

        reports[_sha256Digest] = AgriculturalReport({
            reportId: _reportId,
            reportType: _reportType,
            sha256Digest: _sha256Digest,
            registeredBy: msg.sender,
            timestamp: block.timestamp,
            blockNumber: block.number,
            ipfsHash: _ipfsHash,
            isValid: true
        });

        reportIdToDigest[_reportId] = _sha256Digest;
        totalRecordsCount++;

        emit ReportNotarized(_reportId, _sha256Digest, msg.sender, _reportType, block.timestamp);
        return true;
    }

    /**
     * @notice Verifies whether a given SHA-256 digest exists and is authentic
     * @param _sha256Digest 32-byte cryptographic SHA-256 digest
     */
    function verifyReport(bytes32 _sha256Digest)
        external
        view
        returns (
            bool exists,
            string memory reportId,
            string memory reportType,
            address registeredBy,
            uint256 timestamp,
            uint256 blockNumber,
            bool isValid
        )
    {
        AgriculturalReport memory r = reports[_sha256Digest];
        if (r.timestamp == 0) {
            return (false, "", "", address(0), 0, 0, false);
        }
        return (true, r.reportId, r.reportType, r.registeredBy, r.timestamp, r.blockNumber, r.isValid);
    }
}
