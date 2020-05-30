/**
 * Created by AnGame on 2017/3/30.
 * 后台:
 * 1.本地存储库数据,
 * 2.监听cs的消息: a.发现目标网页就发消息到后台请求数据 b.发送新数据来更新库数据
 * 3.发送数据到cs
 * 4.监听菜单操作, 点击事件到来, 传送命令道cs, 执行刷新任务
 */
// 持久化 !
var stKu = {};
//因为网页禁止了消息机制,必须由cs建立长连接, 在cs未建立前,port不能用
var portCon = false;
if (localStorage['st'] == undefined) {
  localStorage.clear(); // 没有数据就清理下呗
  stKu['FLAG'] = 'OLD';  //标记历史数据
  localStorage['st'] = JSON.stringify(stKu)
}
else {
  stKu = JSON.parse(localStorage['st']) //把数据读进来吧
}
//监听cs来的消息
chrome.extension.onConnect.addListener(function (port) {
  //检查port名称, 避免其他干扰
  if (port.name == 'csPt') {
    console.log('***Found Target Port***');
    port.onMessage.addListener(function (msg) {
      if (msg.verb == 'yesDoIt') //要求历史数据消息
      {
        stKu = JSON.parse(localStorage['st']);
        console.log(function () {
          var c = 0;
          for (var a in stKu) {
            c++
          }
          return c + ' Items send to conntent page.'
        }());
        var o = JSON.stringify(stKu);
        port.postMessage({oldKu: o});
        window.setTimeout(function () {
          portCon = true //刷新后. 设置连接可用标志.
        }, 1000)
      }
      if (msg.upSt) {
        //更新数据到来...(需要更新得部分)
        var upCnt = 0;
        var upPart = JSON.parse(msg.upSt);
        for (var stItem in upPart) {
          stKu[stItem] = upPart[stItem]; //没有的部分添加, 有的部分更新...
          upCnt++
        }
        localStorage['st'] = JSON.stringify(stKu);
        console.log('<' + upCnt + '> Items Background LIB be Updated!!!')
        //console.log(upPart);
      }
    })
    //消息能嵌套吗?  可以~
    //这个菜单监听器,嵌套在port的监听器里面.

    // chrome.browserAction.onClicked.addListener(function (tab) {
    //      testScope();
    //      if (portCon == true) {
    //          console.log("***manFresh***");
    //          try {
    //              port.postMessage({CMD: 'doFresh'});
    //          }
    //          catch (err) {
    //              //console.log(err);
    //          }
    //      }
    //
    //  });
  }
});


