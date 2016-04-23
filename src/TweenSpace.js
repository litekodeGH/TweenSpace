/*
Copyright (c) 2011-2016 LiteKode

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*TODO
1. follow object
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
    TweenSpace = Tweenspace = TS = (function () {
    
    "use strict";
    /** Reference to TweenSpace object.
     * @private */
    var _this = this;
    /** Circular doubly linked list of the tweens being played.
     * @private */
    var _queue_DL = new DoublyList();
    /** Circular doubly linked list of paused tweens.
     * @private */
    var _queue_paused_DL = new DoublyList();
    /** Temporary Node instance used in DoublyList. 'data' property holds a Tween instance.
     * @private */
    var _node = new Node();
    /** Another temporary Node instance used in DoublyList.
     * @private */
    var _node_paused = new Node();
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
    /** Temporary Tween instance.
     * @private */
    var _tween = null;
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
    /** _delayed calls list.
     * @private */
    var _delayedCallList = new DoublyList();
    /** Temporary Node instance used in _delayedCallList.
     * @private */
    var _delayedCallNode = new Node();
    /** PI value.
     * @private */
    var _pi = 3.1415926535897932384626433832795;
    var _pi_m2 = _pi * 2;
    var _pi_d2 = _pi / 2;
    var _MAX_NUMBER = Number.MAX_SAFE_INTEGER;
    var _requestAnimationFrame, _cancelAnimationFrame;
    
    /** Return the least value between a and b.
     * @private */
    var _min = function (a, b)
    {
        return (a<b)?a:b;
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
        
        /*if( Tween.prototype.isPrototypeOf(elements) == true )
        {
            for(l=0; l < elements.tweens.length; l++)
                elementArray.push( elements.tweens[l].element);
        }
        else*/ if( elements.constructor === String)
        {
            var nodeList = document.querySelectorAll(elements);
            if( nodeList == null || nodeList == undefined )
                return null;

            var i = 0;
            for(;i < nodeList.length; i++)
                elementArray[i] = nodeList.item(i);
        }
        else if( elements.constructor === Array ) elementArray = elements;
        else elementArray.push(elements);
        
        return elementArray;
    }
    /**
     * Engine loop based on 'requestAnimationFrame' method.
     * @private */
    var _engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            _requestAnimationFrame =    window.requestAnimationFrame ||
                                        window.mozRequestAnimationFrame || 
                                        window.webkitRequestAnimationFrame ||
                                        window.msRequestAnimationFrame;
            _cancelAnimationFrame = window.cancelAnimationFrame ||
                                    window.mozCancelAnimationFrame || 
                                    window.webkitCancelAnimationFrame ||
                                    window.msCancelAnimationFrame;
            _isEngineOn = true;
            _tickCounter = _eTime = _now = _dt = 0;
            _tween = null;
            
            _start_time = _then = window.performance.now();
            
            tick();
            function tick()
            {
                _cancelAnimationFrame(_reqID);
                if( _queue_DL.length() > 0 )
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
                var curr_node = _queue_DL.head;
                var j=0;
                for( ; j<_queue_DL.length(); j++ )
                {
                    _tween = curr_node.data;
                    
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
                
                _tickCounter++;
            }
        }
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
     * Node.
     * @class Internal class. Simple node used in DoublyList.
     * @param {Tween} value - Stores a Tween instance.
     * @return {Node} - Node instance.
     * @private
     */
    function Node(value)
    {
        this.data = value;
        this.prev = null;
        this.next = null;
        
        return this;
    }
    /**
     * DoublyList.
     * @class Internal class that implements a circular linked list in both directions.
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
            _temp_node = new Node(value);

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
    /**
     * PerlinNoise.
     * @class Internal class that creates 1D Perlin Noise values.
     * @return {PerlinNoise} - PerlinNoise instance.
     * @private
     */
    function PerlinNoise( amplitude, frequency )
    {
        this.amplitude = amplitude;
        this.frequency = frequency;
        
        var _this = this;
        var _MAX_VERTICES = 256; //256
        var _MAX_VERTICES_MASK = _MAX_VERTICES -1;
        var _vertices = [];
        
        var _xMin, _xMax;
        
        this.constructor = new function()
        {
            for ( var i = 0; i < _MAX_VERTICES; ++i )
                _vertices.push( Math.random()*((Math.random()<0.5)?-1:1) );
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
     * PerlinNoise.
     * @class Internal class that creates 1D Perlin Noise values.
     * @return {PerlinNoise} - PerlinNoise instance.
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
    
	return {
        /**
        * Static method that returns a Tween instance which holds destination values and other properties.
        * This method creates and queues a Tween instance as well as stores its current values.
        * @method to
        * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
        * @property {*} params.elements - Element or elements whose properties should be animated.
                                Accepted arguments are a DOM element, an array of elements or CSS selection string.
        * @property {int} params.duration - Tween duration in milliseconds.
        * @param {object} params - An object containing custom properties such as delay(), onComplete(), etc.
        * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation.
        * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount.
        * @property {int} params.repeat - Amount of times that the animation will be played.
        * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
        *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
        *                                   makes the animation slower.
        * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time.
        *                                  Equations used were developed by Robert Penner.
        * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running.
        * @property {function} params.onComplete - Callback dispatched when the animation has finished.
        * @return {Tween} - Tween instance.
        * @memberof TweenSpace */
        to: function( elements, duration, props, options )
        {
            var tween = TweenSpace.Tween( elements, duration, props, options );
            tween.play();

            return tween;
        },
        /** Static method that pauses all tweens and sequences.
        * @method pauseAll
        * @memberof TweenSpace */
        pauseAll: function()
        {
            for( ;_queue_DL.length() > 0; )
                _queue_DL.head.data.pause();
        },
        /** Static method that resumes all tweens and sequences.
        * @method resumeAll
        * @memberof TweenSpace */
        resumeAll: function()
        {
            for( ;_queue_paused_DL.length() > 0; )
                _queue_paused_DL.head.data.resume();
        },
        /** Static method that stops all tweens and sequences.
        * @method stopAll
        * @memberof TweenSpace */
        stopAll: function()
        {
            for( ;_queue_DL.length() > 0; )
                _queue_DL.head.data.stop();
            
            for( ;_queue_paused_DL.length() > 0; )
                _queue_paused_DL.head.data.stop();
        },
        /** TweenSpace options contains custom properties such as delay, onComplete, etc. TweenSpace.option object is intended to be used as a reference only.
        * @var {object} options - An object containing custom properties such as delay, onComplete, etc.
        * @memberof TweenSpace */
        params: 
        {
            elements:'elements',
            duration:'duration',
            delay: 'delay',
            yoyo: 'yoyo',
            repeat: 'repeat',
            timescale: 'timescale',
            debug: 'debug',
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
            onProgress : function(){},
            onComplete : function(){},
            effects:
            {
                to:'to',
                wiggle:
                {
                    amplitude:'amplitude',
                    frequency:'frequency'
                },
                wave:
                {
                    amplitude:'amplitude',
                    frequency:'frequency'
                }
            }
        },
        /** Static method that calls a function after an specified time.
        * @method delayedCall
        * @param {function} callback - Function to call.
        * @param {int} delay - Delay time in milliseconds.
        * @memberof TweenSpace */
        delayedCall: function( callback, delay )
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
        },
        /** Static method that kills all pending delayed calls.
        * @method killPendingCall
        * @memberof TweenSpace */
        killDelayedCalls: function()
        {
            for( ;_delayedCallList.length() > 0; )
            {    
                clearTimeout( _delayedCallList.head.data );
                _delayedCallList.remove(_delayedCallList.head);
            }
        },
        
        /** Callback dispatched every engine tick while animation is running.
        *  @memberof TweenSpace */
        onProgressAll : function()
        {},
        /** Callback dispatched when engine finishes all its queues.
        *  @memberof TweenSpace */
        onCompleteAll : function()
        {},
        /* Private stuff.
         * @private*/
        _ : 
        {
            getElements: function(elements)
            {
                return _getElements(elements);
            },
            engine:function()
            {
                _engine();
            },
            dt: function()
            {
                return _dt;
            },
            min: function(a, b)
            {
                return _min(a, b);
            },
            getMax: function(array)
            {
                return _getMax(array);
            },
            PerlinNoise: function(amplitude, frequency)
            {
                return new PerlinNoise(amplitude, frequency);
            },
            Wave: function(amplitude, frequency)
            {
                return new Wave(amplitude, frequency);
            },
            queue_DL: _queue_DL,
            queue_paused_DL: _queue_paused_DL
            
        },
        /** TweenSpace Engine version.
         *  @var {string} version 
         *  @memberof TweenSpace */
        version: '1.5.1.1', //release.major.minor.dev_stage
        /** Useful under a debugging enviroment for faster revisiones.
         *  If true, the engine will assign destination values immediately and no animation will be performed.
         *  @var {boolean} debug 
         *  @memberof TweenSpace
        */
        debug: false
	};

})();
}

/*Tween Module*/
(function ( TweenSpace ) {
    
    /**
    * Static method that creates Tween instances which are responsible of handling animations on single and multiple objects. The Tween class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc.
    * @method Tween
    * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
    * @property {int} params.duration - Tween duration in milliseconds.
    * @param {object} params - An object containing custom properties such as delay(), onComplete(), etc.
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation.
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount.
    * @property {int} params.repeat - Amount of times that the animation will be played.
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower.
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time.
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running.
    * @property {function} params.onComplete - Callback dispatched when the animation has finished.
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace
    * @public */
    TweenSpace.Tween = function(params)
    {
        return new Tween(params);
    }
        
    /**
    * @class Tween class is responsible of handling animations on single and multiple objects. This class is geared up
    * with usefull methods to control your animations in many different ways. Animations can be delayed, reversed, timescaled, repeated, etc. 
    * @method Tween
    * @param {object} params - An object containing the destination values of css properties and TweenSpace parameters defined in TweenSpace.params.
    * @property {*} params.elements - Element or elements whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
    * @property {int} params.duration - Tween duration in milliseconds.
    * @param {object} params - An object containing custom properties such as delay(), onComplete(), etc.
    * @property {int} params.delay - Amount of time in milliseconds to wait before starting the animation.
    * @property {boolean} params.yoyo - If true, yoyo() property will play the animation back and forth based on repeat property amount.
    * @property {int} params.repeat - Amount of times that the animation will be played.
    * @property {int} params.timescale -  Sets and returns the timescale value. timescale() is a factor used to scale time in the animation.
    *                                   While a value of 1 represents normal speed, lower values makes the faster as well as greater values
    *                                   makes the animation slower.
    * @property {function} params.ease - Easing function that describes the rate of change of a parameter over time.
    *                                  Equations used were developed by Robert Penner.
    * @property {function} params.onProgress - Callback dispatched every engine tick while animation is running.
    * @property {function} params.onComplete - Callback dispatched when the animation has finished.
    * @return {Tween} - Tween instance.
    * @memberof TweenSpace
    * @public */
    function Tween( params )
    {
        var elements, duration;
        var props = {};
        var options = {};
        
        //CHECK PARAMS
        if(params.elements == undefined )
        {
            console.warn('TweenSpace.js Warning: Tween() has no elements to affect!');
            return null;
        }
        else
        { 
            elements = params.elements;
            delete params.elements;
        }
            
        if( params.duration == undefined )
        {
            console.warn('TweenSpace.js Warning: Tween() has no duration defined!');
            return null;
        }
        else
        {
            duration = params.duration;
            delete params.duration;
        }
        
        //SPLIT PARAMS INTO PROPS AND OPTIONS
        paramLoop:for ( var param in params )
        {
            paramDefinedLoop:for ( var paramDefined in TweenSpace.params )
            {
                //CHECK IF PARAM IS TWEENSPACE CUSTOM
                if( param == paramDefined)
                { 
                    options[param] = params[param];
                    delete params[param];
                    break paramDefinedLoop;
                    
                }
                else
                {
                    //CHECK IF PARAM IS TWEENSPACE EFFECT
                    /*if(elements=='#box')
                        console.log( elements, param );*/
                    
                    var effectFound = false;
                    effectLoop:for ( var effect in TweenSpace.params.effects )
                    {
                        if( param == effect)
                        {
                            effectFound = true;
                            var effectObjects = { [param]:{} };
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
                            
                            for ( var m=0;m<effectProps.length;m++ )
                            {
                                var newEffectObj = {};
                                for ( var effectObjProp in effectObjects )
                                {
                                    newEffectObj[effectObjProp] = effectObjects[effectObjProp];
                                }
                                newEffectObj['to'] = effectProps[m].val;
                                props[effectProps[m].prop] = newEffectObj;
                            }
                            
                            delete params[param];
                            break paramDefinedLoop;
                        }
                    }
                    
                    //PARAM IS HTML PROP
                    if(effectFound == false)
                    {    
                        props[param] = params[param];
                    }
                }
            }
        }
        
        
        //IDENTIFY EFFECTS
        
        /** Reference to Tween instance.
         * @private */
        var _this = this;
        /** Array of elements to animate.
         * @private */
        var _elements = TweenSpace._.getElements(elements);
        /** Object containing properties to animate.
         * @private */
        var _props = props;
        /** Object containing TweenSpace custom properties.
         * @private */
        var _options = options;
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
        /** Stores initial duration.
         * @private */
        var _dur_init = duration;
        /** Stores the amount of time in milliseconds to wait before starting the animation.
         * @private */
        var _delay = options.delay || 0;
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
        var _timescale = options.timescale || 1;
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
        /** If true, tween belongs to a Timeline object.
         *  @private */
        var _sequenceParent = false;
        /** If true, delay() property will be considered.
         *  @private */
        var _useDelay = ( _delay > 0 ) ? true : false;
        /** If true, yoyo() property will play the animation back and forth based on repeat property amount.
         *  @private */
        var _yoyo = options.yoyo || false;
        /** If true, tween is being played, otherwise it is either paused or not queued at all.
         *   @private */
        var _playing = false;
        /** Amount of times that the animation will be played.
         *  @private */
        var _repeat = options.repeat || 0;
        
        /** Callback dispatched every engine tick while animation is running.
         *  @var onProgress 
         *  @memberof Tween */
        this.onProgress = options.onProgress || undefined;
        /** Callback dispatched when the animation has finished.
         *  @var  onComplete 
         *  @memberof Tween */
        this.onComplete = options.onComplete || undefined;
        /** Easing function that describes the rate of change of a parameter over time.
         *  Equations used were developed by Robert Penner.
         *  @var ease 
         *  @memberof Tween */
        this.ease = options.ease || TweenSpace.params.ease.quad.inOut;
        /** Returns an array containing the animated elements.
         *  @method elements
         *  @return {array} - Array of animated elements.
         *  @memberof Tween */
        this.elements = function()
        {
            return _elements;
        }
        /** Returns current time in milliseconds.
         *  @method currentTime
         *  @return {float} - Time in milliseconds.
         *  @memberof Tween */
        this.currentTime = function()
        {
            return _mTime;
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
        /** If true, tween is being played, otherwise it is either paused or not queued at all.
         *  @method playing 
         *  @return {boolean} - True if tween is currently playing.
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
        this.sequenceParent = function(value)
        {
            if( value != undefined )
                _sequenceParent = value;
            
            return _sequenceParent;
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
            //console.log(_duration);
            return _timescale;
        }
        /** Tween class constructor. @private
        *@method constructor */
        this.constructor = new function()
        {
            _reset();
            
            var i = 0;
            for(; i < _elements.length; i++)
                _addSubTween( _addElement( _elements[i], _props ) );
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
                if( _adjustPlayhead(playhead) != undefined );
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
        *@param {object} props - Properties to.
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
        /** Reset settings.
         * @private*/
        function _reset()
        {
            _repeat = (_repeat<0)?_MAX_NUMBER:_repeat;
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
                    if(_sequenceParent == false )
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
                if( _useDelay == true && _sequenceParent == false)
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
                    tw.element.style[prop] = tw.tweenStep(prop, time);
            }
            
            //CLIP CALLBACKS____________________________________
            if( _this.onProgress != undefined )
                _this.onProgress();
            
            if( _this.onComplete != undefined )
            {
                if( _playing == false )
                    _this.onComplete();
            }
            //CLIP CALLBACKS____________________________________
        }
        /** Method that adds an element.
         * @private*/
        function _addElement( element, props )
        {
            var tween = new SubTween(element, props );
            return _manageSubTween( tween );
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
            var styles = window.getComputedStyle(tween.element, null);
            
            for ( var prop in tween.props )
            {
                //CHECK PLUGINS_______________________________________
                if(tween.props[prop].constructor === Object )
                {
                    userLoop:for ( var userPlugin in tween.props[prop] )
                    {
                        var installed = false;
                        installedLoop:for ( var installedPlugin in TweenSpace.params.effects )
                        {
                            if(userPlugin == installedPlugin)
                            {
                                if( effects == undefined)
                                    effects = {};
                                
                                installed = true;
                                
                                if( userPlugin != 'to' )
                                {   
                                    if(userPlugin == 'wiggle')
                                    {
                                        effects[userPlugin] = TweenSpace._.PerlinNoise(tween.props[prop][userPlugin].amplitude, tween.props[prop][userPlugin].frequency);
                                    }
                                    else if(userPlugin == 'wave')
                                    {
                                        effects[userPlugin] = TweenSpace._.Wave(tween.props[prop][userPlugin].amplitude, tween.props[prop][userPlugin].frequency);
                                    }
                                    /*else if(userPlugin == 'future_effect')
                                    {
                                    }*/
                                }
                                
                                break installedLoop;
                            }
                        }

                        if(installed == false)
                            console.warn('TweenSpace.js Warning: Plugin "'+userPlugin+'" is undefined.');
                    }
                }
                
                //CHECK PLUGINS_______________________________________
                if(tween.props[prop].constructor === Object )
                    if( tween.props[prop].to != undefined)
                        inputPropString = String(tween.props[prop].to);
                    else
                        inputPropString = styles[prop];
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
                                        match[1] == 'skewX' || match[1] == 'skewY')
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
                else
                {
                    matchResult = String(inputPropString).match( /em|ex|px|in|cm|mm|%|rad|deg/ );
                    fromValues.push(parseFloat(initProp));
                    toValues.push(parseFloat(inputPropString));
                    units.push((matchResult) ? matchResult[0] : "");
                }
                
                tween.values[prop] = new PropValues(name, fromValues, toValues, units, transform, effects);
                effects = undefined;
            }
            
            return tween;
        }
        /** Method that adds tweens into _subTweens.
         * @private*/
        function _addSubTween( tween )
        {
            _subTweens.push( tween );
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
            /*var n,p;
            for(p=0; p < _subTweens.length; p++)
            {
                console.log(_subTweens[p].element.id, _subTweens[p].props);
            }*/
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
                _repeat_counter = _repetitions;
                
                
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

                var toLength, value, effectValue;
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

/*Sequence Module*/
(function ( TweenSpace ) {
    
    /** Static method that creates Timeline instances which are capable of controlling playback operations and time management on groups of tweens.
    * @method Timeline
    * @return {Timeline} - Timeline instance.
    * @memberof TweenSpace */
    TweenSpace.Timeline = function(tweens)
    {
        return new Timeline(tweens);
    }
    
    /**
     * Timeline Module.
     * @class Timeline class is capable of controlling playback operations and time management on groups of tweens.
     * @param {*} tweens - One or more tweens whose properties should be animated
     * @return {Timeline} - Timeline instance.
     * @memberof TweenSpace  
     * @public */
    function Timeline( tweens )
    {
        var _this = this;
        var _tweens = [];
        var _dur = [];
        /** Returns Timeline instance duration in milliseconds.
         *  @method duration
         *  @return {int} - Duration in milliseconds.
         *  @memberof Timeline */
        this.duration = function( )
        {
            return _dur;
        }
        /** Adds tweens to a Timeline instance.
         *  @method addTweens
         *  @param {*} tweens - Tween or array of Tween instances.
         *  @memberof Timeline */
        this.addTweens = function( tweens )
        {
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
                
                _autoTrim();   
                _apply( 'useDelay', true );
                _apply( 'sequenceParent', true );
            }
        }
        /** Timeline class constructor. @private*/
        this.constructor = new function()
        {
            _this.addTweens(tweens);
        }
        /** Removes tweens to a Timeline instance.
         *  @method removeTweens
         *  @param {Tween} tweens - Tween or array of Tween instances.
         *  @memberof Timeline */
        this.removeTweens = function( tweens )
        {
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
            
            _autoTrim();
        }
        /** Starts sequence playback.
         *  @method play
         *  @param {int} playhead - Forward playback from specified time in milliseconds.
         *  @memberof Timeline */
        this.play = function( playhead )
        {
            _apply( 'play', playhead, true );
        }
        /** Resumes sequence playback.
         *  @method resume
         *  @param {int} playhead - Resumes playback from specified time in milliseconds.
         *  @memberof Timeline */
        this.resume = function( playhead )
        {
            _apply( 'resume', playhead, true );
        }
        /** Moves playhead to an specified time.
         *  @method seek
         *  @param {int} playhead - Moves playhead at specified time in milliseconds.
         *  @memberof Timeline */
        this.seek = function( playhead )
        {
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
            _apply( 'reverse', playhead, true );
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
        /** Pauses sequence playback.
         *  @method pause
         *  @param {int} playhead - Pauses playback at specified time in milliseconds.
         *  If no argument is passed, animation will be paused at current playhead. Negative values represents delay time.
         *  @memberof Timeline */
        this.pause = function( playhead )
        {
            _apply( 'pause', playhead, true );
        }
        /** Stops sequence playback.
         *  @method stop
         *  @param {int} playhead - Stops playback at specified time in milliseconds.
         *  If no argument is passed, animation will stop at current playhead. Negative values represents delay time.
         *  @memberof Timeline */
        this.stop = function( playhead )
        {
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
            
            _dur = TweenSpace._.getMax( list );
            
            for(q=0; q < _tweens.length; q++)
                _tweens[q].durationTotal( _dur - (_tweens[q].delay() + _tweens[q].duration()) + _tweens[q].duration() );
        }
         
        return this;
    }
    
})(TweenSpace || {});





