module.exports = {
    mode : 'development',
    // mode : 'production',
    port : 10001, // server port
    session: {
        secure: true,
        httpOnly: true,
        secret: 'secretKey',
        resave: false,
        saveUninitialized: false,
    },
    db: {
        url: 'mongodb://localhost:28882/WhiteBetting',
    },
    api_football: {
        key: 'api_football',
    },
    // 실서버용
    contract: {
        serverName: 'Ropsten',
        // serverName: 'Mainnet',
        serverAddress: 'https://ropsten.infura.io/v3/address',
        serverAddress1: 'https://ropsten.infura.io/v3/address',
        serverAddress2: 'https://ropsten.infura.io/v3/address',
        serverAddress3: 'https://ropsten.infura.io/v3/address',
        serverAddress4: 'https://ropsten.infura.io/v3/address',

        address: 'address',
        owner: 'address', // Account1

        // ★★★★★ 절대 보안 준수
        ownerPrivateKey: 'ownerPrivateKey',

        abi: [ { "constant": false, "inputs": [ { "internalType": "address", "name": "_newManager", "type": "address" } ], "name": "changeManger", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "internalType": "uint32", "name": "_odd_homeTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_drawTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_awayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_over", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_under", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_homeTeamAndDraw", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_homeAndAwayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_awayTeamAndDraw", "type": "uint32" } ], "name": "changeOdd", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "address payable", "name": "_newOwner", "type": "address" } ], "name": "changeOwner", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_eth", "type": "uint256" } ], "name": "deposit", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "internalType": "uint8", "name": "_homeDrawAway", "type": "uint8" }, { "internalType": "uint8", "name": "_overUnder", "type": "uint8" } ], "name": "givePrizeMoney", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "internalType": "uint16", "name": "_selectedTeam", "type": "uint16" }, { "internalType": "uint256", "name": "_stake", "type": "uint256" }, { "internalType": "uint32", "name": "_odd", "type": "uint32" } ], "name": "placeBet", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "internalType": "uint256", "name": "_timestamp", "type": "uint256" }, { "internalType": "uint32", "name": "_odd_homeTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_drawTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_awayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_over", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_under", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_homeTeamAndDraw", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_homeAndAwayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "_odd_awayTeamAndDraw", "type": "uint32" }, { "internalType": "uint8", "name": "_open_status", "type": "uint8" } ], "name": "setGameInfo", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "internalType": "uint8", "name": "_open_status", "type": "uint8" } ], "name": "setOpenStatus", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "internalType": "uint256", "name": "_amount", "type": "uint256" } ], "name": "withdraw", "outputs": [], "payable": true, "stateMutability": "payable", "type": "function" }, { "inputs": [ { "internalType": "address", "name": "_manager", "type": "address" } ], "payable": true, "stateMutability": "payable", "type": "constructor" }, { "payable": true, "stateMutability": "payable", "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint256", "name": "odd", "type": "uint256" } ], "name": "Success", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "sender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "eth", "type": "uint256" } ], "name": "Deposit", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "receiver", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "eth", "type": "uint256" } ], "name": "Withdraw", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint64", "name": "fixtureId", "type": "uint64" }, { "indexed": false, "internalType": "uint16", "name": "selectedTeam", "type": "uint16" }, { "indexed": false, "internalType": "uint256", "name": "stake", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "odd", "type": "uint256" } ], "name": "NewStake", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "indexed": false, "internalType": "uint256", "name": "_timestamp", "type": "uint256" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_drawTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_awayTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_over", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_under", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeTeamAndDraw", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeAndAwayTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_awayTeamAndDraw", "type": "uint32" }, { "indexed": false, "internalType": "uint8", "name": "_open_status", "type": "uint8" } ], "name": "SetGame", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_drawTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_awayTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_over", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_under", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeTeamAndDraw", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_homeAndAwayTeam", "type": "uint32" }, { "indexed": false, "internalType": "uint32", "name": "_odd_awayTeamAndDraw", "type": "uint32" } ], "name": "ChangeOdd", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "internalType": "uint64", "name": "_fixtureId", "type": "uint64" }, { "indexed": false, "internalType": "uint8", "name": "_homeDrawAway", "type": "uint8" }, { "indexed": false, "internalType": "uint8", "name": "_overUnder", "type": "uint8" } ], "name": "GivePrizeMoney", "type": "event" }, { "constant": true, "inputs": [ { "internalType": "uint64", "name": "", "type": "uint64" }, { "internalType": "uint256", "name": "", "type": "uint256" } ], "name": "betList", "outputs": [ { "internalType": "address payable", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "stake", "type": "uint256" }, { "internalType": "uint32", "name": "odd", "type": "uint32" }, { "internalType": "uint16", "name": "selectedTeam", "type": "uint16" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "internalType": "uint64", "name": "", "type": "uint64" } ], "name": "gameList", "outputs": [ { "internalType": "uint256", "name": "timestamp", "type": "uint256" }, { "internalType": "uint32", "name": "odd_homeTeam", "type": "uint32" }, { "internalType": "uint32", "name": "odd_drawTeam", "type": "uint32" }, { "internalType": "uint32", "name": "odd_awayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "odd_over", "type": "uint32" }, { "internalType": "uint32", "name": "odd_under", "type": "uint32" }, { "internalType": "uint32", "name": "odd_homeTeamAndDraw", "type": "uint32" }, { "internalType": "uint32", "name": "odd_homeAndAwayTeam", "type": "uint32" }, { "internalType": "uint32", "name": "odd_awayTeamAndDraw", "type": "uint32" }, { "internalType": "uint8", "name": "open_status", "type": "uint8" }, { "internalType": "bool", "name": "isDone", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getBalance", "outputs": [ { "internalType": "uint256", "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getManager", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "manager", "outputs": [ { "internalType": "address", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "internalType": "address payable", "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" } ],
    },
    managerList: [
        "managerList",
    ],
    stats: {
        summary :{
            byDateWeight: 30, loginWeight: 1, honorWeight: 5, iLoveWeight : 2, iPlayedCount: 1, letterCount: 1,
        },

        level_criteria : 100, // 레벨업 기준
    },
    mail: {
        transporter: { // 매출 기록 메일로 보내기
            host: 'smtp', // .com 기업 메일 전달 가능
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'id',
                pass: 'password'
            }
        },
        paidUser : { // 어떤 유저가 베팅했는지 메일로 push
            from: '"xxx" <email address>',
            to: 'email address', // list of receivers
            subject: '', // Subject line
            html : '',
        },
    },
    cookie: {
        hashkey: 'hashkey',
        key: 'cookiekey',
        token: {
            opt12h: {
                maxAge: (1000 * 60 * 60 * 12),
                signed: true,
                httpOnly: true,
            },
            opt3m: {
                maxAge: (1000 * 60 * 60 * 24 * 90),
                signed: true,
                httpOnly: true,
            },
            opt1y: {
                maxAge: (1000 * 60 * 60 * 24 * 365 * 1 ),
                signed: true,
                httpOnly: true, // true를 하면 browser에서 document.cookie를 쳤을 때 나오지 않는다.
            },
            opt10y: {
                maxAge: (1000 * 60 * 60 * 24 * 365 * 10),
                signed: true,
                httpOnly: true,
            },
        }
    },

}