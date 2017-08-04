/*
Copyright (c) 2011-2016 TweenSpace

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
if(TweenSpace === undefined ) 
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
            _temp_node = TweenSpace._.Node(value);

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

            node = null;
            _length--;
            _length = (_length > 0)?_length:0;

            return _temp_node;
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
    var _MAX_NUMBER = Number.MAX_SAFE_INTEGER;
    /** Return the least value between a and b.
     * @private */
    var _min = function (a, b)
    {
        return (a<b)?a:b;
    }
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
    function _updateTweens()
    {
        TweenSpace._.current_tween = _tween = null;

        //Loop over tweens
        var curr_node = _queue_DL.head;
        var j=0;
        for( ; j<_queue_DL.length(); j++ )
        {
            TweenSpace._.current_tween = _tween = curr_node.data;

            if( _tween.playing() == true )
                _tween.tick();
            else
            {
                if( _queue_DL.length() > 0 ) curr_node = _queue_DL.remove( curr_node );
                if( _queue_DL.length() > 1 ) curr_node = curr_node.prev;

                j--;
                j = (j<0)?0:j;
            }

            if(curr_node)
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
        var elements, tsParams = {}, delay, tweenDelay, delayInc, duration, tweens = [], shuffle, seed, paramsInc = [], 
            val = 'val', prefix = 'prefix', suffix = 'suffix', valInc = 'valInc';
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
                for(var i=0; i<length; i++)
                {
                    //Loop over NON TS params only
                    for ( var param in params )
                    {
                        if(params[param].constructor == String)
                        {
                            //Is function-based value
                            if(params[param].match( /\+=|-=|\*=|\/=/ ) != null)
                            {
                                if( paramsInc[param] == undefined)
                                {
                                    paramsInc[param] = {};
                                    paramsInc[param][prefix] = params[param].match( /\+=|-=|\*=|\/=/ );
                                    paramsInc[param][suffix] = params[param].match( /em|ex|px|in|cm|mm|%|rad|deg/ );
                                    paramsInc[param][val] = parseFloat( params[param].split("=").pop() );
                                    paramsInc[param][valInc] = (paramsInc[param][prefix] == '+=' || paramsInc[param][prefix] == '-=')?0:1;
                                    
                                }
                                else
                                {
                                    paramsInc[param][valInc] = TweenSpace._.functionBasedValues(paramsInc[param][val], params[param] );
                                    params[param] = paramsInc[param][prefix] + String(paramsInc[param][valInc]) + paramsInc[param][suffix];
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
                    
                    tweens.push( TweenSpace.Tween( params ) );
                    if(tweenDelay.constructor == String)
                        delayInc = TweenSpace._.functionBasedValues(delayInc, tweenDelay);
                    else
                        delayInc += tweenDelay;
                }

                if(shuffle == true)
                    tweens = shuffleDelay( tweens, seed );
                
                if( play == true )
                {
                    var timeline = TweenSpace.Timeline({tweens:tweens});
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
    TweenSpace.from = function( params )
    {
        params[TweenSpace.params.isFrom] = true;
        var tween = TweenSpace.Tween( params );
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
        duration: 'duration',
        checkConflict: 'checkConflict',
        delay: 'delay',
        yoyo: 'yoyo',
        repeat: 'repeat',
        timescale: 'timescale',
        debug: 'debug',
        isFrom: 'isFrom',
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
    TweenSpace._.updateTweens = function()
    {
        return _updateTweens();
    };
    TweenSpace._.getElements = function(elements)
    {
        return _getElements(elements);
    };
    TweenSpace._.min = function(a, b)
    {
        return _min(a, b);
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
    TweenSpace._.MAX_NUMBER = function() { return _MAX_NUMBER };
    TweenSpace._.current_tween = _tween;
    


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

    /** TweenSpace Engine current version: 1.8.3.0
     *  @memberof TweenSpace */
    TweenSpace.version = '1.8.5.0'; //release.major.minor.dev_stage
    /** Useful under a debugging enviroment for faster revisiones.
     *  If true, the engine will assign destination values immediately and no animation will be performed.
     *  @memberof TweenSpace */
    TweenSpace.debug = false;
    
    
})(TweenSpace || {});
/**
 * Engine loop module.
 * @private */
(function ( TweenSpace ) {
    
    /** if true, engine is running.
     * @private */
    var _isEngineOn = false;
    /** Global elapsed time.
     * @private */
    var _eTime = 0;
    /** Delta time.
     * @private */
    var _dt = 0;
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
    
    /**
     * Engine loop based on 'requestAnimationFrame' method.
     * @private */
        
    TweenSpace._.dt = function()
    {
        return _dt;
    }
    TweenSpace._.engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            _isEngineOn = true;
            _tickCounter = _eTime = _now = _dt = 0;
            _start_time = _then = window.performance.now();
            var queue_DL = TweenSpace._.queue_DL;
            //var body_DL = TweenSpace.Physics._.body_DL; //__________________________________________________________________________________________________________________________
            
            tick();
            function tick()
            {
                //console.log(_tickCounter);
                _cancelAnimationFrame(_reqID);
                if( queue_DL.length() > 0 )//|| TweenSpace.Physics.active == true ) //________________________________________________________________________________________________
                {
                    _reqID = _requestAnimationFrame(tick);
                }
                else
                {
                    //Engine turns off
                    _isEngineOn = false;
                    _eTime = 0;
                }

                _now = window.performance.now();
                _eTime = _now - _start_time;
                _dt = _now - _then;
                _then = _now;

                //Loop over tweens
                TweenSpace._.updateTweens();
                //Loop over bodies
                /*if(TweenSpace.Physics.active == true)
                    TweenSpace.Physics._.updateBodies();*/ //__________________________________________________________________________________________________________________________

                _tickCounter++;
            }
        }
    }
    
})(TweenSpace || {});
/*Tween Module*/
(function ( TweenSpace ) {
    
    /**
    * Static method that creates Tween instances which are responsible of handling animations on single and multiple objects. The Tween class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc.
    * @method Tween
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
    TweenSpace.Tween = function( params )
    {
        return new Tween(params);
    }
        
    /**
    * @class Tween class is responsible of handling animations on single and multiple objects. This class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc. 
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
            
        delete params.elements;

        
        if( params.duration == undefined )
        {
            console.warn('TweenSpace.js Warning: Tween() has no duration defined!');
            return null;
        }
        else
        {
            _dur_init = params.duration;
            delete params.duration;
        }
        
        //SPLIT PARAMS INTO PROPS AND OPTIONS
        paramLoop:for ( var param in params )
        {
            paramDefinedLoop:for ( var paramDefined in TweenSpace.params )
            {
                //CHECK IF PARAM IS TWEENSPACE CUSTOM SUCH AS delay, duration, repeat, yoyo, ease, etc.
                if( param == paramDefined)
                { 
                    _options[param] = params[param];
                    
                    delete params[param];
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
                            var effectObjects = { [param]:{} };
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
                            
                            for ( var m=0;m<effectProps.length;m++ )
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
                                delete params[param];
                                break paramDefinedLoop;
                            }
                        }
                    }
                }
            }
        }
        
        for (var attrname in params)
            _props[attrname] = params[attrname];
        //_props = params;
        
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
        var _checkConflict = (_options.checkConflict!=undefined)?_options.checkConflict : true;
        /** If true, Tween instance used by Timeline parent to execute important tasks such as onProgress and onComplete callbacks.
         *  @private */
        var _isFrom = _options.isFrom || false;
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
        this.elements = function()
        {
            return _elements;
        }
        /** Returns the current value between from and to properties when using TweenSpace.numberTo() method.
         *  This value can be accessed within the onProgress() method. 
         *  @method numberTo
         *  @return {float} - Returns the current value between from and to properties when using TweenSpace.numberTo() method.
         *  @memberof Tween */
        this.numberTo = function()
        {
            return _numberTo;
        }
        /** Returns current time in milliseconds.
         *  @method currentTime
         *  @return {float} - Time in milliseconds.
         *  @memberof Tween */
        this.currentTime = function()
        {
            return _mTime;
        }
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
        }  
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
        }
        /** Returns true if tween is being played, otherwise it is either paused or not queued at all.
         *  @method playing 
         *  @return {boolean} - Returns true if tween is currently playing.
         *  @memberof Tween */
        this.playing = function()
        {
            return _playing;
        }
        /** Returns true if delay() property will be considered. @private */
        this.useDelay = function(value)
        {
            if( value != undefined )
                _useDelay = value;
            
            return _useDelay;
        }
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
        }
        /** If true, yoyo() property will play the animation back and forth based on repeat property amount.
         *  @method yoyo 
         *  @return {boolean} - yoyo current state.
         *  @memberof Tween */
        this.yoyo = function(value)
        {
            if( value != undefined )
                _yoyo = value;
            
            return _yoyo;
        }
        /** If true, tween belongs to a Timeline object. @private */
        this.timelineParent = function(value)
        {
            if( value != undefined )
                _timelineParent = value;
            
            return _timelineParent;
        }
        /** Returns the duration in milliseconds including. Neither repeat cycles nor delays are included.
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
        }
        /** Returns the total duration in milliseconds including repeat cycles. However delays are not considered.
         *  @method durationTotal
         *  @param {int} value - Total duration which is calculated internally. 
         *  @return {int} - Total duration in milliseconds.
         *  @memberof Tween */
        this.durationTotal = function( value )
        {
            if( value != undefined )
                _durationTotal = value;
            
            return _durationTotal;
        }
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
        }
        /** Tween class constructor. @private
        *@method constructor */
        this.constructor = new function()
        {
            _reset();
            
            var i = 0;
            for(; i < _elements.length; i++)
                _subTweens.push( _manageSubTween( new SubTween( _elements[i], _props ) ) );
                
        }
        /** Starts tween playback.
        *@method play
        *@param {int} playhead - Forward playback from specified time in milliseconds. Negative values represents delay time.
        * @memberof Tween */
        this.play = function( playhead )
        {
            _adjustPlayhead( playhead );
            _playback( playhead, true );
        }
        /** Resumes tween playback.
        *@method resume
        *@param {int} playhead - Resumes playback from specified time in milliseconds. Negative values represents delay time.
        * @memberof Tween */
        this.resume = function( playhead )
        {
            _adjustPlayhead( playhead );
            _playback( playhead, !_reversed );
        }
        /** Reverses tween playback.
        *@method reverse
        *@param {int} playhead - Reverses playback from specified time in milliseconds. Negative values represents delay time.
        * @memberof Tween */
        this.reverse = function( playhead )
        {
            _adjustPlayhead(playhead);
            _playback( playhead, false ); 
        }
        /** Pauses tween playback.
        *@method pause
        *@param {int} playhead - Pauses playback at specified time in milliseconds.
        * If no argument is passed, animation will be paused at current time. Negative values represents delay time
        * @memberof Tween */
        this.pause = function( playhead )
        {
            _paused = true;
            _playing = false;
            _pauseQueue();
            _this.seek( playhead );
        }
        /** Stops tween playback.
        *@method stop
        *@param {int} playhead - Stops playback at specified time in milliseconds.
        * If no argument is passed, animation will stop at current time. Negative values represents delay time.
        * @memberof Tween */
        this.stop = function( playhead )
        {
            _adjustPlayhead(playhead);
            _stopQueue();
            
            _this.seek( playhead );
        }
        /** Moves playhead to an specified time.
        *@method seek
        *@param {int} playhead - Moves playhead at specified time in milliseconds.
        * @memberof Tween */
        this.seek = function( playhead )
        {
            if( playhead != undefined )
            {
                if( _adjustPlayhead(playhead) != undefined )
                {   
                    _tick_logic();
                    _tick_draw(_dTime);
                }
            }
        }
        /** Returns true if animation is paused.
        *@method paused
        *@return {boolean} - If true, animation is paused.
        * @memberof Tween */
        this.paused = function()
        {
            return _paused;
        }
        /** Returns true if animation is reversed.
        *@method reversed
        *@return {boolean} - If true, animation is reversed.
        * @memberof Tween */
        this.reversed = function( bool )
        {
            if( bool != undefined )
                _reversed = bool;
            
            return _reversed;
        }
        /** This method will update Tween property values at runtime. This method is intended to be used rather that to() in order to improve performance.
        * This way you will avoid unnecessary re-instantiation of the same Tween. You can add new properties even when they were not defined at creation. 
        *@method updateTo
        *@param {object} props - An object containing new destination values.
        * @memberof Tween */
        this.updateTo = function( props )
        {
            _this.pause();
            _updateSubTweenProps(props);
            _this.play(0);
        }
        /** Calculates values over time. @private
        *@method tick */
        this.tick = function()
        {
            if(TweenSpace.debug == false)
                _tick_delta();
            else
            {
                _playing = false;
                _this.seek(_durationTotal);
            }
            
            _tick_logic();
            _tick_draw(_dTime);
            
            //TIMELINE CALLBACKS____________________________________
            if( _keyTween == true )
            {
                if( _this.timelineParent().onProgress != undefined )
                {    
                    _this.timelineParent().onProgress();
                }
                
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
        }
        /** Set or return the key Tween instance.
         * @private*/
        this.keyTween = function(value)
        {
            if( value != undefined )
                _keyTween = value;
            
            return _keyTween;
        }
        /** Set or return the key Tween instance.
         * @private*/
        this.subTweens = function()
        {
            return _subTweens;
        }
        /** Reset settings.
         * @private*/
        function _reset()
        {
            _repeat = (_repeat<0)?TweenSpace._.MAX_NUMBER:_repeat;
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
                
                _mTime = playhead;
            }
            return playhead;
        }
        /** Calculates delta change.
         * @private*/
        function _tick_delta()
        {
            //FORWARDS ---->>
            if(_reversed == false)
                _mTime += TweenSpace._.dt();  
            //BACKWARDS <<-----
            else
                _mTime -= TweenSpace._.dt();
        }
        /** where the time logic occurs.
         * @private*/
        function _tick_logic()
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
            else if( _mTime >= _sTime && _mTime <= _durationTotal  )
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
            //ADJUST time______________________________________
            
            _manageRepeatCycles();
        }
        /** Method that draws the objects that are being animated.
         * @private*/
        function _tick_draw( time )
        {
            var i, tw, units;
            for( i=0; i<_subTweens.length; i++ )
            {
                tw = _subTweens[i];
                for ( var prop in tw.props )
                {   
                    if( prop == TweenSpace.params.svg.drawSVG )
                    {    
                        var drawValues = tw.tweenStep(prop, time);
                        tw.element.style.strokeDashoffset = drawValues[0];
                        
                        if(drawValues.length > 2)
                            tw.element.style.strokeDasharray = drawValues[1]+', '+drawValues[2];
                        else
                            tw.element.style.strokeDasharray = drawValues[1];
                    }
                    else if( prop == 'motionPathSVG' )
                    {    
                        tw.element.style.transformOrigin = (tw.props[prop]['pivotX'])+'px '+(tw.props[prop]['pivotY']+'px ');
                        tw.element.style.transform = tw.tweenStep(prop, time);
                        
                    }
                    else if( prop == 'morphSVG' )
                        tw.element.setAttribute('d', tw.tweenStep(prop, time) ) ;
                    else if( prop == 'numberTo' )
                        _numberTo = tw.tweenStep(prop, time);
                    else
                    {
                        //Animate custom objects. I.e. {x:0, y:1}
                        if(tw.element.constructor == Object)
                            tw.element[prop] = tw.tweenStep(prop, time);
                        //Animate CSS properties
                        else
                            tw.element.style[prop] = tw.tweenStep(prop, time);
                    }    
                }
            }
            
            //TWEEN CALLBACKS____________________________________
            if( _this.onProgress != undefined )
                _this.onProgress();
            
            if( _this.onComplete != undefined )
            {
                if( _playing == false )
                    _this.onComplete();
            }
            //TWEEN CALLBACKS____________________________________
        } 
        /** Method that manages tweens.
         * @private*/
        function _manageSubTween( tween )
        {
            var length = 0, q = 0, r = 0;
            var names = [], fromValues = [], toValues = [], units = [], effects = undefined,
                matchResult, inputPropString, initTransform, transform, initProp;
            
            //color vars
            var nameMatch, name, initName, rgb;
            
            
            
            //Store initial values
            //var styles = (_isNumberTo == true)?{}:window.getComputedStyle(tween.element, null);
            var styles;
            if( _isNumberTo == true )
            {    styles = {}; }
            else
            {
                if(tween.element.constructor == Object)
                    styles = tween.element;
                else
                    styles = window.getComputedStyle(tween.element, null); 
            }
                
            
            for ( var prop in tween.props )
            {
                //CHECK OBJECT TYPE ARGUMENTS_______________________________________
                if( tween.props[prop].constructor === Object )
                {
                    effects = {};
                    
                    if( tween.props[prop]['wiggle'] != undefined )
                        effects['wiggle'] = TweenSpace._.PerlinNoise(tween.props[prop]['wiggle'].amplitude, tween.props[prop]['wiggle'].frequency, tween.props[prop]['wiggle'].seed);
                    else if( tween.props[prop]['wave'] != undefined )
                        effects['wave'] = TweenSpace._.Wave(tween.props[prop]['wave'].amplitude, tween.props[prop]['wave'].frequency);
                    
                    if( tween.props[prop]['to'] != undefined )
                        inputPropString = String( tween.props[prop]['to'] );
                    else
                        inputPropString = styles[prop];
                }
                else
                    inputPropString = String(tween.props[prop]);
                
                names = [], fromValues = [], toValues = [], units = [];
                initProp = styles[prop];
                
                nameMatch = name = initName = rgb = '';
                
                if( prop == 'transform' )
                {
                    var regex = /(\w+)\((.+?)\)/g, match;
                    transform = {};
                    initTransform = {};
                    
                    //Get current transform
                    var initTransformString = tween.element.style.transform;
                    if( initTransformString != '' )
                    {
                        while(match = regex.exec(initTransformString))
                            initTransform[ match[1] ] = { fromValues:String(match[2]).split(',') };
                    }
                    
                    //Set destination transform and eliminate initial transform properties that are not defined as destination values 
                    while(match = regex.exec(inputPropString))
                    {
                        //Get destination values
                        transform[ match[1] ] = { fromValues:[], toValues:String(match[2]).split(','), units:[] }; //(matchResult) ? matchResult[0] : ""
                        
                        length = transform[ match[1] ].toValues.length;
                        for( q=0; q < length; q++ )
                        {
                            matchResult = String( transform[ match[1] ].toValues[q] ).match( /em|ex|px|in|cm|mm|%|rad|deg/ );
                            transform[ match[1] ].toValues[q] = parseFloat(transform[ match[1] ].toValues[q]);
                            
                            if(match[1] == 'rotate' || match[1] == 'rotate3d')
                                transform[ match[1] ].units[q] = (matchResult) ? matchResult[0] : "deg";
                            else
                                transform[ match[1] ].units[q] = (matchResult) ? matchResult[0] : "";
                        }
                        
                        //Set initial values
                        if( initTransform[ match[1] ] != undefined )
                        {
                            length = initTransform[ match[1] ].fromValues.length;
                            for( q=0; q < length; q++ )
                                initTransform[ match[1] ].fromValues[q] = parseFloat(initTransform[ match[1] ].fromValues[q]);

                            transform[ match[1] ].fromValues = initTransform[ match[1] ].fromValues;
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
                                transform[ match[1] ].fromValues[0] = 0;
                                transform[ match[1] ].fromValues[0] = 0;
                                transform[ match[1] ].fromValues[0] = 0;
                            }
                            else if(    match[1] == 'translateX' || match[1] == 'translateY' || match[1] == 'translateZ' || 
                                        match[1] == 'rotateX' || match[1] == 'rotateY' || match[1] == 'rotateZ' ||
                                        match[1] == 'skewX' || match[1] == 'skewY' || match[1] == 'perspective' )
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
                    }
                    
                    initTransform = null;
                }
                else if( prop.match( /color|fill|^stroke$/i ) )
                {
                    nameMatch = inputPropString.match( /rgba|rgb/i );
                    name = nameMatch[0];
                    initName = String(initProp).match( /rgba|rgb/i );
                    
                    if( name && initName)
                    {
                        rgb = String(inputPropString).slice( String(inputPropString).indexOf('(')+1, String(inputPropString).indexOf(')') ).split(',');
                        toValues.push(parseFloat(rgb[0])); toValues.push(parseFloat(rgb[1])); toValues.push(parseFloat(rgb[2]));
                        if( rgb.length > 3) toValues.push(parseFloat(rgb[3]));
                        
                        rgb = String(initProp).slice( String(initProp).indexOf('(')+1, String(initProp).indexOf(')') ).split(',');
                        fromValues.push(parseFloat(rgb[0])); fromValues.push(parseFloat(rgb[1])); fromValues.push(parseFloat(rgb[2]));
                        units.push(''); units.push(''); units.push('');
                        if( toValues.length > 3)
                        {
                            if( rgb.length > 3 ) fromValues.push(parseFloat(rgb[3]));
                            else fromValues.push(1);
                            units.push('');
                        }
                    }
                }
                else if( prop == TweenSpace.params.svg.drawSVG )
                {
                    var pathLength = TweenSpace.SVG.getTotalLength( tween.element );
                    //matchResult = String(inputPropString).match( /px|%/ );
                    units.push('px', 'px', 'px');
                    
                    //fromValues and toValues: [0] = strokeDashoffset, [1] = strokeDasharray first value, [2] = strokeDasharray second value
                    fromValues.push(parseFloat(styles['strokeDashoffset']));
                    if( styles['strokeDasharray'] == 'none')
                    {    
                        fromValues.push(pathLength);
                        fromValues.push(0);
                    }
                    else
                    {    
                        var drawFromValues = String(styles['strokeDasharray']).split(' ');
                        
                        if(drawFromValues.length > 1)
                            fromValues.push(parseFloat( drawFromValues[0] ), parseFloat( drawFromValues[1] ));
                        else
                            fromValues.push(parseFloat( drawFromValues[0] ), 0 );
                    }
                    
                    var drawToValues = String(inputPropString).split(' ');
                    if( String(inputPropString).match( /%/ ) != null )
                    {
                        if(drawToValues.length > 1)
                        {
                            toValues.push( -( parseFloat(drawToValues[0] )*0.01*pathLength ) );
                            toValues.push( Math.abs(parseFloat(drawToValues[0])-parseFloat(drawToValues[1]))*0.01*pathLength );
                            toValues.push( (100-Math.abs(parseFloat(drawToValues[0])-parseFloat(drawToValues[1])))*0.01*pathLength );
                        }
                        else
                        {
                            toValues.push( 0 );
                            toValues.push( Math.abs(parseFloat(drawToValues[0]))*0.01*pathLength );
                            toValues.push( (Math.abs(100-parseFloat(drawToValues[0]))*0.01*pathLength) );
                        }
                    }
                    else
                    {
                        if(drawToValues.length > 1)
                        {
                            toValues.push( -( parseFloat(drawToValues[0] ) ) );
                            toValues.push( Math.abs(parseFloat(drawToValues[0])-parseFloat(drawToValues[1])) );
                            toValues.push( (pathLength-Math.abs(parseFloat(drawToValues[0])-parseFloat(drawToValues[1]))) );
                        }
                        else
                        {
                            toValues.push( 0 );
                            toValues.push( parseFloat(drawToValues[0]) );
                            toValues.push( pathLength-parseFloat(drawToValues[0]) );
                        }
                    }
                }
                else if( prop == 'motionPathSVG' )
                {
                    effects = {};
                    units.push('px');
                    
                    if( tween.props[prop]['path'] != undefined )
                    {    
                        effects['path'] = TweenSpace._.getElements( tween.props[prop]['path'] )[0];
                        effects['pathLength'] = TweenSpace.SVG.getTotalLength( effects['path'] );
                    }
                    
                    effects['align'] = ( tween.props[prop]['align'] != undefined )?tween.props[prop]['align']:false;
                    
                    if( tween.props[prop]['rotationOffset'] != undefined )
                    {    
                        effects['rotationOffset'] = parseFloat(tween.props[prop]['rotationOffset']);
                        if(  String( tween.props[prop]['rotationOffset'] ).match( /rad/ ) != null )
                            effects['rotationOffsetUnits'] = 'rad';
                        else effects['rotationOffsetUnits'] = 'deg';
                    }
                    else
                    {
                        effects['rotationOffset'] = 0;
                        effects['rotationOffsetUnits'] = 'deg';
                    }
                    
                    effects['p1'] = {x:0, y:0};
                    effects['p2'] = {x:0, y:0};
                    
                    effects['pivotX'] = ( tween.props[prop]['pivotX'] != undefined )?tween.props[prop]['pivotX']:0;
                    effects['pivotY'] = ( tween.props[prop]['pivotY'] != undefined )?tween.props[prop]['pivotY']:0;
                    effects['offsetX'] = ( tween.props[prop]['offsetX'] != undefined )?tween.props[prop]['offsetX']:0;
                    effects['offsetY'] = ( tween.props[prop]['offsetY'] != undefined )?tween.props[prop]['offsetY']:0;
                    
                    if( String(inputPropString).match( /%/ ) != null )
                    {
                        if( tween.props[prop]['from'] != undefined )
                            fromValues.push( parseFloat( tween.props[prop]['from'] ) * 0.01 * effects['pathLength'] );
                        else
                            fromValues.push(0);
                        
                        if( tween.props[prop]['to'] != undefined )
                            toValues.push( parseFloat( tween.props[prop]['to'] ) * 0.01 * effects['pathLength'] );
                        else
                            toValues.push(0);
                    }
                    else
                    {
                        if( tween.props[prop]['from'] != undefined )
                            fromValues.push( parseFloat( tween.props[prop]['from'] ) );
                        else
                            fromValues.push(0);
                        
                        if( tween.props[prop]['to'] != undefined )
                            toValues.push( parseFloat( tween.props[prop]['to'] ) );
                        else
                            toValues.push(0);
                    }
                }
                else if( prop == 'morphSVG' )
                {
                    name = '';
                    effects = {};
                    units.push('');
                    
                    var toShapeElement = TweenSpace._.getElements(tween.props[prop]['shape'])[0];
                    var fromParent = tween.element.parentElement;
                    var toParent = toShapeElement.parentElement;
                    var bezierPaths = TweenSpace.SVG.matchPathPoints( tween.element, toShapeElement );
                    fromValues = bezierPaths[0];
                    toValues = bezierPaths[1];
                    
                    //Replace svg element by path
                    if(tween.element.tagName != 'path')
                    {
                        var fromShapeReplacement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        fromShapeReplacement.setAttribute('d', TweenSpace.SVG.path.toString( fromValues ) );
                        fromShapeReplacement.setAttribute('style', tween.element.getAttribute('style'));
                        
                        fromShapeReplacement.setAttribute('id', tween.element.getAttribute('id'));
                        fromShapeReplacement.setAttribute('class', tween.element.getAttribute('class'));
                        
                        fromParent.appendChild(fromShapeReplacement);
                        fromParent.removeChild(tween.element);
                        tween.element = fromShapeReplacement;
                    }
                    
                    //reverse
                    if( tween.props[prop]['reverse'] && tween.props[prop]['reverse'] == true )
                    {
                        var i = toValues.length-1;
                        var length = i;
                        var temp_toValues = [];
                        
                        for(;i>=0;i--)
                        {
                            if( i == length )
                                temp_toValues.push( [ 'M', toValues[i][5], toValues[i][6] ] );
                            else if( i == 0 )
                                temp_toValues.push( [ 'C', toValues[i+1][3], toValues[i+1][4], toValues[i+1][1], toValues[i+1][2], toValues[length][5], toValues[length][6] ] );
                            else
                                temp_toValues.push( [ 'C', toValues[i+1][3], toValues[i+1][4], toValues[i+1][1], toValues[i+1][2], toValues[i][5], toValues[i][6] ] );
                        }
                        
                        toValues = temp_toValues;
                    }
                    
                    //shapeIndex
                    if( tween.props[prop]['shapeIndex'] != undefined )
                    {
                        if(parseInt(tween.props[prop]['shapeIndex']) > toValues.length-1)
                        {
                            console.warn('TweenSpace.js Warning: morphSVG - shapeIndex is greater than max index: '+(toValues.length-1)+'.');
                            return;
                        }
                        
                        var partA = toValues.slice(0, parseInt(tween.props[prop]['shapeIndex']) );
                        partA.shift();
                        var partB = toValues.slice(parseInt(tween.props[prop]['shapeIndex']) );
                        partB.unshift(['M', partA[partA.length-1][5], partA[partA.length-1][6] ])
                        toValues = partB.concat(partA);
                    }
                    
                    //debug
                    if( tween.props[prop]['debug'] && tween.props[prop]['debug'] == true )
                    {
                        var fromShapeIndex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        fromShapeIndex.setAttribute('cx', fromValues[0][1]);
                        fromShapeIndex.setAttribute('cy', fromValues[0][2]);
                        fromShapeIndex.setAttribute('r', 6);
                        fromShapeIndex.setAttribute('stroke-width', 0);
                        fromShapeIndex.setAttribute('stroke', '#32B47D');
                        fromShapeIndex.setAttribute('fill', '#32B47D');
                        fromParent.appendChild(fromShapeIndex);
                        
                        var fromShapeDirection = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        if( tween.props[prop]['shapeIndex'] )
                        {
                            fromShapeDirection.setAttribute('cx', fromValues[ parseInt(tween.props[prop]['shapeIndex']) ][5] );
                            fromShapeDirection.setAttribute('cy', fromValues[ parseInt(tween.props[prop]['shapeIndex']) ][6] );
                        }
                        else
                        {
                            fromShapeDirection.setAttribute('cx', fromValues[ parseInt(Math.ceil(fromValues.length-1)*0.25) ][5]);
                            fromShapeDirection.setAttribute('cy', fromValues[  parseInt(Math.ceil(fromValues.length-1)*0.25)  ][6]);
                        }
                        fromShapeDirection.setAttribute('r', 4);
                        fromShapeDirection.setAttribute('stroke-width', 0);
                        fromShapeDirection.setAttribute('stroke', '#32B47D');
                        fromShapeDirection.setAttribute('fill', '#32B47D');
                        fromParent.appendChild(fromShapeDirection);
                        
                        var fromShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        fromShape.setAttribute('d', TweenSpace.SVG.path.toString( fromValues ) );
                        fromShape.setAttribute('stroke-width', 2);
                        fromShape.setAttribute('stroke', '#32B47D');
                        fromShape.setAttribute('fill', 'none');
                        fromParent.appendChild(fromShape);
                        
                        var fromStartText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        fromStartText.setAttribute('x', fromValues[0][1]+10);
                        fromStartText.setAttribute('y', fromValues[0][2]+2);
                        fromStartText.setAttribute('fill', '#1A6643');
                        fromStartText.innerHTML = 'Max Index: '+String(fromValues.length-1);
                        fromParent.appendChild(fromStartText);
                        
                        var fromDirText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                        if( tween.props[prop]['shapeIndex'] )
                        {
                            fromDirText.setAttribute('x', fromValues[parseInt(tween.props[prop]['shapeIndex'])][5]+10);
                            fromDirText.setAttribute('y', fromValues[parseInt(tween.props[prop]['shapeIndex'])][6]+2);
                        }
                        else
                        {
                            fromDirText.setAttribute('x', fromValues[ parseInt(Math.ceil(fromValues.length-1)*0.25) ][5]);
                            fromDirText.setAttribute('y', fromValues[  parseInt(Math.ceil(fromValues.length-1)*0.25)  ][6]);
                        }
                        
                        fromDirText.setAttribute('fill', '#1A6643');
                        fromDirText.innerHTML = ( tween.props[prop]['shapeIndex'] )?'User Index: ' + String(parseInt(tween.props[prop]['shapeIndex'])):'25% Index: ' + String(parseInt(Math.ceil(fromValues.length-1)*0.25));
                        fromParent.appendChild(fromDirText);
                        
                        var toShapeIndex = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        toShapeIndex.setAttribute('cx', toValues[0][1]);
                        toShapeIndex.setAttribute('cy', toValues[0][2]);
                        toShapeIndex.setAttribute('r', 6);
                        toShapeIndex.setAttribute('stroke-width', 0);
                        toShapeIndex.setAttribute('stroke', '#EE416D');
                        toShapeIndex.setAttribute('fill', '#EE416D');
                        fromParent.appendChild(toShapeIndex);
                        
                        var toShapeDirection = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                        
                        if( tween.props[prop]['shapeIndex'] )
                        {
                            toShapeDirection.setAttribute('cx', toValues[ parseInt(tween.props[prop]['shapeIndex']) ][5]);
                            toShapeDirection.setAttribute('cy', toValues[ parseInt(tween.props[prop]['shapeIndex']) ][6]);
                        }
                        else
                        {
                            toShapeDirection.setAttribute('cx', toValues[ parseInt(Math.ceil(toValues.length-1)*0.25) ][5]);
                            toShapeDirection.setAttribute('cy', toValues[ parseInt(Math.ceil(toValues.length-1)*0.25) ][6]);
                        }
                        toShapeDirection.setAttribute('r', 4);
                        toShapeDirection.setAttribute('stroke-width', 0);
                        toShapeDirection.setAttribute('stroke', '#EE416D');
                        toShapeDirection.setAttribute('fill', '#EE416D');
                        fromParent.appendChild(toShapeDirection);
                        
                        var toShape = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                        toShape.setAttribute('d', TweenSpace.SVG.path.toString( toValues ) );
                        toShape.setAttribute('stroke-width', 2);
                        toShape.setAttribute('stroke', '#EE416D');
                        toShape.setAttribute('fill', 'none');
                        fromParent.appendChild(toShape);
                    }
                    
                    transform = null;
                    effects = null;
                }
                else if( prop == 'numberTo' )
                {
                    fromValues.push(parseFloat(_props['from']));
                    toValues.push(parseFloat(_props['to']));
                    delete _props['from'];
                    delete _props['to'];
                }
                else
                {
                    matchResult = String(inputPropString).match( /em|ex|px|in|cm|mm|%|rad|deg/ );
                    var fromVal = parseFloat(initProp), toVal;
                    fromValues.push(fromVal);
                    
                    //!Check function-based values___________________________
                    toVal = TweenSpace._.functionBasedValues(fromVal, inputPropString); 
                    if(toVal == null)
                        toVal = parseFloat(inputPropString)
                    //Check function-based values___________________________!
                    
                    toValues.push(toVal);
                    units.push((matchResult) ? matchResult[0] : "");
                }
                
                if(_isFrom == false)
                    tween.values[prop] = new PropValues(name, fromValues, toValues, units, transform, effects);
                else
                    tween.values[prop] = new PropValues(name, toValues, fromValues, units, transform, effects);
                
                effects = undefined;
            }
            
            return tween;
        }
        /** Method that updates props values. 
         * @private*/
        function _updateSubTweenProps( newProps )
        {
            newPropsLoop:for ( var newProp in newProps )
            {
                var p;
                tweensLoop:for(p=0; p < _subTweens.length; p++)
                {
                    var found = false;
                    oldPropsLoop:for ( var oldProp in _subTweens[p].props )
                    {
                        if( newProp == oldProp)
                        {    
                            //Modify existing prop
                            _subTweens[p].props[oldProp] = newProps[newProp];
                            _manageSubTween(_subTweens[p]);
                            found = true;
                            break oldPropsLoop;
                        }
                    }
                    if( found == false)
                    {    
                        //Add new prop 
                        _subTweens[p].props[newProp] = newProps[newProp];
                        _manageSubTween(_subTweens[p]);
                    }
                }
            }
        }
        /** Method that removes tweens from queue.
         * @private*/
        function _pauseQueue()
        {
            var q;
            _node = TweenSpace._.queue_DL.head;
            for(q=0; q < TweenSpace._.queue_DL.length(); q++)
            {
                if( _node.data == _this )
                {
                    TweenSpace._.queue_paused_DL.push(_node.data);
                    TweenSpace._.queue_DL.remove(_node);
                    break;
                }
                _node = _node.next;
            }
        }
        /** Method that stops playing and paused tweens.
         * @private*/
        function _stopQueue()
        {
            if(_paused == false)
            {
                var q;
                _node = TweenSpace._.queue_DL.head;
                for(q=0; q < TweenSpace._.queue_DL.length(); q++)
                {
                    if( _node.data == _this )
                    {
                        TweenSpace._.queue_DL.remove(_node);
                        break;
                    }
                    _node = _node.next;
                }
            }
            else
            {
                var r;
                _node_paused = TweenSpace._.queue_paused_DL.head;
                for(r=0; r < TweenSpace._.queue_paused_DL.length(); r++)
                {
                    if( _node_paused.data == _this )
                    {
                        TweenSpace._.queue_paused_DL.remove(_node_paused);
                        break;
                    }
                    _node_paused = _node_paused.next;
                }
            }
            
            _paused = _playing = false;
        }
        /** Start forward or backward playback from specified time.
         * @private*/
        function _playback( playhead, direction )
        {
            _this.pause( playhead );
            
            _paused = false;
            
            if( _reversed == direction)
                _reversed = !direction;
            
            var q;
            _node_paused = TweenSpace._.queue_paused_DL.head;
            for(q=0; q < TweenSpace._.queue_paused_DL.length(); q++)
            {
                if( _node_paused.data == _this )
                {
                    TweenSpace._.queue_paused_DL.remove(_node_paused);
                    break;
                }
            }
            
            if(_checkConflict==true)
                checkConflicts();
                
            _playing = true;
            TweenSpace._.queue_DL.push( _this );
            
            TweenSpace._.engine();
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
                }    
                else
                {
                    _reversed_repeat = false;
                    _dTime = _dTime%_duration;
                }
                
                if( _mTime >= _durationRepeat )
                {
                    if( _reversed_repeat == false )
                        _dTime = _durationRepeat;
                    else
                        _dTime = _sTime;
                }
            }
        }
        function checkConflicts()
        {
            var i = 0, j = 0, k = 0;
            
            var this_subTweens_length = _subTweens.length;
            var curr_subTweens_length;
            var queue_length = TweenSpace._.queue_DL.length();
            var currNode = TweenSpace._.queue_DL.head;
            var tempNode;
            
            i=0;
            for(;i<this_subTweens_length;i++)
            {
                j=0;
                for(;j<queue_length;j++)
                {
                    curr_subTweens_length = currNode.data.subTweens().length;
                    
                    k=0;
                    for(;k<curr_subTweens_length;k++)
                    {
                        currNode.data.subTweens()[k];
                        
                        if( _subTweens[i].element == currNode.data.subTweens()[k].element )
                        {
                            for( var this_prop in _subTweens[i].props )
                            {
                                for( var curr_prop in currNode.data.subTweens()[k].props )
                                {
                                    if(this_prop == curr_prop)
                                    {
                                        //delete redundant property on current tween to avoid conflicts
                                        delete currNode.data.subTweens()[k].props[curr_prop];
                                    }
                                }
                            }
                        }
                    }
                    
                    tempNode = currNode.next;
                    currNode = tempNode;
                }
            }
        }
        /**
         * SubTween.
         * @class Internal class. Stores SubTween values.
         * @private
         */
        function SubTween(element, props)
        {
            this.element = element;
            this.props = props;
            this.values = {};
            
            this.tweenStep = function( property, elapesedTime )
            {
                var _names = this.values[property].names;
                var _toValues = this.values[property].toValues;
                var _fromValues = this.values[property].fromValues;
                var _units = this.values[property].units;
                var _transform = this.values[property].transform;
                var _effects = this.values[property].effects;
                
                var toLength, value, last_value, effectValue, rotate = 0;
                var result = '', newValues = '';
                
                var w;
                if( property == 'transform' )
                {
                    for(var prop in _transform)
                    {
                        toLength = _transform[prop].toValues.length;
                        newValues = '';
                        for(w=0; w < toLength; w++)
                        {
                            value = _this.ease( TweenSpace._.min(elapesedTime, _duration),
                                                _transform[prop].fromValues[w],
                                                _transform[prop].toValues[w],
                                                _duration );
                            
                            if( _effects != undefined )
                            {
                                for ( var tweenEffects in _effects )
                                {
                                    if( elapesedTime/_duration <= 0.1 )
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( elapesedTime, 0, 1, _duration*0.1 );
                                    else if( elapesedTime/_duration >= 0.9 )
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( _duration-elapesedTime, 0, 1, _duration*0.1 );
                                    else 
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration));

                                    value += effectValue;
                                }
                            }

                            newValues += String( value )+_transform[prop].units[w];
                            
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
                        //result.push( _this.ease( TweenSpace._.min(elapesedTime, _duration), _fromValues[w], _toValues[w], _duration )+_units[w] );
                        value = _this.ease( TweenSpace._.min(elapesedTime, _duration), _fromValues[w], _toValues[w], _duration );
                        if(w!=1)
                        {
                            if( _effects != undefined )
                            {
                                for ( var tweenEffects in _effects )
                                {
                                    if( elapesedTime/_duration <= 0.1 )
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( elapesedTime, 0, 1, _duration*0.1 );
                                    else if( elapesedTime/_duration >= 0.9 )
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( _duration-elapesedTime, 0, 1, _duration*0.1 );
                                    else 
                                        effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration));

                                    value += effectValue;
                                }
                            }
                        }
                        result.push( value+_units[w] );
                    }
                }
                else if( property == 'motionPathSVG' )
                {
                    value = _this.ease( TweenSpace._.clamp( elapesedTime, 0, _duration), _fromValues[0], _toValues[0], _duration );
                    last_value = _this.ease( TweenSpace._.clamp( elapesedTime-TweenSpace._.dt(), 0, _duration), _fromValues[0], _toValues[0], _duration );
                    
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
                        
                        for(j = 0;j<_fromValues[i].length;j++)
                        {   
                            if(j>0)
                                currentSegmentArray.push( _this.ease( TweenSpace._.min(elapesedTime, _duration), parseFloat(_fromValues[i][j]), parseFloat(_toValues[i][j]), _duration ) );
                            else
                                currentSegmentArray.push( _toValues[i][j] );
                        }
                        
                        currentPathArray.push(currentSegmentArray);
                    }
                    
                    result = TweenSpace.SVG.path.toString(currentPathArray);
                }
                else if( property == 'numberTo' )
                {
                    result = _this.ease( TweenSpace._.min(elapesedTime, _duration), _fromValues[0], _toValues[0], _duration );
                }
                else
                {
                    toLength = _toValues.length;
                    newValues = '';

                    for(w=0; w < toLength; w++)
                    {
                        value = _this.ease( TweenSpace._.min(elapesedTime, _duration), _fromValues[w], _toValues[w], _duration );
                        
                        if( _effects != undefined )
                        {
                            for ( var tweenEffects in _effects )
                            {
                                if( elapesedTime/_duration <= 0.1 )
                                    effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( elapesedTime, 0, 1, _duration*0.1 );
                                else if( elapesedTime/_duration >= 0.9 )
                                    effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration)) * _this.ease( _duration-elapesedTime, 0, 1, _duration*0.1 );
                                else 
                                    effectValue = _effects[tweenEffects].tick( TweenSpace._.min(elapesedTime, _duration));
                                
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
                            if( _names.match(/rgb/i) )
                            {
                                if(w<3)
                                    value = parseInt(value);
                            }

                        newValues += String( value ) + _units[w];
                        if(w<toLength-1) newValues += ',';
                    }
                    
                    if( _names ) result = _names+'('+newValues+')';
                    else result = newValues;
                }
                
                return result;
            }

            return this;
        }
        /**
         * PropValues.
         * @class Internal class. Stores SubTween prop values.
         * @private
         */
        function PropValues(names, fromValues, toValues, units, transform, effects)
        {
            this.names = names;
            this.fromValues = fromValues;
            this.toValues = toValues;
            this.units = units;
            this.transform = transform;
            this.effects = effects;
            
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
     * @property {*} params.timescale - Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
     *                                  While a value of 1 represents normal speed, lower values makes the faster as well as greater values
     *                                  makes the animation slower.
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
        
        /** Returns Timeline instance duration in milliseconds.
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
        /** Set or Gets Timeline repeat amount.
         *  @method repeat
         *  @return {int} - Repeat amount.
         *  @memberof Timeline */
        this.repeat = function( int )
        {
            if(int != undefined)
                _repeat = int;
            return _repeat;
        }
        /** Set or Gets Timeline yoyo behavior.
         *  @method yoyo
         *  @return {bool} - Yoyo behavior
         *  @memberof Timeline */
        this.yoyo = function( bool )
        {
            if(bool != undefined)
                _yoyo = bool;
            return _yoyo;
        }
        /** Returns current time in milliseconds.
         *  @method currentTime
         *  @return {float} - Time in milliseconds.
         *  @memberof Timeline */
        this.currentTime = function()
        {
            return _tweens[_tweens.length-1].currentTime() + _tweens[_tweens.length-1].delay();
        }
        /** Scales the time of all tweens in the Timeline. While a value of 1 represents normal speed, lower values
         *  makes the faster as well as greater values makes the animation slower.
         *  @method timescale
         *  @param {float} value - Amount of time scale.
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
         *  @param {*} tweens - Tween or array of Tween instances.
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
                    tweens.useDelay(true);
                    if( _tweens.length == 0)
                        _tweens.push(tweens);
                    else
                    {
                        for(; i < _tweens.length; i++)
                        {
                            if(_tweens[i] == tweens)
                                break;
                            if(i == _tweens.length - 1)
                                _tweens.push(tweens);
                        }
                    }
                }
                else if( tweens.constructor === Array )
                {
                    if( _tweens.length == 0)
                    {
                        if( tweens[0].__proto__.constructor.name === 'Tween' )
                        {
                            tweens[0].useDelay(true);
                            _tweens.push(tweens[0]);
                            i++;
                        }
                    }

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
                    }
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
                _this.repeat( params.repeat || undefined );
                _this.yoyo( params.yoyo || undefined );
            }
        }
        /** Removes tweens to a Timeline instance.
         *  @method removeTweens
         *  @param {Tween} tweens - Tween or array of Tween instances.
         *  @memberof Timeline */
        this.removeTweens = function( tweens )
        {
            if(_tweens.length > 0)
            {    
                _tweens[_tweens.length-1].keyTween(false);
                _tweens[_tweens.length-1].timelineParent(null);
            }
            
            var i = 0, j = 0;
            if( Tween.prototype.isPrototypeOf(tweens) === true )
            {
                for(; i < _tweens.length; i++)
                {
                    if(_tweens[i] == tweens)
                    {
                        _tweens.splice(i, 1);
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
                            _tweens.splice(j, 1);
                            break loop2;
                        }
                    }
                }
            }
            
            _tweens[_tweens.length-1].keyTween(true);
            _tweens[_tweens.length-1].timelineParent(_this);
            
            _autoTrim();
        }
        /** Starts sequence playback.
         *  @method play
         *  @param {int} playhead - Forward playback from specified time in milliseconds.
         *  @memberof Timeline */
        this.play = function( playhead )
        {
            _reversed = false;
            _repeat_direction = true;
            playhead  = _checkPlayhead( playhead );
            playhead  = _adjustRepeatPlayhead( playhead );
            _apply( (_yoyo_isOdd == false)?'play':'reverse', playhead, true );
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
         *  @memberof Timeline */
        this.seek = function( playhead )
        {
            playhead  = _adjustRepeatPlayhead( playhead );
            var adjustedPlayhead;
            var q=0;
            for(; q < _tweens.length; q++)
            {
                if(playhead!=undefined)
                    adjustedPlayhead = playhead + (-_tweens[q].delay());
                
                _tweens[q]['seek'](adjustedPlayhead);
            }
        }
        /** Reverses sequence playback.
         *  @method reverse
         *  @param {int} playhead - Reverses playback from specified time in milliseconds.
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
         *  If no argument is passed, animation will be paused at current playhead. Negative values represents delay time.
         *  @memberof Timeline */
        this.pause = function( playhead )
        {
            playhead  = _checkPlayhead( playhead );
            //playhead  = _adjustRepeatPlayhead( playhead );
            _apply( 'pause', playhead, true );
        }
        /** Stops sequence playback.
         *  @method stop
         *  @param {int} playhead - Stops playback at specified time in milliseconds.
         *  If no argument is passed, animation will stop at current playhead. Negative values represents delay time.
         *  @memberof Timeline */
        this.stop = function( playhead )
        {
            playhead  = _checkPlayhead( playhead );
            //playhead  = _adjustRepeatPlayhead( playhead );
            _apply( 'stop', playhead, true );
        }
        /**
         * Set values to specified method of a Tween instance.
         * @private */
        function _apply( operation, value, adjustPlayhead )
        {
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
                console.log('A', _this.currentTime(), _repeat_inc, playhead, _this.duration());
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
                console.log('-',_this.currentTime(), _repeat_inc, playhead, _this.duration());
                playhead = Math.abs((_repeat_inc*_this.duration()) - playhead );
                if( _yoyo_isOdd == true)
                    playhead = Math.abs(_this.duration() - playhead );
                console.log('B',_this.currentTime(), _repeat_inc, playhead, _this.duration());
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
                _tweens[q].durationTotal( _duration - (_tweens[q].delay() + _tweens[q].duration()) + _tweens[q].duration() );
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
