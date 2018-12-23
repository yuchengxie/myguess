import React, {Component} from 'react';
import "./home.css"
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';


let scatter = null
let identity = null
let acc = ""

class Home extends Component <> {

    constructor(props) {
        super(props)
        this.state = {
            account: ""
        }
    }

    render() {
        document.title = "Guess";
        return (
            <div>
                <header className={"header"}>
                    {this.renderHeader()}
                </header>
                <div className={"contents"}>

                </div>
            </div>
        );
    }

    renderHeader() {
        return (
            <div className={"container"}>
                <div className={"log"}>
                    {/*<img className={"img"} src={require("./1.png")}/>*/}
                    <text className={"logtitle"}>Guess</text>
                </div>

                <div className={"detail"}>
                    {/*<img className={"img"} src={require("./1.png")}/>*/}
                    {/*<img className={"img"} src={require("./1.png")}/>*/}
                    <button className={"button"}>How to Play</button>
                </div>
                <div>
                    <button className={"button"}
                            onClick={this.handleLogin.bind(this)}>{this.state.account}</button>

                </div>

                {
                    this.state.account == "Login" ? (
                        <button className="button pos unvisable"
                                onClick={this.logout.bind(this)}>Logout</button>) : (
                        <button className="button pos visable" onClick={this.logout.bind(this)}>Logout</button>)
                }

            </div>
        )
    }


    network = {
        protocol: 'https',
        httpEndpoint: 'https://kylin.eoscanada.com',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    };
    currentAccount = null;
    connected = false;


    componentDidMount() {
        // document.addEventListener('scatterLoaded', function (scatterExtension) {
        //     let id = window.scatter.identity
        //     // const eos = window.scatter.eos("", "", "", 'https');
        //     // eos.transaction([{}]).then(r1 => {
        //     //     console.log("r1:", r1)
        //     // });
        //     // eos.getAccount("eosio").then(r2 => {
        //     //     console.log("r2:", r2)
        //     // });
        //     //
        //     // eos.getCurrencyBalance('eosio.token', "eosio", 'EOS').then(r3 => {
        //     //     console.log("r3:", r3)
        //     // });
        //     if (id != null) {
        //         acc = id.accounts[0]["name"]
        //     }
        //     console.log("id:", id)
        //     console.log("acc:", acc)
        //
        //
        //     // if (scatter == null) {
        //     //     alert("请先安装scatter");
        //     // } else {
        //     //     alert("scatter working");
        //     // }
        // });

        // let id = window.scatter.identity
        // if (id != null) {
        //     acc = id.accounts[0]["name"]
        // }
        //
        // console.log("id:", id)
        // console.log("acc:", acc)
        // console.log("acc after:", acc)
        // this.setState({
        //     account: "Login"
        // })
        //  this.setState({
        //     account: acc
        // })
        // ScatterJS.scatter.getIdentity({accounts: [this.network]})
        // this.init()
        // this.connect()

        ScatterJS.scatter.getIdentity({accounts:this.network}).then(() => {
            let accountName = scatter.identity.accounts[0].name;
        })

        this.setState({
            account: "Login"
        })
    }

    async handleLogin() {
        this.connect()
        this.login()
        // if (this.state.account == "Login") {
        //     await this.connect()
        //     await this.login()
        // } else {
        //
        // }

    }

    async connect() {
        this.connected = await ScatterJS.scatter.connect('myguess')
        console.log("connected:" + this.connected);

    }


    // login with eos account via scatter
    async login() {
        if (!this.connected) {
            console.log('not connected');
            console.log('is connected');
            return;
        }
        try {
            let result = await ScatterJS.scatter.getIdentity({accounts: [this.network]})
            this.currentAccount = result.accounts[0];
            // console.log("login success,", this.currentAccount)
            console.log("login success,", JSON.stringify(this.currentAccount))
            // alert("login success" + JSON.stringify(this.currentAccount))
            this.setState({
                account: this.currentAccount["name"]
            })
        } catch (e) {
            alert("login fail")
            console.log("login fail,", e)
        }
    }


    async logout() {
        ScatterJS.scatter.forgetIdentity().then(res => {

            console.log("logout success")
            this.setState({
                account: "Login"
            })
        }).catch(err => {
            console.log(err)
        })
        // console.log("logout success")
    }

    async transfer() {
        if (this.currentAccount == null) {
            await this.handleLogin()
        }
        let eos = ScatterJS.scatter.eos(this.network, Eos);
        try {
            let result = await eos.transfer(this.currentAccount.name, 'eosfavorcomm', '0.0001 EOS', 'hello-eos-scatter, dapp demo transfer');
            console.log(result)
        } catch (e) {
            console.log("error", e)
        }
    }

    async sayHello() {
        if (this.currentAccount == null) {
            await this.handleLogin()
        }
        //please change hello_contract_name to your contract account
        let hello_contract_name = 'itleakstoken';
        let eos = ScatterJS.scatter.eos(this.network, Eos);
        try {
            let data = {
                user: this.currentAccount.name
            }
            let tr = await eos.transaction(
                {
                    actions: [
                        {
                            account: hello_contract_name,
                            name: 'hi',
                            authorization: [{
                                actor: this.currentAccount.name,
                                permission: this.currentAccount.authority
                            }],
                            data,
                        }
                    ]
                }
            )
            console.log(tr)
        } catch (e) {
            console.log("error", e)
        }
    }

    async claimeeth() {
        if (this.currentAccount == null) {
            await this.handleLogin()
        }
        //please change hello_contract_name to your contract account
        let hello_contract_name = 'ethsidechain';
        let eos = ScatterJS.scatter.eos(this.network, Eos);
        try {
            let data = {
                from: this.currentAccount.name,
                quantity: '0.0000 EETH'
            }
            let tr = await eos.transaction(
                {
                    actions: [
                        {
                            account: hello_contract_name,
                            name: 'signup',
                            authorization: [{
                                actor: this.currentAccount.name,
                                permission: this.currentAccount.authority
                            }],
                            data,
                        }
                    ]
                }
            )
            console.log(tr)
        } catch (e) {
            console.log("error", e)
        }
    }


}

export default Home;