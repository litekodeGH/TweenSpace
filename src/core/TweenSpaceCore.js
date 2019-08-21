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
                    
                    //_sequential() assigns params onProgress and onComplete to aeach tween created.
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
            Properties added here needs to be declared in "TweenSpace.params" object as well.
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
    /** TweenSpace Engine current version: 1.9.7.0
     *  @memberof TweenSpace */
    TweenSpace.version = '1.9.9.0'; //release.major.minor.dev_stage
    /** Useful under a debugging enviroment for faster revisiones.
     *  If true, the engine will assign destination values immediately and no animation will be performed.
     *  @memberof TweenSpace */
    TweenSpace.debug = false;
    
})(TweenSpace || {});