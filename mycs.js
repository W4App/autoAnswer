/**
 * Created by AnGame on 2017/3/25.
 */

var csStku = {};
var BGoldKu = {}; //历史版本
var Number_skip = [];
//生成随机的排序无重复序列...
// function get_skip_number()
// {
//   let arr = [];
//   let result = [];
//   for (let iRnd = 0; iRnd < 4; iRnd++)
//   {
//     arr.push(Math.floor(Math.random() * 90) + 1);
//   }
//   arr.sort(function(a, b)
//   {
//     if (a == b)
//     {
//       return 0;
//     }
//     if (a > b)
//     {
//       return 1;
//     } else
//     {
//       return -1;
//     }
//   });
//   let obj = {};
//   //利用js中,属性不能重复来去重! 这是个高效方法
//   for (let i in arr)
//   {
//     if (obj.hasOwnProperty(arr[i]) === false)
//     {
//       result.push(arr[i]);
//       obj[arr[i]] = 1;
//     }
//   }
//   return result;
// }
function itemCount(obj) {
    var cnt = 0;
    for (var ic in obj) {
        cnt++;
    }
    return cnt;
}

function getChg(current, old) // 找出不同历史的部分, 以便传送到后台.
{
    var tmpUpdata = {};
    for (var cstm in current)  //遍历新库,和历史对照...
    {
        if (!old.hasOwnProperty(cstm) ||
            JSON.stringify(old[cstm]) !== JSON.stringify(current[cstm])) {
            tmpUpdata[cstm] = current[cstm];
        }
    }
    return tmpUpdata;
}

if (typeof Answers == 'undefined') {
    var Answers = {};
    Answers.A = 0;
    Answers.B = 1;
    Answers.C = 2;
    Answers.D = 3;
    Answers.E = 4;
    Answers.F = 5;
    Answers.G = 6;
    Answers.H = 7;
    Answers.I = 8;
    Answers.J = 9;
    Answers.K = 10;
}

function getSelector(pageStr, daStr) {
    var selAnswers = [];
    var strArr = pageStr.replace(/<b>/g, '').replace(/<\/b>/g, '').split('<br>');
    strArr.pop();
    strArr.forEach(function (e, i) {
        var tmpstr = e.slice(2);
        if (tmpstr === daStr) {
            selAnswers.push(e.slice(0, 1));
        }
    });
    return selAnswers;
}

//模仿枚举, 因为字母严格对应, 用数字索引~
function daFormt(pageStr, daStr)  //修改显示! 这个函数要重写(因为部分匹配, 会导致错误)
{
    // var firstChar = daStr.substr(0,1);
    //var remainChar =daStr.slice(1);
    //执行多次, daStr是纯粹的字符串.
    // var strNew = '<i>' + firstChar + '</i>'+remainChar;
    var strNew = '<b>' + daStr + '</b>';
    var strArr = pageStr.split('<br>');
    strArr.forEach(function (e, i) {
        var tpStr = e.slice(2);
        if (tpStr === daStr) {
            //这里跟踪序号 e的首字母就是输入表单name
            strArr[i] = e.replace(tpStr, strNew);
        }
    });
    return strArr.join('<br>');
}

// function getAnswersObj(htmlStr, eleInput)  //htmlStr ==string ; eleInput = ele_colection
// {
//   //函数:把html的黑体去掉,用<br>切割. 形成数组, 去掉空格,返回答案字符串.(无空格换行)
//   var tmpAnswers = {};
//   var t = htmlStr.replace(/<b>/g, '').
//       replace(/<\/b>/g, '').
//       replace(/\s/g, '').
//       replace(/\n/g, '');
//   var arr = t.split('<br>');
//   for (var x = 0; x < arr.length; x++)
//   {
//     arr[x] = arr[x].replace(/<b>/g, '').replace(/<\/b>/g, '');
//     arr[x] = arr[x].trim();
//   }
//   arr.pop(); //去掉切割后产生的空字符数组. 删除尾部有害元
//   var daCnt = 0;
//   for (var y = 0; y < eleInput.length; y++)
//   {
//     if (eleInput[y].checked == true)
//     {
//       daCnt++;
//       var alpha = eleInput[y].value;
//       tmpAnswers[alpha] = arr[Answers[alpha]].slice(2); // 有点绕, 用枚举找出序号, 引用数组项, 剪裁下.
//     }
//   }
//   tmpAnswers['Da'] = daCnt;
//   tmpAnswers['An'] = 0;
//   return tmpAnswers;
// }
function getOkAnswersObj(htmlStr, alphaArr)  //htmlStr ==string ; eleInput = alpha Arr
{
    //函数:把html的黑体去掉,用<br>切割. 形成数组, 去掉空格,返回!
    var tmpAnswers = {};
    var t = htmlStr.replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\s/g, '').replace(/\n/g, '');
    var arr = t.split('<br>');
    for (var x = 0; x < arr.length; x++) {
        arr[x] = arr[x].replace(/<b>/g, '').replace(/<\/b>/g, '');
        arr[x] = arr[x].trim();
    }
    arr.pop(); //去掉切割后产生的空字符数组. 删除尾部有害元
    for (var y = 0; y < alphaArr.length; y++) {
        var alpha = alphaArr[y];
        tmpAnswers[alpha] = arr[Answers[alpha]].slice(2); // 有点绕, 用枚举找出序号, 引用数组项, 剪裁下.
    }
    tmpAnswers['An'] = -1; //标准答案
    tmpAnswers['Da'] = alphaArr.length;
    return tmpAnswers;
}

function jxFlag() {
    if (document.querySelector('head title').innerText.match(/答案解析/) != null) {
        // 是不是答案解析页面...
        return true;
    } else {
        return false;
    }
}

function Dajx() {
    console.log('perfect answers got...');
    var stInfo = document.getElementsByClassName('st');
    for (var cnt = 0; cnt < stInfo.length; cnt++) {
        var lookLable = stInfo[cnt].getElementsByTagName('label'); //查找label标签!
        var inputType = stInfo[cnt].querySelector('input');
        var itemClass = 'unknown';
        if (inputType) {
            itemClass = inputType.type;
        }
        if (lookLable.length > 2 && itemClass === 'radio' ||
            itemClass === 'checkbox') {
            var xztm = stInfo[cnt].getElementsByTagName('p')[0].innerText; //题目
            //空格常常无意义,但在代码里,会造成干扰,打算脱掉
            xztm = xztm.replace(/\s/g, '');
            var eleXzDD = stInfo[cnt].getElementsByTagName('dd')[0];  //页面显示元素
            //解析到答案字符串
            var dajxStr = stInfo[cnt].querySelector('div').querySelector('span').innerText;
            var daArr = dajxStr.split(',');
            csStku[xztm] = getOkAnswersObj(eleXzDD.innerHTML, daArr);
        }
        if (lookLable.length === 2 && itemClass === 'radio') {
            //console.log("判断题!");
            var pd = stInfo[cnt].getElementsByTagName('p');
            var pdtm = pd[0].innerText;
            pdtm = pdtm.replace(/\s/g, ''); //去掉内部空格
            var pdRightAnswer = stInfo[cnt].querySelectorAll('div')[0].querySelector(
                'span').innerText;
            pdRightAnswer = pdRightAnswer.replace(/\s/g, '');
            if (pdRightAnswer === '正确') {
                csStku[pdtm] = 'Y';
            }
            if (pdRightAnswer === '错误') {
                csStku[pdtm] = 'N';
            }
        }
        if (lookLable.length < 2) {
            //简答题.填空...
            //stinfo[cnt]代表题目组...
            if (stInfo[cnt].getElementsByTagName('textarea').length > 0) {
                //jdt 这个cnt就是简答...
                var jd = stInfo[cnt].getElementsByTagName('p');
                var jdtm = jd[jd.length - 1].innerText; // 用最后一个P标签...
                jdtm = jdtm.replace(/\s/g, '');
                var jdOkDa = stInfo[cnt].querySelectorAll('div');
                csStku[jdtm] = jdOkDa[1].querySelector('span').innerText;
            }
            if (stInfo[cnt].getElementsByTagName('input').length > 0) {
                //填空题-->这个cnt就是填空题组
                var tk = stInfo[cnt].getElementsByTagName('p');
                var tktm = tk[0].innerText;
                tktm = tktm.replace(/\s/g, '');
                var tkOkDa = stInfo[cnt].querySelector('div').querySelector('span').innerText;
                csStku[tktm] = tkOkDa;
            }
        }
    }
}

function rwPage() {
    var stInfo = document.getElementsByClassName('st');
    for (var cnt = 0; cnt < stInfo.length; cnt++) {
        var lookLable = stInfo[cnt].getElementsByTagName('label'); //查找label标签!
        var radio = stInfo[cnt].querySelector('input');
        var xzpdFlag = 'NoXzPd';
        if (radio) {
            xzpdFlag = radio.type;
        }
        if (lookLable.length > 2 && xzpdFlag === 'radio' || xzpdFlag === 'checkbox') {
            var xztm = stInfo[cnt].getElementsByTagName('p')[0].innerText; //题目
            //空格常常无意义,但在代码里,会造成干扰,打算脱掉
            xztm = xztm.replace(/\s/g, '');
            var eleXzDD = stInfo[cnt].getElementsByTagName('dd')[0];  //页面显示元素
            var eleXzInpt = stInfo[cnt].getElementsByTagName('input');  // 答案控件
            if (csStku.hasOwnProperty(xztm)) {
                //有题目就读出来. 看看有没有答案,
                var oldda = csStku[xztm];
                if (oldda['Da'] > 0) {
                    var dispXm = eleXzDD.innerHTML.replace(/\s/g, '').replace(/<b>/g, '').replace(/<\/b>/g, '').replace(/\n/g, '');
                    eleXzDD.innerHTML = dispXm;
                    for (var x in oldda) //有答案就必须显示下.
                    {
                        if (x !== 'Da' && x !== 'An')  //加粗显示, 标识参数没有修改的意义,过滤掉
                        {
                            var xm = oldda[x];
                            //选项目
                            var XzItem = getSelector(dispXm, xm);
                            if (XzItem.length !== 0) {
                                for (var xx = 0; xx < eleXzInpt.length; xx++) {
                                    if (eleXzInpt.item(xx).value === XzItem[0]) {
                                        eleXzInpt.item(xx).checked = true;
                                    }
                                }
                            }
                            dispXm = daFormt(dispXm, xm);
                        }
                        // }
                        //回写innerhtml
                        //console.log(dispXm);
                        eleXzDD.innerHTML = dispXm;
                    }
                }
            }
        }
        if (lookLable.length === 2 && xzpdFlag === 'radio') {
            var pd = stInfo[cnt].getElementsByTagName('p');
            var pdtm = pd[0].innerText;
            pdtm = pdtm.replace(/\s/g, ''); //去掉内部空格
            var pdtEle = stInfo[cnt].getElementsByTagName('input');
            var pdLabel = stInfo[cnt].getElementsByTagName('label');  //选项标签 改外观用.  判断题是2个咯
            //题目存在, ?读出答案.改外观吧, : 读出状态, 进入库...
            if (csStku.hasOwnProperty(pdtm)) {
                if (csStku[pdtm] !== 'unKnown')  //题存在且有答案, 显示... 特殊格式
                {
                   // pdLabel[0].lastChild.nodeValue = '正确';
                   // pdLabel[1].lastChild.nodeValue = '错误';
                    switch (csStku[pdtm]) {
                        //修改外观  但是并未选定..
                        case 'Y':
                            pdLabel[0].lastChild.nodeValue = '`正确';
                            pdtEle.item(0).checked=true;
                           // pdtEle[0].checked = true;
                            break;
                        case 'N':
                            pdLabel[1].lastChild.nodeValue = '错误`';
                            pdtEle.item(1).checked=true;
                            //pdtEle[1].checked = true;
                            break;
                    }
                }
            }
        }
        if (lookLable.length < 2) {
            //简答题.填空...
            if (stInfo[cnt].getElementsByTagName('textarea').length > 0) {
                //jdt 这个cnt就是简答...
                var jd = stInfo[cnt].getElementsByTagName('p');
                var jdtm = jd[jd.length - 1].innerText; // 用最后一个P标签...
                jdtm = jdtm.replace(/\s/g, '');
                var jdEle = stInfo[cnt].getElementsByTagName('textarea');
                if (csStku.hasOwnProperty(jdtm)) {
                    //有了简答题
                    var jdda = csStku[jdtm];
                    if (jdda !== 'None') {
                        var newjdda = jdEle[0].value;
                        if (newjdda === '') {
                            jdEle[0].value = jdda; //有答案,题为空, 那么填上历史答案
                        }
                    } else //有题, 没答案, 那就和第一次一样检查处理.
                    {
                        if (jdEle[0].value === '') {
                            csStku[jdtm] = 'None';
                        } else {
                            csStku[jdtm] = jdEle[0].value;
                        }
                    }
                } else {
                    if (jdEle[0].value === '') {
                        csStku[jdtm] = 'None';
                    } else {
                        csStku[jdtm] = jdEle[0].value;
                    }
                }
            }
            if (stInfo[cnt].getElementsByTagName('input').length > 0) {
                //填空题-->这个cnt就是填空题组
                var tk = stInfo[cnt].getElementsByTagName('p');
                var tktm = tk[0].innerText;
                tktm = tktm.replace(/\s/g, '');
                var tkEle = tk[0].getElementsByTagName('input');
                if (csStku.hasOwnProperty(tktm)) {
                    //把答案抽出来,如果上次没有答案, 就读这次的写入库, 如果上次有答案, 但是和 本次读取的不同, 更新库
                    var tkda = csStku[tktm];
                    if (tkda !== 'None') {
                        //有答案
                        var newDa = tkEle[0].value;
                        if (newDa === '')  //空没填,,
                        {
                            tkEle[0].value = tkda;
                        } else {
                            csStku[tktm] = newDa;  //有题有答案,且有填数据在格子, 就不由分说,记录下来. 当做更新
                        }
                    } else {
                        //没答案
                        if (tkEle[0].value === '') {
                            csStku[tktm] = 'None';
                        } else {
                            csStku[tktm] = tkEle[0].value;
                        }
                    }
                } else {
                    if (tkEle[0].value === '') {
                        csStku[tktm] = 'None';
                    } else {
                        csStku[tktm] = tkEle[0].value;
                    }
                }
            }
        }
    }
}

// 开始处理....
if (document.getElementsByClassName('st').length > 10) {
    var csPort = chrome.extension.connect({name: 'csPt'});
    //初始去重的排序序列...
    // Number_skip = get_skip_number();
    Number_skip = [-1, -1, -1, -1];
    if (window.document.querySelector('body').innerText.match(/吴炳安/) !== null) {
        Number_skip = [-1, -1, -1, -1];
    }
    csPort.postMessage({verb: 'yesDoIt'});
    csPort.onMessage.addListener(function (msg) {
        if (msg.oldKu) {
            console.log('***Target Page EXIST***');
            csStku = {};//取得历史,初始化库对象.
            csStku = JSON.parse(msg.oldKu);
            BGoldKu = {};
            for (var oldK in csStku) {
                BGoldKu[oldK] = csStku[oldK];
            }
            console.log(
                'Got <' + itemCount(BGoldKu) + '> items from Backgroung library ');
            if (jxFlag()) {
                Dajx();  //是标准答案,就直接更新吧,懒得去点.
                (function () {
                    var tmp = getChg(csStku, BGoldKu);
                    csPort.postMessage({upSt: JSON.stringify(tmp)});
                    console.log(
                        '<' + itemCount(tmp) + '>items which be right answers updated');
                }());
            } else {
                window.setTimeout(function () {
                    rwPage();
                }, 1000 * 30 * 1);
            }
            //必须悄然更新一次. :(
            window.setTimeout(function () {
                if (jxFlag()) {
                    Dajx();
                } else {
                    rwPage();
                }
                try {
                    (function () {
                        var tmp = getChg(csStku, BGoldKu);
                        //console.log(tmp);
                        csPort.postMessage({upSt: JSON.stringify(tmp)});
                    }());
                    // console.log("***auto update lib***");
                } catch (err) {
                }
            }, 1000 * 60 * 15);
        }
        // if (msg.CMD == 'doFresh') //来自菜单的消息.执行刷新任务
        // {
        //   //console.log("***FRESH & UPDATE***");
        //   if (csStku['FLAG'] == 'OLD') //检查历史库标志决定更新, 至少保证是历史库的增量版本.
        //   {
        //     if (jxFlag())
        //     {
        //       Dajx()
        //     }
        //     else
        //     {
        //       rwPage()
        //     }
        //     (function ()
        //     {
        //       var tmp = getChg(csStku, BGoldKu)
        //       csPort.postMessage({upSt: JSON.stringify(tmp)})
        //       console.log('<' + itemCount(tmp) + '> items Updated to background library ')
        //     }())
        //
        //   }
        // }
        // if (msg.who) {
        // person_list = JSON.parse(msg.who)
        // }
    });
}



