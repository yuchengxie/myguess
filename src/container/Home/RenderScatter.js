export default function RenderScatter(props) {
    let account = WalletUtils.selectAccount(); //获得当前选择的EOS账号
    if (account) {
        return `
      iden = {
          name:"${account.name}",
          publicKey:"${account.publicKey}",
          accounts:[{
              name:"${account.name}",
              blockchain:"eos",
              authority:"${account.perm_name}"
          }]
      };
      window.scatter={
          identity:iden,
          getIdentity:function(id){
              return new Promise((resolve, reject) => {
                  resolve(iden);
              })
          },
          eos:(e,t,r,n) =>{
              return {
                  //查询余额
                  getCurrencyBalance:function(contract,name,coin){
                      return new Promise((resolve, reject) => {
                          var key = new Date().getTime();
                          //给WebView发送一个消息，并且吧需要的参数传过去
                          window.postMessage(JSON.stringify({key,scatter:"getCurrencyBalance",params:{contract,name,coin}}));
                          //接收web消息，并将执行结果返回给Dapp
                          document.addEventListener("message",function(msg){
                              document.removeEventListener("message",this);
                              var obj = eval("(" + msg.data + ")");
                              if(obj.scatter==="getCurrencyBalance" && obj.key===key){     
                                  resolve(obj.data);
                              }
                          });
                      })
                  },
                  //查询账号
                  getAccount:function(account){
                      return new Promise((resolve, reject) => {
                          var key = new Date().getTime();
                          //给WebView发送一个消息，并且吧需要的参数传过去
                          window.postMessage(JSON.stringify({key,scatter:"getAccount",params:{account}}));
                          //接收web消息，并将执行结果返回给Dapp
                          document.addEventListener("message",function(msg){
                              document.removeEventListener("message",this);
                              var obj = eval("(" + msg.data + ")");
                              if(obj.scatter==="getAccount" && obj.key===key){     
                                  resolve(obj.data);
                              }
                          });
                      })
                  },
                  //交易
                  transaction:function(actions){
                      return new Promise((resolve, reject) => {
                          var key = new Date().getTime();
                          //给WebView发送一个消息，并且吧需要的参数传过去
                          window.postMessage(JSON.stringify({key,scatter:"transaction",params:{...actions}}));
                          //接收web消息，并将执行结果返回给Dapp
                          document.addEventListener("message",function(msg){
                              document.removeEventListener("message",this);
                              var obj = eval("(" + msg.data + ")");
                              if(obj.scatter==="transaction" && obj.key===key){ 
                                  resolve(obj.data);
                              }
                          });
                      })
                  }
                  //其他更多scatter的eos接口可以在这里实现
              }
          }
      };
      
      //scatter注入成功，发送scatterLoaded Event
      setTimeout(function(){
          var event = document.createEvent('HTMLEvents');
          event.initEvent("scatterLoaded", true, true);
          event.eventType = 'scatterLoaded';
          document.dispatchEvent(event);
      },1000);
  `
    } else {
        return `
    
    `
    }
}