# Simple Blockchain Lottery
### Lottery description:
<div style="text-align: justify"> 
Stwórz aplikację blockchainową - loterię, w której użytkownik wpłaca ustaloną kwotę i z pewnym niskim prawdopodobieństwem ma możliwość wygrania całej puli zgromadzonej w danej chwili. Projekt powinien być minimalny pod względem funkcjonalności, ale zawierać wszystkie elementy, które zastosowałbyś przy tworzeniu produkcyjnej aplikacji.
</div>

## Tech stack:

* Solidity + HardHat for contract development and deployment
* MetaMask (Ropsten Test Chain) + Web3.js
* TypeScript + React for dapp
## Repository structure:
* lotteryContract folder contains HardHat smart contract development environment.
* The final smart contract code can be found in lotteryContract/contracts/LotteryContract4.sol
* folder frontend contains the React dapp.
* [Deployed contract on etherscan.io](https://ropsten.etherscan.io/address/0x8d4b40C9e7ef8fafA0E4E857Ea53aF32CbfE52Fc)
## How to run locally

The app currently can be run locally using docker:

### `docker-compose build`
### `docker-compose up`
<br/>

Open [http://localhost:3000](http://localhost:3000) to view the app in the browser.

## Things that could be improved upon (TODOS):
* Source of randomness - currently the smart contract generates pseudorandomness using block time stamps
  * This implementation is extremely vulnerable ([More details about this approach](https://stackoverflow.com/questions/52467248/how-can-we-generate-multiple-random-number-in-ethereum)), but I just had not enough to implement possible solutions:
  * Usage of an external Oracle that generates the randomness for us: 
    * https://docs.chain.link/docs/chainlink-vrf/
  * Other possible ideas:
    * https://arxiv.org/ftp/arxiv/papers/1902/1902.07986.pdf
* The project is missing CSS and styling
* Extended testing for React and Smart Contract
  * Currently, the repository contains only one simple test for smart contract
* Extended error handling 
* Code refactoring
* Caching and cookies usage! - The use of React Cache Worker. 



