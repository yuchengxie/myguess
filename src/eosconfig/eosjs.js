let EosApi = require('eosjs')
const scatter = window.scatter;
// // everything is optional
let network = {
    httpEndpoint: 'https://kylin.eoscanada.com',
    verbose: false, // API logging
    logger: { // Default logging functions
        //log: config.verbose ? console.log : '',
        error: console.error
    },
    fetchConfiguration: {}
}
//
// let identify = scatter.getIdentity({accounts:[options]});
//
// export default EosApi(options)

// var network = {
//     blockchain: 'eos',
//     protocol: 'https',
//     host: 'mainnet.eoscannon.io',
//     port: 443,
//     chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
// };
var currentAccount = null;

// 连接
function connect() {
    scatter.connect('MY_GAME_NAME').then(connected => {
        if (connected) {
            alert('connect success');
        } else {
            alert('connect fail');
        }
    });
}

// 登录，获取 EOS 账户
 export function login() {
    // scatter.forgetIdentity();
    scatter.getIdentity({accounts: [network]}).then(result => {
        currentAccount = result.accounts[0];
        alert('account:' + JSON.stringify(currentAccount));
        // alert('account:'+currentAccount.name);
    }).catch(error => {
        alert('error:' + JSON.stringify(error));
    });
}