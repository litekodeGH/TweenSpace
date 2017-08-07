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
            
            //Make drawing calls only when needed
            if( _mTime >= _sTime  || _dTime <= _duration )
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
                
                if( prop == 'transform' || prop=='filter' )
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
                if( property == 'transform' || property=='filter')
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