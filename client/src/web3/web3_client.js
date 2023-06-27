import BigNumber from "bignumber.js";

class Web3Client {
  constructor() {
    this.info;
  }
  

  // try catch가 얼마나 중요한지 배웠다. open trustWallet 띄우기 위해 만 이틀을 날렸다. 19.01.15
  async getAccount(web3js) {
    try {
      const accounts = await web3js.eth.getAccounts();
      return accounts[0];
    } catch (err) {
      return '';
    }
  }

  async getBalance(userAccount, web3js) {
    let balance = 0;
    try {
      if (userAccount) {
        const balanceOrigin = await web3js.eth.getBalance(userAccount);
        const balanceEther = BigNumber(balanceOrigin).toFixed();
        const myETH = await web3js.utils.fromWei(balanceEther, 'ether'); // wei를 ether로 단위변경
        balance = parseFloat(parseFloat(myETH).toFixed(3));//문자로 받기 때문에 먼저 float으로 바꾼후 자릿수 결정하고 다시 끝에 0을 없앤다.    
      }
      return balance;
    } catch{
      return balance;
    }
  }  

  async checkTrustWallet() {
    let isTrustWallet = '';
    try {
      isTrustWallet = (await web3.currentProvider.isTrust) || false;
      return isTrustWallet;
    } catch{
      return isTrustWallet;
    }
  } 

  checkMetaMask(userAccount, isTrustWallet) {
    // 만약 공급받은 provider가 있는데 그게 TrustWallet이 아니라면 메타마스크 true를 반환한다.
    let isMetaMask;
    if (userAccount) {
      isMetaMask = (!isTrustWallet) ? true : false;
    } else {
      isMetaMask = false;
    }
    return isMetaMask;
  }

  checkWallet(isTrustWallet, isMetaMask) {
    return isTrustWallet || isMetaMask;
  }

  async transactionHash(_betTransaction) {
    try {
      const transactionHash = await _betTransaction.on('transactionHash', (hash) => { // metamask에서 confirm을 누르면 hash가 나온다.
        console.log('hash');
        console.log(hash);
      })
      console.log('실행?');
      return transactionHash;
    } catch {
      console.log('transactionHash error');
    }
  }

  async receipt(_transactionHash) {
    console.log(_transactionHash);
    try {
      const receipt = await _transactionHash.on('receipt', (receipt) => { // contract이 evm에 올라가면
        console.log('receipt');
        console.log(receipt);
      })
      return receipt;
    } catch {
      console.log('receipt error');
    }
  }
}

export default Web3Client;