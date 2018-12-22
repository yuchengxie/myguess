import React, {Component} from 'react';
import "./home.css"
import ScatterJS from 'scatter-js/dist/scatter.esm';
import Eos from 'eosjs';


class Home extends Component {

    render() {
        document.title = "Guess";
        return (
            <div>
                <header className={"header"}>
                    {this.renderHeader()}
                </header>
                <div className={"contents"}>

                </div>
                <footer>
                    <text>copyright by mixer!</text>
                </footer>
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
                    <button className={"button"} onClick={this.handleLogin.bind(this)}>Login</button>
                    <button className={"button"} onClick={this.logout.bind(this)}>Logout</button>
                </div>
            </div>
        )
    }

    network = {
        // blockchain: 'eos',
        // protocol: 'https',
        // host: 'mainnet.meet.one',
        // port: 443,
        // chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
        // blockchain: 'eos',
        // protocol: 'https',
        protocol: 'https',
        httpEndpoint: 'https://kylin.eoscanada.com',
        chainId: '5fff1dae8dc8e2fc4d5b23b2c7665c97f9e9d8edf2b6485a86ba311c25639191',
    };
    currentAccount = null;
    connected = false;

    async connect() {
        //change name 'hello-scatter' to your application's name
        this.connected = await ScatterJS.scatter.connect('hello-scatter')
        console.log(this.connected);
    }

    // login with eos account via scatter
    async login() {
        if (!this.connected) {
            console.log('not connected');
            return;
        }
        try {
            let result = await ScatterJS.scatter.getIdentity({accounts: [this.network]})
            this.currentAccount = result.accounts[0];
            console.log("login success,", this.currentAccount)
            alert("login success" + JSON.stringify(this.currentAccount))
        } catch (e) {
            alert("login fail")
            console.log("login fail,", e)
        }
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

    async logout() {
        ScatterJS.scatter.forgetIdentity()
        console.log("logout success")
    }

    async handleLogin() {
        await this.connect()
        await this.login()
    }

}

export default Home;