import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isWeb3        : false,
    userAccount   : '',
    contractInfo  : '', // network 이름. 예) mainnet
    web3js        : '',
    // wbContract    : '', 

    myETH         : '',
    white         : '',
    isWalletLogin : '',
    isShowWallet  : '',
    loadingStatus : false,

  },
  mutations: {
    IS_WEB3 (state, val) { state.isWeb3 = val;},
    USER_ACCOUNT (state, val) { state.userAccount = val; },
    CONTRACT_INFO (state, val) { state.contractInfo = val; },
    // WEB3JS (state, val) { state.web3js = val; },
    // WB (state, val) { state.wbContract = val; },  
    MYETH ( state, val) { state.myETH = val; },
    WHITE ( state, val) { state.white = val; },
    IS_WALLET_LOGIN(state, val) { state.isWalletLogin = val; },
    IS_SHOW_WALLET(state, val) { state.isShowWallet = val; },
    CHANGE_LOADING_STATUS(state, status) { state.loadingStatus = status; },
  },
  actions: {
    vuexIsWeb3(context, val) { context.commit('IS_WEB3', val); },
    vuexUserAccount(context, val) { context.commit('USER_ACCOUNT', val); },
    vuexContractInfo(context, val) { context.commit('CONTRACT_INFO', val); },
    // vuexWeb3js(context, val) { context.commit('WEB3JS', val); },
    // vuexWB(context, val) { context.commit('WB', val); },
    vuexMyETH(context, val) { context.commit('MYETH', val); },
    vuexWhite(context, val) { context.commit('WHITE', val); },
    vuexIsWalletLogin(context, val) { context.commit('IS_WALLET_LOGIN', val); },
    vuexIsShowWallet(context, val) { context.commit('IS_SHOW_WALLET', val); },
    changeLoadingStatus(context, status) { context.commit('CHANGE_LOADING_STATUS', status); },
  }
})
