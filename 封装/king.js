/*工具*/

// function forEach(arr, fn){//arr为数组
//     var len = arr.length;
//     for(var i=0;i<len;++i){
//         fn(arr[i], i);
//     }
// }

function isArrayLike(arr){//判断是不是数组
    if(arr && 'length' in arr){
        var len = arr.length;
        if(typeof len === 'number' && 
                (
                    len === 0 ||
                    (0 in arr && len-1 in arr)
                )
            ){
            return true;
        }
    }
    return false;
}

function isArrayFn(value){ 
    if (typeof Array.isArray === "function") { 
        return Array.isArray(value);     
    }else{ 
        return Object.prototype.toString.call(value) === "[object Array]";     
    } 
} 


function forEach(arr, fn) {//arr为数组或者object
    var i;
    if (arr && typeof arr === 'object') {
        if (isArrayLike(arr)) {
            var len = arr.length;
            for (i = 0; i < len; ++i) {
                if (fn(arr[i], i) === false) {
                    break;
                }
            }
        }else{
            var hasOwnProperty = 'hasOwnProperty' in arr;
            for (i in arr) {
                if (!hasOwnProperty || arr.hasOwnProperty(i)) {
                    if (fn(arr[i], i) === false) {
                        break;
                    }
                }
            }
        }
    }
}

function filter(arr, fn) {//过滤
    var r = [];
    forEach(arr, function(a, i) {
        if (fn(a, i)) {
            r.push(a);
        }
    });
    return r;
}

function some(arr, fn) {//筛选
    var match = false;
    forEach(arr, function(a, i) {
        if (fn(a, i)) {
            match = true;
            return false;
        }
    });
    return match;
}

/*ajax*/
function ajax(setting) {
   var time = setting.time || 60000;
   var xhr;//没有定义 如果一个页面多次请求接口，会混乱，而导致想同步的想法，其实是没有定义变量造成的
   //或者用promise  如果接口间有依赖的话 就只能同步

  if (window.XMLHttpRequest)
      xhr = new XMLHttpRequest();
  else {
      xhr = new ActiveXObject("Microsoft.XMLHTTP");
  }

  var countTime = setTimeout(function() {
     xhr.abort();
 }, time);

  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
               clearTimeout(countTime);
              if (setting.success) {
                  var res = xhr.responseText;
                  if(typeof res == 'string'){
                      res = JSON.parse(res);
                  }
                  setting.success(res);
              } else{
                  console.log(xhr.responseText);
              }
          } else {
               clearTimeout(countTime);
              if (setting.error){
                  setting.error(xhr.status);
              }
              else {
                  console.log('Error:' + xhr.status);
              }
          }
      }
  }

  var data = "";
  if (typeof setting.data === 'string') {
      data = setting.data;
      if (data.charAt(0) == '?')
          data = data.substring(1, data.length);
  } else if (typeof setting.data == 'object') {
      for (key in setting.data) {
          data += key + '=' + setting.data[key] + '&';
      }
      data = data.replace(/&$/, '');
  }

  var type = setting.type || 'GET';
  var async = setting.async || 'true';

  if (type.toLowerCase() == 'get') { //GET方式提交

      xhr.open(type, setting.url + '?' + data, JSON.parse(async));
      xhr.send();
  } else { //POST方式提交
      xhr.open(type, setting.url, JSON.parse(async));
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(data);
  }
}


/*调用方法*/
/*
     ajax({
        url: '',
        type: 'get',//不写 默认get 不限大小写
        async:'false',// 不写默认是异步
        data:'id='+themeId,//无论是get还是post 传参数就写data
        success: function(data) {
           
        },
        error: function(data) {
           
        }
    });
*/

/*jsonp*/
// function jsonp(){
//   var script = document.createElement('script');
//   script.setAttribute('src', 'url&callback=fnn');
//   fnn = function(data){
//     script.parentNode.removeChild(script);
//     delete fnn;//严格模式会报错
//   }
//   document.head.appendChild(script); 
// }

// function getJsonP(url,fn){ //弊端是不灵活
//     var script = document.createElement('script');
//     script.setAttribute('src', url + '&callback=' + 'showGiftList&t=' + Date.now());
//     window.showGiftList = function(data){
//         fn(data)
//         script.parentNode.removeChild(script);
//         window.showGiftList = null;
//         //delete showGiftList;
//     }
//     document.head.appendChild(script); 
// }

/*调用方法：getJsonP()*/
function addEvent(elm, evType, fn, useCapture) {
    if (elm.addEventListener) {
        elm.addEventListener(evType, fn, useCapture);
    }else if (elm.attachEvent) {
        elm.attachEvent('on' + evType, fn);
    }else {
        elm['on' + evType] = fn;
    }
}

function removeEvent(elm,evType,fn){
    if (elm.removeEventListener) {  
        elm.removeEventListener(evType,fn,false);  
    }else if (elm.detachEvent) {  
        elm.detachEvent('on'+evType,fn);  
    }else{  
        elm['on'+evType] = null;  
    }  
}

function param(obj) {
    var arr = [];
    for (var i in obj) {
        if (obj.hasOwnProperty(i)) {
            var val = obj[i];
            var type = typeof val;
            if (type === 'number' || type === 'string' || type === 'boolean') {
                arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(val));
            }
        }
    }
    return arr.join('&');
}  
//调用2次举例

var _jsonpI = 0;
var jsonp = function(option, fn){
    var a = _jsonpI + 1;
    if(a === _jsonpI){
        _jsonpI = a = 0;
    }else{
        _jsonpI = a;
    }

    var key = (option.callbackName || 'callback') + a;
    var returned = false;
    var win = window;
    function clean(){
        clearTimeout(to);
        try{
            delete win[key];
        }catch(e){
            win[key] = null;
        }
        removeEvent(script,'load',onLoad,false);
        removeEvent(script,'error',onError,false);
        var p = script.parentNode;
        if(p){
            p.removeChild(script);
        }
    }
    function onLoad(){
        if(!returned){
            clearTimeout(to);
            to = setTimeout(onError, 1000);
        }
    }
    function onError(){
        if(!returned){
            returned = true;
            clean();
            fn(false, 'timeout');
        }
    }
    var to = setTimeout(onError, 15 * 1000);//超时处理
    win[key] = function(r){
        if(!returned){
            returned = true;
            clean();
            fn(true, r);
        }
    };
    var url = option.url;
    var data = '';
    if(option.data){
        if(typeof option.data === 'string'){
            data = option.data;
        }else{
            data = param(option.data);
        }
    }
    var hasCallback = false;

    url = url.replace(/([^&]=)\?/, function(match, group1){
        hasCallback = true;
        return group1 + key;
    });
    
    var extraObj = {_t: Math.random()}
    extraObj[option.callbackName || 'callback'] = !hasCallback ? key : null
    var extraParam = param(extraObj);
    url += (url.indexOf('?') === -1 ? '?' : '&') + data + (data?'&':'') + extraParam;
    var script = document.createElement('script');

    addEvent(script,'error',onError,false);
    addEvent(script,'load',onLoad,false);

    script.src = url;
    (document.body || document.documentElement).appendChild(script);
};


/*
调用方法：
    jsonp({
        url: 'http://api.gc.liebao.cn/index.php?r=1/gift/receive',
        //callbackName:'cb',//不写默认是callback
        data: {
            deviceid: 'YzU1amQ3dGh2aGcxNDY5MDkzMTQyNjA2',
            list_id: 11001
        }
    }, function(success, response){
       console.log(success)
       console.log(response)
    });
    可以多次调用

*/

/*获取id*/

function getId(id){
	return document.getElementById(id);
}

/*获取id*/

/*获取className
  返回的是数组
*/

function getClass(classN,ele){
	if(document.getElementsByClassName){
		return (ele || document).getElementsByClassName(classN);
	}else{
		var commonTag =  (ele || document).getElementsByTagName('*');
		var arr = [];
		for(var i = 0;i<commonTag.length;i++){
			var arrClass = commonTag[i].className.split(' ');
			for(var j = 0;j<arrClass.length;j++){
				if(arrClass[j] == classN){
					arr.push(arrClass[j]);
				}
			}
		}
		return arr;
	}
}

/*获取样式/设置样式【可以是object】*/

function cssStyle(obj, attr, value){
	switch (arguments.length){
		case 2:
			if(typeof arguments[1] == "object"){
				for (var i in attr) i == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + attr[i] + ")", obj.style[i] = attr[i] / 100) : obj.style[i] = attr[i];
			}else{
				return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj, null)[attr]
			}
			break;
		case 3:
			attr == "opacity" ? (obj.style["filter"] = "alpha(opacity=" + value + ")", obj.style[attr] = value / 100) : obj.style[attr] = value;
			break;
	}
}

/*添加class*/

function addClass(el, cls) {
    var cL = el.classList;
    if (cL) {
        cL.add(cls);
    } else {
        el.className += ' ' + cls;
    }
}

/*删除class*/

function removeClass(el, cls) {
    var cL = el.classList;
    if (cL) {
        cL.remove(cls);
    } else {
        var n = el.className;
        if (n) {
            var _n = filter(n.split(' '), function(a) {
                    return a !== cls;
                }).join(' ');
            if (_n !== n) {
                el.className = _n;
            }
        }
    }
}

/*是否含有class*/

function hasClass(el, cls) {
    var cL = el.classList;
    if (cL) {
        return cL.contains(cls);
    } else {
        return some(el.className.split(' '), function(part) {
            return part === cls;
        });
    }
}

/*显隐性*/
function show(el) {
    el.style.display = 'block';
}

function hide(el) {
    el.style.display = 'none';
}

/*绑定事件*/

function on(el, ev, fn, capture) {
    forEach(ev.split(' '), function(ev) {
        el.addEventListener(ev, fn, Boolean(capture));
    });
}

function off(el, ev, fn, capture) {
    forEach(ev.split(' '), function(ev) {
        el.removeEventListener(ev, fn, Boolean(capture));
    });
}

/*阻止默认行为*/

function preventDefault(e){
    if(e.preventDefault){
        e.preventDefault();
    }else{
        e.returnValue = false;
    }
}

/*阻止冒泡*/

function stopPropagation(e){
    if(e.stopPropagation){
        e.stopPropagation();
    }else{
        e.cancelBubble = true;
    }
}

function extend(a, b) {//给style添加样式
    forEach(b, function(val, key) {
        a[key] = val;
    });
    return a;
}

/*
使用方法：
	extend(DOM.style, {
        width: 100 + 'px',
        height: 100 + 'px'
    });
*/

/*图片预加载*/

function preloadimages(arr){
    var newimages = [], loadedimages = 0;
    var arr = (typeof arr != "object")?[arr]:arr;

    function imageloadpost(){
        loadedimages++;
        if (loadedimages == arr.length){
           console.log('图片加载完成');
        }
    }
    for (var i=0; i<arr.length; i++){
        newimages[i] = new Image();
        newimages[i].src = arr[i];
        newimages[i].onload = function(){
            imageloadpost()
        }
        newimages[i].onerror = function(){
        	imageloadpost()
        }
    }
}

/*
	preloadimages(arr);
*/

/*获取坐标[pc和移动端]*/
//x touchstart touchmove
function getX(e){
  return e.touches ? e.touches[0].clientX : e.clientX;
}
//y touchstart touchmove
function getY(e){
  return e.touches ? e.touches[0].clientY : e.clientY;
}

//x touchend
function getX2(e){
  return e.changedTouches ? e.changedTouches[0].clientX : false;
}
//y touchend
function getY2(e){
  return e.changedTouches ? e.changedTouches[0].clientY : false;
}

/*获取坐标[pc和移动端]*/


/*获取url的参数*/
function getValue(key,s){
    var a = s.split(/\?|=|&/);
    console.log(a)
    for(var i=0,len=a.length;i<len;i++){
       if(a[i]==key){
            return a[i+1];
       }
    }
    return null;
}


/*获取url的参数*/

/*清空style*/
function clearStyle(obj){
    return obj.style.cssText  = '';
}
/*清空style*/

/*设置cookie*/

function setCookie(name,value,exdays) {
    var exdate=new Date();
    exdate.setDate(exdate.getDate() + exdays);
    var c_value=escape(value) + ((exdays==null) ? "" : "; expires="+exdate.toUTCString());
    document.cookie=name + "=" + value;
}


/*设置cookie*/

/*获取cookie*/

function getCookie(name) {
    var i,x,y,ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++){
        x = ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y = ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x = x.replace(/^\s+|\s+$/g,"");
        if(x == name){
            return unescape(y);
        }
    }
    return false;
}


/*获取cookie*/

/*删除cookie*/

function deleteCookie(name){
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

/*删除cookie*/

/*判断android版本*/
function android(){
    var version = window.navigator.userAgent.match(/android\s*([\d]\.[\d])/i);
    if(version != null){
        return version[1].split('.').join('');
    }else{
        return false;
    }
}
/*判断android版本*/
/*判断android*/
//navigator.userAgent.match(/android/gi) != null
//(/android/ig).test(window.navigator.userAgent)
/*判断android*/

/*判断ios*/
//navigator.userAgent.match(/(iPhone|iPad|iPod|iOS)/gi) != null
//(/(iPhone|iPad|iPod|iOS)/gi).test(window.navigator.userAgent)
/*判断ios*/

/*判断domready*/
var domReady = function(fn){
    if(document.readyState === 'complete'){//要加载完成需要延迟
        fn();
    }else{
        document.addEventListener('readystatechange',function o(){
            if(document.readyState === 'complete'){
                document.removeEventListener('readystatechange',o,false);
                setTimeout(fn, 0);
            }
        },false);
    }
};
/*判断domready*/

/*简易版domready*/
var whenReady = (function() {               //这个函数返回whenReady()函数
    var funcs = [];             //当获得事件时，要运行的函数
    var ready = false;          //当触发事件处理程序时,切换为true
   
    //当文档就绪时,调用事件处理程序
    function handler(e) {
        if(ready) return;       //确保事件处理程序只完整运行一次
       
        //如果发生onreadystatechange事件，但其状态不是complete的话,那么文档尚未准备好
       
        if(e.type === 'readystatechange' && document.readyState !== 'complete') {
            return;
        }
       
        //运行所有注册函数
        //注意每次都要计算funcs.length
        //以防这些函数的调用可能会导致注册更多的函数
        for(var i=0; i<funcs.length; i++) {
            funcs[i]();
        }
        //事件处理函数完整执行,切换ready状态, 并移除所有函数
        ready = true;
        funcs = null;
    }
    //为接收到的任何事件注册处理程序
    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', handler, false);
        document.addEventListener('readystatechange', handler, false);           
        window.addEventListener('load', handler, false);
    }else if(document.attachEvent) {
        document.attachEvent('onreadystatechange', handler);
        window.attachEvent('onload', handler);
    }
    //返回whenReady()函数
    return function rrr(fn) {
        if(ready) {
          fn()
        }else {
          funcs.push(fn);
        }
    }
})();
/*简易版domready*/

/*innerHTML赋值*/
function setHtml(dom,html){
    dom.innerHTML = html;
}
/*innerHTML赋值*/

/*innerHTML取值*/
function getHtml(dom){
    return dom.innerHTML;
}
/*innerHTML取值*/


/*text赋值*/
function $text(el, text){
    if('innerText' in el){
        el.innerText = text;
    }else{
        el.textContent = text;//兼容ff
    }
}
/*text赋值*/

/*localStorage*/
function setLocal(key,val){
    localStorage.setItem(key,val);
}

function getLocal(key){
    return localStorage.getItem(key);   
}

/*localStorage*/

/*获取屏幕宽度和高度*/ 
function getInnerWidth(){
    return window.innerWidth || document.documentElement.clientWidth ||document.body.clientWidth;
}
function getInnerHeight(){
    return window.innerHeight ||document.documentElement.clientHeight || documentoc.body.clientHeight;
}

/*获取屏幕宽度和高度*/

/*设置滚动条距离*/
function setScrollTop(scroll_top) {
    document.documentElement.scrollTop = scroll_top;
    window.pageYOffset = scroll_top;
    document.body.scrollTop = scroll_top;
}

/*设置滚动条距离*/

/*动画封装*/



/*动画封装*/

/*事件兼容*/






