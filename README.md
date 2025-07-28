# Electronic Voting System (Python-based Blockchain)

## Overview

This project is a self-built electronic voting system based on blockchain technology.  
It aims to achieve security, transparency, and tamper detection in the voting process.

### System Components:
1. Voter registration based on public keys  
2. Voting with digital signatures  
3. Grouping votes into blocks  
4. Adding blocks to the chain (Proof-of-Work is optional)  
5. Tamper detection and vote counting  

### Technologies Used:
- Python standard libraries: `hashlib`, `json`, `time`  
- Cryptography: `ecdsa` for elliptic curve signature  
- Frontend: React with TypeScript for UI and key management  
- Backend: FastAPI (Python) to handle vote validation and blockchain management  

### Current Status:
- UI and backend communication is established  
- Votes are signed locally with private keys and verified on the server  
- Blockchain stores validated votes as blocks  
- Duplicate vote prevention is planned but not yet implemented  

### How to Use:
- Generate or load your key pair in the UI (stored in localStorage)  
- Select a programming language to vote for  
- Sign the vote and submit it to the backend  
- Backend verifies the signature and adds the vote to the blockchain  

---
