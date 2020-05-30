/**
 * Created by AnGame on 2017/6/7.
 */
function SliceObj(tarObj, mSize) {
    // 把大对象切割成小的对象, 放入数组.
    var objArr = [];
    var cnt = 0;
    var objStr = '';
    var objGroup = {};
    for (var oi in tarObj) {

        var obj0 = 'back' + Math.floor(cnt / mSize);
        if (obj0 !== objStr) {
            objStr = obj0;
            obj0 = new Object();
            objGroup = obj0;
            obj0[oi] = tarObj[oi];
            objArr.push(objGroup);
        }
        else {
            objGroup[oi] = tarObj[oi];
        }
        cnt++;
    }
    return objArr;
}
function libSlice(objData) {
    // 把st中数据切割成小对象,保存在本地
    var mArr = [];
    var tmp = {};
    mArr = SliceObj(objData, 400);
    for (var ii = 0; ii < mArr.length; ii++) {
        var str = 'st' + ii;
        localStorage[str] = JSON.stringify(mArr[ii])
    }
}
//主库切块
function copyToExe()  // 主库切割成400个元以便于拷贝
{
    var myStKu=JSON.parse(window.localStorage['st']);
    libSlice(myStKu);
}

function testCode() {
    var x= window.document.getElementsByClassName('st');
    for(var i=0;i<x.length;i++)
    {
        x[i].style.display='';
    }

}

