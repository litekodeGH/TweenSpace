

if (TweenSpace === undefined) 
{

var TweenSpace, Tweenspace, TS;
TweenSpace = Tweenspace = TS = (function ()
{
return {

_:{}
};
})();
}

(function (TweenSpace) {

TweenSpace.UI = {};


TweenSpace.UI.Timebar = function (params)
{
return new Timebar(params);
}

function Timebar( params )
{

let _this = this;
let _target;

let _play_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11.2px" height="12.8px" viewBox="0 0 11.2 12.8" style="overflow:visible;" xml:space="preserve"><style type="text/css"> .st0{opacity:0.8;} .st1{fill:none;stroke:#32B47D;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2px;}</style><g id="play_2_" class="st0"> <polygon class="st1" points="0.5,0.5 10.7,6.4 0.5,12.3 "/></g></svg>';

let _pause_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="5.2px" height="12.8px" viewBox="0 0 5.2 12.8" style="overflow:visible;" xml:space="preserve"><style type="text/css"> .st0{opacity:0.8;fill:none;stroke:#32B47D;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2px;}</style><path id="pause_1_" class="st0" d="M0.5,0.5v11.8 M4.7,0.5v11.8"/></svg>';

let _loop_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16.5px" height="16px" viewBox="0 0 16.5 13.2" style="overflow:visible;enable-background:new 0 0 16.5 13.2;" xml:space="preserve"><style type="text/css"> .st0{fill:none;stroke:#32B47D;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><path class="st0" d="M5.9,2.3C3,2.3,0.8,4.6,0.8,7.4v0c0,2.8,2.3,5.1,5.1,5.1h4.8c2.8,0,5.1-2.3,5.1-5.1v0c0-2.8-2.3-5.1-5.1-5.1 l3.1-1.5"/></svg>';

let _once_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15.8px" height="16px" viewBox="0 0 15.8 3.9" style="overflow:visible;enable-background:new 0 0 15.8 3.9;" xml:space="preserve"><style type="text/css"> .st0{fill:none;stroke:#32B47D;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><polyline class="st0" points="0.8,3.2 15.1,3.2 12.7,0.8 "/></svg>';

let _play, _pause, _playing = false, _looping = false, _bbox, _bbox_checked = false;

this.holder = document.createElement('div');
let _playHolder = document.createElement('div');
let _loopHolder = document.createElement('div');
let _barHolder = document.createElement('div');
let _cursorBarHolder = document.createElement('div');
let _cursorBar = document.createElement('div');
let _endSpacer = document.createElement('div');
let _cursor = document.createElement('div');
let _time = document.createElement('div');

this.constructor = new function()
{
_playHolder.innerHTML = _play_svg_string;
_loopHolder.innerHTML = _once_svg_string;

_this.holder.appendChild(_playHolder);
_this.holder.appendChild(_loopHolder);
_cursorBarHolder.appendChild(_cursorBar);
_barHolder.appendChild(_cursorBarHolder);
_barHolder.appendChild(_cursor);
_this.holder.appendChild(_barHolder);
_this.holder.appendChild(_time);
_this.holder.appendChild(_endSpacer);



_this.holder.style.width = '100%';
_this.holder.style.height = '30px';
_this.holder.style.display = 'flex';
_this.holder.style.flexWrap = 'nowrap';

_this.holder.style.position = 'absolute';
_this.holder.style.bottom = '0px';
_this.holder.style.background = 'rgba(71, 77, 83, 0.9)';
_this.holder.style.alignItems = 'center';

_playHolder.style.marginRight = '6px';
_playHolder.style.width = '14px';
_playHolder.style.cursor = 'pointer';
_playHolder.style.height = '16px';
_playHolder.style.padding = '0px 0px 0px 10px';

_loopHolder.style.marginRight = '6px';
_loopHolder.style.height = '16px';
_loopHolder.style.cursor = 'pointer';
_loopHolder.style.padding = '0px 10px 0px 10px';

_barHolder.style.width = '100%';
_barHolder.style.height = '100%';
_barHolder.style.background = 'rgba(51, 57, 63, 0)';
_barHolder.style.cursor = 'pointer';
_barHolder.style.display = 'grid';
_barHolder.style.alignContent = 'center';
_barHolder.style.padding = '0px 0px 0px 0px';

_cursorBarHolder.style.position = 'relative';
_cursorBarHolder.style.width = '100%';
_cursorBarHolder.style.height = '2px';
_cursorBarHolder.style.background = 'rgba(150, 150, 150, 0.5)';
_cursorBarHolder.style.pointerEvents = 'none';
_cursorBarHolder.style.borderRadius = '2px';

_cursorBar.style.height = '2px';
_cursorBar.style.background = 'rgba(50, 180, 125, 0.7)';
_cursorBar.style.borderRadius = '4px';

_cursor.style.position = 'absolute';
_cursor.style.top = '7px';
_cursor.style.width = '4px';
_cursor.style.height = '16px';
_cursor.style.background = 'rgba(50, 180, 125, 0.7)';
_cursor.style.pointerEvents = 'none';
_cursor.style.borderRadius = '4px';
_cursor.style.left = '0px';

_time.style.width = '60px';
_time.style.height = '16px';
_time.style.color = 'white';
_time.style.fontFamily = 'sans-serif';
_time.style.fontSize = '12px';
_time.style.padding = '0px 0px 0px 10px';
_time.style.opacity = 0.5;
_time.style.pointerEvents = 'none';
_time.style.userSelect = 'none';
_time.style.textAlign = 'center';
_time.textContent = '00:00.0';


_endSpacer.style.width = '14px';
_endSpacer.style.height = '16px';

_bbox = _barHolder.getBoundingClientRect();

_playHolder.addEventListener('click', onPlay);
_loopHolder.addEventListener('click', onLoop);

_barHolder.addEventListener('mousedown', function(e)
{
onMouseMove(e);
_bbox = _barHolder.getBoundingClientRect();
_barHolder.addEventListener('mousemove', onMouseMove);
});
document.body.addEventListener('mouseup', function()
{
_barHolder.removeEventListener('mousemove', onMouseMove);
});

window.onresize = onresize;

};


   this.add = function(target)
{
_target = target;
_target.onProgressTimebar = onProgressTimebar;
_target.onCompleteTimebar = onCompleteTimebar;
return this;
}

function onPlay(e)
{
if(_playing == false)
{
if(_target.currentTime() == _target.duration())
_target.play(0);
else
_target.play();

_playing = true;
_playHolder.innerHTML = _pause_svg_string;
}
else
{
_target.pause();
_playing = false;
_playHolder.innerHTML = _play_svg_string;
}
}

function onLoop(e)
{
if(_looping == false)
{
_looping = true;
_loopHolder.innerHTML = _loop_svg_string;
_target.repeat(-1);
}
else
{
_looping = false;
_loopHolder.innerHTML = _once_svg_string;
_target.repeat(0);
}
}

function onMouseMove(e)
{
let playhead = TweenSpace.params.ease.linear( e.offsetX, 0, _target.duration(), Math.round(_bbox.width) );

_cursorBar.style.width = ((playhead)*100/_target.duration())+'%';
_cursor.style.left = Math.round(e.clientX)+'px';
_target.seek(playhead);

}

function onProgressTimebar(e)
{
if(_bbox_checked == false)
{
_bbox = _barHolder.getBoundingClientRect();
_bbox_checked = true;
}

_cursorBar.style.width = ((_target.currentTime())*100/_target.duration())+'%';
_cursor.style.left = Math.round(_bbox.width)*((_target.currentTime())/_target.duration())+_bbox.x+'px';
_time.textContent = msToTime(parseInt(_target.currentTime()));
}

function onresize(e)
{
_bbox_checked = false;
onProgressTimebar();
}

function onCompleteTimebar()
{
if(_looping)
return;

_playHolder.innerHTML = _play_svg_string;
_playing = false;
}

function msToTime(duration)
{
var milliseconds = parseInt((duration%1000)/100)
, seconds = parseInt((duration/1000)%60)
, minutes = parseInt((duration/(1000*60))%60)
, hours = parseInt((duration/(1000*60*60))%24);

hours = (hours < 10) ? "0" + hours : hours;
minutes = (minutes < 10) ? "0" + minutes : minutes;
seconds = (seconds < 10) ? "0" + seconds : seconds;

if( hours == '00' && minutes == '00' )
return seconds + "." + milliseconds;
else if(hours == '00')
return minutes + ":" + seconds + "." + milliseconds;

return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}


return this;
}

})(TweenSpace || {});

(function ( TweenSpace ) {


function Node(value)
{
this.data = value;
this.prev = null;
this.next = null;

return this;
}


TweenSpace._.Node = function(value)
{
return new Node(value);
};

})(TweenSpace || {});

(function ( TweenSpace ) {

function DoublyList()
{
this.head = null;
this.tail = null;

var _length = 0;
var _temp_node;

this.length = function ()
{
return _length;
}

this.push = function (value)
{
if(value==undefined)
return;

_temp_node = (value.__proto__.constructor.name == 'Node')?value:TweenSpace._.Node(value);

if (_length > 0)
{
this.tail.next = _temp_node;
_temp_node.prev = this.tail;
}
else
{
this.head = _temp_node;
this.tail = _temp_node;
}

this.tail = _temp_node;
this.tail.next = this.head;
this.head.prev = this.tail;

_length++;

return _temp_node;
}

this.unshift = function (value)
{
if(value==undefined)
return;

_temp_node = (value.__proto__.constructor.name == 'Node')?value:TweenSpace._.Node(value);

if (_length > 0)
{
this.head.prev = _temp_node;
_temp_node.next = this.head;
}
else
{
this.head = _temp_node;
this.tail = _temp_node;
}

this.head = _temp_node;
this.tail.next = this.head;
this.head.prev = this.tail;

_length++;

return _temp_node;
}


this.insert = function ( new_data, existing_node, before_after_bool )
{
if(new_data == undefined || existing_node == undefined)
return;

new_data = (new_data.__proto__.constructor.name == 'Node')?new_data:TweenSpace._.Node(new_data);

if(before_after_bool == undefined)
before_after_bool = true;
else if( before_after_bool == 'after' )
before_after_bool = true;
else if( before_after_bool == 'before' )
before_after_bool = false;


if( before_after_bool == true)
{
if(existing_node == this.tail)
this.push(new_data);
else
{
new_data.next = existing_node.next;
new_data.prev = existing_node;
existing_node.next = existing_node.next.prev = new_data;

_length++;
}
}

else
{
if(existing_node == this.head)
this.unshift(new_data);
else
{
new_data.next = existing_node;
new_data.prev = existing_node.prev;
existing_node.prev = existing_node.prev.next = new_data;

_length++;
}
}


}

this.remove = function ( node )
{
if( !node )
return null;

if (_length > 1)
{
_temp_node = node.prev.next = node.next;
node.next.prev = node.prev;

if (node == this.head)
this.head = node.next;
if (node == this.tail)
this.tail = node.prev;
}
else
{
this.head = null;
this.tail = null;
}


_length--;
_length = (_length < 0)?0:_length;

return node;
}

this.nodeAt = function ( index )
{
if(index >= _length)
{
console.warn('TweenSpace - DoublyList: index ' + index + ' is out of range.');
return;
}

_temp_node = this.head;

var i = 0;
for(;i<_length;i++)
{
if(i==index)
return _temp_node;

_temp_node = _temp_node.next;
}
}

return this;
}


TweenSpace._.DoublyList = function()
{
return new DoublyList();
};

})(TweenSpace || {});

(function ( TweenSpace ) {



var _this = this;

var _queue_DL = TweenSpace._.DoublyList();

var _queue_paused_DL = TweenSpace._.DoublyList();

var _node = TweenSpace._.Node();

var _node_paused = TweenSpace._.Node();

var _tween = null;

var _delayedCallList = TweenSpace._.DoublyList();

var _delayedCallNode = TweenSpace._.Node();

var _pi = 3.1415926535897932384626433832795;
var _pi_m2 = _pi * 2;
var _pi_d2 = _pi / 2;

var _UID = 0;

var _clamp = function (val, min, max)
{
if(val<min) val = min;
else if(val>max) val = max;

return val;
}

var _getMax = function (array)
{
if(array.length == 0)
return 0;

var max = 0;
var l=0;
for(; l < array.length; l++)
{
if( array[l] > max)
max = array[l];
}

return max;
}

var _getElements = function ( elements )
{
var elementArray = [];

if( elements.constructor === String)
{
var nodeList = document.querySelectorAll(elements);
if( nodeList == null || nodeList == undefined )
return null;

var i = 0;
for(;i < nodeList.length; i++)
elementArray[i] = nodeList.item(i);
}
else if( elements.constructor === Array ) elementArray = elements;
else if( elements.constructor === Object ) elementArray.push(elements);
else elementArray.push(elements);

return elementArray;
}


function _tick_tweens(dt)
{
_tween = null;
   

var j=0;
loop:for (var curr_node = _queue_DL.head; j<_queue_DL.length(); j++)
{
_tween = curr_node.data;

if( _tween.playing() == true )
_tween.tick(dt, true);
else
{
_tween.resetNode();
curr_node = _queue_DL.remove( curr_node );
curr_node = curr_node.next;
}

if(curr_node.next == _queue_DL.head)
break loop;
else
curr_node = curr_node.next;
}

if(_queue_DL.length() <= 0)
TweenSpace.onCompleteAll();
else
TweenSpace.onProgressAll();
}

function _sequential( params, play )
{
var elements, tsParams = {}, delay, tweenDelay, delayInc, duration, tweens = [], shuffle, seed,
fromParamsInc = [], toParamsInc = [], val = 'val', prefix = 'prefix', suffix = 'suffix', valInc = 'valInc';
play = (play != undefined)?play:false;

if( params.shuffle != undefined )
{
shuffle = params.shuffle;
seed = params.seed;
}
else shuffle = false;

if( params.delay != undefined )
delay = params.delay;
else delay = 0;

params.elements = TweenSpace._.alternativeParams('elements', params);
params.duration = TweenSpace._.alternativeParams('duration', params);

if( params.elements != undefined)
{
if( params.duration == undefined )
{
console.warn('TweenSpace.js Warning: Tween() has no duration defined!');
return null;
}
else
{
duration = params.duration;
delayInc = 0;

if( params.tweenDelay == undefined)
{
console.warn('TweenSpace.js Warning: tweenDelay property needs to be defined in order to animate objects sequentially.');
tweenDelay = 0;
}
else
{
tweenDelay = params.tweenDelay;


if(tweenDelay.constructor == String)

if( TweenSpace._.functionBasedValues(0, tweenDelay) == 0)
delayInc = 1;
}   

elements = TweenSpace._.getElements( params.elements );
if( elements.length == 0)
{
console.warn('TweenSpace.js Warning: "sequential()" method has no elements to animate. Either "elements" paramater is empty or assigned value has failed.');
return null;
}

for ( var param in params )
{
paramDefinedLoop:for ( var paramDefined in TweenSpace.params )
{
if( param == paramDefined)
{ 
tsParams[param] = params[param];

break paramDefinedLoop;
}
}
}

var length = elements.length;
if(params.fromParams != undefined)
var clonedFromParams = JSON.parse(JSON.stringify(params.fromParams));
for(var i=0; i<length; i++)
{
if(params.fromParams != undefined)
manageFromToValues(clonedFromParams, fromParamsInc);

manageFromToValues(params, toParamsInc);


function manageFromToValues(inputParams, arrayInc)
{
for ( var param in inputParams )
{

if(inputParams[param].constructor == String)
{

if(inputParams[param].match( /\+=|-=|\*=|\/=/ ) != null)
{
if( arrayInc[param] == undefined)
{
arrayInc[param] = {};
arrayInc[param][prefix] = inputParams[param].match( /\+=|-=|\*=|\/=/ );
arrayInc[param][suffix] = inputParams[param].match( /em|ex|px|in|cm|mm|%|rad|deg/ );
arrayInc[param][val] = parseFloat( inputParams[param].split("=").pop() );
arrayInc[param][valInc] = (arrayInc[param][prefix][0] == '+=' || arrayInc[param][prefix][0] == '-=')?0:1;
}
else
{
arrayInc[param][valInc] = TweenSpace._.functionBasedValues(arrayInc[param][val], inputParams[param] );
inputParams[param] = arrayInc[param][prefix] + String(arrayInc[param][valInc]) + arrayInc[param][suffix];
}
}   
}
} 
} 


for (var param in tsParams)
params[param] = tsParams[param];

params.elements = elements[i];
params.delay = delayInc + delay;
params.duration = duration;

if(clonedFromParams != undefined)
params.fromParams = clonedFromParams;



if( play == true )
{
if(params.onProgress != undefined)
delete params.onProgress;
if(params.onComplete != undefined)
delete params.onComplete;
}
tweens.push( TweenSpace.Tween( params ) );

if(tweenDelay.constructor == String)
delayInc = TweenSpace._.functionBasedValues(delayInc, tweenDelay);
else
delayInc += tweenDelay;

if(clonedFromParams != undefined)
params.fromParams = clonedFromParams;
}

if(shuffle == true)
tweens = shuffleDelay( tweens, seed );

if( play == true )
{
var timeline = TweenSpace.Timeline({tweens:tweens, onProgress:tsParams.onProgress, onComplete:tsParams.onComplete });
timeline.play();
return timeline;
}  
else
return tweens;
}
}
else
{
console.warn('TweenSpace.js Warning: TweenSpace.sequential() has no elements to affect!');
return null;
}


}

function _set( params )
{
params.elements = TweenSpace._.alternativeParams('elements', params);

if(params.elements == undefined )
{
console.warn('TweenSpace.js Warning: Tween() has no elements to affect!');
return null;
}
else
{ 
_elements = TweenSpace._.getElements(params.elements);
delete params.elements;
}

var i = 0, length = _elements.length;
for(; i < length; i++)
{
for ( var param in params )
{   
if(_elements[i].style[param] != undefined)

_elements[i].style[param] = params[param];
else
{

var tempParams = {};
tempParams.elements = _elements[i];
tempParams.duration = 1;
tempParams[param] = params[param];
TweenSpace.Tween( tempParams ).seek(1);
}
}
}
}
function _numberTo( params )
{
var tween;
if( params != undefined )
{
params.elements = TweenSpace._.alternativeParams('elements', params);


params.numberTo = 'numberTo';
if(params.elements != undefined)
{
console.warn('TweenSpace.js Warning: Property "elements" will not be considered by TweenSpace.numberTo() method!');
}
if(params.from == undefined)
{
console.warn('TweenSpace.js Warning: Property "from" needs to be declared with a number value in order to use TweenSpace.numberTo() method!');
return null;
}
if(params.to == undefined)
{
console.warn('TweenSpace.js Warning: Property "to" needs to be declared with a number value in order to use TweenSpace.numberTo() method!');
return null;
}
tween = TweenSpace.to(params);

}
else console.warn('TweenSpace.js Warning: TweenSpace.numberTo() has no arguments!');

return tween;
}

var ease =
{
linear : function ( t, from, to, dur )
{
return (((to-from)*t)/dur) + from;
},
quad:
{
in: function( t, from, to, dur )
{
return (to-from)*(t/=dur)*t + from;
},
out: function( t, from, to, dur )
{
return -(to-from) *(t/=dur)*(t-2) + from;
},
inOut: function( t, from, to, dur )
{
if ((t/=dur/2) < 1) return (to-from)/2*t*t + from;
return -(to-from)/2 * ((--t)*(t-2) - 1) + from;
}
},
cubic:
{
in: function( t, from, to, dur )
{
return (to-from)*(t/=dur)*t*t + from;
},
out: function( t, from, to, dur )
{
return (to-from)*((t=t/dur-1)*t*t + 1) + from;
},
inOut: function( t, from, to, dur )
{
if ((t/=dur/2) < 1) return (to-from)/2*t*t*t + from;
return (to-from)/2*((t-=2)*t*t + 2) + from;
}
},
quart:
{
in: function( t, from, to, dur )
{
return (to-from)*(t/=dur)*t*t*t + from;
},
out: function( t, from, to, dur )
{
return -(to-from) * ((t=t/dur-1)*t*t*t - 1) + from;
},
inOut: function( t, from, to, dur )
{
if ((t/=dur/2) < 1) return (to-from)/2*t*t*t*t + from;
return -(to-from)/2 * ((t-=2)*t*t*t - 2) + from;
}
},
quint:
{
in: function( t, from, to, dur )
{
return (to-from)*(t/=dur)*t*t*t*t + from;
},
out: function( t, from, to, dur )
{
return (to-from)*((t=t/dur-1)*t*t*t*t + 1) + from;
},
inOut: function( t, from, to, dur )
{
if ((t/=dur/2) < 1) return (to-from)/2*t*t*t*t*t + from;
return (to-from)/2*((t-=2)*t*t*t*t + 2) + from;
}
},
sine:
{
in: function( t, from, to, dur )
{
return -(to-from) * Math.cos(t/dur * _pi_d2) + (to-from) + from;
},
out: function( t, from, to, dur )
{
return (to-from) * Math.sin(t/dur * _pi_d2) + from;
},
inOut: function( t, from, to, dur )
{
return -(to-from)/2 * (Math.cos(_pi*t/dur) - 1) + from;
}
},
exp:
{
in: function( t, from, to, dur )
{
return (t==0) ? from : (to-from) * Math.pow(2, 10 * (t/dur - 1)) + from;
},
out: function( t, from, to, dur )
{
return (t==dur) ? from+(to-from) : (to-from) * (-Math.pow(2, -10 * t/dur) + 1) + from;
},
inOut: function( t, from, to, dur )
{
if (t==0) return from;
if (t==dur) return from+(to-from);
if ((t/=dur/2) < 1) return (to-from)/2 * Math.pow(2, 10 * (t - 1)) + from;
return (to-from)/2 * (-Math.pow(2, -10 * --t) + 2) + from;
}
},
elastic:
{
in: function( t, from, to, dur, a, p )
{
var s;
if (t==0) return from;  if ((t/=dur)==1) return from+(to-from);  if (!p) p=dur*.3;
if (!a || a < Math.abs((to-from))) { a=(to-from); s=p/4; }
else s = p/_pi_m2 * Math.asin ((to-from)/a);
return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*dur-s)*_pi_m2/p )) + from;
},
out: function( t, from, to, dur, a, p )
{
var s;
if (t==0) return from;  if ((t/=dur)==1) return from+(to-from);  if (!p) p=dur*.3;
if (!a || a < Math.abs((to-from))) { a=(to-from); s=p/4; }
else s = p/_pi_m2 * Math.asin ((to-from)/a);
return (a*Math.pow(2,-10*t) * Math.sin( (t*dur-s)*_pi_m2/p ) + (to-from) + from);
},
inOut: function( t, from, to, dur, a, p )
{
var s;
if (t==0) return from;  if ((t/=dur/2)==2) return from+(to-from);  if (!p) p=dur*(.3*1.5);
if (!a || a < Math.abs((to-from))) { a=(to-from); s=p/4; }
else s = p/_pi_m2 * Math.asin ((to-from)/a);
if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*dur-s)*_pi_m2/p )) + from;
return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*dur-s)*_pi_m2/p )*.5 + (to-from) + from;
}
},
circ:
{
in: function( t, from, to, dur )
{
var s = 1.70158;
return -(to-from) * (Math.sqrt(1 - (t/=dur)*t) - 1) + from;
},
out: function( t, from, to, dur )
{
var s = 1.70158;
return (to-from) * Math.sqrt(1 - (t=t/dur-1)*t) + from;
},
inOut: function( t, from, to, dur )
{
var s = 1.70158;
if ((t/=dur/2) < 1) return -(to-from)/2 * (Math.sqrt(1 - t*t) - 1) + from;
return (to-from)/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + from;
}
},
bounce:
{
in: function( t, from, to, dur )
{
return (to-from) - ease.bounce.out(dur-t, 0, (to-from), dur) + from;
},
out: function( t, from, to, dur )
{
if ((t/=dur) < (1/2.75))
return (to-from)*(7.5625*t*t) + from;
else if (t < (2/2.75))
return (to-from)*(7.5625*(t-=(1.5/2.75))*t + .75) + from;
else if (t < (2.5/2.75))
return (to-from)*(7.5625*(t-=(2.25/2.75))*t + .9375) + from;
else
return (to-from)*(7.5625*(t-=(2.625/2.75))*t + .984375) + from;
},
inOut: function( t, from, to, dur )
{
if (t < dur/2) return ease.bounce.in (t*2, 0, (to-from), dur) * .5 + from;
else return ease.bounce.out (t*2-dur, 0, (to-from), dur) * .5 + (to-from)*.5 + from;
}
},
back:
{
in: function( t, from, to, dur )
{
var s = 1.70158;
return (to-from)*(t/=dur)*t*((s+1)*t - s) + from;
},
out: function( t, from, to, dur )
{
var s = 1.70158;
return (to-from)*((t=t/dur-1)*t*((s+1)*t + s) + 1) + from;
},
inOut: function( t, from, to, dur )
{
var s = 1.70158;
if ((t/=dur/2) < 1) return (to-from)/2*(t*t*(((s*=(1.525))+1)*t - s)) + from;
return (to-from)/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + from;
}
}
}

function PerlinNoise( amplitude, frequency, seed )
{
if( seed == undefined) seed = 0;

this.amplitude = amplitude;
this.frequency = frequency;

var _this = this;
var _MAX_VERTICES = 256; 
var _MAX_VERTICES_MASK = _MAX_VERTICES -1;
var _vertices = [];
var m = 0x80000000, a = 1103515245, c = 12345, next = seed;
var _xMin, _xMax;

this.constructor = new function()
{
for ( var i = 0; i < _MAX_VERTICES; ++i )
{





next = (((a * (next+i) + c) % m) / m);
if((((a * (next+i) + c) % m) / m)<0.5) next = -next;

_vertices.push( next );
}
}

this.tick = function( x )
{
var scaledX = x * (_this.frequency * 0.01 );
var xFloor = Math.floor(scaledX);
var t = scaledX - xFloor;
var tRemapSmoothstep = t * t * ( 3 - 2 * t );

_xMin = (xFloor & _MAX_VERTICES_MASK);
_xMax = ( _xMin + 1 ) & _MAX_VERTICES_MASK;

var y = _lerp( _vertices[ _xMin ], _vertices[ _xMax ], tRemapSmoothstep );

return y * _this.amplitude;
}

function _lerp(a, b, t )
{
return a * ( 1 - t ) + b * t;
}

return this;
}

function Wave( amplitude, frequency )
{
this.amplitude = amplitude;
this.frequency = frequency;

var _this = this;

this.tick = function( t )
{
return _this.amplitude * Math.sin( (2 * _pi * (_this.frequency*0.001) * t ) );
}

return this;
}

function shuffleDelay(array, seed)
{
if(seed==undefined) seed = 1;

var temp, i=0, j=0;
var length = array.length;
seed = Math.pow(seed+length, 48);

forLoop:for(; i<length;i++)
{
j = (seed % (i+1) + i) % length;
temp=array[i].delay();
array[i].delay( array[j].delay() );
array[j].delay(temp);
}

return array;
}


TweenSpace.to = function( params )
{
var tween = TweenSpace.Tween( params );
tween.play();

return tween;
};

TweenSpace.from = function( params )
{
params[TweenSpace.params.isFrom] = true;
var tween = TweenSpace.Tween( params );
tween.play();

return tween;
};

TweenSpace.fromTo = function( fromParams, toParams )
{
if(toParams == undefined)
{
console.warn("TweenSpace.sequentialFromTo(): Destination values has not been set. Please add an object "+
"with properties as a 2nd parameter. I.e. {css_property:'value'}");

return;
}




for ( var tsProp in TweenSpace.params )
{

if(fromParams[tsProp] != undefined || toParams[tsProp] != undefined)
 {
 toParams[tsProp] = fromParams[tsProp] || toParams[tsProp];
 if(fromParams[tsProp] != undefined)
 delete fromParams[tsProp];
 }
}

toParams[TweenSpace.params.isFrom] = false;
toParams.fromParams = fromParams;


let immediateRender = false;
if(fromParams.immediateRender)
immediateRender = fromParams.immediateRender;

if(toParams.immediateRender)
immediateRender = toParams.immediateRender;

let elements = TweenSpace._.alternativeParams('elements', toParams);
if(immediateRender == true)
{
let object = JSON.parse(JSON.stringify(toParams.fromParams));
object.elements = elements;
TS.set(object);
}


var tween = TweenSpace.Tween( toParams );
tween.play();

return tween;
};

TweenSpace.sequential = function( params )
{
return _sequential( params );
};

TweenSpace.sequentialTo = function( params )
{
return _sequential( params, true );
};

TweenSpace.sequentialFrom = function( params )
{
params[TweenSpace.params.isFrom] = true;
return _sequential( params, true );
};

TweenSpace.sequentialFromTo = function( fromParams, toParams )
{
if(toParams == undefined)
{
console.warn("TweenSpace.sequentialFromTo(): Destination values has not been set. Please add an object "+
"with properties as a 2nd parameter. I.e. {css_property:'value'}");

return;
}


for ( var tsProp in TweenSpace.params )
{

if(fromParams[tsProp] != undefined || toParams[tsProp] != undefined)
 {
 if( fromParams[tsProp] != undefined)
 toParams[tsProp] = fromParams[tsProp]
 else
 toParams[tsProp] = toParams[tsProp]
 
 if(fromParams[tsProp] != undefined)
 delete fromParams[tsProp];
 }
}

toParams[TweenSpace.params.isFrom] = false;
toParams.fromParams = fromParams;

return _sequential( toParams, true );
};

TweenSpace.pauseAll = function()
{
for( ;_queue_DL.length() > 0; )
_queue_DL.head.data.pause();
};

TweenSpace.resumeAll = function()
{
for( ;_queue_paused_DL.length() > 0; )
_queue_paused_DL.head.data.resume();
};

TweenSpace.stopAll = function()
{
for( ;_queue_DL.length() > 0; )
_queue_DL.head.data.stop();

for( ;_queue_paused_DL.length() > 0; )
_queue_paused_DL.head.data.stop();
};

TweenSpace.set = function( params )
{
return _set( params );
};

TweenSpace.params =
{

tweenDelay: 'tweenDelay',
shuffle: 'shuffle',
seed: 'seed',


tweens: 'tweens',


elements: 'elements',
element: 'element',
item: 'item',
items: 'items',
object: 'object',
objects: 'objects',
duration: 'duration',
dur: 'dur',
checkConflict: 'checkConflict',
checkConflicts: 'checkConflicts',
useCSSText: 'useCSSText',
delay: 'delay',
yoyo: 'yoyo',
bounce: 'bounce',
repeat: 'repeat',
loop: 'loop',
loops: 'loops',
timescale: 'timescale',
debug: 'debug',
isFrom: 'isFrom',
from: 'from',
fromParams: 'fromParams', 
immediateRender: 'immediateRender',
ease:
{

linear : ease.linear,
quad:
{
in: ease.quad.in, out: ease.quad.out, inOut: ease.quad.inOut
},
cubic:
{
in: ease.cubic.in, out: ease.cubic.out, inOut: ease.cubic.inOut
},
quart:
{
in: ease.quart.in, out: ease.quart.out, inOut: ease.quart.inOut
},
quint:
{
in: ease.quint.in, out: ease.quint.out, inOut: ease.quint.inOut
},
sine:
{
in: ease.sine.in, out: ease.sine.out, inOut: ease.sine.inOut
},
exp:
{
in: ease.exp.in, out: ease.exp.out, inOut: ease.exp.inOut
},
elastic:
{
in: ease.elastic.in, out: ease.elastic.out, inOut: ease.elastic.inOut
},
circ:
{
in: ease.circ.in, out: ease.circ.out, inOut: ease.circ.inOut
},
bounce:
{
in: ease.bounce.in, out: ease.bounce.out, inOut: ease.bounce.inOut
},
back:
{
in: ease.back.in, out: ease.back.out, inOut: ease.back.inOut
}

},
onProgress: function(){},
onComplete: function(){},
onRepeat: function(){},
effects:
{
to:'to',
wiggle:
{
amplitude:'amplitude',
frequency:'frequency',
seed:'seed'
},
wave:
{
amplitude:'amplitude',
frequency:'frequency'
}
},
svg:
{
drawSVG:'drawSVG',
motionPathSVG:
{
from:'from',
to:'to',
path:'path',
rotationOffset:'rotationOffset',
pivotX:'pivotX',
pivotY:'pivotY',
offsetX:'offsetX',
offsetY:'offsetY',
align:'align'
},
morphSVG:
{
shape:'shape',
debug:'debug',
reverse:'reverse',
shapeIndex:'shapeIndex'
}
}
};

TweenSpace.delayedCall = function( callback, delay )
{
var tempDelayedNode;
var id = setTimeout( function()
{
clearTimeout( id );
_delayedCallList.remove(tempDelayedNode);
callback();
return;
}, delay );
tempDelayedNode = _delayedCallList.push(id);
};

TweenSpace.numberTo = function( params )
{
return _numberTo( params );
};

TweenSpace.killDelayedCalls = function()
{
for( ;_delayedCallList.length() > 0; )
{
clearTimeout( _delayedCallList.head.data );
_delayedCallList.remove(_delayedCallList.head);
}
};


TweenSpace.checkConflict = true;

TweenSpace.immediateRender = false;


TweenSpace.onProgressAll = function()
{};

TweenSpace.onCompleteAll = function()
{};

TweenSpace._.tick_tweens = function(dt)
{
return _tick_tweens(dt);
};
TweenSpace._.getElements = function(elements)
{
return _getElements(elements);
};
TweenSpace._.clamp = function(val, a, b)
{
return _clamp(val, a, b);
};
TweenSpace._.getMax = function(array)
{
return _getMax(array);
};
TweenSpace._.PerlinNoise = function(amplitude, frequency, seed)
{
return new PerlinNoise(amplitude, frequency, seed);
};
TweenSpace._.Wave = function(amplitude, frequency)
{
return new Wave(amplitude, frequency);
};
TweenSpace._.queue_DL = _queue_DL;
TweenSpace._.queue_DL = _queue_DL;
TweenSpace._.queue_paused_DL = _queue_paused_DL;
TweenSpace._.PI = function() { return _pi };


TweenSpace._.functionBasedValues = function (fromVal, toVal)
{
var prefix = toVal.match( /\+=|-=|\*=|\/=/ );
toVal = parseFloat  ( toVal.split("=").pop() );

if( prefix == null )
return null;
else
{
if(prefix[0] == '+=')
return fromVal += toVal;
else if(prefix[0] == '-=')
return fromVal -= toVal;
else if(prefix[0] == '*=')
return fromVal *= toVal;
else if(prefix[0] == '/=')
return fromVal /= toVal;
}
}


TweenSpace._.alternativeParams = function ( paramName, alternativeParams )
{

if(paramName=='elements')
{
return alternativeParams.elements || alternativeParams.element || alternativeParams.item || alternativeParams.items || alternativeParams.object || alternativeParams.objects;
}
else if(paramName=='isFrom')
{
return alternativeParams.isFrom || alternativeParams.from || false;
}
else if(paramName=='repeat')
{
return alternativeParams.repeat || alternativeParams.loop || alternativeParams.loops || 0;
}
else if(paramName=='yoyo')
{
return alternativeParams.yoyo || alternativeParams.bounce || false;
}
else if(paramName=='duration')
{
return alternativeParams.duration || alternativeParams.dur;
}
else if(paramName=='checkConflict')
{
if( alternativeParams.checkConflict != undefined)
return alternativeParams.checkConflict;
else if( alternativeParams.checkConflicts != undefined)
return alternativeParams.checkConflicts;
 
return undefined;
}
}

TweenSpace._.checkParam = function (param)
{
for (let prop in TweenSpace.params)
{
if(param == prop)
return true;
}

return false;
}

TweenSpace._.UID = function ( )
{
return _UID++;
}


TweenSpace._.counter = 0;

TweenSpace.version = '1.9.92.0'; 

TweenSpace.debug = false;


})(TweenSpace || {});

(function ( TweenSpace )
{

var _isEngineOn = false;

var _eTime = 0;

var _dt = 0;

var _dt_accum = 0;

var _interval = 16.67;

var _min_interval = 1;

var _max_interval = 34;

var _tickCounter = 0;

var _start_time = 0;

var _now;

var _then = 0;

var _reqID = 0;


var _requestAnimationFrame =window.requestAnimationFrame ||
window.mozRequestAnimationFrame || 
window.webkitRequestAnimationFrame ||
window.msRequestAnimationFrame,
_cancelAnimationFrame = window.cancelAnimationFrame ||
window.mozCancelAnimationFrame || 
window.webkitCancelAnimationFrame ||
window.msCancelAnimationFrame;

var _queue_DL, _tick_tweens;



TweenSpace._.tickCounter = function()
{
return _tickCounter;
}

TweenSpace._.dt = function(dt)
{
if(dt) _dt = dt;
return _dt;
}

TweenSpace._.interval = function()
{
return _interval;
}

TweenSpace._.engine = function()
{

if( _isEngineOn == false )
{
_isEngineOn = true;
_tickCounter = _eTime = _dt = _dt_accum = 0;
_start_time = _then = window.performance.now();

_queue_DL = TweenSpace._.queue_DL;
_tick_tweens = TweenSpace._.tick_tweens;


 _requestAnimationFrame(tick);
}
}

function tick(now)
{


if(!_then) 
_start_time = _then = now;


_dt = now - _then;
_then = now;


if(_dt > _min_interval && _dt < _max_interval)
{
_dt += _dt_accum;
_dt = (_dt<0)?0:_dt;
_tick_tweens(_dt);
_dt_accum = 0;


}
else
{
_dt_accum += _dt;
}

_cancelAnimationFrame(_reqID);
if( _queue_DL.length() > 0 )
{
_reqID = _requestAnimationFrame(tick);
}
else
{

_isEngineOn = false;
_eTime = 0;
_dt = 16.67;
}







_tickCounter++;



}


document.addEventListener("visibilitychange", TweenSpaceOnVizChange);
function TweenSpaceOnVizChange(e)
{
if(document.visibilityState == 'hidden')
setTimeout( function() { TweenSpace.pauseAll(); }, 16.67);
else
setTimeout( function() { TweenSpace.resumeAll(); }, 16.67);
}

})(TweenSpace || {});

(function (TweenSpace) {


TweenSpace.Tween = function (params)
{
return new Tween(params);
}


function Tween( params )
{

var _this = this;

var _node;

var _elements;

var _props = {};

var _options = {};

var _dur_init;

var _isNumberTo = false;
var _numberTo = 0;

params.elements = TweenSpace._.alternativeParams('elements', params);


if(params.elements == undefined)
{
if(params.numberTo == undefined)
{
console.warn('TweenSpace.js Warning: Tween() has no elements to affect!');
return null;
}
}

if(params.numberTo != undefined)
{
_elements = [0];
_isNumberTo = true;
}
else
_elements = TweenSpace._.getElements(params.elements);



params.duration = TweenSpace._.alternativeParams('duration', params);
if( params.duration == undefined )
{
console.warn('TweenSpace.js Warning: Tween() has no duration defined!');
return null;
}
else
{
_dur_init = params.duration;

}

params.isFrom = TweenSpace._.alternativeParams('isFrom', params);
params.repeat = TweenSpace._.alternativeParams('repeat', params);
params.yoyo = TweenSpace._.alternativeParams('yoyo', params);


var _fromProps;
if(params.fromParams != undefined)
{
_fromProps = params.fromParams;
delete params.fromParams;
}


paramLoop:for ( var param in params )
{
var isCSS = true;
paramDefinedLoop:for ( var paramDefined in TweenSpace.params )
{


if( param == paramDefined)
{ 
_options[param] = params[param];
isCSS = false;


break paramDefinedLoop;
}
else
{

var effectFound = false;
effectLoop:for ( var effect in TweenSpace.params.effects )
{
if( param == effect)
{
effectFound = true;

var effectObjects = {};
effectObjects[param] = {};
var effectProps = [];


effectParamLoop:for ( var effectParam in params[param] )
{
var effectParamFound = false;
effectParamDefinedLoop:for ( var effectParamDefined in TweenSpace.params.effects[param] )
{
if( effectParam == effectParamDefined )
{
effectObjects[param][effectParam] = params[param][effectParam];
effectParamFound = true;
break effectParamDefinedLoop;
}
}
if(effectParamFound==false)
effectProps.push( {prop:effectParam, val:params[param][effectParam]} );
}

var m = effectProps.length;
for ( ;m--; )
{
var newEffectObj = {};
for ( var effectObjProp in effectObjects )
{
newEffectObj[effectObjProp] = effectObjects[effectObjProp];
}
newEffectObj['to'] = effectProps[m].val;
_props[effectProps[m].prop] = newEffectObj;
}

if(_isNumberTo == true && param == 'to')
{}
else
{
isCSS = false;

break paramDefinedLoop;
}
}
}
}

}

if(isCSS == true)
_props[param] = params[param];
}



var _reversed = false;

var _reversed_repeat = false;

var _repeat_counter = 0;

var _repetitions = 0;

var _paused = false;

var _delay = _options.delay || 0;

var _delay_init = _delay;

var _durExtended_init = _dur_init;

var _duration = _dur_init;

var _durRepeat_init = 0;

var _durationRepeat = 0;

var _durationTotal = _dur_init;

var _timescale = _options.timescale || 1;

var _mTime = -(_delay-0.000001);
var _last_mTime = -1;

var _dTime = 0;

var _sTime = 0;

var _subTweens = [];

var _timelineParent = null;

var _useDelay = ( _delay > 0 ) ? true : false;

var _useCSSText = _options.useCSSText || false;

var _yoyo = _options.yoyo || false;

var _playing = false;

var _checkDestValue = false;

var _repeat = _options.repeat || 0;

var _keyTween = false;

var _checkConflict = TweenSpace._.alternativeParams('checkConflict', _options); 

var _immediateRender = _options.immediateRender;

var _isFrom = _options.isFrom || false;

var _UID = TweenSpace._.UID();

var _currentPropValues = new PropValues();

var _isUpdateTo = false;


this.isCSSText = function(){return _useCSSText;};

this.UID = function(){return _UID;};

this.resetNode = function()
{
_node = undefined;
};

this.onComplete = _options.onComplete || undefined;
this.onCompleteTimebar = undefined;

this.onProgress = _options.onProgress || undefined;
this.onProgressTimebar = undefined;

this.onRepeat = _options.onRepeat || undefined;

this.ease = _options.ease || TweenSpace.params.ease.quad.inOut;

this.elements = this.element = this.item = this.items = this.object = this.objects = function()
{
return _elements;
};

this.numberTo = function()
{
return _numberTo;
};

this.currentTime = function()
{
return _mTime;
};

this.checkConflict = function(value)
{
if( value != undefined )
_checkConflict = value;

return _checkConflict;
}; 

this.delay = function(value)
{
if( value != undefined )
{
_delay_init = _delay = value;
_mTime = -(_delay);
_useDelay = ( _delay > 0 ) ? true : false;

}


return _delay;
};

this.playing = function(playing)
{
if(playing == true) playing = true;
else playing = false;

return _playing;
};

this.useDelay = function(value)
{
if( value != undefined )
_useDelay = value;

return _useDelay;
};

this.repeat = function(value)
{
if( value != undefined )
{
_repeat = value;
_reset();
}

return _repeat;
};


this.repeatCounter = function()
{
return _repeat_counter;
};


this.yoyo = function(value)
{
if( value != undefined )
_yoyo = value;

return _yoyo;
};

this.timelineParent = function(value)
{
if( value != undefined )
_timelineParent = value;

return _timelineParent;
};

this.duration = function(value)
{
if( value != undefined )
{
_durationTotal = _durExtended_init = _dur_init = _duration = value;
_reset();
}

return _duration;
};

this.durationRepeat = function()
{
return _durationRepeat;
};

this.durationTotal = function( value )
{
if( value != undefined )
_durationTotal = value;

return _durationTotal;
};

this.timescale = function( value )
{
if( value )
{
_mTime = (_mTime/_timescale)*value;
_timescale = value;
_delay = _delay_init * _timescale;
_duration = _dur_init * _timescale;
_durationTotal = _durExtended_init * _timescale; 
_durationRepeat = _durRepeat_init * _timescale; 
}

return _timescale;
};

this.constructor = new function()
{
_reset();

var i = _elements.length;
for(;i--;)
_subTweens.push( new SubTween( _elements[i], _props ) );
};

this.play = function( playhead )
{
_adjustPlayhead( playhead );
_playback( playhead, true );

return _this;
};

this.resume = function( playhead )
{
_adjustPlayhead( playhead );
_playback( playhead, !_reversed );

return _this;
};

this.reverse = function( playhead )
{
_adjustPlayhead(playhead);
_playback( playhead, false ); 

return _this;
};

this.pause = function( playhead )
{
_pauseQueue();
if(playhead)
_this.seek( playhead );

return _this;
};

this.stop = function( playhead )
{
_adjustPlayhead(playhead);
_stopQueue();

_this.seek( playhead );

return _this;
};

this.seek = function( playhead, updateDOM, doTick )
{
if(doTick == undefined)
doTick = true;

if( playhead != undefined )
{
if( _adjustPlayhead(playhead) != undefined )
{   
if(doTick==true)
{
_this.tick(16.67, false, updateDOM);
}

}
}
};
this.tick_logic = function( playhead, setInitValues, prop, subtween, checkConflict )
{
if( playhead != undefined )
{
if( _adjustPlayhead(playhead) != undefined )
{   
_tick_logic(TweenSpace._.interval());
}
}
};

this.paused = function()
{
return _paused;
};

this.reversed = function( bool )
{
if( bool != undefined )
_reversed = bool;

return _reversed;
};

this.updateTo = function( props )
{
_isUpdateTo = true;
_this.pause();
_updateSubTweenProps(props);
_this.play(0);
};

this.tick = function(dt, useCallbacks, updateDOM)
{


if(TweenSpace.debug == false  && _playing == true)
_tick_delta(dt);
else if(TweenSpace.debug == true)
{
_playing = false;
_adjustPlayhead(_durationTotal);
}

_tick_logic(TweenSpace._.interval()); 



if(_timelineParent != null && _timelineParent != undefined && _playing == false)
{
_last_mTime = _mTime;
_this.tick_draw(_dTime, false, updateDOM);
}
else
{

if( _mTime >= _sTime && _mTime <= _durationRepeat ) 
{

if( _dTime == _sTime || (_last_mTime < 0 && _mTime >= 0)) 
{

if( _reversed == false )  
{
_manageConflicts();




if(_shouldCheckConflicts() == false)
_updateNewInitValues();
}
}

else if( _last_mTime <  _durationTotal && _mTime >= _durationTotal)
{

}

_last_mTime = _mTime;
_this.tick_draw(_dTime, false, updateDOM);

}
else
{



}
}

if(_dTime>_durationRepeat)
{
if(_checkDestValue == true)
{
ensureInitDestValues(updateDOM);
_checkDestValue = false;
}
}
 
if(useCallbacks==true)
_manageCallbacks();
};

function ensureInitDestValues(_updateDOM)
{
if(_checkDestValue == true)
{
if( _mTime <= _sTime )
{
_this.tick_draw(_sTime, false, _updateDOM);
}
else if( _mTime >= _durationRepeat)
{
_this.tick_draw(_durationRepeat, false, _updateDOM);
}

_checkDestValue = false;
}


}


this.tick_draw = function( time, setInitValues, updateDOM )
{  
var i = _subTweens.length, j, subtween, prop, 
subtween_element, subtween_element_style, subtween_props,
subtween_values_DL, subtween_values_node,
subtween_values_node_data, cssText = "";  

for( ;i--; )
{
subtween = _subTweens[i];
subtween_element = subtween.element;
subtween_element_style = subtween.elementStyle;
subtween_props = subtween.props;
subtween_values_DL = subtween.values_DL;
j = subtween_values_DL.length();
subtween_values_node = subtween_values_DL.head;

for ( ;j--; )
{   
subtween_values_node_data = subtween_values_node.data;
prop = subtween_values_node_data.prop;

   
if( subtween_values_node_data.halted == false )
{
if(updateDOM==false)
{
subtween.tick_prop(prop, time, setInitValues);
}
else
{
cssText = this.tick_draw_prop(prop, time, setInitValues, subtween, cssText);
}
}

subtween_values_node = subtween_values_node.next;
}

if(_useCSSText && updateDOM!=false)
subtween_element_style.cssText = cssText;
}
};
this.tick_draw_prop = function(prop, time, setInitValues, subtween, cssText)
{
_dTime = time;

if( prop == TweenSpace.params.svg.drawSVG )
{
var drawValues = subtween.tick_prop(prop, _dTime, setInitValues);
subtween.elementStyle.strokeDashoffset = drawValues[0];

if(drawValues.length > 2)
subtween.elementStyle.strokeDasharray = drawValues[1]+', '+drawValues[2];
else
subtween.elementStyle.strokeDasharray = drawValues[1];
}
else if( prop == 'motionPathSVG' )
{
subtween.elementStyle.transformOrigin = (subtween.props[prop]['pivotX'])+'px '+(subtween.props[prop]['pivotY']+'px ');
subtween.elementStyle.transform = subtween.tick_prop(prop, _dTime, setInitValues);
}
else if( prop == 'morphSVG' )
subtween.element.setAttribute('d', subtween.tick_prop(prop, _dTime, setInitValues) );
else if( prop == 'numberTo' )
{
_numberTo = subtween.tick_prop(prop, _dTime, setInitValues);
}
else
{

if(subtween.element.constructor == Object)
subtween.element[prop] = subtween.tick_prop(prop, _dTime, setInitValues);

else
{
if(_useCSSText)
cssText += prop +":"+ subtween.tick_prop(prop, _dTime, setInitValues)+";";
else
{
subtween.elementStyle[prop] = subtween.tick_prop(prop, _dTime, setInitValues);







}
}




}

return cssText;

}

this.destroy = function()
{
var parent;
while( _elements.length > 0 )
{
parent = _elements[0].parentElement;
if( parent == null )
return;
parent.removeChild( _elements[0] );
_elements.splice(0, 1);
}
};

this.keyTween = function(value)
{
if( value != undefined )
_keyTween = value;

return _keyTween;
};

this.subTweens = function()
{
return _subTweens;
};

function _manageCallbacks()
{
if( _mTime >= _sTime && _mTime <= _durationRepeat ) 
{

if( _this.onProgress )
_this.onProgress();

if( _this.onProgressTimebar )
_this.onProgressTimebar();

if( _playing == false )
{
if( _this.onComplete )
_this.onComplete();
}

if( _playing == false )
{
if( _this.onCompleteTimebar )
_this.onCompleteTimebar();
}

}


if( _keyTween == true )
{
if( _this.timelineParent().onProgress != undefined )
_this.timelineParent().onProgress();

if( _this.timelineParent()._onProgress != undefined )
_this.timelineParent()._onProgress( _this.currentTime() + _this.delay() );

if( _this.timelineParent().onProgressTimebar != undefined )
_this.timelineParent().onProgressTimebar();

if(_playing == false)
{
if( _this.timelineParent().onComplete != undefined )
_this.timelineParent().onComplete();

if( _this.timelineParent().onCompleteTimebar != undefined )
_this.timelineParent().onCompleteTimebar();

if(_timelineParent != null)
_timelineParent._.manageRepeatCycles();


}
}


}
function _updateInitProps()
{   
var i = _elements.length;
for(;i--;)
_subTweens[i].manageSubTween(true);
}

function _reset()
{
_repeat = (_repeat<0)?Number.MAX_SAFE_INTEGER:_repeat;
_durationTotal = _durationRepeat = _durRepeat_init = _durExtended_init = (_repeat * _duration) + _duration;
_this.timescale(_timescale);
}

function _adjustPlayhead( playhead )
{
if(playhead  != undefined )
{
if(playhead < 0 )
{
if(_timelineParent == null )
{
_delay = -playhead;
if(_delay < _delay_init)
console.warn('TweenSpace.js Warning: delay property has been changed from '+_delay_init+'ms to '+_delay+'ms.');
}
}
else if(playhead > _durationTotal)
{ 
if(_timelineParent == null )
console.warn('TweenSpace.js Warning: playhead '+playhead+'ms is greater than duration. Playhead has been set to '+_durationTotal+'ms.');

playhead = _durationTotal;
}

_manageRepeatCycles();


_mTime = playhead+0.000000001;
}

return playhead;
}
this.adjustPlayhead = function(playhead)
{
_adjustPlayhead( playhead );
};

function _tick_delta(dt)
{

if(_reversed == false)
_mTime += dt;

else
_mTime -= dt;


}

function _tick_logic(dt)
{

if( _mTime < _sTime)
{
if( (_reversed == true && _useDelay == false) )
{
_mTime = _sTime;
_playing = false;
}

if( _mTime <= -_delay )
{
_mTime = -_delay;
_playing = false;
}

_dTime = _sTime;
}
else if( _mTime >= _sTime && _mTime <= _durationTotal )
{
if( _useDelay == true && _timelineParent == null)
_useDelay = false;

_dTime = _mTime;
}
else if( _mTime > _durationTotal )
{
_dTime = _mTime = _durationTotal;
_playing = false;
}



_manageRepeatCycles();
}

function _manageRepeatCycles()
{
if( _repeat > 0 )
{
if( _mTime >= _durationRepeat )
_dTime = _durationRepeat;

_repetitions = parseInt(_dTime / _duration);
_repetitions = (_repetitions<=_repeat)?_repetitions:_repeat;

if(_repeat_counter != _repetitions)
{
if( _this.onRepeat != undefined )
_this.onRepeat();

_repeat_counter = _repetitions;
}

if(_yoyo==true)
{
_reversed_repeat = (_repetitions%2==0) ? false : true;

_dTime = ( _reversed_repeat == false ) ? _dTime%_duration : Math.abs((_mTime%_duration)-_duration);

if(_mTime>=_durationRepeat)
{
if( _reversed_repeat == false )
_dTime = _durationRepeat;
else
_dTime = _sTime;
}
else if( _mTime < _sTime)
{


}



}
else
{


_reversed_repeat = false;
_dTime = (_mTime>=_durationRepeat)?_durationRepeat:_dTime%_duration;
}



}
}

function _updateSubTweenProps( newProps )
{

for ( var newProp in newProps )
{
if( TweenSpace._.checkParam(newProp) == true )
{
_duration = _dur_init = params.duration = _durationTotal = TweenSpace._.alternativeParams('duration', newProps);
this.onProgress = TweenSpace._.alternativeParams('onProgress', newProps);
this.onComplete = TweenSpace._.alternativeParams('onComplete', newProps);

params.isFrom = TweenSpace._.alternativeParams('isFrom', params);
params.repeat = TweenSpace._.alternativeParams('repeat', params);
params.yoyo = TweenSpace._.alternativeParams('yoyo', params); 

_yoyo = params.yoyo;
_repeat = params.repeat;

delete newProps[newProp];
}
}

newPropsLoop:for ( var newProp in newProps )
{
var p = _subTweens.length;
tweensLoop:for(;p--;)
{
var found = false;
oldPropsLoop:for ( var oldProp in _subTweens[p].props )
{
if( newProp == oldProp)
{

_subTweens[p].props[oldProp] = newProps[newProp];
_subTweens[p].manageSubTween(true);
found = true;

break oldPropsLoop;
}
}
if( found == false)
{

_subTweens[p].props[newProp] = newProps[newProp];
_subTweens[p].manageSubTween(true);
}
}
}
}

function _pauseQueue()
{
if( _paused == false )
_node = TweenSpace._.queue_paused_DL.push( TweenSpace._.queue_DL.remove(_node) );

_paused = true;
_playing = false;
}

function _stopQueue()
{
if(_paused == false)
TweenSpace._.queue_DL.remove(_node);
else
TweenSpace._.queue_paused_DL.remove(_node);

_node = undefined;
_paused = _playing = false;
}

function _playback( playhead, direction )
{
if( _reversed == direction )
_reversed = !direction;

if(_node == undefined)
{
_node = TweenSpace._.queue_DL.push( _this );
}
else
{
if( _paused == true )
{
_node = TweenSpace._.queue_paused_DL.remove( _node );

_node.data = _this;
_node = TweenSpace._.queue_DL.push( _node );
}
}

_manageImmediateRender();
_unhaltSubTweens();

_paused = false;
_playing = true;
_checkDestValue = true;


if(playhead!=undefined)
_this.tick_draw(-_delay, true, false);



TweenSpace._.engine();
}
function _unhaltSubTweens()
{
var i = _subTweens.length;
for(;i--;)
for( var prop in _subTweens[i].props )
_subTweens[i].values[prop].halted = false;
}


function _updateNewInitValues()
{
var i = _subTweens.length;
for(;i--;)
_subTweens[i].resetValues();

_updateInitProps();
}


function _checkConflicts()
{
var i = _subTweens.length, j = 0, k = 0;

var queue_length = TweenSpace._.queue_DL.length();
var currNode = TweenSpace._.queue_DL.head;
var tempNode;


for(;i--;)
{

for(j=0;j<queue_length;j++)
{
k = currNode.data.subTweens().length;



for(;k--;)
{
currNode.data.subTweens()[k];


if( _subTweens[i].UID() > currNode.data.subTweens()[k].UID() )

if( _subTweens[i].element == currNode.data.subTweens()[k].element )
{

for( var this_prop in _subTweens[i].props )
{
for( var curr_prop in currNode.data.subTweens()[k].props )
{
if(this_prop == curr_prop)
{


currNode.data.subTweens()[k].values[curr_prop].halted = true;
}
else
currNode.data.subTweens()[k].values[curr_prop].halted = false;
}
}
}
}

tempNode = currNode.next;
currNode = tempNode;
}
}
}


function _manageConflicts()
{
if( _checkConflict == undefined )
{
if( TweenSpace.checkConflict == true )
{
_updateInitProps();
_checkConflicts();
}
}
else if( _checkConflict == true )
{
_updateInitProps();
_checkConflicts();
}
}

function _shouldCheckConflicts()
{
if( _checkConflict == undefined )
{
if( TweenSpace.checkConflict == true )
{
return true;
}
}
else if( _checkConflict == true )
{
return true;
}

return false;
}

function _manageImmediateRender()
{
if( _immediateRender == undefined )
{
if( TweenSpace.immediateRender == true )
_this.tick_draw(_dTime);
}
else if( _immediateRender == true )
{
_this.tick_draw(_dTime);
}   
}

function SubTween(element, props)
{
var _st_this = this;

var _UID = TweenSpace._.UID();
this.element = element;
this.elementStyle = element.style;
this.props = props;

this.values = {};
this.creationValues = {};
this.values_DL;



this.UID = function(){return _UID;};


this.tick_prop = function( property, elapsedTime, setInitValues )
{



var _prop_values = _st_this.values[property];
var _names = _prop_values.names;


var _toValues = (_isFrom === true) ? ((setInitValues==true)?_prop_values.initValues:_prop_values.fromValues) : _prop_values.toValues;
var _fromValues = (_isFrom === true) ? _prop_values.toValues : ((setInitValues==true)?_prop_values.initValues:_prop_values.fromValues);
var _units = _prop_values.units;
var _effects = _prop_values.effects;
var toLength, value, last_value, effectValue, rotate = 0;
var result = '', newValues = '';
var _transform = _prop_values.transform;
var _min = 0, _max = 0;






var w;
if( property == 'transform' || property=='filter' )
{
for(var prop in _transform)
{
var _prop_transform = _transform[prop];

toLength = _prop_transform.toValues.length;
newValues = '';

for(w=0; w < toLength; w++)
{
var _trans_prop_from;

if(setInitValues == true)
_trans_prop_from = _prop_transform.initValues[w];
else
_trans_prop_from = _prop_transform.fromValues[w];
   
value = _this.ease( Math.min(elapsedTime, _duration),
_trans_prop_from,
_prop_transform.toValues[w],
_duration );

if( _effects != undefined )
{
for ( var tweenEffects in _effects )
{
if( elapsedTime/_duration <= 0.1 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( elapsedTime, 0, 1, _duration*0.1 );
else if( elapsedTime/_duration >= 0.9 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( _duration-Math.min(elapsedTime, _duration), 0, 1, _duration*0.1 );
else 
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration));

value += effectValue;
}
}

newValues += String( value )+_prop_transform.units[w];

if(w<toLength-1) newValues += ',';
}
result += prop+'('+newValues+') ';
}
}
else if( property == TweenSpace.params.svg.drawSVG )
{
toLength = _toValues.length;
newValues = '';
result = [];
for(w=0; w < toLength; w++)
{


value = _this.ease( Math.min(elapsedTime, _duration), _fromValues[w], _toValues[w], _duration );
if(w!=1)
{
if( _effects != undefined )
{
for ( var tweenEffects in _effects )
{
if( elapsedTime/_duration <= 0.1 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( elapsedTime, 0, 1, _duration*0.1 );
else if( elapsedTime/_duration >= 0.9 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( _duration-Math.min(elapsedTime, _duration), 0, 1, _duration*0.1 );
else 
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration));

value += effectValue;
}
}
}

result.push( value+_units[w] );
}
}
else if( property == 'motionPathSVG' )
{
value = _this.ease( TweenSpace._.clamp( elapsedTime, 0, _duration), _fromValues[0], _toValues[0], _duration );
last_value = _this.ease( TweenSpace._.clamp( elapsedTime-TweenSpace._.dt(), 0, _duration), _fromValues[0], _toValues[0], _duration );

if( _effects['align'] == true )
{
if( _fromValues[0] == value)
{ 

}
else if( _toValues[0] == value)
{ 

}
else
{
_effects['p1'].x = _effects['path'].getPointAtLength( value )['x'];
_effects['p1'].y = _effects['path'].getPointAtLength( value )['y'];
_effects['p2'].x = _effects['path'].getPointAtLength( last_value )['x'];
_effects['p2'].y = _effects['path'].getPointAtLength( last_value )['y'];
}

rotate = Math.atan2(_effects['p2'].y - _effects['p1'].y, _effects['p2'].x - _effects['p1'].x) * (180 / TweenSpace._.PI());
}

result ='translate('+(_effects['path'].getPointAtLength( value )['x']-_effects['pivotX']+_effects['offsetX'])+'px,'
+(_effects['path'].getPointAtLength( value )['y']-_effects['pivotY']+_effects['offsetY'])+'px)'+
' rotate('+(_effects['rotationOffset']+rotate)+_effects['rotationOffsetUnits']+')';
}
else if( property == 'morphSVG' )
{
var currentPathArray = [];
var length = _fromValues.length;
var i = 0, j = 0;

for(;i<length;i++)
{
var currentSegmentArray = [];

var length2 = _fromValues[i].length;
for(j = 0; j<length2; j++)
{   
if(j>0)
currentSegmentArray.push( _this.ease( Math.min(elapsedTime, _duration), parseFloat(_fromValues[i][j]), parseFloat(_toValues[i][j]), _duration ) );
else
currentSegmentArray.push( _toValues[i][j] );
}

currentPathArray.push(currentSegmentArray);
}

result = TweenSpace.SVG.path.toString(currentPathArray);
}
else if( property == 'numberTo' )
{
result = _this.ease( Math.min(elapsedTime, _duration), _fromValues[0], _toValues[0], _duration );
}
else
{
if(_toValues.constructor != Array)
if(isNaN(parseFloat(_toValues)) == false)
_toValues = [parseFloat(_toValues)];

w = toLength = _toValues.length;
newValues = '';


if(_fromValues.constructor != Array)
if(isNaN(parseFloat(_fromValues)) == false)
_fromValues = [parseFloat(_fromValues)];


for(w=0; w < toLength; w++)
{

   
value = _this.ease( Math.min(elapsedTime, _duration), parseFloat(_fromValues[w]), parseFloat(_toValues[w]), _duration );

if( _effects != undefined )
{
for ( var tweenEffects in _effects )
{
if( elapsedTime/_duration <= 0.1 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( elapsedTime, 0, 1, _duration*0.1 );
else if( elapsedTime/_duration >= 0.9 )
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration)) * _this.ease( _duration-Math.min(elapsedTime, _duration), 0, 1, _duration*0.1 );
else 
effectValue = _effects[tweenEffects].tick( Math.min(elapsedTime, _duration));

if( _names )
if( _names.match(/rgb/i) )
{
effectValue = (effectValue<0)?-effectValue:effectValue;
if(w==3)
effectValue = _this.ease( effectValue, 0, 1, _effects[tweenEffects].amplitude * _fromValues[w] );
}

value += effectValue;
}
}


if( _names )
{
if( _names.match(/rgb/i) )
{
if(w<3)
value = parseInt(value);
}
}



newValues += String( value ) + _units[w];
if(w<toLength-1) newValues += ',';


}

if( _names ) result = _names+'('+newValues+')';
else result = newValues;



}




return result;

};


this.manageSubTween = function (checkConflict, checkConflictProp)
{
var length = 0, q = 0, r = 0;
var matchResult, inputPropString, initTransform, transform, initProp;
var newPropVals = new PropValues();
this.values_DL = TweenSpace._.DoublyList();




var nameMatch, name, initName, rgb;


var styles;
if( _isNumberTo == true )
styles = {};
else
{
if(this.element.constructor == Object)
styles = this.element;
else
{
styles = {};

forLoopInitProps:for ( var p in this.props )
{


if(this.props[TweenSpace.params.svg.drawSVG] !== undefined)
styles = window.getComputedStyle(this.element, null);
else if( this.element.style[p] == "" )
{
styles = window.getComputedStyle(this.element, null);
break forLoopInitProps;
}
else
styles[p] = this.element.style[p];
}
}
}

var props_value;
for ( var prop in this.props )
{


initProp = undefined;
props_value = this.props[prop];


if( props_value.constructor === Object )
{
newPropVals.effects = {};

if( props_value['wiggle'] != undefined )
newPropVals.effects['wiggle'] = TweenSpace._.PerlinNoise(props_value['wiggle'].amplitude, props_value['wiggle'].frequency, props_value['wiggle'].seed);
else if( props_value['wave'] != undefined )
newPropVals.effects['wave'] = TweenSpace._.Wave(props_value['wave'].amplitude, props_value['wave'].frequency);

if( props_value['to'] != undefined )
inputPropString = String( props_value['to'] );
else
inputPropString = styles[prop];

if( props_value['from'] != undefined )
initProp = String( props_value['from'] );
}
else
inputPropString = String(props_value);

newPropVals.names = [], newPropVals.fromValues = [], newPropVals.toValues = [], newPropVals.units = [], newPropVals.initValues = '';



if(_fromProps!=undefined)
{
if( _fromProps[prop].match( /\+=|-=|\*=|\/=/ ) == null )
initProp = _fromProps[prop];
else
{
var newInitProp = TweenSpace._.functionBasedValues( parseFloat(styles[prop]), _fromProps[prop] );
var lastInitProp = parseFloat(styles[prop]);

if(this.values[prop] == undefined)
initProp = newInitProp;
else if (this.values[prop] != undefined && lastInitProp == parseFloat(styles[prop]))
initProp = lastInitProp;
else
initProp = newInitProp;


}
}
else
{

if( initProp == undefined)
{
if( this.values[prop] == undefined )
{
initProp =  newPropVals.initValues = styles[prop];
}
else
{
if(checkConflict == true)
{
if(_isFrom == false )
{
if(inputPropString != undefined)
if(inputPropString.match( /\+=|-=|\*=|\/=/ ) != null)
initProp = this.values[prop].initValues;
else
initProp = styles[prop];
}
else
{
initProp = this.values[prop].initValues;
}
}
else
initProp = newPropVals.initValues = this.values[prop].initValues;

if( checkConflictProp )
if( checkConflictProp != prop )
initProp = this.values[prop].fromValues;
}
}
}

nameMatch = name = initName = rgb = '';
if( prop == 'transform' || prop == 'filter' )
{
var regex = /(\w+)\((.+?)\)/g, match;
transform = {};
initTransform = {};


var initTransformString;

if(this.element.style.transform != '')
initTransformString = this.element.style.transform;
else
initTransformString = initProp;

if( initTransformString != '' )
{
while(match = regex.exec(initTransformString))
initTransform[ match[1] ] = { fromValues:String(match[2]).split(',') };
}


while(match = regex.exec(inputPropString))
{

transform[ match[1] ] = { fromValues:[], toValues:String(match[2]).split(','), units:[], initValues:[] }; 

length = transform[ match[1] ].toValues.length;

for( q=0; q < length; q++ )
{
matchResult = String( transform[ match[1] ].toValues[q] ).match( /em|ex|px|in|cm|mm|%|rad|deg/ );
transform[ match[1] ].toValues[q] = parseFloat(transform[ match[1] ].toValues[q]);

if(match[1] == 'rotate' )
transform[ match[1] ].units[q] = (matchResult) ? matchResult[0] : "deg";
else if(match[1] == 'rotate' || match[1] == 'rotate3d')
{
if(q<3)
transform[ match[1] ].units[q] = "";
else
transform[ match[1] ].units[q] = (matchResult) ? matchResult[0] : "deg";
}
else
transform[ match[1] ].units[q] = (matchResult) ? matchResult[0] : "";
}


if( initTransform[ match[1] ] != undefined )
{
q = initTransform[ match[1] ].fromValues.length;
for( ;q--; )
initTransform[ match[1] ].fromValues[q] = parseFloat(initTransform[ match[1] ].fromValues[q]);

transform[ match[1] ].fromValues = initTransform[ match[1] ].fromValues;

if( checkConflictProp )
if( checkConflictProp != prop )
transform[ match[1] ].fromValues = this.values[prop].transform[match[1]].fromValues.slice();
}
else
{
if( match[1] == 'scale')
{
transform[ match[1] ].fromValues[0] = 1;
transform[ match[1] ].fromValues[1] = 1;
}
else if( match[1] == 'skew' || match[1] == 'translate')
{
transform[ match[1] ].fromValues[0] = 0;
transform[ match[1] ].fromValues[1] = 0;
}
else if( match[1] == 'rotate')
{
transform[ match[1] ].fromValues[0] = 0;
}
else if( match[1] == 'scale3d')
{
transform[ match[1] ].fromValues[0] = 1;
transform[ match[1] ].fromValues[1] = 1;
transform[ match[1] ].fromValues[2] = 1;
}
else if( match[1] == 'skew3d' || match[1] == 'translate3d')
{
transform[ match[1] ].fromValues[0] = 0;
transform[ match[1] ].fromValues[1] = 0;
transform[ match[1] ].fromValues[2] = 0;
}
else if( match[1] == 'rotate3d')
{
transform[ match[1] ].fromValues[0] = 0;
transform[ match[1] ].fromValues[1] = 0;
transform[ match[1] ].fromValues[2] = 0;
transform[ match[1] ].fromValues[3] = 0;
}
else if(match[1] == 'translateX' || match[1] == 'translateY' || match[1] == 'translateZ' || 
match[1] == 'rotateX' || match[1] == 'rotateY' || match[1] == 'rotateZ' ||
match[1] == 'skewX' || match[1] == 'skewY' || match[1] == 'perspective' )
{
transform[ match[1] ].fromValues[0] = 0;
}
else if(match[1] == 'blur' || match[1] == 'brightness' || match[1] == 'contrast' || 
match[1] == 'grayscale' || match[1] == 'hueRotate' || match[1] == 'invert' ||
match[1] == 'opacity' || match[1] == 'saturate' || match[1] == 'sepia' )
{
transform[ match[1] ].fromValues[0] = 0;
}
else if(match[1] == 'scaleX' || match[1] == 'scaleY' || match[1] == 'scaleZ' )
{
transform[ match[1] ].fromValues[0] = 1;
}
else if(match[1] == 'matrix' )
{
transform[ match[1] ].fromValues[0] = 1;
transform[ match[1] ].fromValues[1] = 0;
transform[ match[1] ].fromValues[2] = 0;
transform[ match[1] ].fromValues[3] = 1;
transform[ match[1] ].fromValues[4] = 0;
transform[ match[1] ].fromValues[5] = 0;
}
else if(match[1] == 'matrix3d' )
{
transform[ match[1] ].fromValues[0] = 1;
transform[ match[1] ].fromValues[1] = 0;
transform[ match[1] ].fromValues[2] = 0;
transform[ match[1] ].fromValues[3] = 0;
transform[ match[1] ].fromValues[4] = 0;
transform[ match[1] ].fromValues[5] = 1;
transform[ match[1] ].fromValues[6] = 0;
transform[ match[1] ].fromValues[7] = 0;
transform[ match[1] ].fromValues[8] = 0;
transform[ match[1] ].fromValues[9] = 0;
transform[ match[1] ].fromValues[10] = 1;
transform[ match[1] ].fromValues[11] = 0;
transform[ match[1] ].fromValues[12] = 0;
transform[ match[1] ].fromValues[13] = 0;
transform[ match[1] ].fromValues[14] = 0;
transform[ match[1] ].fromValues[15] = 1;
}
}

if( this.values[prop] == undefined )   
{
transform[ match[1] ].initValues = transform[ match[1] ].fromValues.slice();
}
else
{
transform[ match[1] ].initValues = this.values[prop].transform[match[1]].initValues;
}
}


}
else if( prop.match( /color|fill|^stroke$/i ) )
{
nameMatch = inputPropString.match( /rgba|rgb/i );
name = nameMatch[0];
initName = String(initProp).match( /rgba|rgb/i );

if( name && initName)
{
rgb = String(inputPropString).slice( String(inputPropString).indexOf('(')+1, String(inputPropString).indexOf(')') ).split(',');
newPropVals.toValues.push(parseFloat(rgb[0])); newPropVals.toValues.push(parseFloat(rgb[1])); newPropVals.toValues.push(parseFloat(rgb[2]));
if( rgb.length > 3) newPropVals.toValues.push(parseFloat(rgb[3]));

rgb = String(initProp).slice( String(initProp).indexOf('(')+1, String(initProp).indexOf(')') ).split(',');
newPropVals.fromValues.push(parseFloat(rgb[0])); newPropVals.fromValues.push(parseFloat(rgb[1])); newPropVals.fromValues.push(parseFloat(rgb[2]));
newPropVals.units.push(''); newPropVals.units.push(''); newPropVals.units.push('');

if( newPropVals.toValues.length > 3)
{
if( rgb.length > 3 ) newPropVals.fromValues.push(parseFloat(rgb[3]));
else newPropVals.fromValues.push(1);
newPropVals.units.push('');
}

if(this.values[prop])
{
newPropVals.initValues = this.values[prop].initValues;
}
else
newPropVals.initValues = newPropVals.fromValues.slice();
}

if(this.values[prop])
{
if(this.values[prop].toValues.length > 0)
{
newPropVals.fromValues = this.values[prop].fromValues.slice();
newPropVals.toValues = this.values[prop].toValues.slice();
newPropVals.units = this.values[prop].units.slice();
}
}
}
else if( prop == TweenSpace.params.svg.drawSVG )
{
var pathLength = TweenSpace.SVG.getTotalLength( this.element );

newPropVals.units.push('px', 'px', 'px');

var drawToValues;



if( _fromProps != undefined )
{

drawToValues = String(_fromProps[prop]).split(' ');
setValues( drawToValues, newPropVals.fromValues );
}

else if( props_value.constructor === Object )
{

drawToValues = String(props_value['from']).split(' ');
setValues( drawToValues, newPropVals.fromValues );
}
else
{
newPropVals.fromValues.push(parseFloat(styles['strokeDashoffset']));
if( styles['strokeDasharray'] == 'none')
{
newPropVals.fromValues.push(pathLength);
newPropVals.fromValues.push(0);
}
else
{
var drawFromValues = String(styles['strokeDasharray']).split(' ');

if(drawFromValues.length > 1)
newPropVals.fromValues.push(parseFloat( drawFromValues[0] ), parseFloat( drawFromValues[1] ));
else
newPropVals.fromValues.push(parseFloat( drawFromValues[0] ), 0 );
}
}

if( this.values[prop] == undefined )
{
var length = newPropVals.fromValues.length;
newPropVals.initValues = [];
var c = 0;
for(;c<length;c++)
newPropVals.initValues.push( newPropVals.fromValues[c] );
}



if( props_value.constructor === Object )
inputPropString = props_value['to'];

drawToValues = String(inputPropString).split(' ');
setValues( drawToValues, newPropVals.toValues );

function setValues( drawValues, values )
{
if( String(inputPropString).match( /%/ ) != null )
{
if(drawValues.length > 1)
{
values.push( -( parseFloat(drawValues[0] )*0.01*pathLength ) );
values.push( Math.abs(parseFloat(drawValues[0])-parseFloat(drawValues[1]))*0.01*pathLength );
values.push( (100-Math.abs(parseFloat(drawValues[0])-parseFloat(drawValues[1])))*0.01*pathLength );
}
else
{
values.push( 0 );
values.push( Math.abs(parseFloat(drawValues[0]))*0.01*pathLength );
values.push( (Math.abs(100-parseFloat(drawValues[0]))*0.01*pathLength) );
}
}
else
{
if(drawValues.length > 1)
{
values.push( -( parseFloat(drawValues[0] ) ) );
values.push( Math.abs(parseFloat(drawValues[0])-parseFloat(drawValues[1])) );
values.push( (pathLength-Math.abs(parseFloat(drawValues[0])-parseFloat(drawValues[1]))) );
}
else
{
values.push( 0 );
values.push( parseFloat(drawValues[0]) );
values.push( pathLength-parseFloat(drawValues[0]) );
}
}

return [drawValues, values];
}
}
else if( prop == 'motionPathSVG' )
{
newPropVals.effects = {};
newPropVals.units.push('px');

if( props_value['path'] != undefined )
{
newPropVals.effects['path'] = TweenSpace._.getElements( props_value['path'] )[0];
newPropVals.effects['pathLength'] = TweenSpace.SVG.getTotalLength( newPropVals.effects['path'] );
}

newPropVals.effects['align'] = ( props_value['align'] != undefined )?props_value['align']:false;

if( props_value['rotationOffset'] != undefined )
{
newPropVals.effects['rotationOffset'] = parseFloat(props_value['rotationOffset']);
if(  String( props_value['rotationOffset'] ).match( /rad/ ) != null )
newPropVals.effects['rotationOffsetUnits'] = 'rad';
else newPropVals.effects['rotationOffsetUnits'] = 'deg';
}
else
{
newPropVals.effects['rotationOffset'] = 0;
newPropVals.effects['rotationOffsetUnits'] = 'deg';
}

newPropVals.effects['p1'] = {x:0, y:0};
newPropVals.effects['p2'] = {x:0, y:0};

newPropVals.effects['pivotX'] = ( props_value['pivotX'] != undefined )?props_value['pivotX']:0;
newPropVals.effects['pivotY'] = ( props_value['pivotY'] != undefined )?props_value['pivotY']:0;
newPropVals.effects['offsetX'] = ( props_value['offsetX'] != undefined )?props_value['offsetX']:0;
newPropVals.effects['offsetY'] = ( props_value['offsetY'] != undefined )?props_value['offsetY']:0;

if( String(inputPropString).match( /%/ ) != null )
{
if( props_value['from'] != undefined )
newPropVals.fromValues.push( parseFloat( props_value['from'] ) * 0.01 * newPropVals.effects['pathLength'] );
else
newPropVals.fromValues.push(0);

if( props_value['to'] != undefined )
newPropVals.toValues.push( parseFloat( props_value['to'] ) * 0.01 * newPropVals.effects['pathLength'] );
else
newPropVals.toValues.push(0);
}
else
{
if( props_value['from'] != undefined )
newPropVals.fromValues.push( parseFloat( props_value['from'] ) );
else
newPropVals.fromValues.push(0);

if( props_value['to'] != undefined )
newPropVals.toValues.push( parseFloat( props_value['to'] ) );
else
newPropVals.toValues.push(0);
}
}
else if( prop == 'morphSVG' )
{
name = '';
newPropVals.effects = {};
newPropVals.units.push('');

var toShapeElement = TweenSpace._.getElements(props_value['shape'])[0];
var fromParent = this.element.parentElement;
var toParent = toShapeElement.parentElement;
var bezierPaths = TweenSpace.SVG.matchPathPoints( this.element, toShapeElement );
newPropVals.fromValues = bezierPaths[0];
newPropVals.toValues = bezierPaths[1];


if(this.element.tagName != 'path')
{
var fromShapeReplacement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
fromShapeReplacement.setAttribute('d', TweenSpace.SVG.path.toString( newPropVals.fromValues ) );
fromShapeReplacement.setAttribute('style', this.element.getAttribute('style'));

fromShapeReplacement.setAttribute('id', this.element.getAttribute('id'));
fromShapeReplacement.setAttribute('class', this.element.getAttribute('class'));

fromParent.appendChild(fromShapeReplacement);
fromParent.removeChild(this.element);
this.element = fromShapeReplacement;
}


if( props_value['reverse'] && props_value['reverse'] == true )
{
var i = newPropVals.toValues.length;
var length = i-1;
var temp_toValues = [];


for(;i--;)
{
if( i == length )
temp_toValues.push( [ 'M', newPropVals.toValues[i][5], newPropVals.toValues[i][6] ] );
else if( i == 0 )
temp_toValues.push( [ 'C', newPropVals.toValues[i+1][3], newPropVals.toValues[i+1][4], newPropVals.toValues[i+1][1], newPropVals.toValues[i+1][2], newPropVals.toValues[length][5], newPropVals.toValues[length][6] ] );
else
temp_toValues.push( [ 'C', newPropVals.toValues[i+1][3], newPropVals.toValues[i+1][4], newPropVals.toValues[i+1][1], newPropVals.toValues[i+1][2], newPropVals.toValues[i][5], newPropVals.toValues[i][6] ] );
}

newPropVals.toValues = temp_toValues;
}


if( props_value['shapeIndex'] != undefined )
{
if(parseInt(props_value['shapeIndex']) > newPropVals.toValues.length-1)
{
console.warn('TweenSpace.js Warning: morphSVG - shapeIndex is greater than max index: '+(newPropVals.toValues.length-1)+'.');
return;
}

var partA = newPropVals.toValues.slice(0, parseInt(props_value['shapeIndex']) );
partA.shift();
var partB = newPropVals.toValues.slice(parseInt(props_value['shapeIndex']) );
partB.unshift(['M', partA[partA.length-1][5], partA[partA.length-1][6] ])
newPropVals.toValues = partB.concat(partA);
}


if( props_value['debug'] && props_value['debug'] == true )
{
var fromShapeIndex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
fromShapeIndex.setAttribute('cx', newPropVals.fromValues[0][1]);
fromShapeIndex.setAttribute('cy', newPropVals.fromValues[0][2]);
fromShapeIndex.setAttribute('r', 6);
fromShapeIndex.setAttribute('stroke-width', 0);
fromShapeIndex.setAttribute('stroke', '#32B47D');
fromShapeIndex.setAttribute('fill', '#32B47D');
fromParent.appendChild(fromShapeIndex);

var fromShapeDirection = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
if( props_value['shapeIndex'] )
{
fromShapeDirection.setAttribute('cx', newPropVals.fromValues[ parseInt(props_value['shapeIndex']) ][5] );
fromShapeDirection.setAttribute('cy', newPropVals.fromValues[ parseInt(props_value['shapeIndex']) ][6] );
}
else
{
fromShapeDirection.setAttribute('cx', newPropVals.fromValues[ parseInt(Math.ceil(newPropVals.fromValues.length-1)*0.25) ][5]);
fromShapeDirection.setAttribute('cy', newPropVals.fromValues[  parseInt(Math.ceil(newPropVals.fromValues.length-1)*0.25)  ][6]);
}
fromShapeDirection.setAttribute('r', 4);
fromShapeDirection.setAttribute('stroke-width', 0);
fromShapeDirection.setAttribute('stroke', '#32B47D');
fromShapeDirection.setAttribute('fill', '#32B47D');
fromParent.appendChild(fromShapeDirection);

var fromShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
fromShape.setAttribute('d', TweenSpace.SVG.path.toString( newPropVals.fromValues ) );
fromShape.setAttribute('stroke-width', 2);
fromShape.setAttribute('stroke', '#32B47D');
fromShape.setAttribute('fill', 'none');
fromParent.appendChild(fromShape);

var fromStartText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
fromStartText.setAttribute('x', newPropVals.fromValues[0][1]+10);
fromStartText.setAttribute('y', newPropVals.fromValues[0][2]+2);
fromStartText.setAttribute('fill', '#1A6643');
fromStartText.innerHTML = 'Max Index: '+String(newPropVals.fromValues.length-1);
fromParent.appendChild(fromStartText);

var fromDirText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
if( props_value['shapeIndex'] )
{
fromDirText.setAttribute('x', newPropVals.fromValues[parseInt(props_value['shapeIndex'])][5]+10);
fromDirText.setAttribute('y', newPropVals.fromValues[parseInt(props_value['shapeIndex'])][6]+2);
}
else
{
fromDirText.setAttribute('x', newPropVals.fromValues[ parseInt(Math.ceil(newPropVals.fromValues.length-1)*0.25) ][5]);
fromDirText.setAttribute('y', newPropVals.fromValues[  parseInt(Math.ceil(newPropVals.fromValues.length-1)*0.25)  ][6]);
}

fromDirText.setAttribute('fill', '#1A6643');
fromDirText.innerHTML = ( props_value['shapeIndex'] )?'User Index: ' + String(parseInt(props_value['shapeIndex'])):'25% Index: ' + String(parseInt(Math.ceil(newPropVals.fromValues.length-1)*0.25));
fromParent.appendChild(fromDirText);

var toShapeIndex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
toShapeIndex.setAttribute('cx', newPropVals.toValues[0][1]);
toShapeIndex.setAttribute('cy', newPropVals.toValues[0][2]);
toShapeIndex.setAttribute('r', 6);
toShapeIndex.setAttribute('stroke-width', 0);
toShapeIndex.setAttribute('stroke', '#EE416D');
toShapeIndex.setAttribute('fill', '#EE416D');
fromParent.appendChild(toShapeIndex);

var toShapeDirection = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

if( props_value['shapeIndex'] )
{
toShapeDirection.setAttribute('cx', newPropVals.toValues[ parseInt(props_value['shapeIndex']) ][5]);
toShapeDirection.setAttribute('cy', newPropVals.toValues[ parseInt(props_value['shapeIndex']) ][6]);
}
else
{
toShapeDirection.setAttribute('cx', newPropVals.toValues[ parseInt(Math.ceil(newPropVals.toValues.length-1)*0.25) ][5]);
toShapeDirection.setAttribute('cy', newPropVals.toValues[ parseInt(Math.ceil(newPropVals.toValues.length-1)*0.25) ][6]);
}
toShapeDirection.setAttribute('r', 4);
toShapeDirection.setAttribute('stroke-width', 0);
toShapeDirection.setAttribute('stroke', '#EE416D');
toShapeDirection.setAttribute('fill', '#EE416D');
fromParent.appendChild(toShapeDirection);

var toShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
toShape.setAttribute('d', TweenSpace.SVG.path.toString( newPropVals.toValues ) );
toShape.setAttribute('stroke-width', 2);
toShape.setAttribute('stroke', '#EE416D');
toShape.setAttribute('fill', 'none');
fromParent.appendChild(toShape);
}

if( this.values[prop] == undefined  && newPropVals.initValues==undefined)
newPropVals.initValues = newPropVals.fromValues.slice();

transform = null;
newPropVals.effects = null;
}
else if( prop == 'numberTo' )
{



newPropVals.fromValues.push(parseFloat(params['from']));
newPropVals.toValues.push(parseFloat(params['to']));
delete _props['from'];
delete _props['to'];
}
else
{
matchResult = String(inputPropString).match( /em|ex|px|in|cm|mm|%|rad|deg/ );

var fromVal = parseFloat(initProp), toVal;
newPropVals.fromValues.push(fromVal);

if(newPropVals.initValues == '')
{
newPropVals.initValues = [];
newPropVals.initValues.push(fromVal);
}


if(this.values[prop] != undefined )
toVal = this.values[prop].toValues[0];
else
toVal = TweenSpace._.functionBasedValues(fromVal, inputPropString);


if( toVal == null )
toVal = parseFloat(inputPropString);


if(_isUpdateTo == true)
{
toVal = parseFloat(inputPropString);
}

newPropVals.toValues.push(toVal);
newPropVals.units.push((matchResult) ? matchResult[0] : "");  
}

if(this.values[prop])
newPropVals.initValues = this.values[prop].initValues;


if(!this.creationValues[prop])
{
this.creationValues[prop] =  JSON.parse(JSON.stringify(newPropVals.fromValues));

if(transform)
this.creationValues['transform'] =  JSON.parse(JSON.stringify(transform));
}




this.values[prop] = new PropValues(prop, name, newPropVals.fromValues, newPropVals.toValues, 
   newPropVals.units, transform, newPropVals.effects, 
   newPropVals.initValues, this.creationValues );

this.values_DL.push(this.values[prop]);

newPropVals.effects = undefined;
} 

return this;
};


this.resetValues = function()
{
this.values = {};
this.values_DL;
}


this.tweenParent = function()
{
return _this;
}


_manageSubTween();


function _manageSubTween()
{
return _st_this.manageSubTween();
}

return this;
}

function PropValues(prop, names, fromValues, toValues, units, transform, effects, initValues, creationValues)
{

this.prop = prop;
this.names = names;
this.creationValues = creationValues;
this.initValues = initValues;
this.fromValues = fromValues;
this.toValues = toValues;
this.units = units;
this.transform = transform;
this.effects = effects;

this.halted = false;

return this;
}

return this;
}

})(TweenSpace || {});

(function ( TweenSpace ) {


TweenSpace.Timeline = function( params )
{
return new Timeline(params);
}


function Timeline( params )
{
var _this = this,
_tweens = [],
_repeatedProps = [],
_repeat = 0,
_repeat_inc = 0,
_repeat_direction = true, 
_yoyo_isOdd = false,
_yoyo = false,
_duration = 0,
_reversed = false,
_currentTime = 0;


this.checkConflicts = false;

this.duration = function()
{
return _duration;
}

this.durationTotal = function()
{
return _duration + (_duration*_repeat);
}

this.repeat = function( int )
{
int = (int <= -1)?Number.MAX_SAFE_INTEGER:int;

if(int != undefined)
_repeat = int;
return _repeat;
}

this.yoyo = function( bool )
{
if(bool != undefined)
_yoyo = bool;
return _yoyo;
}

this.currentTime = function()
{




return _currentTime;
}

this.timescale = function( value )
{
_apply( 'timescale', value, false );
_autoTrim();
}

this.reversed = function()
{
return _reversed;
}

this.onComplete = undefined;
this.onCompleteTimebar = undefined;

this.onProgress = undefined;
this._onProgress = function(time)
{
_currentTime = time;

}
this.onProgressTimebar = undefined;

this.playing = function()
{
return _tweens[_tweens.length-1].playing();
}

this.tweens = function()
{
return _tweens;
}

this.addTweens = function( tweens )
{
if(_tweens.length > 0)
{
_tweens[_tweens.length-1].keyTween(false);
_tweens[_tweens.length-1].timelineParent(null);
}

if(tweens != undefined)
{
var i = 0, j = 0;
if( tweens.__proto__.constructor.name === 'Tween' )
{
_pushTween(tweens);
}
else if( tweens.constructor === Object )
{
tweens = new TweenSpace.Tween(tweens);
_pushTween(tweens);
}
else if( tweens.constructor === Array )
{

loop1:for(; i < tweens.length; i++)
{
_pushTween(tweens[i]);
}
}

_tweens[_tweens.length-1].keyTween(true);

_autoTrim();   
_apply( 'useDelay', true );
_apply( 'timelineParent', _this );
}

return _this;
}

this.constructor = new function()
{
if( params != undefined )
{
_this.onProgress = params.onProgress || undefined;
_this.onComplete = params.onComplete || undefined;
_this.addTweens( params.tweens || undefined );
_this.timescale( params.timescale || undefined );
if(params.repeat)
{
_this.repeat(params.repeat || undefined );
}

_this.yoyo( params.yoyo || undefined );
}
}

this.removeTweens = function( tweens )
{
var removed_tweens = [];
if(_tweens.length > 0)
{
_tweens[_tweens.length-1].keyTween(false);
_tweens[_tweens.length-1].timelineParent(null);
}

var i = 0, j = 0;
if( tweens.__proto__.constructor.name === 'Tween' )
{
for(; i < _tweens.length; i++)
{
if(_tweens[i] == tweens)
{
removed_tweens = removed_tweens.concat( _tweens.splice(i, 1) );
break;
}
}
}
else if( tweens.constructor === Array )
{
loop1:for(; i < tweens.length; i++)
{
   loop2:for(; j < _tweens.length; j++)
{
if(tweens[i] == _tweens[j])
{
removed_tweens = removed_tweens.concat( _tweens.splice(j, 1) );
break loop2;
}
}
}
}

_tweens[_tweens.length-1].keyTween(true);
_tweens[_tweens.length-1].timelineParent(_this);

_autoTrim();

return removed_tweens;
}

this.play = function( playhead )
{
   
_reversed = false;
_repeat_direction = true;

playhead  = _checkPlayhead( playhead );
playhead  = _adjustRepeatPlayhead( playhead );

if(isNaN(playhead))
playhead = 0;

this.seek(playhead);
_apply( (_yoyo_isOdd == false)?'play':'reverse', playhead, true );

return _this;
}

this.resume = function( playhead )
{
playhead  = _checkPlayhead( playhead );
_apply( (_reversed == false)?'play':'reverse', playhead, true );

}




this.seek = function( playhead )
{
_currentTime = playhead;

let stwn_list = [];

for(let i = 0, twn; twn = _tweens[i]; i++)
{
if(twn.isCSSText())
{
console.warn( 'The useCSSText property is not supported by Timeline.seek() method. This tween contains an element with id: ' + 
twn.elements()[0].id );
}

twn.seek( _currentTime-twn.delay() );
}


for (let a = 0; a < _repeatedProps.length; a++)
{
const prop_stwn_group = _repeatedProps[a];

for (let b = 1; b < prop_stwn_group.length; b++)
{
const stwn = prop_stwn_group[b];

if(parseInt(_currentTime) >= stwn.tweenParent().delay() && 
parseInt(_currentTime) <= stwn.tweenParent().delay() +stwn.tweenParent().duration() )
{



stwn.tweenParent().tick_draw_prop(prop_stwn_group[0], _currentTime-stwn.tweenParent().delay(), false, stwn)


}

}
}
}


function sortProps(array)
{
let array_out = [array[0]];
for(let i = 1, a; a = array[i]; i++)
{
for(let j = 0, b; b = array_out[j]; j++)
{
if(a.tween.delay() <= b.tween.delay())
{
if(j==0)
array_out.unshift(a);
else
array_out.splice(j, 0, a);

break;


}

if(j==array_out.length-1)
{
array_out.push(a);
break;
}
}
}

return array_out;

}


this.reverse = function( playhead )
{
_reversed = true;
_repeat_direction = false;
playhead  = _checkPlayhead( playhead );
playhead  = _adjustRepeatPlayhead( playhead );

if(_yoyo_isOdd == false)
_apply( 'reverse', playhead, true );   
else
_apply( 'play', playhead, true );
}

this.pause = function( playhead )
{
if(playhead)
{
playhead  = _checkPlayhead( playhead );
playhead  = _adjustRepeatPlayhead( playhead );
}

_apply( 'pause', playhead, true );

return _this;
}

this.stop = function( playhead )
{
playhead  = _checkPlayhead( playhead );

_apply( 'stop', playhead, true );

return _this;
}

function _apply( operation, value, adjustPlayhead )
{
_currentTime = value;

var adjustedValue;
var q;


for(q=0; q < _tweens.length; q++)
{
if(adjustPlayhead==true && value!=undefined)
adjustedValue = value + ( -_tweens[q].delay() );
else adjustedValue = value;





_tweens[q][operation](adjustedValue);
}
}

function _checkPlayhead( playhead )
{
if( isNaN(playhead) == true || playhead == undefined )
playhead = _this.currentTime();

return playhead;
}

function _adjustRepeatPlayhead( playhead )
{
if(_repeat>0)
{

if( playhead == _this.durationTotal() )
playhead -= 1;
else if(playhead > _this.durationTotal() )
{
console.warn('TweenSpace.js Warning: playhead '+playhead+'ms is greater than Timeline total duration. Playhead has been set to '+_this.durationTotal()+'ms.');
playhead = _this.durationTotal()-1;
}

_repeat_inc = parseInt(parseInt(playhead)/_this.duration());
if( _yoyo == true )
_yoyo_isOdd = (_repeat_inc%2 == 1)?true:false;

playhead = Math.abs((_repeat_inc*_this.duration()) - playhead );

if( _yoyo_isOdd == true)
playhead = Math.abs(_this.duration() - playhead );
}

return playhead;
}

function _setTweensProp( prop, val )
{
var q;
for(q=0; q < _tweens.length; q++)
_tweens[q][prop] = val;
}

function _autoTrim()
{
var list = [];
var q;
for(q=0; q < _tweens.length; q++)
list.push(_tweens[q].delay()+_tweens[q].duration()+(_tweens[q].repeat()*_tweens[q].duration()));

_duration = TweenSpace._.getMax( list );

for(q=0; q < _tweens.length; q++)
_tweens[q].durationTotal( _duration - _tweens[q].delay() );
}
function _pushTween(tween)
{
tween.useDelay(true);
if( _tweens.length == 0)
_tweens.push(tween);
else
{

var i = 0;
for(; i < _tweens.length; i++)
{
if(_tweens[i] == tween)
break;
if(i == _tweens.length - 1)
_tweens.push(tween);
}
}

if(_this.checkConflicts == true)
storeRepeatedProps();
}

function storeRepeatedProps()
{

let subtweens_props = [];



for (let index = 0; index < _tweens.length; index++) 
{
const twn = _tweens[index];

for (let index = 0; index < twn.subTweens().length; index++) 
{
const stwn = twn.subTweens()[index];


for (const key in stwn.props) 
{
if (Object.hasOwnProperty.call(stwn.props, key)) 
{
const element = stwn.props[key];
subtweens_props.push([stwn, stwn.element.id, key ]);

}
}
}
}



let same_prop_stwns = [];

for (let i = 0; i < subtweens_props.length; i++)
{
const i_stwn_prop = subtweens_props[i];

let stwn_group = [i_stwn_prop[2], i_stwn_prop[0]];
 
for (let j = 0; j < subtweens_props.length; j++)
{
const j_stwn_prop = subtweens_props[j];


if( i_stwn_prop[0].UID() != j_stwn_prop[0].UID() && 
i_stwn_prop[1] == j_stwn_prop[1] && 
i_stwn_prop[2] == j_stwn_prop[2])
{
stwn_group.push(j_stwn_prop[0]);


}
}

if(stwn_group.length > 2)
{
same_prop_stwns.push(stwn_group);
for (let p = 1; p < stwn_group.length; p++) {
const p_stwn = stwn_group[p];

for (let q = 0; q < subtweens_props.length; q++) {
const q_stwn = subtweens_props[q][0];

if( stwn_group[0] == subtweens_props[q][2] && p_stwn.UID() == q_stwn.UID()) 
{
subtweens_props.splice(q, 1);
q--;
}

}

}
}

}



_repeatedProps = same_prop_stwns;


}

this._ = {};
this._.manageRepeatCycles = function()
{

if( _this.repeat() > 0 && _repeat_inc >=0 && _repeat_inc <= _this.repeat() )
{

if( _this.currentTime() <= 0 )
{
if( _repeat_inc == 0 && _repeat_direction == false)
return;

(_repeat_direction == true ) ? _repeat_inc++ : _repeat_inc--;

if( _yoyo == true )
_apply( 'play', 0, true );
else
_apply( 'reverse', _this.duration()-1, true );
}

else if( _this.currentTime() >= _this.duration() )
{
if( _repeat_inc == _this.repeat() && _repeat_direction == true)
return;

(_repeat_direction == true ) ? _repeat_inc++ : _repeat_inc--;

if( _yoyo == true )
_apply( 'reverse', _this.duration()-1, true );
else
_apply( 'play', 0, true );
}
}
}
 
return this;
}

})(TweenSpace || {});

(function ( TweenSpace ) {


TweenSpace.SVG = 
{
getTotalLength: function(svgObj)
{
var length = null;
if( svgObj.tagName == 'circle') length = circlePathLength(svgObj);
else if( svgObj.tagName == 'rect') length = rectPathLength(svgObj);
else if( svgObj.tagName == 'polygon') length = polygonPathLength(svgObj);
else if( svgObj.tagName == 'path') length = pathLength(svgObj);

return length;
},
path:
{
toAbsolute: function(path)
{
return pathToAbsolute(path);
},
toLinear: function(path)
{
return pathToLinear(path);
},
toBezier: function(path1, path2)
{
return pathToCubicBezier(path1, path2);
},
toString: function( array )
{
return pathArrayToString( array );
} 
},
svgToPath: function( svgObj )
{
return svgToPath( svgObj );
},
matchPathPoints: function ( segmentList1, segmentList2 )
{
return matchPathPoints( segmentList1, segmentList2 );
}
}


function circlePathLength(svgObj)
{
var r = svgObj.getAttribute('r');
var circleLength = 2 * Math.PI * r; 
return circleLength;
}

function rectPathLength(svgObj)
{
var w = svgObj.getAttribute('width');
var h = svgObj.getAttribute('height');

return (w*2)+(h*2);
}

function polygonPathLength(svgObj)
{
var points = svgObj.getAttribute('points');
points = points.split(" ");
var x1 = null, x2, y1 = null, y2 , lineLength = 0, x3, y3;
for(var i = 0; i < points.length; i++)
{
var coords = points[i].split(",");
if(x1 == null && y1 == null){

if(/(\r\n|\n|\r)/gm.test(coords[0]))
{
coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm,"");
coords[0] = coords[0].replace(/\s+/g,"");
}

if(/(\r\n|\n|\r)/gm.test(coords[1]))
{
coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm,"");
coords[0] = coords[1].replace(/\s+/g,"");
}

x1 = coords[0];
y1 = coords[1];
x3 = coords[0];
y3 = coords[1];

}
else
{
if(coords[0] != "" && coords[1] != "")
{ 
if(/(\r\n|\n|\r)/gm.test(coords[0]))
{
coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm,"");
coords[0] = coords[0].replace(/\s+/g,"");
}

if(/(\r\n|\n|\r)/gm.test(coords[1]))
{
coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm,"");
coords[0] = coords[1].replace(/\s+/g,"");
}

x2 = coords[0];
y2 = coords[1];

lineLength += Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1),2));

x1 = x2;
y1 = y2;
if(i == points.length-2)
lineLength += Math.sqrt(Math.pow((x3-x1), 2)+Math.pow((y3-y1),2));
}
}

}
return lineLength;
}

function pathLength(svgObj)
{
return svgObj.getTotalLength();
}

function pathArrayToString( array )
{
return array.valueOf().toString().replace(/,/g, " ");
}

function matchPathPoints( segmentList1, segmentList2 )
{
var s1 = checkArgument(segmentList1);
var s2 = checkArgument(segmentList2);
var s3 = [];

var long, short;
if(s1.length>s2.length)
{ 
long = s1;
short = s2;
}
else if(s1.length<s2.length)
{ 
long = s2;
short = s1;
}
else
return [s1, s2];

var short_length = short.length;
var long_length = long.length;

var additionalPoints = Math.ceil( long_length / (short_length-1) );
var lastAdditionalPoints = long_length - ( (short_length-1)*additionalPoints ) ;
var additionalCounter = 0, additionalLength = 0, foundPoint;

var h = 1;
forLoop:for(;h<short_length;h++)
{
additionalLength = additionalPoints;

if(lastAdditionalPoints < 0)
{
if(additionalCounter >= lastAdditionalPoints)
{
additionalCounter--;
additionalLength--;
}
}
else if(lastAdditionalPoints > 0)
{
if(additionalCounter <= lastAdditionalPoints)
{   
additionalCounter++;
additionalLength++;
}
}

var j = 0;
if( short[h-1][0] == 'M' )
{
foundPoint = findDotsAtSegment( short[h-1][1], short[h-1][2], short[h][1], short[h][2], short[h][3], short[h][4], short[h][5], short[h][6], 1/additionalPoints );
s3.push([ 'M', short[h-1][1], short[h-1][2] ] );
s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
j = 1;
}
else j = 0;

for(;j<additionalLength;j++)
{
if( j == 0 )
{
foundPoint = findDotsAtSegment( short[h-1][5], short[h-1][6], short[h][1], short[h][2], short[h][3], short[h][4], short[h][5], short[h][6], 1/additionalLength );
s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
}
else
{   
foundPoint = findDotsAtSegment( foundPoint.x, foundPoint.y, foundPoint.n.x, foundPoint.n.y, foundPoint.end.x, foundPoint.end.y, short[h][5], short[h][6], 1/(additionalLength-j) );

s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
}
}
}

return (s1.length > s2.length) ? [long, s3] : [s3, long];

function checkArgument(arg)
{

if(arg.constructor === String)
return TweenSpace.SVG.path.toBezier( arg );

else if(arg.tagName == 'rect' || arg.tagName == 'polygon' || arg.tagName == 'ellipse' || arg.tagName == 'circle' || arg.tagName == 'path' )
return TweenSpace.SVG.path.toBezier( TweenSpace.SVG.path.toString(TweenSpace.SVG.svgToPath( arg ) ) );
}
}




function pathToAbsolute( path )
{
path = stringToSegmentsArray(path);
var res = [],
x = 0,
y = 0,
mx = 0,
my = 0,
start = 0,
pa0;
if (path[0][0] == "M") {
x = +path[0][1];
y = +path[0][2];
mx = x;
my = y;
start++;
res[0] = ["M", x, y];
}
var crz = path.length == 3 &&
path[0][0] == "M" &&
path[1][0].toUpperCase() == "R" &&
path[2][0].toUpperCase() == "Z";
for (var r, pa, i = start, ii = path.length; i < ii; i++) {
res.push(r = []);
pa = path[i];
pa0 = pa[0];
if (pa0 != pa0.toUpperCase()) {
r[0] = pa0.toUpperCase();
switch (r[0]) {
case "A":
r[1] = pa[1];
r[2] = pa[2];
r[3] = pa[3];
r[4] = pa[4];
r[5] = pa[5];
r[6] = +pa[6] + x;
r[7] = +pa[7] + y;
break;
case "V":
r[1] = +pa[1] + y;
break;
case "H":
r[1] = +pa[1] + x;
break;
case "R":
var dots = [x, y].concat(pa.slice(1));
for (var j = 2, jj = dots.length; j < jj; j++) {
dots[j] = +dots[j] + x;
dots[++j] = +dots[j] + y;
}
res.pop();
res = res.concat(catmullRom2bezier(dots, crz));
break;
case "O":
res.pop();
dots = ellipsePath(x, y, pa[1], pa[2]);
dots.push(dots[0]);
res = res.concat(dots);
break;
case "U":
res.pop();
res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
r = ["U"].concat(res[res.length - 1].slice(-2));
break;
case "M":
mx = +pa[1] + x;
my = +pa[2] + y;
default:
for (j = 1, jj = pa.length; j < jj; j++) {
r[j] = +pa[j] + ((j % 2) ? x : y);
}
}
} else if (pa0 == "R") {
dots = [x, y].concat(pa.slice(1));
res.pop();
res = res.concat(catmullRom2bezier(dots, crz));
r = ["R"].concat(pa.slice(-2));
} else if (pa0 == "O") {
res.pop();
dots = ellipsePath(x, y, pa[1], pa[2]);
dots.push(dots[0]);
res = res.concat(dots);
} else if (pa0 == "U") {
res.pop();
res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
r = ["U"].concat(res[res.length - 1].slice(-2));
} else {
for (var k = 0, kk = pa.length; k < kk; k++) {
r[k] = pa[k];
}
}
pa0 = pa0.toUpperCase();
if (pa0 != "O") {
switch (r[0]) {
case "Z":
x = +mx;
y = +my;
break;
case "H":
x = r[1];
break;
case "V":
y = r[1];
break;
case "M":
mx = r[r.length - 2];
my = r[r.length - 1];
default:
x = r[r.length - 2];
y = r[r.length - 1];
}
}
}

return res;

}
function pathToLinear( path )
{
var array = pathToAbsolute( path );
var linear_path = [];
var length = array.length;
var i = 0;
for(;i<length;i++)
{
if( array[i][0] == 'M' )
linear_path.push([array[i][0], array[i][array[i].length-2], array[i][array[i].length-1]]);
else if(array[i][0] == 'Z')
linear_path.push(['Z']);
else if(array[i][0] == 'H')
linear_path.push(['L', array[i][array[i].length-1], array[i-1][array[i-1].length-1]]);
else if(array[i][0] == 'V')
linear_path.push(['L', array[i-1][array[i-1].length-2], array[i][array[i].length-1]]);
else
linear_path.push(['L', array[i][array[i].length-2], array[i][array[i].length-1]]);
}

return linear_path;
}
function rectToPath(x, y, w, h, rx, ry)
{
if( x.tagName == 'rect')
{
var rect = x;

x = rect.getAttribute('x') || 0;
y = rect.getAttribute('y') || 0;
w = rect.getAttribute('width');
h = rect.getAttribute('height');
rx = rect.getAttribute('rx') || 0;
ry = rect.getAttribute('ry') || 0;
 
}
else if( ['circle','ellipse','line','polygon','polyline', 'path', 'text'].indexOf(x.tagName)!=-1 )
{
console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+x.tagName+', expecting SVG rect instead.');
return;
}

if (rx && ry)
{
return [
["M", +x + (+rx), y],
["l", w - rx * 2, 0],
["a", rx, ry, 0, 0, 1, rx, ry],
["l", 0, h - ry * 2],
["a", rx, ry, 0, 0, 1, -rx, ry],
["l", rx * 2 - w, 0],
["a", rx, ry, 0, 0, 1, -rx, -ry],
["l", 0, ry * 2 - h],
["a", rx, ry, 0, 0, 1, rx, -ry],
["z"]
];
}

var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
return res;
}
function circleToPath(cx, cy, r)
{
if( cx.tagName == 'circle')
{
var circle = cx;

cx = circle.getAttribute('cx') || 0;
cy = circle.getAttribute('cy') || 0;
r = circle.getAttribute('r') || 0;

}
else if( ['ellipse','rect','line','polygon','polyline', 'path', 'text'].indexOf(cx.tagName)!=-1 )
{
console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+cx.tagName+', expecting SVG circle instead.');
return;
}

return ellipseToPath(cx, cy, r);
}
function ellipseToPath(cx, cy, rx, ry, a)
{
if( cx.tagName == 'ellipse')
{
var ellipse = cx;

cx = ellipse.getAttribute('cx') || 0;
cy = ellipse.getAttribute('cy') || 0;
rx = ellipse.getAttribute('rx') || 0;
ry = ellipse.getAttribute('ry') || 0;

}
else if( ['circle','rect','line','polygon','polyline', 'path', 'text'].indexOf(cx.tagName)!=-1 )
{
console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+cx.tagName+', expecting SVG ellipse instead.');
return;
}

if (a == null && ry == null)
ry = rx;

cx = +cx;
cy = +cy;
rx = +rx;
ry = +ry;
if (a != null)
{
var rad = Math.PI / 180,
x1 = cx + rx * Math.cos(-ry * rad),
x2 = cx + rx * Math.cos(-a * rad),
y1 = cy + rx * Math.sin(-ry * rad),
y2 = cy + rx * Math.sin(-a * rad),
res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
}
else
{

res = [
["M", cx, cy-ry],
["a", rx, ry, 0, 1, 1, 0, 2 * ry],
["a", rx, ry, 0, 1, 1, 0, -2 * ry],
["z"]
];
}
return res;
}
function polygonToPath(poly)
{
if( poly.tagName == 'polygon')
{
poly = TweenSpace._.getElements(poly);

var newPoints = [];
var length = poly[0].animatedPoints.length;
var i = 0;
for(;i<length;i++)
{
if(i==0)
newPoints.push(['M', poly[0].animatedPoints[i].x, poly[0].animatedPoints[i].y]);
else if(i==length-1)
 newPoints.push(['Z']);
else
newPoints.push(['L', poly[0].animatedPoints[i].x, poly[0].animatedPoints[i].y]);

}
return newPoints;
}
else if( ['circle','ellipse','line','rect','polyline', 'path', 'text'].indexOf(poly.tagName)!=-1 )
{
console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+poly.tagName+', expecting SVG polygon instead.');
return;
}
}
function svgToPath(svgObj)
{
if(svgObj.tagName == 'rect')
return rectToPath(svgObj);
else if(svgObj.tagName == 'polygon')
return polygonToPath(svgObj);
else if(svgObj.tagName == 'ellipse')
return ellipseToPath(svgObj);
else if(svgObj.tagName == 'circle')
return circleToPath(svgObj);
else if(svgObj.tagName == 'path')
return pathToAbsolute( svgObj.getAttribute('d') );
else
return null;
}
function linearToCubic(x1, y1, x2, y2)
{
return [x1, y1, x2, y2, x2, y2];
}
function quadToCubic(x1, y1, cpx, cpy, x2, y2)
{
var _1_3 = 0.33333333333333333333333, 
_2_3 = 0.66666666666666666666667; 
return [ (_1_3 * x1 + _2_3 * cpx), (_1_3 * y1 + _2_3 * cpy), (_1_3 * x2 + _2_3 * cpx), (_1_3 * y2 + _2_3 * cpy), x2, y2 ];
}
function arcToCubic(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive)
{

var PI = TweenSpace._.PI();
var _120 = PI * 120 / 180,
rad = PI / 180 * (+angle || 0),
res = [],
p1, p2,
rotate = function (x, y, rad)
{
return { x: ( x * Math.cos(rad) - y * Math.sin(rad) ), y: ( x * Math.sin(rad) + y * Math.cos(rad) ) };
};

if ( recursive == undefined )
{
p1 = rotate(x1, y1, -rad);
x1 = p1.x;
y1 = p1.y;

p2 = rotate(x2, y2, -rad);
x2 = p2.x;
y2 = p2.y;
var cos = Math.cos(PI / 180 * angle),
sin = Math.sin(PI / 180 * angle),
x = (x1 - x2) / 2,
y = (y1 - y2) / 2;
var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
if (h > 1)
{
h = Math.sqrt(h);
rx = h * rx;
ry = h * ry;
}
var rx2 = rx * rx,
ry2 = ry * ry,
k = (large_arc_flag == sweep_flag ? -1 : 1) *
Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
cx = k * rx * y / ry + (x1 + x2) / 2,
cy = k * -ry * x / rx + (y1 + y2) / 2,
f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

f1 = x1 < cx ? PI - f1 : f1;
f2 = x2 < cx ? PI - f2 : f2;
f1 < 0 && (f1 = PI * 2 + f1);
f2 < 0 && (f2 = PI * 2 + f2);
if (sweep_flag && f1 > f2)
f1 = f1 - PI * 2;

if (!sweep_flag && f2 > f1)
f2 = f2 - PI * 2;
}
else
{
f1 = recursive[0];
f2 = recursive[1];
cx = recursive[2];
cy = recursive[3];
}

var df = f2 - f1;
if (Math.abs(df) > _120)
{
var f2old = f2,
x2old = x2,
y2old = y2;
f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
x2 = cx + rx * Math.cos(f2);
y2 = cy + ry * Math.sin(f2);
res = arcToCubic(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
}
df = f2 - f1;
var c1 = Math.cos(f1),
s1 = Math.sin(f1),
c2 = Math.cos(f2),
s2 = Math.sin(f2),
t = Math.tan(df / 4),
hx = 4 / 3 * rx * t,
hy = 4 / 3 * ry * t,
m1 = [x1, y1],
m2 = [x1 + hx * s1, y1 - hy * c1],
m3 = [x2 + hx * s2, y2 - hy * c2],
m4 = [x2, y2];
m2[0] = 2 * m1[0] - m2[0];
m2[1] = 2 * m1[1] - m2[1];

if (recursive)
return [m2, m3, m4].concat(res);
else
{
res = [m2, m3, m4].concat(res).join().split(",");
var newres = [];
for (var i = 0, ii = res.length; i < ii; i++)
newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;

return newres;
}
}
function pathToCubicBezier(path, path2)
{
var p = pathToAbsolute(path),
p2 = path2 && pathToAbsolute(path2),
attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
processPath = function (path, d, pcom)
{
var nx, ny, cmd;
if (!path)
return ["C", d.x, d.y, d.x, d.y, d.x, d.y];

!(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);

cmd = path[0];
if( cmd == "M")
{   
d.X = path[1];
d.Y = path[2];
}
else if( cmd == "A")
path = ["C"].concat(arcToCubic.apply(0, [d.x, d.y].concat(path.slice(1))));
else if( cmd == "S")
{
if (pcom == "C" || pcom == "S") 
{ 
nx = d.x * 2 - d.bx;  
ny = d.y * 2 - d.by;  
}
else 
{
nx = d.x;
ny = d.y;
}
path = ["C", nx, ny].concat(path.slice(1));
}
else if( cmd == "T")
{
if (pcom == "Q" || pcom == "T") 
{ 
d.qx = d.x * 2 - d.qx;
d.qy = d.y * 2 - d.qy;
}
else 
{
d.qx = d.x;
d.qy = d.y;
}
path = ["C"].concat(quadToCubic(d.x, d.y, d.qx, d.qy, path[1], path[2]));
}
else if( cmd == "Q")
{
d.qx = path[1];
d.qy = path[2];
path = ["C"].concat(quadToCubic(d.x, d.y, path[1], path[2], path[3], path[4]));
}
else if( cmd == "L")
path = ["C"].concat(linearToCubic(d.x, d.y, path[1], path[2]));
else if( cmd == "H")
path = ["C"].concat(linearToCubic(d.x, d.y, path[1], d.y));
else if( cmd == "V")
path = ["C"].concat(linearToCubic(d.x, d.y, d.x, path[1]));
else if( cmd == "Z")
path = ["C"].concat(linearToCubic(d.x, d.y, d.X, d.Y));

return path;
},
fixArc = function (pp, i) {
if (pp[i].length > 7) {
pp[i].shift();
var pi = pp[i];
while (pi.length) {
pcoms1[i] = "A"; 
p2 && (pcoms2[i] = "A"); 
pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
}
pp.splice(i, 1);
ii = Math.max(p.length, p2 && p2.length || 0);
}
},
fixM = function (path1, path2, a1, a2, i) {
if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
path2.splice(i, 0, ["M", a2.x, a2.y]);
a1.bx = 0;
a1.by = 0;
a1.x = path1[i][1];
a1.y = path1[i][2];
ii = Math.max(p.length, p2 && p2.length || 0);
}
},
pcoms1 = [], 
pcoms2 = [], 
pfirst = "", 
pcom = ""; 

for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
p[i] && (pfirst = p[i][0]); 

if (pfirst != "C") 
{
pcoms1[i] = pfirst; 
i && ( pcom = pcoms1[i - 1]); 
}

p[i] = processPath(p[i], attrs, pcom); 

if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; 



fixArc(p, i); 

if (p2) { 
p2[i] && (pfirst = p2[i][0]);
if (pfirst != "C") {
pcoms2[i] = pfirst;
i && (pcom = pcoms2[i - 1]);
}
p2[i] = processPath(p2[i], attrs2, pcom);

if (pcoms2[i] != "A" && pfirst == "C") {
pcoms2[i] = "C";
}

fixArc(p2, i);
}
fixM(p, p2, attrs, attrs2, i);
fixM(p2, p, attrs2, attrs, i);
var seg = p[i],
seg2 = p2 && p2[i],
seglen = seg.length,
seg2len = p2 && seg2.length;
attrs.x = seg[seglen - 2];
attrs.y = seg[seglen - 1];
attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
attrs2.x = p2 && seg2[seg2len - 2];
attrs2.y = p2 && seg2[seg2len - 1];

}

return p2 ? [p, p2] : p;
}
function stringToSegmentsArray(pathString)
{
if (!pathString)
return null;

var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
data = [];

if (!data.length)
{
String(pathString).replace(/([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig, function (a, b, c) {
var params = [],
name = b.toLowerCase();
c.replace(/(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/ig, function (a, b) {
b && params.push(+b);
});
if (name == "m" && params.length > 2) {
data.push([b].concat(params.splice(0, 2)));
name = "l";
b = b == "m" ? "l" : "L";
}
if (name == "o" && params.length == 1) {
data.push([b, params[0]]);
}
if (name == "r") {
data.push([b].concat(params));
} else while (params.length >= paramCounts[name]) {
data.push([b].concat(params.splice(0, paramCounts[name])));
if (!paramCounts[name]) {
break;
}
}
});
}
return data;
}
function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t)
{
var t1 = 1 - t,
t13 = Math.pow(t1, 3),
t12 = Math.pow(t1, 2),
t2 = t * t,
t3 = t2 * t,
x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
ax = t1 * p1x + t * c1x,
ay = t1 * p1y + t * c1y,
cx = t1 * c2x + t * p2x,
cy = t1 * c2y + t * p2y,
alpha = (90 - Math.atan2(mx - nx, my - ny) * 180 / TweenSpace._.PI() );

return {
x: x,
y: y,
m: {x: mx, y: my},
n: {x: nx, y: ny},
start: {x: ax, y: ay},
end: {x: cx, y: cy},
alpha: alpha
};
}

function catmullRom2bezier(crp, z)
{
var d = [];
for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
var p = [
{x: +crp[i - 2], y: +crp[i - 1]},
{x: +crp[i], y: +crp[i + 1]},
{x: +crp[i + 2], y: +crp[i + 3]},
{x: +crp[i + 4], y: +crp[i + 5]}
];
if (z) {
if (!i) {
p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
} else if (iLen - 4 == i) {
p[3] = {x: +crp[0], y: +crp[1]};
} else if (iLen - 2 == i) {
p[2] = {x: +crp[0], y: +crp[1]};
p[3] = {x: +crp[2], y: +crp[3]};
}
} else {
if (iLen - 4 == i) {
p[3] = p[2];
} else if (!i) {
p[0] = {x: +crp[i], y: +crp[i + 1]};
}
}
d.push(["C",
  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
  (p[1].x + 6 * p[2].x - p[3].x) / 6,
  (p[1].y + 6*p[2].y - p[3].y) / 6,
  p[2].x,
  p[2].y
]);
}

return d;
}
function ellipsePath(x, y, rx, ry, a)
{
if (a == null && ry == null) {
ry = rx;
}
x = +x;
y = +y;
rx = +rx;
ry = +ry;
if (a != null) {
var rad = Math.PI / 180,
x1 = x + rx * Math.cos(-ry * rad),
x2 = x + rx * Math.cos(-a * rad),
y1 = y + rx * Math.sin(-ry * rad),
y2 = y + rx * Math.sin(-a * rad),
res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
} else {
res = [
["M", x, y],
["m", 0, -ry],
["a", rx, ry, 0, 1, 1, 0, 2 * ry],
["a", rx, ry, 0, 1, 1, 0, -2 * ry],
["z"]
];
}
res.toString = toString;
return res;
}




})(TweenSpace || {});

(function ( TweenSpace ) {


TweenSpace.SplitText = function( params )
{
return new SplitText(params);
}


class SplitText
{
constructor (params)
{ 
if(params == undefined)
params = {};
params.elements = TweenSpace._.alternativeParams('elements', params);
var line_match = (params.type!= undefined) ? params.type.match("line") != null : false,
word_match = (params.type!= undefined) ? params.type.match("word") != null : false,
char_match = (params.type!= undefined) ? params.type.match("char") != null : false;

this.chars = this.char = [];
this.words = this.word = [];
this.lines = this.line = [];
this.elements = this.element = this.item = this.items = this.object = this.objects = function( elements )
{
if(elements != undefined)
this._.elements = TweenSpace._.getElements(elements);

return this._.elements;
}


this._ = 
{
isSplit: false,
elements: (params.elements!= undefined)?TweenSpace._.getElements(params.elements):undefined,
isLine: line_match,
isWord: word_match,
isChar: (line_match == false && word_match == false )?true:char_match,
round:  function (value, decimals) {
return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
},
originalData:[]
}

if( this._.elements != undefined )
this.split();
}


split(type)
{
if( type != undefined)
{
var line_match = (type!= undefined) ? type.match("line") != null : false,
word_match = (type!= undefined) ? type.match("word") != null : false,
char_match = (type!= undefined) ? type.match("char") != null : false;

this._.isLine = line_match;
this._.isWord = word_match;
this._.isChar = (line_match == false && word_match == false )?true:char_match;
}
   

if( this._.isSplit == false)
{
this._.isSplit = true;
var elems = this._.elements, chars, words, lines,
charWidthInc = 0, wordWidthInc = 0, wordsInLineInc = 0, 
startCharIndex = 0, startWordIndex = 0,lineInc = 0, charInc = 0, wordInc = -1;

if(elems!= undefined)
{
var i = 0;

for(;i<elems.length;i++)
{
var j = 0, 
parent_style = {}, 
stylesheet = window.getComputedStyle(elems[i], null);


parent_style.width = stylesheet.width;
parent_style.height = stylesheet.height;
parent_style.paddingLeft = stylesheet.paddingLeft;
parent_style.paddingRight = stylesheet.paddingRight;
parent_style.marginLeft = stylesheet.marginLeft;
parent_style.marginRight = stylesheet.marginRight;
parent_style.borderRightWidth = stylesheet.borderRightWidth;
parent_style.borderLeftWidth = stylesheet.borderLeftWidth;


for(;j<elems[i].childNodes.length;j++)
{
var lineStr = "";


if(elems[i].childNodes[j].data != undefined)
{
var str = elems[i].childNodes[j].data;
this._.originalData.push( elems[i].childNodes[j].data );
chars = str.split('');
words = str.split(' ');


elems[i].childNodes[j].data = "";

var k = 0;
wordInc++;
var div_word = document.createElement('div');
div_word.id = 'word_'+TweenSpace._.UID();
div_word.style.position = "relative";
div_word.style.display = "inline-block";
forChar:for(;k<str.length;k++)
{
var div_char;
div_char = document.createElement('div');
div_char.id = 'char_'+TweenSpace._.UID();
div_char.style.position = "relative";
div_char.style.display = "inline-block";


if( k+1 < str.length)
{
if(str[k+1]==" ")
div_char.innerHTML = str[k]+"&nbsp;";
else
div_char.innerHTML = str[k];
}

else
{
div_char.innerHTML = str[k];
if(this._.isWord == true)
{
this.words.push(div_word);
elems[i].appendChild(div_word);
wordsInLineInc++;
var style_word = window.getComputedStyle(div_word, null);
wordWidthInc += this._.round(parseFloat(style_word.width), 2) || 0;
}
}

if( str[k]==" " )
{

if(this._.isWord == true)
{
this.words.push(div_word);
elems[i].appendChild(div_word);
wordsInLineInc++;
var style_word = window.getComputedStyle(div_word, null);
wordWidthInc += this._.round(parseFloat(style_word.width), 2) || 0;
}

wordInc++;
div_word = document.createElement('div');
div_word.id = 'word_'+TweenSpace._.UID();
div_word.style.position = "relative";
div_word.style.display = "inline-block";
}
else
{

if(this._.isChar == true)
this.chars.push(div_char);

if(this._.isWord == true)
{

if(this._.isChar == true)
div_word.appendChild(div_char);

else
div_word.innerHTML += div_char.innerHTML;
}
else

elems[i].appendChild(div_char);
}


if(this._.isLine == true)
{
lineStr += str[k];
if(this._.isWord == true)
{

if( wordWidthInc >= this._.round(parseFloat(parent_style.width), 2) || k == str.length-1 )
{
var div_line = document.createElement('div');
div_line.id = 'line_'+TweenSpace._.UID();
div_line.style.position = "relative";
div_line.style.display = "inline-block";

var length = wordsInLineInc-1 + ((k == str.length-1)?1:0);
var m = startWordIndex;
forLoop1:for(;m<length;m++)
div_line.appendChild( elems[i].removeChild( document.getElementById('word_'+m) ) );

this.words.push(div_line);
elems[i].appendChild(div_line);
lineInc++;
this.lines.push(div_line);
startWordIndex = m;


if(k == str.length-1)
break forChar;

var style_word2 = window.getComputedStyle(document.getElementById('word_'+m), null);
wordWidthInc = this._.round(parseFloat(style_word2.width), 2) || 0;
}
}
else
{

if(this._.isChar == false)
elems[i].appendChild(div_char);

var style_char = window.getComputedStyle(div_char, null);
charWidthInc += this._.round(parseFloat(style_char.width), 2) || 0;
if( str[k]!=" " || k == str.length-1)
{
if( charWidthInc>=this._.round(parseFloat(parent_style.width), 2) || k == str.length-1 )
{
var lastChar = lineStr.slice(-1);
lineStr = lineStr.substring(0, lineStr.length-1);
lineStr += (k == str.length-1)?lastChar:"";

charWidthInc=this._.round(parseFloat(style_char.width), 2) || 0;
wordsInLineInc = 0;

var div_line = document.createElement('div');
div_line.id = 'line_'+TweenSpace._.UID();
div_line.style.position = "relative";
div_line.style.display = "inline-block";


if(this._.isChar == false)
div_line.innerHTML = lineStr;

else
{
var length = charInc-1;
var l = startCharIndex;
forLoop2:for(;l<=length;l++)
{
div_line.appendChild( elems[i].removeChild( document.getElementById('char_'+l) ) );
if(k == str.length-1 && l == length)
{
length++;
div_line.appendChild( elems[i].removeChild( document.getElementById('char_'+(l+1)) ) );
break forLoop2;
}
}
}

this.words.push(div_line);
elems[i].appendChild(div_line);
this.lines.push(div_line);

lineInc++;
lineStr = lastChar;
startCharIndex = length+1;
}
}


if(this._.isChar == false)
elems[i].removeChild(div_char);
}
}

if(str[k] != " ")
charInc++;
}
}
}
}
}
}
}

 
unsplit()
{
if( this._.isSplit == true)
{
this._.isSplit = false;
var elems = this._.elements;
var i = 0;


for(;i<elems.length;i++)
elems[i].innerHTML = this._.originalData[i];
}
} 
}

})(TweenSpace || {});