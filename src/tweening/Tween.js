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
        /** Returns Tween instance unique id number.
         *  @private */
        this.UID = function(){return _UID;};
        
        /** Sets to undefined the reference to the node where this Tween instance is stored as data property.
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
        };
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
        this.seek = function( playhead )
        {
            if( playhead != undefined )
            {
                if( _adjustPlayhead(playhead) != undefined )
                {   
                    _this.tick(16.67, false);
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
            _this.pause();
            _updateSubTweenProps(props);
            _this.play(0);
        };
        /** Calculates values over time. @private
        * @method tick
        * @private*/
        this.tick = function(dt, useCallbacks)
        {
            if(TweenSpace.debug == true)
            {
                _playing = false;
                _adjustPlayhead(_durationTotal);//_this.seek(_durationTotal);
            }
            
            _tick_logic(TweenSpace._.interval());
            
            //Make drawing calls only when needed except for last frame
            if( _mTime >= _sTime && _mTime <= _durationRepeat ) //-TweenSpace._.dt() _durationTotal
            {
                //First drawing frame
                if( _dTime == _sTime ) 
                {    
                    if( _reversed == false )
                        _manageConflicts();
                    /*if( _reversed == false )
                        console.log( 'started', _elements[0].id, _dTime );*/
                }
                //Last drawing frame
                else if ( _dTime == _durationRepeat  ) //_durationTotal
                {
                    /*if( _reversed == true )
                        _manageConflicts();*/
                    /*if( _reversed == true )
                        console.log( 'complete', _elements[0].id, _dTime );*/
                }
                
                _this.tick_draw(_dTime);
            }
            
            if(TweenSpace.debug == false  && _playing == true)
                _tick_delta(dt);
            
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
                            if( prop == TweenSpace.params.svg.drawSVG )
                            {    
                                var drawValues = subtween.tick_prop(prop, time, setInitValues);
                                subtween_element_style.strokeDashoffset = drawValues[0];

                                if(drawValues.length > 2)
                                    subtween_element_style.strokeDasharray = drawValues[1]+', '+drawValues[2];
                                else
                                    subtween_element_style.strokeDasharray = drawValues[1];
                            }
                            else if( prop == 'motionPathSVG' )
                            {    
                                subtween_element_style.transformOrigin = (subtween_props[prop]['pivotX'])+'px '+(subtween_props[prop]['pivotY']+'px ');
                                subtween_element_style.transform = subtween.tick_prop(prop, time, setInitValues);
                            }
                            else if( prop == 'morphSVG' )
                                subtween_element.setAttribute('d', subtween.tick_prop(prop, time, setInitValues) );
                            else if( prop == 'numberTo' )
                                _numberTo = subtween.tick_prop(prop, time, setInitValues);
                            else
                            {
                                //Animate custom objects. I.e. {x:0, y:1}
                                if(subtween_element.constructor == Object)
                                    subtween_element[prop] = subtween.tick_prop(prop, time, setInitValues);
                                //Animate CSS properties
                                else
                                {
                                    if(_useCSSText)
                                        cssText += prop +":"+ subtween.tick_prop(prop, time, setInitValues)+";";
                                    else
                                        subtween_element_style[prop] = subtween.tick_prop(prop, time, setInitValues);

                                }
                            }
                        }
                    }
                    
                    subtween_values_node = subtween_values_node.next;
                }
                
                if(_useCSSText && updateDOM!=false)
                    subtween_element_style.cssText = cssText;
            }
            
            
        };
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
            if( _mTime >= _sTime && _mTime <= _durationRepeat )
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
                _subTweens[i].manageSubTween();
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
                
                _mTime = playhead;
            }
            return playhead;
        }
        /** Calculates delta change.
         * @private*/
        function _tick_delta(dt)
        {
            //FORWARDS ---->>
            if(_reversed == false)
                _mTime += dt;  
            //BACKWARDS <<-----
            else
                _mTime -= dt;
        }
        /** where the time logic occurs.
         * @private*/
        function _tick_logic(dt)
        {
            //ADJUST time______________________________________
            if( _mTime < _sTime)
            {
                if(dt > -_mTime == true)
                    _mTime = _sTime;
                    
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
                
            }
            //ADJUST time______________________________________
            
            _manageRepeatCycles();
        }
        /** Method that updates props values. 
         * @private*/
        function _updateSubTweenProps( newProps )
        {
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
                            _subTweens[p].manageSubTween();
                            found = true;
                            break oldPropsLoop;
                        }
                    }
                    if( found == false)
                    {    
                        //Add new prop 
                        _subTweens[p].props[newProp] = newProps[newProp];
                        _subTweens[p].manageSubTween();
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
            
            _paused = false;
            _playing = true;
            
            /*If playhead is specified in any of the playback method,
            the tween will start intentionally from that value. If playhead 
            is not specified, and 'checkConflict' is true, the animation
            will start from current value.*/
            if(playhead!=undefined)
                _this.tick_draw(-_delay, true, false);
            
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
                        if(_subTweens[i].UID() > currNode.data.subTweens()[k].UID() )
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
                _this.tick_draw(_dTime);
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
                var _prop_values = this.values[property];
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
                if( property == 'transform' || property=='filter')
                {
                    
                    for(var prop in _transform)
                    {
                        var _prop_transform = _transform[prop];
                        toLength = _prop_transform.toValues.length;
                        newValues = '';
                        for(w=0; w < toLength; w++)
                        {
                            value = _this.ease( Math.min(elapsedTime, _duration),
                                                _prop_transform.fromValues[w],
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
                    
                    //Set initial string value if value is 'none'.
                    if(_prop_values.initValues=='none')
                        _prop_values.initValues = result;
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
                    w = toLength = _toValues.length;
                    newValues = '';
                    
                    for(w=0; w < toLength; w++)
                    {
                        value = _this.ease( Math.min(elapsedTime, _duration), _fromValues[w], _toValues[w], _duration );
                        
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
                            if( _names.match(/rgb/i) )
                            {
                                if(w<3)
                                    value = parseInt(value);
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
            this.manageSubTween = function ()
            {
                var length = 0, q = 0, r = 0;
                var matchResult, inputPropString, initTransform, transform, initProp;
                var newPropVals = new PropValues();
                this.values_DL = TweenSpace._.DoublyList();
                
                //color vars
                var nameMatch, name, initName, rgb;

                //Store initial values
                var styles;
                if( _isNumberTo == true )
                {    styles = {}; }
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
                                initProp =  newPropVals.initValues = styles[prop];
                            else
                            {
                                /*if(_isFrom != true)
                                    initProp = newPropVals.initValues = styles[prop];
                                else
                                    initProp = newPropVals.initValues = this.values[prop].initValues;*/
                                if(_checkConflict == true)
                                    initProp = styles[prop];
                                else
                                    initProp = newPropVals.initValues = this.values[prop].initValues;
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
                            transform[ match[1] ] = { fromValues:[], toValues:String(match[2]).split(','), units:[] }; //(matchResult) ? matchResult[0] : ""

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

                        transform = null;
                        newPropVals.effects = null;
                    }
                    else if( prop == 'numberTo' )
                    {
                        newPropVals.fromValues.push(parseFloat(_props['from']));
                        newPropVals.toValues.push(parseFloat(_props['to']));
                        delete _props['from'];
                        delete _props['to'];
                    }
                    else
                    {
                        matchResult = String(inputPropString).match( /em|ex|px|in|cm|mm|%|rad|deg/ );
                        var fromVal = parseFloat(initProp), toVal;
                        newPropVals.fromValues.push(fromVal);
                        
                        //!Check function-based values___________________________
                        toVal = TweenSpace._.functionBasedValues(fromVal, inputPropString); 
                        if(toVal == null)
                            toVal = parseFloat(inputPropString)
                        //Check function-based values___________________________!

                        newPropVals.toValues.push(toVal);
                        newPropVals.units.push((matchResult) ? matchResult[0] : "");
                    }

                    
                    this.values[prop] = new PropValues(prop, name, newPropVals.fromValues, newPropVals.toValues, 
                                                       newPropVals.units, transform, newPropVals.effects, 
                                                       newPropVals.initValues);

                    this.values_DL.push(this.values[prop]);
                    
                    newPropVals.effects = undefined;

                } 
                
                return this;
            };
        
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