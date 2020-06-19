/*
Copyright (c) 2011-2017 TweenSpace

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
if (TweenSpace === undefined) 
{    
    /**
     * TweenSpace Engine.
     * @class TweenSpace is a Javascript library that tweens object properties producing smooth animations.
     * It is an optimized tweening engine written from square one in pure Javascript with no dependencies. 
     * Tween and Timeline are the core classes that make possible the creation and management of many types of tweenings.
     * Tween instances are responsible of handling animations on single and multiple objects.
     * Timeline instances are capable of controlling playback operations and time management on groups of tweens.
     * @public
     */
    var TweenSpace, Tweenspace, TS;
    TweenSpace = Tweenspace = TS = (function ()
    {
        return {
            /* Underscore is an object which contains TweenSpace private properties and methods.
            * @private*/
            _:{}
        };
    })();
}
(function ( TweenSpace ) {

    /**
     * Node.
     * @class Internal class. Simple node used in DoublyList.
     * @param {Tween} value - Stores a Tween instance.
     * @return {Node}  - Node instance.
     * @private
     */
    function Node(value)
    {
        this.data = value;
        this.prev = null;
        this.next = null;

        return this;
    }

    /* Private stuff.
     * @private*/
    TweenSpace._.Node = function(value)
    {
        return new Node(value);
    };

})(TweenSpace || {});
(function ( TweenSpace ) {
    /**
     * DoublyList.
     * @class Internal class that implements a circular bi-directional linked list in both directions.
     * @return {DoublyList} - DoublyList instance.
     * @private
     */
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
        
        /* Inserts a new_data before or after specified existing_node. 
         * When 'before_after_bool' is set to false, the new_data will be inserted before the 'existing_node'.
         * @private*/
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
            
            //Add node after existing node
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
            //Add node before existing node
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

            //node = null;
            _length--;
            _length = (_length < 0)?0:_length;//_length = (_length > 0)?_length:0;

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

    /* Private stuff.
     * @private*/
    TweenSpace._.DoublyList = function()
    {
        return new DoublyList();
    };

})(TweenSpace || {});
(function ( TweenSpace ) {
    
    //"use strict";
    /** Reference to TweenSpace object.
     * @private */
    var _this = this;
    /** Circular doubly linked list of the tweens being played.
     * @private */
    var _queue_DL = TweenSpace._.DoublyList();
    /** Circular doubly linked list of paused tweens.
     * @private */
    var _queue_paused_DL = TweenSpace._.DoublyList();
    /** Temporary Node instance used in DoublyList. 'data' property holds a Tween instance.
     * @private */
    var _node = TweenSpace._.Node();
    /** Another temporary Node instance used in DoublyList.
     * @private */
    var _node_paused = TweenSpace._.Node();
    /** Temporary Tween instance.
     * @private */
    var _tween = null;
    /** _delayed calls list.
     * @private */
    var _delayedCallList = TweenSpace._.DoublyList();
    /** Temporary Node instance used in _delayedCallList.
     * @private */
    var _delayedCallNode = TweenSpace._.Node();
    /** PI value.
     * @private */
    var _pi = 3.1415926535897932384626433832795;
    var _pi_m2 = _pi * 2;
    var _pi_d2 = _pi / 2;
    /** Stores a unique id number.
     * @private */
    var _UID = 0;
    /** Clamps a val between min and max.
     * @private */
    var _clamp = function (val, min, max)
    {
        if(val<min) val = min;
        else if(val>max) val = max;

        return val;
    }
    /**
     * Return the greatest property value of an array of tweens.
     * @private */
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
    /**
     * Returns an array of the specified elements to be animated.
     * @private */
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

    /**
     * Loop over tweens.
     * @private */
    function _tick_tweens(dt)
    {
        _tween = null;
        
        //Loop over tweens
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
    /**
     * Private method that plays a group of tweens that share common animated properties. These tweens will be played sequentially
     * with an offset in time based on the tweenDelay property. TweenSpace.sequentialTo() returns a timeline object 
     * while TweenSpace.sequential() returns an array of tweens.
     * @private */
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
                    
                    //Check if tweenDelay is function-based
                    if(tweenDelay.constructor == String)
                        //If *=, add 1 to delayInc, otherwise will be multiply by 0 and will never increment. 
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
                            //delete params[param];
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
                    
                    //Loop over NON TS params only
                    function manageFromToValues(inputParams, arrayInc)
                    {
                        for ( var param in inputParams )
                        {
                            //console.log(param, inputParams[param], inputParams);
                            if(inputParams[param].constructor == String)
                            {
                                //Is function-based value
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
                    
                    //Restore deleted TS params
                    for (var param in tsParams)
                        params[param] = tsParams[param];

                    params.elements = elements[i];
                    params.delay = delayInc + delay;
                    params.duration = duration;
                    
                    if(clonedFromParams != undefined)
                        params.fromParams = clonedFromParams;
                    
                    //_sequential() assigns params onProgress and onComplete to each tween created.
                    //_sequentialTo() assigns params onProgress and onComplete to a timeline created.
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

        //return null;
    }        
    /**
     * Private method that sets attributes and css properties.
     * @private */
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
                    //css properties
                    _elements[i].style[param] = params[param];
                else
                {
                    //TweenSpace custom properties
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
            
            //Temporary property to make Tween class know that this call comes from numberTo method.
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
    /**
     * Robert Penner's Easing Equations.
     * @private */
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
    /**
     * PerlinNoise.
     * @class Internal class that creates 1D Perlin Noise values.
     * @return {PerlinNoise} - PerlinNoise instance.
     * @private
     */
    function PerlinNoise( amplitude, frequency, seed )
    {
        if( seed == undefined) seed = 0;

        this.amplitude = amplitude;
        this.frequency = frequency;

        var _this = this;
        var _MAX_VERTICES = 256; //256
        var _MAX_VERTICES_MASK = _MAX_VERTICES -1;
        var _vertices = [];
        var m = 0x80000000, a = 1103515245, c = 12345, next = seed;
        var _xMin, _xMax;

        this.constructor = new function()
        {
            for ( var i = 0; i < _MAX_VERTICES; ++i )
            {
                //Non-deterministic
                //next = Math.random()*((Math.random()<0.5)?-1:1);

                //Deterministic
                //https://en.wikipedia.org/wiki/Linear_congruential_generator
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
    /**
     * Wave.
     * @class Internal class that generates sine wave numbers.
     * @return {Wave} - Wave instance.
     * @private
     */
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
    /**
     * shuffleDelay.
     * @class Shuffles array items.
     * @return {array} - An array with the items shuffled.
     * @private
     */
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

    /**
    * Static method that returns a Tween instance which holds destination values and other properties.
    * This method creates and queues a Tween instance as well as stores its current values.
    * @method to
    * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
    * @property {int} params.duration - Tween duration in milliseconds. Check this link: http://codepen.io/TweenSpace/pen/mVwBdY
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation. http://codepen.io/TweenSpace/pen/BjZJdb
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount. Try this example: http://codepen.io/TweenSpace/pen/GoEyQP
    * @property {int} params.repeat - Amount of times that the animation will be played. http://codepen.io/TweenSpace/pen/pgwpdj
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower. Please go to: http://codepen.io/TweenSpace/pen/OMzegL and http://codepen.io/TweenSpace/pen/WrOMQx
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time. http://codepen.io/TweenSpace/pen/qbjxZJ
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running. http://codepen.io/TweenSpace/pen/dMeVYR
    * @property {function} params.onComplete - Callback dispatched when the animation has finished. http://codepen.io/TweenSpace/pen/vGjeEe
    * @property {function} params.onRepeat - Callback dispatched when the animation starts a repetition.
    * @property {object} params.wiggle - Adds deterministic randomness to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                    You can also change the seed property to obtain different deterministic random behaviors. wiggle can be used in two ways.
    *                                    For setting multiple css properties at once use the following approach:
    *                                    http://codepen.io/TweenSpace/pen/PGWzoV
    *                                    When setting css properties separately follow this example:
    *                                    http://codepen.io/TweenSpace/pen/XjpKJp
    * @property {object} params.wave - Adds oscilatory to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                   http://codepen.io/TweenSpace/pen/QKKbJy
    * @property {string} params.drawSVG - Value or set of values that allows you to animate an svg stroke length. Values can be provided as percentages as well as numbers.
    *                                   Try this example: http://codepen.io/TweenSpace/pen/yORjYO
    * @property {object} params.motionPathSVG - Makes any html element move along an SVG path. 'motionPathSVG' object contains the following properties:<br>
    *                                       <p style="padding-left:40px;">
    *                                       path : SVG object which serves as the trajectory.<br>
    *                                       'from' : Starting position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       'to' : Destination position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       rotationOffset : Offsets current rotation in degrees for custom purposes.<br>
    *                                       pivotX : Adjusts the current moving object's pivot in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       pivotY : Adjusts the current moving object's pivot in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetX : Offsets the current moving object's position in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetY : Offsets the current moving object's position in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       'align' : Rotates automatically the moving object accordingly to the path's orientation using the current css transform-origin values.<br>
    *                                       http://codepen.io/TweenSpace/pen/qaRVKK
    *                                       </p>
    * @property {object} params.morphSVG -  Morphs from one SVG Element to another. morphSVG will match the necessary amount of points for both paths,
    *                                       besides, it provides handy properties like reverse, shapeIndex and debug. Accepted SVG Elemets are circle, rect, ellipse, polygon, and path.
    *                                       'morphSVG' object contains the following properties:
    *                                       <p style="padding-left:40px;">
    *                                       reverse : Changes the direction of the destination path. <br>
    *                                       shapeIndex : Offsets the points along the destination path. <br>
    *                                       debug : Shows graphics regarding initial and destination path for setup purposes. When debug is true, the green path is the initial path
    *                                       while the red one is the destination path. Also, a larger dot indicates the end point and the max amount of points,
    *                                       while a smaller dot represents either a 25% of length of the path or a user shapeIndex on the path. Notice that
    *                                       the smaller dot indicates the direction of the path which is useful when matching dots positions.<br>
    *                                       Please go here for more info: http://codepen.io/TweenSpace/pen/KMpedd
    *                                       </p>
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace */
    TweenSpace.to = function( params )
    {
        var tween = TweenSpace.Tween( params );
        tween.play();

        return tween;
    };
    /**
    * Static method that creates and plays a Tween instance which holds starting values and other properties.
    * In contrast with the 'to()' method, the input values will be used as starting values while the current ones will be considered destination values.
    * Please check this example https://codepen.io/TweenSpace/pen/BdYwqy/
    * @method from
    * @param {object} params - An object containing the starting values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
    * @property {int} params.duration - Tween duration in milliseconds. Check this link: http://codepen.io/TweenSpace/pen/mVwBdY
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation. http://codepen.io/TweenSpace/pen/BjZJdb
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount. Try this example: http://codepen.io/TweenSpace/pen/GoEyQP
    * @property {int} params.repeat - Amount of times that the animation will be played. http://codepen.io/TweenSpace/pen/pgwpdj
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower. Please go to: http://codepen.io/TweenSpace/pen/OMzegL and http://codepen.io/TweenSpace/pen/WrOMQx
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time. http://codepen.io/TweenSpace/pen/qbjxZJ
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running. http://codepen.io/TweenSpace/pen/dMeVYR
    * @property {function} params.onComplete - Callback dispatched when the animation has finished. http://codepen.io/TweenSpace/pen/vGjeEe
    * @property {function} params.onRepeat - Callback dispatched when the animation starts a repetition.
    * @property {object} params.wiggle - Adds deterministic randomness to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                    You can also change the seed property to obtain different deterministic random behaviors. wiggle can be used in two ways.
    *                                    For setting multiple css properties at once use the following approach:
    *                                    http://codepen.io/TweenSpace/pen/PGWzoV
    *                                    When setting css properties separately follow this example:
    *                                    http://codepen.io/TweenSpace/pen/XjpKJp
    * @property {object} params.wave - Adds oscilatory to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                   http://codepen.io/TweenSpace/pen/QKKbJy
    * @property {string} params.drawSVG - Value or set of values that allows you to animate an svg stroke length. Values can be provided as percentages as well as numbers.
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace */
    TweenSpace.from = function( params )
    {
        params[TweenSpace.params.isFrom] = true;
        var tween = TweenSpace.Tween( params );
        tween.play();

        return tween;
    };
    /**
    * Static method that creates and plays a Tween instance which holds starting and destination values as well as other properties.
    * @method fromTo
    * @param {object} fromParams - An object containing the starting values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @param {object} toParams - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} (fromParams or toParams).elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
    * @property {int} (fromParams or toParams).duration - Tween duration in milliseconds. Check this link: http://codepen.io/TweenSpace/pen/mVwBdY
    * @property {int} (fromParams or toParams).delay - Amount of time in milliseconds to wait before starting the animation. http://codepen.io/TweenSpace/pen/BjZJdb
    * @property {boolean} (fromParams or toParams).yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount. Try this example: http://codepen.io/TweenSpace/pen/GoEyQP
    * @property {int} (fromParams or toParams).repeat - Amount of times that the animation will be played. http://codepen.io/TweenSpace/pen/pgwpdj
    * @property {int} (fromParams or toParams).timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower. Please go to: http://codepen.io/TweenSpace/pen/OMzegL and http://codepen.io/TweenSpace/pen/WrOMQx
    * @property {function} (fromParams or toParams).ease - Easing function that describes the rate of change of a parameter over time. http://codepen.io/TweenSpace/pen/qbjxZJ
    *                                  Equations used were developed by Robert Penner.
    * @property {function} (fromParams or toParams).onProgress - Callback dispatched every engine tick while animation is running. http://codepen.io/TweenSpace/pen/dMeVYR
    * @property {function} (fromParams or toParams).onComplete - Callback dispatched when the animation has finished. http://codepen.io/TweenSpace/pen/vGjeEe
    * @property {function} (fromParams or toParams).onRepeat - Callback dispatched when the animation starts a repetition.
    * @property {object} (fromParams or toParams).wiggle - Adds deterministic randomness to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                    You can also change the seed property to obtain different deterministic random behaviors. wiggle can be used in two ways.
    *                                    For setting multiple css properties at once use the following approach:
    *                                    http://codepen.io/TweenSpace/pen/PGWzoV
    *                                    When setting css properties separately follow this example:
    *                                    http://codepen.io/TweenSpace/pen/XjpKJp
    * @property {object} (fromParams or toParams).wave - Adds oscilatory to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                   http://codepen.io/TweenSpace/pen/QKKbJy
    * @property {string} (fromParams or toParams).drawSVG - Value or set of values that allows you to animate an svg stroke length. Values can be provided as percentages as well as numbers.
    *                                   Try this example: http://codepen.io/TweenSpace/pen/yORjYO
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace */
    TweenSpace.fromTo = function( fromParams, toParams )
    {
        if(toParams == undefined)
        {
            console.warn("TweenSpace.sequentialFromTo(): Destination values has not been set. Please add an object "+
                        "with properties as a 2nd parameter. I.e. {css_property:'value'}");
            
            return;
        }
        
		
		
        //Loop over TweenSpace parameters
        for ( var tsProp in TweenSpace.params )
        {
            //TweenSpace parameters declarared in fromParams will prevail over the ones in toParams
            if(fromParams[tsProp] != undefined || toParams[tsProp] != undefined)
             {
                 toParams[tsProp] = fromParams[tsProp] || toParams[tsProp];
                 if(fromParams[tsProp] != undefined)
                     delete fromParams[tsProp];
             }    
        }    
        
        toParams[TweenSpace.params.isFrom] = false;
        toParams.fromParams = fromParams;
		
		//CHECK IMMEDIATE RENDER^^^^^^^^^^^^^^^^^^^^^^^^^^^^
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
		//CHECK IMMEDIATE RENDE^^^^^^^^^^^^^^^^^^^^^^^^^^^^
		
        var tween = TweenSpace.Tween( toParams );
        tween.play();
        
        return tween;
    };
    /** Static method that returns an array of Tween instances. In contrast to the static method sequentialTo,
    * this method does not start the animation. When the time comes to animate the same properties on multiple objects
    * this method reduces multiple tweens instantiation into one. Control the amount of delayed time between each tween using the tweenDelay parameter.
    * If tweenDelay parameter is set to cero or just not declared, all tweens will start at the same time. If tweenDelay parameter is greater than cero, 
    * objects will play with a delayed start time between each tween.
    * @method sequential
    * @param {object} params -  An object containing the common destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    *                           The following properties are exclusive for this method. For more additional TweenSpace custom properties please go to TweenSpace.to() method description.
    * @property {int} params.tweenDelay - Is the time offset between each tween. The tweenDelay amount will increment linearly as the tweens are played.
    * @property {boolean} params.shuffle - If shuffle is set to true, the tweens are going to be played in a deterministic random fashion.
    * @property {int} params.seed - Change this value in order to get different random behaviors.
    * @return {array} - Array of Tween instances.
    * @memberof TweenSpace */
    TweenSpace.sequential = function( params )
    {
        return _sequential( params );
    };
    /** Static method that returns Timeline object that contains a sequence of tweens. In contrast to the static method sequential,
    * this method plays the animation right after instantiation. When the time comes to animate the same properties on multiple objects
    * this method reduces multiple tweens instantiation into one. Control the amount of delayed time between each tween using the tweenDelay parameter.
    * If tweenDelay parameter is set to cero or just not declared, all tweens will start at the same time. If tweenDelay parameter is greater than cero, 
    * objects will play with a delayed start time between each tween.
    * @method sequentialTo
    * @param {object} params -  An object containing the common destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    *                           The following properties are exclusive for this method. For more additional TweenSpace custom properties please go to TweenSpace.to() method description.
    * @property {int} params.tweenDelay - Is the time offset between each tween. The tweenDelay amount will increment linearly as the tweens are played.
    * @property {boolean} params.shuffle - If shuffle is set to true, the tweens are going to be played in a deterministic random fashion.
    * @property {int} params.seed - Change this value in order to get different random behaviors.
    * @return {Timeline} - Timeline object.
    * @memberof TweenSpace */
    TweenSpace.sequentialTo = function( params )
    {
        return _sequential( params, true );
    };
    /** Static method that returns Timeline object that contains a sequence of tweens. This method plays the animation right after instantiation.
    * en the time comes to animate the same properties on multiple objects this method reduces multiple tweens instantiation into one.
    * Control the amount of delayed time between each tween using the tweenDelay parameter.
    * If tweenDelay parameter is set to cero or just not declared, all tweens will start at the same time. If tweenDelay parameter is greater than cero, 
    * objects will play with a delayed start time between each tween.
    * @method sequentialFrom
    * @param {object} params -  An object containing the common starting values of css properties and TweenSpace parameters defined in TweenSpace.params.
    *                           The following properties are exclusive for this method. For more additional TweenSpace custom properties please go to TweenSpace.to() method description.
    * @property {int} params.tweenDelay - Is the time offset between each tween. The tweenDelay amount will increment linearly as the tweens are played.
    * @property {boolean} params.shuffle - If shuffle is set to true, the tweens are going to be played in a deterministic random fashion.
    * @property {int} params.seed - Change this value in order to get different random behaviors.
    * @return {Timeline} - Timeline object.
    * @memberof TweenSpace */
    TweenSpace.sequentialFrom = function( params )
    {
        params[TweenSpace.params.isFrom] = true;
        return _sequential( params, true );
    };
    /** Static method that returns Timeline object that contains a sequence of tweens. This method plays the animation right after instantiation.
    * en the time comes to animate the same properties on multiple objects this method reduces multiple tweens instantiation into one.
    * Control the amount of delayed time between each tween using the tweenDelay parameter.
    * If tweenDelay parameter is set to cero or just not declared, all tweens will start at the same time. If tweenDelay parameter is greater than cero, 
    * objects will play with a delayed start time between each tween.
    * @method sequentialFromTo
    * @param {object} fromParams - An object containing the common starting values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @param {object} toParams - An object containing the common destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    *                            The following properties are exclusive for this method. For more additional TweenSpace custom properties please go to TweenSpace.to() method description.
    * @property {int} (fromParams or toParams).tweenDelay - Is the time offset between each tween. The tweenDelay amount will increment linearly as the tweens are played.
    * @property {boolean} (fromParams or toParams).shuffle - If shuffle is set to true, the tweens are going to be played in a deterministic random fashion.
    * @property {int} (fromParams or toParams).seed - Change this value in order to get different random behaviors.
    * @return {Timeline} - Timeline object.
    * @memberof TweenSpace */
    TweenSpace.sequentialFromTo = function( fromParams, toParams )
    {
        if(toParams == undefined)
        {
            console.warn("TweenSpace.sequentialFromTo(): Destination values has not been set. Please add an object "+
                        "with properties as a 2nd parameter. I.e. {css_property:'value'}");
            
            return;
        }
        
        //Loop over TweenSpace parameters
        for ( var tsProp in TweenSpace.params )
        {
            //TweenSpace parameters declarared in fromParams will prevail over the ones in toParams
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
    /** Static method that pauses all tweens and timelines.
    * @method pauseAll
    * @memberof TweenSpace */
    TweenSpace.pauseAll = function()
    {
        for( ;_queue_DL.length() > 0; )
            _queue_DL.head.data.pause();
    };
    /** Static method that resumes all tweens and timelines.
    * @method resumeAll
    * @memberof TweenSpace */
    TweenSpace.resumeAll = function()
    {
        for( ;_queue_paused_DL.length() > 0; )
            _queue_paused_DL.head.data.resume();
    };
    /** Static method that stops all tweens and timelines.
    * @method stopAll
    * @memberof TweenSpace */
    TweenSpace.stopAll = function()
    {
        for( ;_queue_DL.length() > 0; )
            _queue_DL.head.data.stop();

        for( ;_queue_paused_DL.length() > 0; )
            _queue_paused_DL.head.data.stop();
    };
    /** Static method that sets attributes and css properties.
    * @method set
    * @memberof TweenSpace */
    TweenSpace.set = function( params )
    {
        return _set( params );
    };
    /** TweenSpace params contains custom properties such as delay, onComplete, etc. TweenSpace.params object is intended to be used as a reference only.
    * @memberof TweenSpace */
    TweenSpace.params =
    {
        //Exclusive Paramenters for TweenSpace.sequential() and TweenSpace.sequentialTo()
        tweenDelay: 'tweenDelay',
        shuffle: 'shuffle',
        seed: 'seed',

        //Exclusive Paramenters for TweenSpace.Timeline()
        tweens: 'tweens',

        //Exclusive Paramenters for TweenSpace.Tween()
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
        fromParams: 'fromParams', //for internal use only
        immediateRender: 'immediateRender',
        ease:
        {
            //Robert Penner's Easing Equations
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
    /** Static method that calls a function after an specified time.
    * @method delayedCall
    * @param {function} callback - Function to call.
    * @param {int} delay - Delay time in milliseconds.
    * @memberof TweenSpace */
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
    /** Static method that tweens a number over time using 'from' and 'to' properties in the params object.
    * @method numberTo
    * @param {object} params - An object containing TweenSpace custom properties.
    * @memberof TweenSpace */
    TweenSpace.numberTo = function( params )
    {
        return _numberTo( params );
    };
    /** Static method that kills all pending delayed calls.
    * @method killDelayedCalls
    * @memberof TweenSpace */
    TweenSpace.killDelayedCalls = function()
    {
        for( ;_delayedCallList.length() > 0; )
        {    
            clearTimeout( _delayedCallList.head.data );
            _delayedCallList.remove(_delayedCallList.head);
        }
    };

    /** Global property that checks conflicts on multiple animations for the same property.
    *  @memberof TweenSpace */
    TweenSpace.checkConflict = true;
    /** Global property that ensures to render the initial values declared
     *  in 'from' properties and methods. This means that the element's initial
     *  state can be different to the starting values specified.
    *  @memberof TweenSpace */
    TweenSpace.immediateRender = false;
        
    /** Callback dispatched every engine tick while animation is running.
    *  @memberof TweenSpace */
    TweenSpace.onProgressAll = function()
    {};
    /** Callback dispatched when engine finishes all its queues.
    *  @memberof TweenSpace */
    TweenSpace.onCompleteAll = function()
    {};
    /* Private stuff.
     * @private*/
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
    TweenSpace._.queue_paused_DL = _queue_paused_DL;
    TweenSpace._.PI = function() { return _pi };

    /** Method that manages function based values such as +=, -=, *= and /=. 
     * @private*/
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
    
    /** Manages TS properties seudonames. 
     * @private*/
    TweenSpace._.alternativeParams = function ( paramName, alternativeParams )
    {
        /*                      !!!!!!   IMPORTANT NOTE !!!!!!!
            Properties added here need to be declared in "TweenSpace.params" object as well.
        */        
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
	/** Check if parameter exists. 
     * @private*/
    TweenSpace._.checkParam = function (param)
	{
		for (let prop in TweenSpace.params)
		{
			if(param == prop)
				return true;
		}
		
		return false;
	}
    /** Creates a unique id number. 
     * @private*/
    TweenSpace._.UID = function ( )
    {
        return _UID++;
    }
    /** Increment number for debugging purposes only. 
     * @private*/
    TweenSpace._.counter = 0;
    /** TweenSpace Engine current version: 1.9.91.0
     *  @memberof TweenSpace */
    TweenSpace.version = '1.9.91.0'; //release.major.minor.dev_stage
    /** Useful under a debugging enviroment for faster revisiones.
     *  If true, the engine will assign destination values immediately and no animation will be performed.
     *  @memberof TweenSpace */
    TweenSpace.debug = false;
    
})(TweenSpace || {});
/**
 * Engine loop module.
 * @private */
(function ( TweenSpace )
{
    /** if true, engine is running.
     * @private */
    var _isEngineOn = false;
    /** Global elapsed time.
     * @private */
    var _eTime = 0;
    /** Delta time.
     * @private */
    var _dt = 0;
    /** Accumulated delta time. If last frame took more time to calculate
     * than expected, that delta time will be saved and added up 
     * to the next on time frame's delta time. 
     * @private */
    var _dt_accum = 0;
    /** Ideal delta time.
     * @private */
    var _interval = 16.67;
    /** Ideal delta time.
     * @private */
    var _min_interval = 1;
    /** Ideal delta time.
     * @private */
    var _max_interval = 34;
    /** Counts each tick call.
     * @private */
    var _tickCounter = 0;
    /** Stores time right before starting the engine.
     * @private */
    var _start_time = 0;
    /** Stores current time.
     * @private */
    var _now;
    /** Stores last time.
     * @private */
    var _then = 0;
    /** requestAnimationFrame method id.
     * @private */
    var _reqID = 0;
    
    /** Request animation frame.
     * @private */
    var _requestAnimationFrame =    window.requestAnimationFrame ||
                                    window.mozRequestAnimationFrame || 
                                    window.webkitRequestAnimationFrame ||
                                    window.msRequestAnimationFrame,
        _cancelAnimationFrame =     window.cancelAnimationFrame ||
                                    window.mozCancelAnimationFrame || 
                                    window.webkitCancelAnimationFrame ||
                                    window.msCancelAnimationFrame;
    
    var _queue_DL, _tick_tweens;
    
    
    /** tick method counter.
     *  @private */
    TweenSpace._.tickCounter = function()
    {
        return _tickCounter;
    }
    /** Delta time.
     *  @private */
    TweenSpace._.dt = function(dt)
    {
        if(dt) _dt = dt;
        return _dt;
    }
    /** Delta time.
     *  @private */
    TweenSpace._.interval = function()
    {
        return _interval;
    }
    /** Engine loop based on 'requestAnimationFrame' method.
     *  @private */
    TweenSpace._.engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            _isEngineOn = true;
            _tickCounter = _eTime = _dt = _dt_accum = 0;
            _start_time = _then = window.performance.now();
            
            _queue_DL = TweenSpace._.queue_DL;
            _tick_tweens = TweenSpace._.tick_tweens;
            //var body_DL = TweenSpace.Physics._.body_DL; //__________________________________________________________________________________________________________________________
            
             _requestAnimationFrame(tick);//tick();
        }
    }
    
    function tick(now)
    {
//---------------------------------------------------------
        
        if(!_then) 
            _start_time = _then = now;
		
        //_eTime = now - _start_time;
        _dt = now - _then;
        _then = now;
        
        //Loop over tweens
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
        if( _queue_DL.length() > 0 )//|| TweenSpace.Physics.active == true ) 
        {
            _reqID = _requestAnimationFrame(tick);
        }
        else
        {
            //Engine turns off
            _isEngineOn = false;
            _eTime = 0;
			_dt = 16.67;
        }
            
        
//---------------------------------------------------------
        //Loop over bodies
//        if(TweenSpace.Physics.active == true)
//            TweenSpace.Physics._.updateBodies(); //__________________________________________________________________________________________________________________________

        _tickCounter++;
        
//        if(_tickCounter%20==0)
//            console.log('fps: ', 1000/_dt, _queue_DL.length() );
    }
    
    /**
     * Event to pause TweenSpace engine entirely while window or tab is hidden.
     * @private */
    document.addEventListener("visibilitychange", TweenSpaceOnVizChange);
    function TweenSpaceOnVizChange(e)
    {
        if(document.visibilityState == 'hidden')
            setTimeout( function() { TweenSpace.pauseAll(); }, 16.67);
        else
            setTimeout( function() { TweenSpace.resumeAll(); }, 16.67);
    }
    
})(TweenSpace || {});
/*Tween Module*/
(function (TweenSpace) {
    
    /**
    * Static method that creates Tween instances which are responsible of handling animations on single and multiple objects. The Tween class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc.
    * @method Tween
    * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or query selection string.
    * @property {int} params.duration - Tween duration in milliseconds. Check this link: http://codepen.io/TweenSpace/pen/mVwBdY
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation. http://codepen.io/TweenSpace/pen/BjZJdb
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount. Try this example: http://codepen.io/TweenSpace/pen/GoEyQP
    * @property {int} params.repeat - Amount of times that the animation will be played. http://codepen.io/TweenSpace/pen/pgwpdj
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower. Please go to: http://codepen.io/TweenSpace/pen/OMzegL and http://codepen.io/TweenSpace/pen/WrOMQx
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time. http://codepen.io/TweenSpace/pen/qbjxZJ
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running. http://codepen.io/TweenSpace/pen/dMeVYR
    * @property {function} params.onComplete - Callback dispatched when the animation has finished. http://codepen.io/TweenSpace/pen/vGjeEe
    * @property {function} params.onRepeat - Callback dispatched when the animation starts a repetition.
    * @property {object} params.wiggle - Adds deterministic randomness to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                    You can also change the seed property to obtain different deterministic random behaviors. wiggle can be used in two ways.
    *                                    For setting multiple css properties at once use the following approach:
    *                                    http://codepen.io/TweenSpace/pen/PGWzoV
    *                                    When setting css properties separately follow this example:
    *                                    http://codepen.io/TweenSpace/pen/XjpKJp
    * @property {object} params.wave - Adds oscilatory to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                   http://codepen.io/TweenSpace/pen/QKKbJy
    * @property {string} params.drawSVG - Value or set of values that allows you to animate an svg stroke length. Values can be provided as percentages as well as numbers.
    *                                   Try this example: http://codepen.io/TweenSpace/pen/yORjYO
    * @property {object} params.motionPathSVG - Makes any html element move along an SVG path. 'motionPathSVG' object contains the following properties:<br>
    *                                       <p style="padding-left:40px;">
    *                                       path : SVG object which serves as the trajectory.<br>
    *                                       'from' : Starting position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       'to' : Destination position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       rotationOffset : Offsets current rotation in degrees for custom purposes.<br>
    *                                       pivotX : Adjusts the current moving object's pivot in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       pivotY : Adjusts the current moving object's pivot in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetX : Offsets the current moving object's position in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetY : Offsets the current moving object's position in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       'align' : Rotates automatically the moving object accordingly to the path's orientation using the current css transform-origin values.<br>
    *                                       https://codepen.io/TweenSpace/pen/OjyRyP
    *                                       </p>
    * @property {object} params.morphSVG -  Morphs from one SVG Element to another. morphSVG will match the necessary amount of points for both paths,
    *                                       besides, it provides handy properties like reverse, shapeIndex and debug. Accepted SVG Elemets are circle, rect, ellipse, polygon, and path.
    *                                       'morphSVG' object contains the following properties:
    *                                       <p style="padding-left:40px;">
    *                                       reverse : Changes the direction of the destination path. <br>
    *                                       shapeIndex : Offsets the points along the destination path. <br>
    *                                       debug : Shows graphics regarding initial and destination path for setup purposes. When debug is true, the green path is the initial path
    *                                       while the red one is the destination path. Also, a larger dot indicates the end point and the max amount of points,
    *                                       while a smaller dot represents either a 25% of length of the path or a user shapeIndex on the path. Notice that
    *                                       the smaller dot indicates the direction of the path which is useful when matching dots positions.<br>
    *                                       Please go here for more info: https://codepen.io/TweenSpace/pen/xLwOyp
    *                                       </p>                    
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace
    * */
    TweenSpace.Tween = function (params)
    {
        return new Tween(params);
    }
        
    /**
    * @class Tween class is responsible of handling animations on single and multiple objects. This class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc. 
    * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or query selection string.
    * @property {int} params.duration - Tween duration in milliseconds. Check this link: http://codepen.io/TweenSpace/pen/mVwBdY
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation. http://codepen.io/TweenSpace/pen/BjZJdb
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount. Try this example: http://codepen.io/TweenSpace/pen/GoEyQP
    * @property {int} params.repeat - Amount of times that the animation will be played. http://codepen.io/TweenSpace/pen/pgwpdj
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower. Please go to: http://codepen.io/TweenSpace/pen/OMzegL and http://codepen.io/TweenSpace/pen/WrOMQx
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time. http://codepen.io/TweenSpace/pen/qbjxZJ
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running. http://codepen.io/TweenSpace/pen/dMeVYR
    * @property {function} params.onComplete - Callback dispatched when the animation has finished. http://codepen.io/TweenSpace/pen/vGjeEe
    * @property {function} params.onRepeat - Callback dispatched when the animation starts a repetition.
    * @property {object} params.wiggle - Adds deterministic randomness to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                    You can also change the seed property to obtain different deterministic random behaviors. wiggle can be used in two ways.
    *                                    For setting multiple css properties at once use the following approach:
    *                                    http://codepen.io/TweenSpace/pen/PGWzoV
    *                                    When setting css properties separately follow this example:
    *                                    http://codepen.io/TweenSpace/pen/XjpKJp
    * @property {object} params.wave - Adds oscilatory to property values. Use amplitude property to modify the magnitude of the effect and frequency property to change the speed.
    *                                   http://codepen.io/TweenSpace/pen/QKKbJy
    * @property {string} params.drawSVG - Value or set of values that allows you to animate an svg stroke length. Values can be provided as percentages as well as numbers.
    *                                   Try this example: http://codepen.io/TweenSpace/pen/yORjYO
    * @property {object} params.motionPathSVG - Makes any html element move along an SVG path. 'motionPathSVG' object contains the following properties:<br>
    *                                       <p style="padding-left:40px;">
    *                                       path : SVG object which serves as the trajectory.<br>
    *                                       'from' : Starting position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       'to' : Destination position on curve based on percentage of length or a value between 0 and curve length.<br>
    *                                       rotationOffset : Offsets current rotation in degrees for custom purposes.<br>
    *                                       pivotX : Adjusts the current moving object's pivot in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       pivotY : Adjusts the current moving object's pivot in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetX : Offsets the current moving object's position in the x axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       offsetY : Offsets the current moving object's position in the y axis. This value will be considered in pixel units only,
    *                                       therefore only numerical values will be accepted.<br>
    *                                       'align' : Rotates automatically the moving object accordingly to the path's orientation using the current css transform-origin values.<br>
    *                                       https://codepen.io/TweenSpace/pen/OjyRyP
    *                                       </p>
    * @property {object} params.morphSVG -  Morphs from one SVG Element to another. morphSVG will match the necessary amount of points for both paths,
    *                                       besides, it provides handy properties like reverse, shapeIndex and debug. Accepted SVG Elemets are circle, rect, ellipse, polygon, and path.
    *                                       'morphSVG' object contains the following properties:
    *                                       <p style="padding-left:40px;">
    *                                       reverse : Changes the direction of the destination path. <br>
    *                                       shapeIndex : Offsets the points along the destination path. <br>
    *                                       debug : Shows graphics regarding initial and destination path for setup purposes. When debug is true, the green path is the initial path
    *                                       while the red one is the destination path. Also, a larger dot indicates the end point and the max amount of points,
    *                                       while a smaller dot represents either a 25% of length of the path or a user shapeIndex on the path. Notice that
    *                                       the smaller dot indicates the direction of the path which is useful when matching dots positions.<br>
    *                                       Please go here for more info: https://codepen.io/TweenSpace/pen/xLwOyp
    *                                       </p>
    * @return {Tween} - Tween instance.
    * @memberof Tween
    * @public */
    function Tween( params )
    {
        /** Reference to Tween instance.
         * @private */
        var _this = this;
        /** Reference to the node where this Tween instance is stored as data property.
         * @private */
        var _node;
        /** Array of elements to animate.
         * @private */
        var _elements;
        /** Object containing properties to animate.
         * @private */
        var _props = {};
        /** Object containing TweenSpace custom properties.
         * @private */
        var _options = {};
        /** Stores initial duration.
         * @private */
        var _dur_init;
        
        var _isNumberTo = false;
        var _numberTo = 0;
        
        params.elements = TweenSpace._.alternativeParams('elements', params);
        
        //CHECK PARAMS
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
            
        //delete params.elements;

        params.duration = TweenSpace._.alternativeParams('duration', params);
        if( params.duration == undefined )
        {
            console.warn('TweenSpace.js Warning: Tween() has no duration defined!');
            return null;
        }
        else
        {
            _dur_init = params.duration;
            //delete params.duration;
        }
        
        params.isFrom = TweenSpace._.alternativeParams('isFrom', params);
        params.repeat = TweenSpace._.alternativeParams('repeat', params);
        params.yoyo = TweenSpace._.alternativeParams('yoyo', params);
        
        /** Used to store starting values When using "TweenSpace.fromTo()" method.
         * @private */
        var _fromProps;
        if(params.fromParams != undefined)
        {
            _fromProps = params.fromParams;
            delete params.fromParams;
        }
        
        //SPLIT PARAMS INTO PROPS AND OPTIONS
        paramLoop:for ( var param in params )
        {
            var isCSS = true;
            paramDefinedLoop:for ( var paramDefined in TweenSpace.params )
            {
				
                //CHECK IF PARAM IS TWEENSPACE CUSTOM SUCH AS delay, duration, repeat, yoyo, ease, etc.
                if( param == paramDefined)
                { 
                    _options[param] = params[param];
                    isCSS = false;
					
                    //delete params[param];
                    break paramDefinedLoop;
                }
                else
                {
                    //CHECK IF PARAM IS TWEENSPACE EFFECT SUCH AS wiggle, 
                    var effectFound = false;
                    effectLoop:for ( var effect in TweenSpace.params.effects )
                    {
                        if( param == effect)
                        {
                            effectFound = true;
                            //var effectObjects = { [param]:{} };
                            var effectObjects = {};
                            effectObjects[param] = {};
                            var effectProps = [];
                            
                            //Iterate over effect object parameters
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
                                //delete params[param];
                                break paramDefinedLoop;
                            }
                        }
                    }
                }
                
            }
            
            if(isCSS == true)
                _props[param] = params[param];
        }
        
        
        /** If true, animation will be played backwards.
         * @private */
        var _reversed = false;
        /** If true, repeat cycle will be played backwards.
         * @private */
        var _reversed_repeat = false;
        /** Counts the amount of times that the animation has been played.
         * @private */
        var _repeat_counter = 0;
        /** Stores cycle repetitions at the moment.
         * @private */
        var _repetitions = 0;
        /** Tween's paused state.
         * @private */
        var _paused = false;
        /** Stores the amount of time in milliseconds to wait before starting the animation.
         * @private */
        var _delay = _options.delay || 0;
        /** Stores initial delay.
         * @private */
        var _delay_init = _delay;
        /** Stores initial durExtended.
         * @private */
        var _durExtended_init = _dur_init;
        /** Duration in milliseconds of the animation.
         * @private */
        var _duration = _dur_init;
        /** Stores initial durRepeat.
         * @private */
        var _durRepeat_init = 0;
        /** Total duration in milliseconds of the repeat cycles.
         * @private */
        var _durationRepeat = 0;
        /** Stores de total duration in milliseconds including repeat cycles. However delays are not considered.
         * @private */
        var _durationTotal = _dur_init;
        /** Factor used to scale time in the animation. While a value of 1 represents normal speed, lower values
         *  makes the faster as well as greater values makes the animation slower.
         * @private */
        var _timescale = _options.timescale || 1;
        /** Animation playhead in milliseconds. Negative values represent delay time.
         * @private */
        var _mTime = -(_delay);
        var _last_mTime = -1;
        /** Drawing animation playhead in milliseconds.
         * @private */
        var _dTime = 0;
        /** Start time in milliseconds. For now, always starts on 0.
         *  @private */
        var _sTime = 0;
        /** Array of properties to animate.
         *  @private */
        var _subTweens = [];
        /** Parent Timeline instance.
         *  @private */
        var _timelineParent = null;
        /** If true, delay() property will be considered.
         *  @private */
        var _useDelay = ( _delay > 0 ) ? true : false;
        /** If true, delay() property will be considered.
         *  @private */
        var _useCSSText = _options.useCSSText || false;
        /** If true, yoyo() property will play the animation back and forth based on repeat property amount.
         *  @private */
        var _yoyo = _options.yoyo || false;
        /** If true, tween is being played, otherwise it is either paused or not queued at all.
         *   @private */
        var _playing = false;
        /** Amount of times that the animation will be played.
         *  @private */
        var _repeat = _options.repeat || 0;
        /** If true, Tween instance used by Timeline parent to execute important tasks such as onProgress and onComplete callbacks.
         *  @private */
        var _keyTween = false;
        /** Check if an specific element's property is being played by multiple tweens. If so, the last call will prevail.
         *  @private */
        var _checkConflict = TweenSpace._.alternativeParams('checkConflict', _options); // (_options.checkConflict!=undefined)?_options.checkConflict : true;
        /** Check if an specific element's property is being played by multiple tweens. If so, the last call will prevail.
         *  @private */
        var _immediateRender = _options.immediateRender;
        /** If true, Tween instance used by Timeline parent to execute important tasks such as onProgress and onComplete callbacks.
         *  @private */
        var _isFrom = _options.isFrom || false;
        /** Stores a unique id number for this Tween instance.
         *  @private */
        var _UID = TweenSpace._.UID();
        /** Variable for current transform property values.
         *  @private */
        var _currentPropValues = new PropValues();
        /** This is a quick ficx to identify an updateTo call. This pushes the engine to always updates
            new destination values.
         *  @private */
        var _isUpdateTo = false;
        
        /** Returns Tween instance unique id number.
         *  @private */
        this.UID = function(){return _UID;};
        /** Sets to undefined the reference to the node where this Tween instance was stored as data property.
         * @private */
        this.resetNode = function()
        {
            _node = undefined;
        };
        /** Callback dispatched when the animation has finished.
         *  @var  onComplete 
         *  @memberof Tween */
        this.onComplete = _options.onComplete || undefined;
        /** Callback dispatched every engine tick while animation is running.
         *  @var onProgress 
         *  @memberof Tween */
        this.onProgress = _options.onProgress || undefined;
        /** Callback dispatched every time the animation starts a repetition.
         *  @var  onRepeat 
         *  @memberof Tween */
        this.onRepeat = _options.onRepeat || undefined;
        /** Easing function that describes the rate of change of a parameter over time.
         *  Equations used were developed by Robert Penner.
         *  @var ease 
         *  @memberof Tween */
        this.ease = _options.ease || TweenSpace.params.ease.quad.inOut;
        /** Returns an array containing the animated elements.
         *  @method elements
         *  @return {array} - Array of animated elements.
         *  @memberof Tween */
        this.elements = this.element = this.item = this.items = this.object = this.objects = function()
        {
            return _elements;
        };
        /** Returns the current value between from and to properties when using TweenSpace.numberTo() method.
         *  This value can be accessed within the onProgress() method. 
         *  @method numberTo
         *  @return {float} - Returns the current value between from and to properties when using TweenSpace.numberTo() method.
         *  @memberof Tween */
        this.numberTo = function()
        {
            return _numberTo;
        };
        /** Returns current time in milliseconds.
         *  @method currentTime
         *  @return {float} - Time in milliseconds.
         *  @memberof Tween */
        this.currentTime = function()
        {
            return _mTime;
        };
        /** Check if an specific element's property is being played by multiple tweens. If so, the last call will prevail.
         *  It is good to set it to false if you're planning to generate multiple elements dynamically in order to improve animation performance.
         *  @method checkConflict
         *  @return {boolean} - If true, conflict checking will be performed just before playback. By default is set to true. 
         *  @memberof Tween */
        this.checkConflict = function(value)
        {
            if( value != undefined )
                _checkConflict = value;
                
            return _checkConflict;
        }; 
        /** Returns the amount of time in milliseconds to wait before starting the animation.
         *  @method delay
         *  @return {float} - Delay time in milliseconds.
         *  @memberof Tween */
        this.delay = function(value)
        {
            if( value != undefined )
            {    
                _delay_init = _delay = value;
                _mTime = -(_delay);
                _useDelay = ( _delay > 0 ) ? true : false;
                //_reset();
            }
            
            return _delay;
        };
        /** Returns true if tween is being played, otherwise it is either paused or not queued at all.
         *  @method playing 
         *  @return {boolean} - Returns true if tween is currently playing.
         *  @memberof Tween */
        this.playing = function(playing)
        {
            if(playing == true) playing = true;
            else playing = false;
            
            return _playing;
        };
        /** Returns true if delay() property will be considered. @private */
        this.useDelay = function(value)
        {
            if( value != undefined )
                _useDelay = value;
            
            return _useDelay;
        };
        /** Amount of times that the animation will be played.
         *  @method repeat 
         *  @return {boolean} - Amount of times that the animation will be played.
         *  @memberof Tween */
        this.repeat = function(value)
        {
            if( value != undefined )
            {    
                _repeat = value;
                _reset();
            }
            
            return _repeat;
        };
        /** If true, yoyo() property will play the animation back and forth based on repeat property amount.
         *  @method yoyo 
         *  @return {boolean} - yoyo current state.
         *  @memberof Tween */
        this.yoyo = function(value)
        {
            if( value != undefined )
                _yoyo = value;
            
            return _yoyo;
        };
        /** If true, tween belongs to a Timeline object. @private */
        this.timelineParent = function(value)
        {
            if( value != undefined )
                _timelineParent = value;
            
            return _timelineParent;
        };
        /** Returns the duration in milliseconds. Neither repeat cycles nor delays are included.
         *  @method duration
         *  @param {int} value - Duration. 
         *  @return {int} - Duration in milliseconds.
         *  @memberof Tween */
        this.duration = function(value)
        {
            if( value != undefined )
            {    
                _durationTotal = _durExtended_init = _dur_init = _duration = value;
                _reset();
            }
            
            return _duration;
        };
        /** Returns the duration in milliseconds including repeat cycles durations.
         *  @method durationRepeat
         *  @return {int} - Duration in milliseconds.
         *  @memberof Tween*/
        this.durationRepeat = function()
        {
            return _durationRepeat;
        };
        /** Returns the total duration in milliseconds including repeat cycles durations and extra tail frames when this Tween is part of Timeline. However delays are not considered.
         *  @method durationTotal
         *  @param {int} value - Total duration which is calculated internally. 
         *  @return {int} - Total duration in milliseconds.
         *  @memberof Tween */
        this.durationTotal = function( value )
        {
            if( value != undefined )
                _durationTotal = value;
            
            return _durationTotal;
        };
        /** Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
         *  While a value of 1 represents normal speed, lower values makes the faster as well as greater values makes the animation slower.
         *  @method timescale
         *  @param {float} value - Amount of timescale.
         *  @memberof Tween */
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
        /** Tween class constructor. @private
        *@method constructor */
        this.constructor = new function()
        {
            _reset();
            
            var i = _elements.length;
            for(;i--;)
                _subTweens.push( new SubTween( _elements[i], _props ) );
        };
        /** Starts tween playback.
        *  @method play
        *  @param {int} playhead - Forward playback from specified time in milliseconds. Negative values represents delay time.
        *  @return {Tween} - A Tween instance.
        *  @memberof Tween */
        this.play = function( playhead )
        {
            _adjustPlayhead( playhead );
            _playback( playhead, true );
            
            return _this;
        };
        /** Resumes tween playback.
        *@method resume
        *@param {int} playhead - Resumes playback from specified time in milliseconds. Negative values represents delay time.
        * @memberof Tween */
        this.resume = function( playhead )
        {
            _adjustPlayhead( playhead );
            _playback( playhead, !_reversed );
            
            return _this;
        };
        /** Reverses tween playback.
        *@method reverse
        *@param {int} playhead - Reverses playback from specified time in milliseconds. Negative values represents delay time.
        * @memberof Tween */
        this.reverse = function( playhead )
        {
            _adjustPlayhead(playhead);
            _playback( playhead, false ); 
            
            return _this;
        };
        /** Pauses tween playback.
        *@method pause
        *@param {int} playhead - Pauses playback at specified time in milliseconds.
        * If no argument is passed, animation will be paused at current time. Negative values represents delay time
        * @return {Tween} - Returns itself for chaining purposes.
        * @memberof Tween */
        this.pause = function( playhead )
        {
            _pauseQueue();
            if(playhead)
                _this.seek( playhead );
            
            return _this;
        };
        /** Stops tween playback.
        *@method stop
        *@param {int} playhead - Stops playback at specified time in milliseconds.
        * If no argument is passed, animation will stop at current time. Negative values represents delay time.
        * @return {Tween} - Returns itself for chaining purposes.
        * @memberof Tween */
        this.stop = function( playhead )
        {
            _adjustPlayhead(playhead);
            _stopQueue();
            
            _this.seek( playhead );
            
            return _this;
        };
        /** Moves playhead to an specified time.
        *@method seek
        *@param {int} playhead - Moves playhead at specified time in milliseconds.
        * @memberof Tween */
        this.seek = function( playhead, updateDOM, doTick )
        {
            if(doTick == undefined)
                doTick = true;
            
            if( playhead != undefined )
            {
                if( _adjustPlayhead(playhead) != undefined )
                {   
                    if(doTick==true)
                        _this.tick(16.67, false, updateDOM);
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
        /** Returns true if animation is paused.
        *@method paused
        *@return {boolean} - If true, animation is paused.
        * @memberof Tween */
        this.paused = function()
        {
            return _paused;
        };
        /** Returns true if animation is reversed.
        *@method reversed
        *@return {boolean} - If true, animation is reversed.
        * @memberof Tween */
        this.reversed = function( bool )
        {
            if( bool != undefined )
                _reversed = bool;
            
            return _reversed;
        };
        /** This method will update Tween property values at runtime. This method is intended to be used rather that to() in order to improve performance.
        * This way you will avoid unnecessary re-instantiation of the same Tween. You can add new properties even when they were not defined at creation. 
        *@method updateTo
        *@param {object} props - An object containing new destination values.
        * @memberof Tween */
        this.updateTo = function( props )
        {
            _isUpdateTo = true;
            _this.pause();
            _updateSubTweenProps(props);
            _this.play(0);
        };
        /** Calculates values over time. @private
        * @method tick
        * @private*/
        this.tick = function(dt, useCallbacks, updateDOM)
        {
			//console.warn(dt);
			
            if(TweenSpace.debug == false  && _playing == true)
                _tick_delta(dt);
            else if(TweenSpace.debug == true)
            {
                _playing = false;
                _adjustPlayhead(_durationTotal);//_this.seek(_durationTotal);
            }
            
            _tick_logic(TweenSpace._.interval()); //TweenSpace._.interval()
			
            //Make drawing calls only when needed except for last frame
            if( _mTime >= _sTime && _mTime <= _durationRepeat ) //-TweenSpace._.dt() _durationTotal _durationRepeat
            {
                //First drawing frame
                if( _dTime == _sTime || (_last_mTime < 0 && _mTime >= 0)) 
                {    
					
                    if( _reversed == false )  //&& updateDOM == true
                    {
                        _manageConflicts();
						
						//This will allow tweens to update init prop values
						//to current in case that the tween was delayed and 
						//it init prop values change since the time it was played.
						if(_shouldCheckConflicts() == false)
							_updateNewInitValues();
                    }
                }
                //Last drawing frame
                else if ( _dTime == _durationRepeat ) //_durationTotal _durationRepeat
                {
                    //if( _reversed == true )
                    //    _manageConflicts();
                }
                _last_mTime = _mTime;
                _this.tick_draw(_dTime, false, updateDOM);
				
            }
            else
            {
                //-------------------------
                // FIRST OR LAST FRAME
                //-------------------------
				
                //This last call will ensure that the destination values were met.
				//It will keep ticking init or destination values even if is
				//in a delay phase or after end point.
				if(_shouldCheckConflicts())
				{
					if( _mTime <= _sTime )
						_this.tick_draw(_sTime, false, updateDOM);
					else if( _mTime >= _durationRepeat)
						_this.tick_draw(_durationRepeat, false, updateDOM);
				}
            }
            
//            if(_elements[0].id == 'box0')
//                console.log(_elements[0].id, _elements[0].style.marginLeft, '_mTime:', parseFloat(_mTime.toFixed(3)), '_dTime:', parseFloat(_dTime.toFixed(3)) );
                //console.log(_elements[0].id, _elements[0].style.marginLeft, '_mTime:', parseFloat(_mTime.toFixed(3)), '_dTime:', parseFloat(_dTime.toFixed(3)), '_durationRepeat:', _durationRepeat, '_durationTotal:', _durationTotal, _playing);
             
            if(useCallbacks==true)
                _manageCallbacks();
        };
        /** Method that draws the objects that are being animated.
         * @method tick_draw */
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
                //Animate custom objects. I.e. {x:0, y:1}
                if(subtween.element.constructor == Object)
                    subtween.element[prop] = subtween.tick_prop(prop, _dTime, setInitValues);
                //Animate CSS properties
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
        /** Removes all elements from DOM as well as its references stored in 'elements'.
        *@method destroy
        * @memberof Tween */
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
        /** Set or return the key Tween instance.
         * @private*/
        this.keyTween = function(value)
        {
            if( value != undefined )
                _keyTween = value;
            
            return _keyTween;
        };
        /** Return subTweens array.
         * @private*/
        this.subTweens = function()
        {
            return _subTweens;
        };
        
        function _manageCallbacks()
        {
            if( _mTime >= _sTime && _mTime <= _durationRepeat ) //_durationRepeat
            {
                //TWEEN CALLBACKS____________________________________
                if( _this.onProgress )
                    _this.onProgress();

                if( _this.onComplete )
                {
                    if( _playing == false )
                        _this.onComplete();
                }
                //TWEEN CALLBACKS____________________________________
            }
            
            //TIMELINE CALLBACKS____________________________________
            if( _keyTween == true )
            {
                if( _this.timelineParent().onProgress != undefined )
                    _this.timelineParent().onProgress();
                
                if(_playing == false)
                {
                    if( _this.timelineParent().onComplete != undefined )
                        _this.timelineParent().onComplete();
                    
                    if(_timelineParent != null)
                        _timelineParent._.manageRepeatCycles();
                }    
            }
            
            //TIMELINE CALLBACKS____________________________________
        }
        function _updateInitProps()
        {   
            var i = _elements.length;
            for(;i--;)
                _subTweens[i].manageSubTween(true);
        }
        /** Reset settings.
         * @private*/
        function _reset()
        {
            _repeat = (_repeat<0)?Number.MAX_SAFE_INTEGER:_repeat;
            _durationTotal = _durationRepeat = _durRepeat_init = _durExtended_init = (_repeat * _duration) + _duration;
            _this.timescale(_timescale);
        }
        /** Adjusts playhead position in time.
         * @private*/
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
                    console.warn('TweenSpace.js Warning: playhead '+playhead+'ms is greater than duration. Playhead has been set to '+_durationTotal+'ms.');
                    playhead = _durationTotal;
                }
                
                _manageRepeatCycles();
                
				/*
					ADDING 0.00001 IS A QUICK FIX TO AVOID TWEENS TO GET STUCK AT FIRST FRAME.
				*/
                _mTime = playhead+0.00001;
            }
            return playhead;
        }
        /** Calculates delta change.
         * @private*/
        function _tick_delta(dt)
        {
            //FORWARDS ---->>
            if(_reversed == false)
                _mTime += dt;//TweenSpace._.dt(); //!!!!!!!!!!!!!!!!!!!!!!!!  
            //BACKWARDS <<-----
            else
                _mTime -= dt;//TweenSpace._.dt(); //!!!!!!!!!!!!!!!!!!!!!!!! 
            
            /*//FORWARDS ---->>
            if(_reversed == false)
                _mTime += dt;  
            //BACKWARDS <<-----
            else
                _mTime -= dt;*/
        }
        /** where the time logic occurs.
         * @private*/
        function _tick_logic(dt)
        {
            //ADJUST time______________________________________
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
            //________________________________________
            /*if( _mTime < _sTime)
            {
                if( (_reversed == true && _useDelay == false) )
                {
                    _mTime = _sTime;
                    _playing = false;
                }

                if( _mTime < -_delay )
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
                
                if(dt > _durationTotal-_mTime == true && _reversed == false)
                {
                    _mTime = _durationTotal;
                    _playing = false;
                }    
                
                _dTime = _mTime;
            }
            else if( _mTime > _durationTotal )
            {
                _dTime = _mTime = _durationTotal;
                _playing = false;
                
            }*/
            //ADJUST time______________________________________
            
            _manageRepeatCycles();
        }
        /** Calculates current playhead in repeat situations.
         * @private*/
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
//                           if(_elements[0].id == 'box0')
//                    			console.log(_reversed_repeat, _dTime.toFixed(0), _mTime.toFixed(0)); 
                    }
                    /*if( _reversed_repeat == false )
                        _dTime = (_mTime==_durationRepeat)?_durationRepeat:_dTime%_duration;
                    else
                        _dTime = (_mTime==_durationRepeat)?_sTime:Math.abs((_mTime%_duration)-_duration);*/
                    
                    
                }    
                else
                {
                    _reversed_repeat = false;
                    _dTime = (_mTime>=_durationRepeat)?_durationRepeat:_dTime%_duration;
                }
                
                
            }
        }
        /** Method that updates props values. 
         * @private*/
        function _updateSubTweenProps( newProps )
        {
			/*FIX updateTo(): This block updates options new values
			  and get deletes them to avoid being treated as animatable properties.*/
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
                            //Modify existing prop
                            _subTweens[p].props[oldProp] = newProps[newProp];
                            _subTweens[p].manageSubTween(true);
                            found = true;
                            
                            break oldPropsLoop;
                        }
                    }
                    if( found == false)
                    {    
                        //Add new prop 
                        _subTweens[p].props[newProp] = newProps[newProp];
                        _subTweens[p].manageSubTween(true);
                    }
                }
            }
        }
        /** Method that removes tweens from queue.
         * @private*/
        function _pauseQueue()
        {
            if( _paused == false )
                _node = TweenSpace._.queue_paused_DL.push( TweenSpace._.queue_DL.remove(_node) );
            
            _paused = true;
            _playing = false;
        }
        /** Method that stops playing and paused tweens.
         * @private*/
        function _stopQueue()
        {
            if(_paused == false)
                TweenSpace._.queue_DL.remove(_node);
            else
                TweenSpace._.queue_paused_DL.remove(_node);
            
            _node = undefined;
            _paused = _playing = false;
        }
        /** Start forward or backward playback from specified time.
         * @private*/
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
            
            /*If playhead is specified in any of the playback method,
            the tween will start intentionally from that value. If playhead 
            is not specified, and 'checkConflict' is true, the animation
            will start from current value.*/
            if(playhead!=undefined)
                _this.tick_draw(-_delay, true, false);
            
//            console.log('playhead', playhead, _subTweens[0].UID());
            
            TweenSpace._.engine();
        }
        function _unhaltSubTweens()
        {
            var i = _subTweens.length;
            for(;i--;)
                for( var prop in _subTweens[i].props )
                    _subTweens[i].values[prop].halted = false;
        }
		
		/** Set current prop values to new init values.
         * @private*/
		function _updateNewInitValues()
        {
            var i = _subTweens.length;
            for(;i--;)
				_subTweens[i].resetValues();
			
            _updateInitProps();	
        }
        
        /** Check if an element has an existing animation happening. 
         * true, it will get rid of the older tween and the new one will prevail.
         * @private*/
        function _checkConflicts()
        {
            var i = _subTweens.length, j = 0, k = 0;
            
            var queue_length = TweenSpace._.queue_DL.length();
            var currNode = TweenSpace._.queue_DL.head;
            var tempNode;
            
            //Loop over this SubTweens
            for(;i--;)
            {
                //Loop over queued Tweens
                for(j=0;j<queue_length;j++)
                {
                    k = currNode.data.subTweens().length;
                    
                    //Loop over queued Tween's SubTweens
                    //for(k=0; k<curr_subTweens_length;k++)
                    for(;k--;)
                    {
                        currNode.data.subTweens()[k];
                        
                        //Check which Tween is most recent 
                        if( _subTweens[i].UID() > currNode.data.subTweens()[k].UID() )
                            //Check if both Subtweens from different Tweens are targeting the same element
                            if( _subTweens[i].element == currNode.data.subTweens()[k].element )
                            {
                                //Check if both Subtweens from different Tweens are targeting the same element's property
                                for( var this_prop in _subTweens[i].props )
                                {
                                    for( var curr_prop in currNode.data.subTweens()[k].props )
                                    {
                                        if(this_prop == curr_prop)
                                        {
                                            //Halts this subtween because a new one, meant to affect
                                            //the same element's property, has been queued.
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
        
        /** Manages global and local conflict  declarations.
         * @private*/
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
        /** Manages global and local immediate render declarations.
         * @private*/
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
        /**
         * SubTween.
         * @class Internal class. Stores SubTween values.
         * @private
         */
        function SubTween(element, props)
        {
            var _st_this = this;
            /** Stores a unique id number for this SubTween instance.
             *  @private */
            var _UID = TweenSpace._.UID();
            this.element = element;
            this.elementStyle = element.style;
            this.props = props;
            /*  Object that stores PropValues instances on each of it properties.
                I.e. this.values =  {
                                        left: PropValues Instance for this property,
                                        transform: PropValues Instance for this property,
                                        opacity: PropValues Instance for this property
                                    }
            */
            this.values = {};
            this.values_DL;
            
            
            /** Returns SubTween instance unique id number.
             *  @private */
            this.UID = function(){return _UID;};
			
            /** Calculates subtween property values. When 'elapsedTime' is set to -_delay
             *  and 'setInitValues' to true, initial values will be assigned.
             *  @private */
            this.tick_prop = function( property, elapsedTime, setInitValues )
            {
				/*if( TweenSpace._.checkParam(property) == true )
					return;*/
				
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
                
                /*if(property == 'morphSVG' )
                    console.log(_fromValues, _prop_values.initValues,_prop_values.fromValues);*/
				
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
                        //result.push( _this.ease( Math.min(elapsedTime, _duration), _fromValues[w], _toValues[w], _duration )+_units[w] );
                        
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
                            //Do nothing for now
                        }
                        else if( _toValues[0] == value)
                        { 
                            //Do nothing for now
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
                    
                    result =    'translate('    +(_effects['path'].getPointAtLength( value )['x']-_effects['pivotX']+_effects['offsetX'])+'px,'
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
                    
//					console.log('_fromValues', _fromValues, property );
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
                        
                        //rgba case: r g b values need to be integer, however alpha needs to be decimal
                        if( _names )
						{
							if( _names.match(/rgb/i) )
                            {
                                if(w<3)
                                    value = parseInt(value);
                            }
						}
                            
                        
                        //newValues += value + _units[w];
                        newValues += String( value ) + _units[w];
                        if(w<toLength-1) newValues += ',';
                    }
                    
                    if( _names ) result = _names+'('+newValues+')';
                    else result = newValues;
                    
                }
                
                return result;
                
            };
            
            /** Method that manages subtweens.
             * @private*/
            this.manageSubTween = function (checkConflict, checkConflictProp)
            {
                var length = 0, q = 0, r = 0;
                var matchResult, inputPropString, initTransform, transform, initProp;
                var newPropVals = new PropValues();
                this.values_DL = TweenSpace._.DoublyList();
				
				/*for ( var prop in this.props )
                {
					//console.log(prop);
					if( TweenSpace._.checkParam(prop) == true )
					{
						delete this.props[prop];
					}
				}*/
                
                //color vars
                var nameMatch, name, initName, rgb;

                //Store initial values
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
                        //Loop over css props
                        forLoopInitProps:for ( var p in this.props )
                        {
                            //If destination props were inline declared in advanced
                            //don't compute style. It is very CPU intensive.
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
					/*console.log(prop);
					if( TweenSpace._.checkParam(prop) == true )
					{
						delete this.props[prop];
						continue;
					}*/
					
                    initProp = undefined;
                    props_value = this.props[prop];
                    
                    //CHECK OBJECT TYPE ARGUMENTS_______________________________________
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

					
                    //If "_fromProps" exists, "TweenSpace.fromTo()" has been called.
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
                        //if "initProp" exists, it means that it was define by the "effects override" using the "from" parameter.
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

                        //Get current transform
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
                        
                        //Set destination transform and eliminate initial transform properties that are not defined as destination values 
                        while(match = regex.exec(inputPropString))
                        {
                            //Get destination values
                            transform[ match[1] ] = { fromValues:[], toValues:String(match[2]).split(','), units:[], initValues:[] }; //(matchResult) ? matchResult[0] : ""

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
                            
                            //Set initial values
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
                                else if(    match[1] == 'translateX' || match[1] == 'translateY' || match[1] == 'translateZ' || 
                                            match[1] == 'rotateX' || match[1] == 'rotateY' || match[1] == 'rotateZ' ||
                                            match[1] == 'skewX' || match[1] == 'skewY' || match[1] == 'perspective' )
                                {
                                    transform[ match[1] ].fromValues[0] = 0;
                                }
                                else if(    match[1] == 'blur' || match[1] == 'brightness' || match[1] == 'contrast' || 
                                            match[1] == 'grayscale' || match[1] == 'hueRotate' || match[1] == 'invert' ||
                                            match[1] == 'opacity' || match[1] == 'saturate' || match[1] == 'sepia' )
                                {
                                    transform[ match[1] ].fromValues[0] = 0;
                                }
                                else if(    match[1] == 'scaleX' || match[1] == 'scaleY' || match[1] == 'scaleZ' )
                                {
                                    transform[ match[1] ].fromValues[0] = 1;
                                }
                                else if(    match[1] == 'matrix' )
                                {
                                    transform[ match[1] ].fromValues[0] = 1;
                                    transform[ match[1] ].fromValues[1] = 0;
                                    transform[ match[1] ].fromValues[2] = 0;
                                    transform[ match[1] ].fromValues[3] = 1;
                                    transform[ match[1] ].fromValues[4] = 0;
                                    transform[ match[1] ].fromValues[5] = 0;
                                }
                                else if(    match[1] == 'matrix3d' )
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
                        
                        //initTransform = null;
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
                        //matchResult = String(inputPropString).match( /px|%/ );
                        newPropVals.units.push('px', 'px', 'px');

                        var drawToValues;

                        //fromValues and newPropVals.toValues: [0] = strokeDashoffset, [1] = strokeDasharray first value, [2] = strokeDasharray second value
                        //"TweenSpace.fromTo()" has been called.
                        if( _fromProps != undefined )
                        {
                            //from values
                            drawToValues = String(_fromProps[prop]).split(' ');
                            setValues( drawToValues, newPropVals.fromValues );
                        }
                        //parameter has been declared as an object. i.e. {from:"", to:""}
                        else if( props_value.constructor === Object )
                        {
                            //from values
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
                        

                        //to values
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

                        //Replace svg element by path
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

                        //reverse
                        if( props_value['reverse'] && props_value['reverse'] == true )
                        {
                            var i = newPropVals.toValues.length;
                            var length = i-1;
                            var temp_toValues = [];

                            //for(;i>=0;i--)
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

                        //shapeIndex
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

                        //debug
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
						//console.log(prop);
//                        newPropVals.fromValues.push(parseFloat(_props['from']));
//                        newPropVals.toValues.push(parseFloat(_props['to']));
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
                        
                        //!Check function-based values___________________________
                        if(this.values[prop] != undefined )
                            toVal = this.values[prop].toValues[0];
                        else
                            toVal = TweenSpace._.functionBasedValues(fromVal, inputPropString);
                        
                        //Check function-based values___________________________!
                        if( toVal == null )
                            toVal = parseFloat(inputPropString);
                        
                        //updateTo FIX !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        if(_isUpdateTo == true)
						{
							toVal = parseFloat(inputPropString);
						}
                            
                        
                        newPropVals.toValues.push(toVal);
                        newPropVals.units.push((matchResult) ? matchResult[0] : "");  
                    }
                    
					
					
                    if(this.values[prop])
                        newPropVals.initValues = this.values[prop].initValues;
                    
                    this.values[prop] = new PropValues(prop, name, newPropVals.fromValues, newPropVals.toValues, 
                                                       newPropVals.units, transform, newPropVals.effects, 
                                                       newPropVals.initValues);
                    
                    this.values_DL.push(this.values[prop]);
                    
                    newPropVals.effects = undefined;
                } 
                
                return this;
            };
			
			/** Method that resets prop values. When this properties are
			 * reset, manageSubTween will set element's current props to init values.
             * @private*/
			this.resetValues = function()
			{
				this.values = {};
            	this.values_DL;
			}
        
            /*____________CONSTRUCTOR___________*/
            _manageSubTween();
            /*____________CONSTRUCTOR___________*/
            
            function _manageSubTween()
            {
                return _st_this.manageSubTween();
            }
            
            return this;
        }
        /**
         * PropValues.
         * @class Internal class. Stores SubTween prop values.
         * @private
         */
        function PropValues(prop, names, fromValues, toValues, units, transform, effects, initValues)
        {
            /** "this.prop" CSS property name.
             * @private */
            this.prop = prop;
            this.names = names;
            this.initValues = initValues;
            this.fromValues = fromValues;
            this.toValues = toValues;
            this.units = units;
            this.transform = transform;
            this.effects = effects;
            /** "halted" means that this property animation has been overriden 
             * by a newer Tween, hence, this one was halted.
             * @private */
            this.halted = false;
            
            return this;
        }
        
        return this;
    }
    
})(TweenSpace || {});
/*Timeline Module*/
(function ( TweenSpace ) {
    
    /** Static method that creates Timeline instances which are capable of controlling playback operations and time management on groups of tweens.
     * @method Timeline
     * @param {object} params - An object containing Timeline properties.
     * @property {*} params.tweens - A Tween or an array of Tween instances whose properties should be animated.
	 *								https://codepen.io/TweenSpace/pen/MyGGNM
     * @property {*} params.timescale - Sets and returns the timescale value. timescale() is a factor used to scale time in the animation. 
     *                                  While a value of 1 represents normal speed, lower values makes the faster as well as greater values
     *                                  makes the animation slower. https://codepen.io/TweenSpace/pen/BKxVoP
     * @property {function} params.onProgress - Callback dispatched every engine tick while the Timeline instance is running.
     * @property {function} params.onComplete - Callback dispatched when the animation of all the Tween instances that belongs to a Timeline object has finished.
     * @return {Timeline} - Timeline instance.
     * @memberof TweenSpace  */
    TweenSpace.Timeline = function( params )
    {
        return new Timeline(params);
    }
    
    /**
     * @class Timeline class is capable of controlling playback operations and time management on groups of tweens.
     * @param {object} params - An object containing Timeline properties.
     * @property {*} params.tweens - A Tween or an array of Tween instances whose properties should be animated.
     * @property {*} params.timescale - Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
     *                                  While a value of 1 represents normal speed, lower values makes the faster as well as greater values
     *                                  makes the animation slower.
     * @property {function} params.onProgress - Callback dispatched every engine tick while the Timeline instance is running.
     * @property {function} params.onComplete - Callback dispatched when the animation of all the Tween instances that belongs to a Timeline object has finished.
     * @return {Timeline} - Timeline instance.
     * @memberof Timeline  
     * @public */
    function Timeline( params )
    {
        var _this = this,
            _tweens = [],
            _repeat = 0,
            _repeat_inc = 0,
            _repeat_direction = true, //true = forward, false = backwards
            _yoyo_isOdd = false,
            _yoyo = false,
            _duration = 0,
            _reversed = false;
        
        /** Returns Timeline instance duration in milliseconds. https://codepen.io/TweenSpace/pen/WNrGpGg
         *  @method duration
         *  @return {int} - Duration in milliseconds.
         *  @memberof Timeline */
        this.duration = function()
        {
            return _duration;
        }
        /** Returns Timeline instance total duration in milliseconds, considering the repeat value.
         *  @method durationTotal
         *  @return {int} - Total duration in milliseconds considering the repeat value.
         *  @memberof Timeline */
        this.durationTotal = function()
        {
            return _duration + (_duration*_repeat);
        }
        /** Sets or returns Timeline repeat amount.
		 *	https://codepen.io/TweenSpace/pen/oNbzeBz
         *  @method repeat
         *  @return {int} - Repeat amount.
         *  @memberof Timeline */
        this.repeat = function( int )
        {
            if(int != undefined)
                _repeat = int;
            return _repeat;
        }
        /** Set or returns Timeline yoyo behavior.
         *  @method yoyo
         *  @return {bool} - Yoyo behavior
         *  @memberof Timeline */
        this.yoyo = function( bool )
        {
            if(bool != undefined)
                _yoyo = bool;
            return _yoyo;
        }
        /** Returns current time in milliseconds. https://codepen.io/TweenSpace/pen/xxZEqGb
         *  @method currentTime
         *  @return {float} - Time in milliseconds.
         *  @memberof Timeline */
        this.currentTime = function()
        {
            //console.log('currentTime', _tweens[_tweens.length-1].currentTime() + _tweens[_tweens.length-1].delay());
            return _tweens[_tweens.length-1].currentTime() + _tweens[_tweens.length-1].delay();
        }
        /** Scales the time of all tweens in the Timeline. While a value of 1 represents normal speed, lower values
         *  makes the faster as well as greater values makes the animation slower.
         *  @method timescale
         *  @param {float} value - Amount of time scale.
		 *	https://codepen.io/TweenSpace/pen/BKxVoP
         *  @memberof Timeline */
        this.timescale = function( value )
        {
            _apply( 'timescale', value, false );
            _autoTrim();
        }
        /** Returns true if Timeline animation is reversed.
        *@method reversed
        *@return {boolean} - If true, animation is reversed.
        * @memberof Timeline */
        this.reversed = function()
        {
            return _reversed;
        }
        /** Callback dispatched when the animation has finished.
         *  @var  onComplete 
         *  @memberof Timeline */
        this.onComplete = undefined;
        /** Callback dispatched every engine tick while animation is running.
         *  @var onProgress 
         *  @memberof Timeline */
        this.onProgress = undefined;
        /** Returns true if timeline is being played, otherwise it is either paused or not queued at all.
         *  @method playing 
         *  @return {boolean} - Returns true if tween is currently playing.
         *  @memberof Timeline */
        this.playing = function()
        {
            return _tweens[_tweens.length-1].playing();
        }
        /** Returns an array of Tween objects.
         *  @method tweens 
         *  @return {Array} - Array of Tween objects.
         *  @memberof Timeline */
        this.tweens = function()
        {
            return _tweens;
        }
        /** Adds tweens to a Timeline instance.
         *  @method addTweens
         *  @param {*} tweens - Tween, Tween parameters object or array of Tween instances.
		 *						https://codepen.io/TweenSpace/pen/xVjjNZ
         *  @memberof Timeline */
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
                    //Check if tween exists
                    loop1:for(; i < tweens.length; i++)
                    {
                        _pushTween(tweens[i]);
                    }
                    /*if( _tweens.length == 0)
                    {
                        if( tweens[0].__proto__.constructor.name === 'Tween' )
                        {
                            tweens[0].useDelay(true);
                            _tweens.push(tweens[0]);
                            i++;
                        }
                    }

                    //Check if tween exists
                    loop1:for(; i < tweens.length; i++)
                    {
                        loop2:for(; j < _tweens.length; j++)
                        {
                            if( tweens[i].__proto__.constructor.name === 'Tween' )
                            {
                                tweens[i].useDelay(true);
                                if(tweens[i] == _tweens[j])
                                    break loop2;
                                if(j == _tweens.length - 1)
                                    _tweens.push(tweens[i]);
                            }
                        }
                    }*/
                    
                }
                
                _tweens[_tweens.length-1].keyTween(true);
                
                _autoTrim();   
                _apply( 'useDelay', true );
                _apply( 'timelineParent', _this );
            }
            
            return _this;
        }
        /** Timeline class constructor. @private*/
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
					
					let r = (params.repeat == -1)?Number.MAX_SAFE_INTEGER:params.repeat;
					_this.repeat( r );
				}
                
                _this.yoyo( params.yoyo || undefined );
            }
        }
        /** Removes tweens to a Timeline instance.
         *  @method removeTweens
         *  @param {Tween} tweens - Tween or array of Tween instances.
         *  @return {Array} - Array of removed Tween objects.
         *  @memberof Timeline */
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
        /** Starts sequence playback.
         *  @method play
         *  @param {int} playhead - Forward playback from specified time in milliseconds.
		 *							https://codepen.io/TweenSpace/pen/bpvNax
         *  @return {Timeline} - A Timeline instance.
         *  @memberof Timeline */
        this.play = function( playhead )
        {
            _reversed = false;
            _repeat_direction = true;
            playhead  = _checkPlayhead( playhead );
            playhead  = _adjustRepeatPlayhead( playhead );
            
            //console.log('play', playhead);
            
            _apply( (_yoyo_isOdd == false)?'play':'reverse', playhead, true );
            
            return _this;
        }
        /** Resumes sequence playback.
         *  @method resume
         *  @param {int} playhead - Resumes playback from specified time in milliseconds.
         *  @memberof Timeline */
        this.resume = function( playhead )
        {
            playhead  = _checkPlayhead( playhead );
            _apply( (_reversed == false)?'play':'reverse', playhead, true );
            //_apply( 'resume', playhead, true );
        }
        /** Moves playhead to an specified time.
         *  @method seek
         *  @param {int} playhead - Moves playhead at specified time in milliseconds.
		 *							https://codepen.io/TweenSpace/pen/MyGGNM
         *  @memberof Timeline */
        this.seek = function( playhead )
        {
            /*playhead  = _checkPlayhead( playhead );
            playhead  = _adjustRepeatPlayhead( playhead );*/
            
            var i = 0, j = 0, k = 0, l = 0, m = 0, p = 0;
            var twn, stwn, stwnGroups = [], group_node1, group_node2, twn2;
            
            //Loop over Tweens and group subTweens
            j = _tweens.length;
            for(;j--;)
            {
                twn = _tweens[j];
                
                //Loop over this SubTweens
                i = twn.subTweens().length;
                for(;i--;)
                {
                    stwn = twn.subTweens()[i];
                    //Add first DOM element and subTweens array
                    if(stwnGroups.length == 0)
                    {
                        dl = TweenSpace._.DoublyList();
                        dl.push( {tween:twn, subTween:stwn} );
                        stwnGroups.push([stwn.element, dl] );//[{tween:twn, subTween:stwn}]]);
                    }    
                    else
                    {
                        //Loop over existing elements grouping subTweens
                        var inserted = false;
                        k = stwnGroups.length;
                        loop_k:for(;k--;)
                        {
                            //If DOM element already exists, add subTween
                            if(stwn.element == stwnGroups[k][0])
                            {
                                stwnGroups[k][1].push({tween:twn, subTween:stwn});
                                inserted = true;
                                break loop_k;
                            }  
                                
                        }
                        //If DOM element does not exist, add element and array containing first subTween
                        if(inserted == false)
                        {
                            //console.log(stwnGroups[k][0].id, stwn.element.id, stwnGroups[k][0].id == stwn.element.id);
                            dl = TweenSpace._.DoublyList();
                            dl.push( {tween:twn, subTween:stwn} );
                            stwnGroups.push([stwn.element, dl]);
                        }
                    }
                } 
            }
            
            //Sort subTweens chronologically
            var l = stwnGroups.length;
            for(;l--;)
            {
                //Loop over subTweens, grouped by DOM element
                m = stwnGroups[l][1].length();
                if(m>1)
                {
                    var twn_delay, twn_dur;
                    group_node1 = stwnGroups[l][1].head;
                    var sorted_dl = TweenSpace._.DoublyList();
                    for(;m--;)
                    {
                        twn = group_node1.data.tween;
                        twn_delay = twn.delay();
                        twn_dur = twn.delay()+twn.durationRepeat();
                        p = sorted_dl.length();
                        group_node2 = sorted_dl.tail;

                        //Sort ascending by delay
                        if(p==0)
                            sorted_dl.push( group_node1.data );
                        else
                        {
                            var added = false, twn2_delay, twn2_dur;

                            loop_p:for(;p--;)
                            {
                                twn2 = group_node2.data.tween;
                                twn2_delay = twn2.delay();
                                twn2_dur = twn2.delay()+twn2.durationRepeat();
                                
                                //twn2 starts before twns
                                if( twn_delay > twn2_delay )
                                {
                                    if( twn_dur > twn2_dur)
                                    {
                                        sorted_dl.insert( group_node1.data, group_node2, 'after' );
                                        added = true;
                                        break loop_p;
                                    }
                                    else
                                    {
                                        added = true;
                                        break loop_p;
                                    }
                                }
                                else
                                {
                                    if( twn_dur > twn2_dur)
                                        sorted_dl.remove(group_node2);
                                }

                                group_node2 = group_node2.prev;
                            }

                            if(added==false)
                                sorted_dl.unshift(group_node1.data);
                        }
                        
                        group_node1 = group_node1.next;
                    }

                    stwnGroups[l][1] = sorted_dl;
                }
                
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //Loop over subTweens and group values by props
                m = stwnGroups[l][1].length();
                if(m>1)
                {
                    //IMPORTANT: Create a third item in 'stwnGroups' array that groups values by properties.
                    stwnGroups[l].push({});
                    group_node1 = stwnGroups[l][1].head;
                    draw_loop:for(;m--;)
                    {
                        twn = group_node1.data.tween;
                        stwn = group_node1.data.subTween;
                        //console.log('lala', group_node1.data.subTween.props);
                        var props = group_node1.data.subTween.props;
                        for(var prop in props)
                        {
                            if(stwnGroups[l][2][prop] == undefined)
                                stwnGroups[l][2][prop] = {tween:[], subTween:[]};
                            
                            stwnGroups[l][2][prop]['tween'].push(twn);
                            stwnGroups[l][2][prop]['subTween'].push(stwn);
                        }
                        
                        group_node1 = group_node1.next;
                    }
                }
                
                //++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
                //____________________________________________________________________________
                var cssText = '';
                //Loop over grouped subTweens and draw values according to timeline 'playhead'
                m = stwnGroups[l][1].length();
                if(m>1)
                {
                    for( var prop in stwnGroups[l][2] ) 
                    {
                        var twns = stwnGroups[l][2][prop]['tween']; 
                        var stwns = stwnGroups[l][2][prop]['subTween'];
                        var length = stwns.length;
                        var r = 0;
                        var lastToValues = undefined;
                        
                        //console.log('prop', r, prop);
                        loop_stwns:for(;r<length;r++)
                        {
                            twn = twns[r];
                            stwn = stwns[r];
                            twn_delay = twn.delay();
                            twn_dur = twn.delay() + twn.durationRepeat();
                            
                            if( playhead >= twn_delay )
                            {
                                //After duration
                                if(playhead >= twn_dur)
                                {
                                    _updatePropVal(prop, twn, stwn, twn_delay, playhead, cssText, !r, r>0);
                                    _updatePropVal(prop, twn, stwn, twn_dur, playhead, cssText, !r, r>0);
                                }
                                //After delay, before duration. Right in drawing time.
                                else
                                {   
                                    _updatePropVal(prop, twn, stwn, twn_delay, playhead, cssText, !r, r>0);
                                    _updatePropVal(prop, twn, stwn, playhead, playhead, cssText, !r, r>0);
                                }
                            }
                            //Before delay
                            else
                            {
                                _updatePropVal( prop, twn, stwn, twn_delay, playhead, cssText, !r, r>0 );
                                
                                break loop_stwns;
                            }
                        }
                    }    
                }
                else
                {
                    twn = stwnGroups[l][1].head.data.tween;
                    stwn = stwnGroups[l][1].head.data.subTween;
                    
                    _updatePropVals(twn, stwn, playhead, cssText);
                }
            }
            
            //console.log('seek', playhead );
            j = _tweens.length;
            for(;j--;)
                _tweens[j].seek(playhead-_tweens[j].delay(), false, false);
        }
        function _updatePropVal(prop, twn, stwn, playhead, timeline_playhead, cssText, setInitValues, checkConflict)
        {
            
            if( setInitValues == undefined)
                setInitValues = false;
            
            //console.log('_updatePropVal', stwn.element.id, playhead, timeline_playhead);
            
            var adjustedPlayhead = _updatePropAdjustedPlayhead(twn, playhead, checkConflict, prop, stwn);
            
            if(checkConflict == true)
                stwn.manageSubTween(checkConflict, prop);
            
            
            cssText = twn.tick_draw_prop( prop, adjustedPlayhead, setInitValues, stwn, cssText );
            
            //console.log('_updatePropVal', stwn.element.id, timeline_playhead, twn.delay(), timeline_playhead-twn.delay());
            //twn.seek(timeline_playhead-twn.delay(), false, false)
            
            return cssText;
        }
        function _updatePropVals(twn, stwn, playhead, cssText)
        {
            var adjustedPlayhead = _updatePropAdjustedPlayhead(twn, playhead);

            /* In Tween's method, 'tick_draw_prop', the 3rd parameter, 'setInitValues', is set
            to true because this elements are affected by only one Tween. */
            for (var prop in stwn.values)
            {
//                if(stwn.element.id == 'box2')
//                    console.log('_updatePropVals', playhead, adjustedPlayhead, twn.duration(), twn.durationRepeat() );
                
                stwn.manageSubTween(false, prop);
                cssText = twn.tick_draw_prop( prop, adjustedPlayhead, true, stwn, cssText );
                //console.log(stwn.UID(), prop, stwn.values[prop].fromValues, stwn.values[prop].toValues);
            }    
            
//            if( stwn.element.id == 'title_outlines_bottom')
//                console.log( stwn.values );
            
            return cssText;
        }
        function _updatePropAdjustedPlayhead(twn, playhead, checkConflict, prop, stwn)
        {
            
            var adjustedPlayhead;
            
            if(playhead!=undefined)
                adjustedPlayhead = playhead - twn.delay();
            
            twn.tick_logic( adjustedPlayhead, false, prop, stwn, checkConflict);
            
            if(adjustedPlayhead<0) adjustedPlayhead = 0;
            else if(adjustedPlayhead>twn.durationRepeat() ) adjustedPlayhead = twn.durationRepeat() ;
            
            return adjustedPlayhead;
        }
        
        /** Reverses sequence playback.
         *  @method reverse
         *  @param {int} playhead - Reverses playback from specified time in milliseconds.
		 *							https://codepen.io/TweenSpace/pen/wGjmYz
         *  @memberof Timeline */
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
        /** Pauses sequence playback.
         *  @method pause
         *  @param {int} playhead - Pauses playback at specified time in milliseconds.
         *  If no argument is passed, animation will be paused at current playhead.
		 *	https://codepen.io/TweenSpace/pen/zqjppV
         *  @return {Timeline} - Returns itself for chaining purposes.
         *  @memberof Timeline */
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
        /** Stops sequence playback.
         *  @method stop
         *  @param {int} playhead - Stops playback at specified time in milliseconds.
         *  If no argument is passed, animation will stop at current playhead.
         *  @return {Timeline} - Returns itself for chaining purposes.
         *  @memberof Timeline */
        this.stop = function( playhead )
        {
            playhead  = _checkPlayhead( playhead );
            //playhead  = _adjustRepeatPlayhead( playhead );
            _apply( 'stop', playhead, true );
            
            return _this;
        }
        /**
         * Set values to specified method of a Tween instance.
         * @private */
        function _apply( operation, value, adjustPlayhead )
        {
            var adjustedValue;
            var q;
            
            //console.log('_apply', value, adjustPlayhead);
            for(q=0; q < _tweens.length; q++)
            {    
                if(adjustPlayhead==true && value!=undefined)
                    adjustedValue = value + ( -_tweens[q].delay() );
                else adjustedValue = value;
                
//                if(operation=='play')
//                   console.log('_tweens', operation, _tweens[q].currentTime(), adjustedValue, _tweens[q].elements() );
                
                //------------------------------------
                _tweens[q][operation](adjustedValue);
            }
        }
        /**
         * Check playhead.
         * @private */
        function _checkPlayhead( playhead )
        {
            if( isNaN(playhead) == true || playhead == undefined )
                playhead = _this.currentTime();
            
            return playhead;
        }
        /**
         * Adjust playhead for repeat feature.
         * @private */
        function _adjustRepeatPlayhead( playhead )
        {
            if(_repeat>0)
            {
                //Quick fix that should be revisited. Can't play a repeated timeline in reverse from the durationTotal() or the last millisecond.
                if( playhead == _this.durationTotal() )
                    playhead -= 1;
                else if(playhead > _this.durationTotal() )
                {
                    console.warn('TweenSpace.js Warning: playhead '+playhead+'ms is greater than Timeline total duration. Playhead has been set to '+_this.durationTotal()+'ms.');
                    playhead = _this.durationTotal()-1;
                }    
                
                _repeat_inc = parseInt(playhead/_this.duration());
                if( _yoyo == true )
                    _yoyo_isOdd = (_repeat_inc%2 == 1)?true:false;
                
                playhead = Math.abs((_repeat_inc*_this.duration()) - playhead );
                if( _yoyo_isOdd == true)
                    playhead = Math.abs(_this.duration() - playhead );
            }
            
            return playhead;
        }
        /**
         * Set values to specified property of elements within a Tween instance.
         * @private */
        function _setTweensProp( prop, val )
        {
            var q;
            for(q=0; q < _tweens.length; q++)
                _tweens[q][prop] = val;
        }
        /**
         * Auto adjust sequence duration. This method is used right after a tween has been added of removed.
         * @private */
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
                //Check if tween exists
                var i = 0;
                for(; i < _tweens.length; i++)
                {
                    if(_tweens[i] == tween)
                        break;
                    if(i == _tweens.length - 1)
                        _tweens.push(tween);
                }
            }
        }
        
        this._ = {};
        this._.manageRepeatCycles = function()
        {
            //Repeat is enabled
            if( _this.repeat() > 0 && _repeat_inc >=0 && _repeat_inc <= _this.repeat() )
            {
                    //Timeline in point
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
                    //Timeline out point
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
/**SVG Module
* @private */
(function ( TweenSpace ) {
    
    /**SVG Module.
    * @private*/
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
    
    /** Returns path length of an SVG Circle.
     * @private */
    function circlePathLength(svgObj)
    {
        var r = svgObj.getAttribute('r');
        var circleLength = 2 * Math.PI * r; 
        return circleLength;
    }
    /** Returns path length of an SVG Rectangle.
     * @private */
    function rectPathLength(svgObj)
    {
        var w = svgObj.getAttribute('width');
        var h = svgObj.getAttribute('height');

        return (w*2)+(h*2);
    }
    /** Returns path length of an SVG Polygon.
     * @private */
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
    /** Returns path length of an SVG Path.
     * @private */
    function pathLength(svgObj)
    {
        return svgObj.getTotalLength();
    }
    /** Returns a path string out of an array of path segments.
     * @private */
    function pathArrayToString( array )
    {
        return array.valueOf().toString().replace(/,/g, " ");
    }
    /** Match the amount of points in the path of two SVG Objects.
     * @private */
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
            //arg has to be a path.
            if(arg.constructor === String)
                return TweenSpace.SVG.path.toBezier( arg );
            //arg has to be an SVG Element.
            else if(arg.tagName == 'rect' || arg.tagName == 'polygon' || arg.tagName == 'ellipse' || arg.tagName == 'circle' || arg.tagName == 'path' )
                return TweenSpace.SVG.path.toBezier( TweenSpace.SVG.path.toString(TweenSpace.SVG.svgToPath( arg ) ) );
        }
    }
    
    //____________________________________________________________
    // Source: https://github.com/adobe-webplatform/Snap.svg
    // Author: Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
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
            /*res = [
                ["M", cx, cy],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];*/
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
        var _1_3 = 0.33333333333333333333333, // 1/3
            _2_3 = 0.66666666666666666666667; // 2/3
        return [ (_1_3 * x1 + _2_3 * cpx), (_1_3 * y1 + _2_3 * cpy), (_1_3 * x2 + _2_3 * cpx), (_1_3 * y2 + _2_3 * cpy), x2, y2 ];
    }
    function arcToCubic(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive)
    {
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
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
                    if (pcom == "C" || pcom == "S") // In "S" case we have to take into account, if the previous command is C/S.
                    { 
                        nx = d.x * 2 - d.bx;          // And reflect the previous
                        ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                    }
                    else // or some else or nothing
                    {                            
                        nx = d.x;
                        ny = d.y;
                    }
                    path = ["C", nx, ny].concat(path.slice(1));
                }
                else if( cmd == "T")
                {    
                    if (pcom == "Q" || pcom == "T") // In "T" case we have to take into account, if the previous command is Q/T.
                    { 
                        d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                        d.qy = d.y * 2 - d.qy;        // to case "S".
                    }
                    else // or something else or nothing
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
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
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
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        
        for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command
            
            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath
            
            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
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
        // (mx > nx || my < ny) && (alpha += 180);
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
    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z)
    {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
            var p = [
                        {x: +crp[i - 2], y: +crp[i - 1]},
                        {x: +crp[i],     y: +crp[i + 1]},
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
    
    // Source: https://github.com/adobe-webplatform/Snap.svg
    // Author: Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
    //____________________________________________________________
})(TweenSpace || {});
/**SplitText Module */
(function ( TweenSpace ) {
    
    /**Static method that is capable of getting text ready to be animated by characters, words or lines.
     * @method SplitText                                                                                                   
     * @param {object} params - An object containing SplitText properties.
     * @property {*} params.elements - Element or elements whose properties should be animated. Accepted arguments are a DOM element, an array of elements or query selection string.
     * @property {string} params.type - Text will get ready to be animated by characters, words or lines.  
	 									https://codepen.io/TweenSpace/pen/GvMgQb
     * @return {SplitText} - SplitText instance.
	 						 
     * @memberof TweenSpace */
    TweenSpace.SplitText = function( params )
    {
        return new SplitText(params);
    }
    
    /**
     * @class SplitText class is capable of getting text ready to be animated by characters, words or lines.
     * @param {object} params - An object containing SplitText properties.
     * @property {*} params.elements - Element or elements whose properties should be animated. Accepted arguments are a DOM element, an array of elements or query selection string.
     * @property {string} params.type - Text will get ready to be animated by characters, words or lines. 
	 									https://codepen.io/TweenSpace/embed/GvMgQb
     * @return {SplitText} - SplitText instance.
	 						 
     * @memberof SplitText  
     * @public */
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
            
            //PRIVATE MEMBERS
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
        
        /** Splits text into characters, words and lines.
         *  @method  split 
         *  @memberof SplitText */
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
                    //Loop over elements
                    for(;i<elems.length;i++)
                    {
                        var j = 0, 
                            parent_style = {}, 
                            stylesheet = window.getComputedStyle(elems[i], null);
                        //startCharIndex = 0;
                        //charInc = 0;
                        parent_style.width = stylesheet.width;
                        parent_style.height = stylesheet.height;
                        parent_style.paddingLeft = stylesheet.paddingLeft;
                        parent_style.paddingRight = stylesheet.paddingRight;
                        parent_style.marginLeft = stylesheet.marginLeft;
                        parent_style.marginRight = stylesheet.marginRight;
                        parent_style.borderRightWidth = stylesheet.borderRightWidth;
                        parent_style.borderLeftWidth = stylesheet.borderLeftWidth;
                        
                        //Loop over elements' childNodes looking for text elements only
                        for(;j<elems[i].childNodes.length;j++)
                        {
                            var lineStr = "";
                            
                            //Loop over characters
                            if(elems[i].childNodes[j].data != undefined)
                            {
                                var str = elems[i].childNodes[j].data;
                                this._.originalData.push( elems[i].childNodes[j].data );
                                chars = str.split('');
                                words = str.split(' ');
                                
                                //Delete text
                                elems[i].childNodes[j].data = "";
                                
                                var k = 0;
                                wordInc++;
                                var div_word = document.createElement('div');
                                div_word.id = 'word_'+TweenSpace._.UID();//'word_'+wordInc;
                                div_word.style.position = "relative";
                                div_word.style.display = "inline-block";
                                forChar:for(;k<str.length;k++)
                                {
                                    var div_char;
                                    div_char = document.createElement('div');
                                    div_char.id = 'char_'+TweenSpace._.UID();//'char_'+charInc;
                                    div_char.style.position = "relative";
                                    div_char.style.display = "inline-block";
                                    
                                    //Check if next character is a whitespace
                                    if( k+1 < str.length)
                                    {
                                        if(str[k+1]==" ")
                                            div_char.innerHTML = str[k]+"&nbsp;";
                                        else
                                            div_char.innerHTML = str[k];
                                    }
                                    //ADD last char
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
                                    //Check if current character is a whitespace
                                    if( str[k]==" " )
                                    {
                                        //ADD word
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
                                        div_word.id = 'word_'+TweenSpace._.UID();//'word_'+wordInc;
                                        div_word.style.position = "relative";
                                        div_word.style.display = "inline-block";
                                    }
                                    else
                                    {
                                        //If isChar == false, don't store char divs into this.chars array
                                        if(this._.isChar == true)
                                            this.chars.push(div_char);
                                        
                                        if(this._.isWord == true)
                                        {
                                            //Add word and char divs to DOM
                                            if(this._.isChar == true)
                                                div_word.appendChild(div_char);
                                            //Add ONLY word divs to DOM
                                            else
                                                div_word.innerHTML += div_char.innerHTML;
                                        }    
                                        else
                                            //Add ONLY char divs to DOM
                                            elems[i].appendChild(div_char);
                                    }
                                    
                                    //Check lines
                                    if(this._.isLine == true)
                                    {
                                        lineStr += str[k];
                                        if(this._.isWord == true)
                                        {
                                            
                                            if( wordWidthInc >= this._.round(parseFloat(parent_style.width), 2) || k == str.length-1 )
                                            {
                                                var div_line = document.createElement('div');
                                                div_line.id = 'line_'+TweenSpace._.UID();//'line_'+lineInc;
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
                                                
                                                //Last line was added so break the loop
                                                if(k == str.length-1)
                                                    break forChar;
                                                
                                                var style_word2 = window.getComputedStyle(document.getElementById('word_'+m), null);
                                                    wordWidthInc = this._.round(parseFloat(style_word2.width), 2) || 0;
                                            }
                                        }
                                        else
                                        {
                                            //Add char div temporarely
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
                                                    div_line.id = 'line_'+TweenSpace._.UID();//'line_'+lineInc;
                                                    div_line.style.position = "relative";
                                                    div_line.style.display = "inline-block";
                                                    
                                                    //Add line from string
                                                    if(this._.isChar == false)
                                                        div_line.innerHTML = lineStr;
                                                    //Add line grouping previously added char divs
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
                                            
                                            //Remove temporarely added char div
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
        
         /** Sets text back to the original state.
         *  @method  unsplit 
         *  @memberof SplitText */
        unsplit()
        {
            if( this._.isSplit == true)
            {
                this._.isSplit = false;
                var elems = this._.elements;
                var i = 0;
                
                //Loop over elements
                for(;i<elems.length;i++)
                    elems[i].innerHTML = this._.originalData[i];
            }
        } 
    }
    
})(TweenSpace || {});
