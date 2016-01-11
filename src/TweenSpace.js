/*TODO
1. follow object
*/
/**
 * TweenSpace Engine.
 * @class Static class that provides animations tools for tweening properties over time.
 */
var TweenSpace = TweenSpace || (function () {
    
    /** Reference to TweenSpace object. @private */
    var _this = this;
    /** Circular doubly linked list of the clips being played. @private */
    var _queue_DL = new DoublyList();
    /** Circular doubly linked list of paused clips. @private */
    var _queue_paused_DL = new DoublyList();
    /** Temporary Node instance used in DoublyList. 'data' property holds a Clip instance. @private */
    var _node = new Node();
    /** Another temporary Node instance used in DoublyList. @private */
    var _node_paused = new Node();
    /** if true, engine is running. @private */
    var _isEngineOn = false;
    /** Global elapsed time. @private */
    var _eTime = 0;
    /** Delta time. @private */
    var _dt = 0;
    /** Counts each step call. @private */
    var _stepCounter = 0;
    /** Temporary Clip instance. @private */
    var _clip = null;
    /** Stores time right before starting the engine. @private */
    var _start_time = 0;
    /** Stores current time. @private */
    var _now;
    /** Stores last time. @private */
    var _then = 0;
    /** requestAnimationFrame method id. @private */
    var _reqID = 0;
    /** PI value. @private */
    var _pi = 3.1415926535897932384626433832795;
    var _pi_m2 = _pi * 2;
    var _pi_d2 = _pi / 2;
    
    var _start_limit = 0;
    
    /** Return the least value between a and b. @private */
    var min = function( a, b )
    {
        return (a<b)?a:b;
    }
    /** Return the least property value of an array of clips. @private */
    var getMin = function( clips, prop )
    {
        if(clips.length == 0)
            return 0;
        
        var min = Number.MAX_VALUE;
        for(l=0; l < clips.length; l++)
        {
            if( clips[l][prop] < min)
                min = clips[l][prop];
        }
        
        return min;
    }
    /** Return the greatest property value of an array of clips. @private */
    var getMax = function( clips, prop )
    {
        if(clips.length == 0)
            return 0;
        
        var max = 0;
        for(l=0; l < clips.length; l++)
        {
            if( clips[l][prop] > max)
                max = clips[l][prop];
        }
        
        return max;
    }
    /** Check if specified properties are supported by this engine or correctlly spelled. @private */
    var checkProps = function( propsRequested, propsDefined, string1, string2 )
    {
        for ( var propReq in propsRequested )
        {
            if( TweenSpace.options[propReq] == undefined )
                console.warn('TweenSpace.js Warning: "'+propReq+'" is not a defined '+string1+' in '+string2+' class.');
            
            if( propsRequested[propReq] == undefined )
              console.warn('TweenSpace.js Warning: Value assigned to "'+propReq+'" is undefined.');
        }
    }
    /** Returns an array of the specified elements to be animated. @private */
    var getElements = function( elements )
    {
        var elementArray = [];
        
        if( Clip.prototype.isPrototypeOf(elements) == true )
        {
            for(l=0; l < elements.tweens.length; l++)
                elementArray.push( elements.tweens[l].element);
        }
        else if( elements.constructor === String)
        {
            var nodeList = document.querySelectorAll(elements);
            if( nodeList == null || nodeList == undefined )
                return null;

            for(i=0; i < nodeList.length; i++)
                elementArray[i] = nodeList.item(i);
        }
        else if( elements.constructor === Array ) elementArray = elements;
        else elementArray.push(elements);
        
        return elementArray;
    }
    /** Engine loop based on 'requestAnimationFrame' method. @private */
    var engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || 
                                        window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
            var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || 
                                        window.webkitCancelAnimationFrame || window.msCancelAnimationFrame;
            _isEngineOn = true;
            _stepCounter = _eTime = _now = _dt = 0;
            _clip = null;
            
            _start_time = _then = window.performance.now();

            step();
            function step()
            {
                cancelAnimationFrame(_reqID);
                if( _queue_DL.length() > 0 )
                {
                    _reqID = requestAnimationFrame(step);
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

                //Loop over clips
                var curr_node = _queue_DL.head;
                for( j=0; j<_queue_DL.length(); j++ )
                {
                    _clip = curr_node.data;
                    _clip.step();
                    
                    if( _clip.onProgress != undefined )
                            _clip.onProgress();
                    
                    _start_limit = (_clip.useDelay == true)?_start_limit = -_clip.delay:_start_limit = _clip.sTime;
                    
                    if( _clip.eTime <= _start_limit || _clip.eTime >= _clip.durExtended )
                    {
                        if( ( _clip.reversedRepeat() == false && _clip.repeatCounter() == _clip.repeat ) ||
                            ( _clip.reversedRepeat() == true && _clip.repeatCounter() == 0) ||
                            (_clip.yoyo == false && _clip.repeat == 0 ) ) 
                        {
                            _clip.playing = false;
                            
                            if( _clip.onComplete != undefined )
                            {
                                if( _clip.reversed() == true && _clip.eTime <= _clip.sTime)
                                    _clip.onComplete();
                                else if( _clip.reversed() == false && _clip.eTime >= _clip.dur)
                                    _clip.onComplete();
                            }
                            
                            curr_node = _queue_DL.remove( curr_node );

                            if( _queue_DL.length() > 1 )
                                curr_node = curr_node.prev;

                            j--;
                            (j<0)?0:j;
                        }
                        else
                        {
                            if(_clip.yoyo == true)
                            {
                                if( _clip.reversed() == true )
                                    _clip.reversed(false);
                                else
                                    _clip.reversed(true);
                            }
                            else
                            {
                                if( _clip.reversed() == true )
                                    _clip.eTime = _clip.dur;
                                else
                                    _clip.eTime = _clip.sTime;
                            }
                            
                            if(_clip.reversedRepeat() == true )
                                _clip.repeatCounter(-1);
                            else
                                _clip.repeatCounter(1);
                        }
                    }
                    
                    if(curr_node)
                        curr_node = curr_node.next;
                }
                
                if(_queue_DL.length() == 0)
                    TweenSpace.onCompleteAll();
                else
                    TweenSpace.onProgressAll();
                
                _stepCounter++;
            }
        }
    }
    
    /**
     * Clip.
     * @class Internal class responsable of handling animations on single and multiple objects.
     * @return {Clip} - Clip instance.
     * @private
     */
    function Clip( elements, duration, props, options )
    {
        if(elements == undefined || duration == undefined || props == undefined )
        {
            console.warn('TweenSpace.js Warning: Clip() has missing arguments!');
            return null;
        }
        
        if(options == undefined) options = {};
        else checkProps(options, TweenSpace.options, 'option', 'Clip');

        /** Reference to Clip instance. @private */
        var _this = this;
        /** Array of elements to animate. @private */
        var _elements = getElements(elements);
        /** Object containing properties to animate. @private */
        var _props = props;
        /** Object containing TweenSpace custom properties. @private */
        var _options = options;
        /** If true, animation will be played backwards. @private */
        var _reversed = false;
        /** If true, repeat cycle will be played backwards. @private */
        var _reversed_repeat = false;
        /** Clip's paused state. @private */
        var _paused = false;
        /** Stores initial duration. @private */
        var _dur_init = 0;
        /** Stores initial delay. @private */
        var _delay_init = 0;
        /** Stores initial extended duration. @private */
        var _durExtended_init = 0;
        /** Counts the amount of times that the animation has been played. @private */
        var _repeat_counter = 0;
        /** Factor used to scale time in the animation. While a value of 1 represents normal speed, lower values
         *  makes the faster as well as greater values makes the animation slower.
         *  @var {float} timescale */
        var _timescale = options.timescale || 1;
        
        this.playing = false;
        /** Array of properties to animate.
         *  @var {array} tweens */
        this.tweens = [];
        /** Callback dispatched every engine step while animation is running.
         *  @method elements */
        this.onProgress = options.onProgress || undefined;
        /** Callback dispatched when the animation has finished.
         *  @method elements */
        this.onComplete = options.onComplete || undefined;
        /** Amount of time in milliseconds to wait before starting the animation.
         *  @var {int} delay */
        this.delay = _delay_init = options.delay || 0;
        /** Duration in milliseconds of the animation.
         *  @var {int} dur */
        this.dur = _dur_init = duration;
        /** Extended duration of a clip in queue. This is used in Sequence class to keep a clip active
         *  even if is no animation is happening.
         *  @var {int} durExtended */
        this.durExtended = _durExtended_init = duration;
        /** If true, 'delay' property will be considered.
         *  @var {boolean} useDelay */
        this.useDelay = ( this.delay > 0 ) ? true : false;
        /** If true, 'yoyo' property will play the animation back and forth based on 'repeat' property amount.
         *  @var {boolean} yoyo */
        this.yoyo = options.yoyo || false;
        /** Amount of times that the animation will be played.
         *  @var {int} repeat */
        this.repeat = options.repeat || 0;
        /** If true, clip belongs to a Sequence object.
         *  @var {boolean} sequenceParent */
        this.sequenceParent = false;
        /** Animation playhead in milliseconds. Negative values represent delay time.
         *  @var {int} eTime */
        this.eTime = -this.delay;
        /** Start time in milliseconds. For now, always starts on 0.
         *  @var {int} sTime */
        this.sTime = 0;
        /** Easing function that describes the rate of change of a parameter over time.
         *  Equations used were developed by Robert Penner.
         *  @method ease */
        this.ease = options.ease || TweenSpace.options.ease.quad.inOut;
        /** Returns an array containing the elements animated.
         *  @method elements
         *  @return {array} - Array of animated elements.*/
        this.elements = function()
        {
            return _elements;
        }
        /** Sets and returns the timescale value. 'timescale' is a factor used to scale time in the animation.
         *  While a value of 1 represents normal speed, lower values makes the faster as well as greater values makes the animation slower.
         *  @method timescale
         *  @param {float} value - Amount of timescale.*/
        this.timescale = function( value )
        {
            if( value )
            {
                _this.eTime = (_this.eTime/_timescale)*value;
                _timescale = value;
                _this.delay = _delay_init * _timescale;
                _this.dur = _dur_init * _timescale;
                _this.durExtended = _durExtended_init * _timescale; 
            }
            
            return _timescale;
        }
        /** Clip class constructor.
        *@method constructor */
        this.constructor = new function()
        {
            _this.timescale(_timescale);
                
            for(i=0; i < _elements.length; i++)
                addTween( _elements[i], _props );
        }
        /** Starts clip playback.
        *@method play
        *@param {int} playhead - Forward playback from specified time in milliseconds. Negative values represents delay time.*/
        this.play = function( playhead )
        {
            if( _this.repeat > 0 )
            {
                adjustDelay(playhead);
                if( _reversed_repeat == true && _reversed == false )
                    playback( playhead, false );
                
                if(_this.yoyo == true)
                {
                    if(_repeat_counter < _this.repeat )
                        playback( playhead, true );
                }
                else
                    playback( playhead, true );
                
                _reversed_repeat = false;
            }
            else
            {
                adjustDelay( playhead );
                playback( playhead, true );
            }
        }
        /** Resumes clip playback.
        *@method resume
        *@param {int} playhead - Resumes playback from specified time in milliseconds. Negative values represents delay time.*/
        this.resume = function( playhead )
        {
            adjustDelay( playhead );
            playback( playhead, !_reversed );
        }
        /** Reverses clip playback.
        *@method reverse
        *@param {int} playhead - Reverses playback from specified time in milliseconds. Negative values represents delay time.*/
        this.reverse = function( playhead )
        {
            if( _this.repeat > 0 )
            {
                if(_reversed_repeat == false)
                {
                    adjustDelay( playhead );
                    playback( playhead, _reversed );
                }
                    
                _reversed_repeat = true;
            }
            else
            {
                adjustDelay(playhead);
                playback( playhead, false );
            }
        }
        /** Pauses clip playback.
        *@method pause
        *@param {int} playhead - Pauses playback at specified time in milliseconds.
        * If no argument is passed, animation will be paused at current 'eTime'. Negative values represents delay time.*/
        this.pause = function( playhead )
        {
            adjustDelay(playhead);
            _paused = true;
            _this.playing = false;
            dequeue();
            
            _this.seek( playhead );
        }
        /** Moves playhead to an specified time.
        *@method seek
        *@param {int} playhead - Moves playhead at specified time in milliseconds.*/
        this.seek = function( playhead )
        {
            if( playhead )
            {
                if(_this.useDelay == true)
                {
                    if( playhead >= -_this.delay && playhead <= _this.delay + _this.durExtended )
                        _this.eTime = playhead;
                    else
                        console.warn('TweenSpace.js Warning: playhead argument is out of 0 - '+(_this.delay + _this.durExtended)+' range.');
                }
                else
                {
                    if( playhead >= -_this.delay && playhead <= _this.durExtended )
                        _this.eTime = (_reversed == false )?playhead:_this.dur - playhead;
                    else
                        console.warn('TweenSpace.js Warning: playhead argument is out of '+(-_this.delay)+' - '+_this.dur+' range.');
                }
            }
            
            draw();
        }
        /** Returns true if animation is paused.
        *@method paused
        *@return {boolean} - If true, animation is paused.*/
        this.paused = function()
        {
            return _paused;
        }
        /** Returns true if animation is reversed.
        *@method reversed
        *@return {boolean} - If true, animation is reversed.*/
        this.reversed = function( bool )
        {
            if( bool )
                _reversed = bool;
            
            return _reversed;
        }
        /** If true, repeat cycle will be played backwards.
        *@method reversedRepeat
        *@return {boolean} - Repeat cycle playback direction.*/
        this.reversedRepeat = function()
        {
            return _reversed_repeat;
        }
        /** Counts the amount of times that the animation has been played.
        *@method repeatCounter
        *@return {int} - IAmount of times repeated. */
        this.repeatCounter = function(increment)
        {
            if( increment )
                _repeat_counter += increment;
            
            return _repeat_counter;
        }
        /** Calculates values over time.
        *@method step
        *@return {boolean} - If true, animation is reversed.*/
        this.step = function()
        {
            if(_reversed == true)
            {
                if(TweenSpace.debug == false)
                    _this.eTime -= _dt;
                else
                    _this.eTime = 0;
            }
            else
            {
                if(TweenSpace.debug == false)
                    _this.eTime += _dt;
                else
                    _this.eTime = _this.durExtended;
            }
            
            draw();
        }
        /** Adjusts playhead position in time.
        *@private*/
        function adjustDelay( playhead )
        {
            if(playhead)
                if(playhead < 0)
                    this.delay = -playhead;
        }
        /** Method that draws the objects that are being animated.
        *@private*/
        function draw()
        {
            var i, tw, tp, units; //tw = tween, tp = tween options
            for( i=0; i<_this.tweens.length; i++ )
            {
                tw = _this.tweens[i];
                
                for ( var prop in tw.props )
                {
                    tp = tw.options;
                    
                    //Updates tween properties
                    if(_this.eTime >= _this.sTime && _this.eTime <= _this.dur)
                    {
                        tw.element.style[prop] = tw.tweenStep(prop, _this.eTime);
                        if( _this.useDelay == true && _this.sequenceParent == false)
                            _this.useDelay = false;
                    }
                    else if( _this.eTime <= _this.sTime )
                    {
                        if( (_reversed == true && _this.useDelay == false) )
                            _this.eTime = _this.sTime;
                        
                        if( _this.eTime <= -_this.delay )
                            _this.eTime = -_this.delay;
                        tw.element.style[prop] = tw.tweenStep( prop, _this.sTime );
                    }
                    else if( _this.eTime >= _this.dur )
                    {
                        if( (_reversed == false  && _this.useDelay == false) )
                            _this.eTime = _this.dur;
                        
                        if( _this.eTime >= _this.durExtended )
                            _this.eTime = _this.durExtended;
                        tw.element.style[prop] = tw.tweenStep( prop, _this.dur );
                    }
                    //console.log( _this.eTime );
                }
            }
            
        }
        /** Method that adds tweens.
        *@private*/
        function addTween( element, props )
        {
            var tween = { element:element, props, values:[] };
            var length = 0, q = 0, r = 0;
            var names = [], fromValues = [], toValues = [], units = [],
                matchResult, inputPropString, initTransform, transform, initProp;
            
            //Store initial values
            var styles = window.getComputedStyle(tween.element, null);
            for ( var prop in tween.props )
            {
                inputPropString = String(tween.props[prop]);
                names = [], fromValues = [], toValues = [], units = [];
                initProp = styles[prop];
                
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
                            
                            //console.log(match[1], transform[ match[1] ].fromValues);
                        }
                    }
                    
                    initTransform = null;
                }
                else if( prop.match( /color/i ) )
                {
                    var nameMatch = inputPropString.match( /rgba|rgb/i );
                    var name = nameMatch[0];
                    var initName = String(initProp).match( /rgba|rgb/i );
                    var rgb;
                    
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
                
                tween.values[prop] = { names:name, fromValues:fromValues, toValues:toValues, units:units, transform:transform };
                
                tween.tweenStep = function( property, elapesedTime )
                {
                    var names = this.values[property]['names'];
                    var toValues = this.values[property]['toValues'];
                    var fromValues = this.values[property]['fromValues'];
                    var units = this.values[property]['units'];
                    var transform = this.values[property].transform;
                    
                    var toLength, value;
                    var result = '', newValues = '';
                    
                    var w;
                    if( transform )
                    {
                        for(var prop in transform)
                        {
                            
                            
                            toLength = transform[prop].toValues.length;
                            newValues = '';
                            for(w=0; w < toLength; w++)
                            {
                                newValues += String( _this.ease( min(elapesedTime, _this.dur),
                                                                transform[prop].fromValues[w],
                                                                transform[prop].toValues[w],
                                                                _this.dur ) )+transform[prop].units[w];
                                
                                if(w<toLength-1) newValues += ',';
                            }
                            result += prop+'('+newValues+') ';
                        }
                    }
                    else
                    {
                        toLength = toValues.length;
                        newValues = '';
                        
                        for(w=0; w < toLength; w++)
                        {
                            value = _this.ease( min(elapesedTime, _this.dur), fromValues[w], toValues[w], _this.dur );
                            /*var midpoint = 0.5;
                            var ratio = (value/toValues[w])/midpoint;
                            
                            if(ratio >= (1/midpoint)*0.5)
                                ratio = Math.abs( (1/midpoint)-((value/toValues[w])/midpoint));
                            value *= ratio;  
                            console.log( ratio );*/
                            
                            //rgba case: r g b values need to be integer, however alpha needs to be decimal
                            if( names )
                                if( names.match(/rgb/i) )
                                {
                                    if(w<3)
                                        value = parseInt(value);
                                }
                            
                            newValues += String( value ) + units[w];
                            if(w<toLength-1) newValues += ',';
                        }
                        
                        if( names ) result = names+'('+newValues+')';
                        else result = newValues;
                    }
                        
                    return result;
                }
            }
            
            _this.tweens.push( tween );
        }
        /** Method that removes clips from queue.
        *@private*/
        function dequeue()
        {
            var q;
            _node = _queue_DL.head;
            for(q=0; q < _queue_DL.length(); q++)
            {
                if( _node.data == _this )
                {
                    _queue_paused_DL.push(_node.data);
                    _queue_DL.remove(_node);
                    break;
                }
                _node = _node.next;
            }
        }
        /** Start forward or backward playback from specified time.
        *@private*/
        function playback( playhead, direction )
        {
            _this.pause( playhead );
            
            _paused = false;
            
            if( _reversed == direction)
                _reversed = !direction;
            
            var q;
            _node_paused = _queue_paused_DL.head;
            for(q=0; q < _queue_paused_DL.length(); q++)
            {
                if( _node_paused.data == _this )
                {
                    _queue_paused_DL.remove(_node_paused);
                    break;
                }
            }
            
            _this.playing = true;
            _queue_DL.push( _this );
            engine();
        }
        
        
        return this;
    }
    /**
     * Sequence.
     * @class Internal class responsable of handling playback operations on groups of clips.
     * @return {Sequence} - Sequence instance.
     * @private
     */
    function Sequence( clips )
    {
        var _this = this;
        var _clips = [];
        var _dur = [];
        /** Returns Sequence instance duration in milliseconds.
         *  @method dur
         *  @return {int} - Duration in milliseconds.*/
        this.dur = function( )
        {
            return _dur;
        }
        /** Adds clips to a Sequence instance.
         *  @method addClips */
        this.addClips = function( clips )
        {
            var i = 0, j = 0;
            if( Clip.prototype.isPrototypeOf(clips) === true )
            {
                clips.useDelay = true;
                if( _clips.length == 0)
                    _clips.push(clips);
                else
                {
                    for(; i < _clips.length; i++)
                    {
                        if(_clips[i] == clips)
                            break;
                        if(i == _clips.length - 1)
                            _clips.push(clips);
                    }
                }
            }
            else if( clips.constructor === Array )
            {
                if( _clips.length == 0)
                {
                    clips[0].useDelay = true;
                    _clips.push(clips[0]);
                    i++;
                }
                
                loop1:for(; i < clips.length; i++)
                {
                    loop2:for(; j < _clips.length; j++)
                    {
                        if( Clip.prototype.isPrototypeOf(clips[i]) === true )
                        {
                            clips[i].useDelay = true;
                            if(clips[i] == _clips[j])
                                break loop2;
                            if(j == _clips.length - 1)
                                _clips.push(clips[i]);
                        }
                    }
                }
            }
            
            autoTrim();   
            setClipsProp( 'useDelay', true );
            setClipsProp( 'yoyo', false );
            setClipsProp( 'repeat', 0 );
            setClipsProp( 'sequenceParent', true );
        }
        /** Sequence class constructor.
         *  @method constructor */
        this.constructor = new function()
        {
            _this.addClips(clips);
        }
        /** Removes clips to a Sequence instance.
         *  @method addClips */
        this.removeClips = function( clips )
        {
            var i = 0, j = 0;
            if( Clip.prototype.isPrototypeOf(clips) === true )
            {
                for(; i < _clips.length; i++)
                {
                    if(_clips[i] == clips)
                    {
                        _clips.splice(i, 1);
                        break;
                    }
                }
            }
            else if( clips.constructor === Array )
            {
                loop1:for(; i < clips.length; i++)
                {
                    loop2:for(; j < _clips.length; j++)
                    {
                        if(clips[i] == _clips[j])
                        {
                            _clips.splice(j, 1);
                            break loop2;
                        }
                    }
                }
            }
            
            autoTrim();
        }
        /** Starts sequence playback.
         *  @method play
         *  @param {int} playhead - Forward playback from specified time in milliseconds.*/
        this.play = function( playhead )
        {
            apply( 'play', playhead );
        }
        /** Resumes sequence playback.
         *  @method resume
         *  @param {int} playhead - Forward playback from specified time in milliseconds.*/
        this.resume = function( playhead )
        {
            apply( 'resume', playhead );
        }
        /** Moves playhead to an specified time.
         *  @method seek
         *  @param {int} playhead - Moves playhead at specified time in milliseconds.*/
        this.seek = function( playhead )
        {
            
            var adjustedPlayhead =  0;
            
            var q;
            for(q=0; q < _clips.length; q++)
            {
                adjustedPlayhead = playhead - _clips[q].delay;
                
                //console.log( playhead, adjustedPlayhead );
                _clips[q]['seek'](adjustedPlayhead);
            }
                
        }
        /** Reverses sequence playback.
         *  @method reverse
         *  @param {int} playhead - Reverses playback from specified time in milliseconds.*/
        this.reverse = function( playhead )
        {
            apply( 'reverse', playhead );
        }
        /** Scales the time of all clips in the Sequence. While a value of 1 represents normal speed, lower values
         *  makes the faster as well as greater values makes the animation slower.
         *  @method timescale
         *  @param {float} value - Amount of delay.*/
        this.timescale = function( value )
        {
            apply( 'timescale', value );
            autoTrim();
        }
        /** Reverses sequence playback.
         *  @method reverse
         *  @param {int} playhead - Pauses playback at specified time in milliseconds.
         *  If no argument is passed, animation will be paused at current playhead. Negative values represents delay time.*/
        this.pause = function( playhead )
        {
            apply( 'pause', playhead );
        }
        /** Used to apply clip methods.
         *  @method apply */
        function apply( operation, value )
        {
            var q;
            for(q=0; q < _clips.length; q++)
                _clips[q][operation](value);
        }
        /** Set values to specified property of elements within a Clip instance.
         *  @method setClipsProp */
        function setClipsProp( prop, val )
        {
            var q;
            for(q=0; q < _clips.length; q++)
                _clips[q][prop] = val;
        }
        /** Auto adjust sequence duration. This method is used right after a clip has been added of removed.
         *  @method setClipsProp */
        function autoTrim()
        {
            var delay = getMax( _clips , 'delay' );
            var delayOut = getMax( _clips , 'dur' );
            _dur = delay + delayOut;
            
            var q;
            for(q=0; q < _clips.length; q++)
                _clips[q].durExtended = _dur - (_clips[q].delay + _clips[q].dur) + _clips[q].dur;
        }
         
        return this;
    }
    /**
     * Node.
     * @class Internal class. Simple node used in DoublyList.
     * @param {Clip} value - Stores a Clip instance.
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
            
            return _temp_node;
        }

        return this;
    }
    
	return {
        /**
        * Static method that returns a Clip instance which holds destination values and other properties.
        * This method creates and queues a Clip instance as well as stores its current values.
        * @method to
        * @param {*} elements - Element or elements whose properties should be animated.
                                Accepted arguments are a DOM element, an array of elements or CSS selection string.
        * @param {int} duration - Duration in milliseconds.
        * @param {object} props - An object containing the destination values of css properties.
        *                       
        * @param {object} options - An object containing custom properties such as 'delay', 'onComplete', etc.
        * @param {int} options.delay - Amount of time in milliseconds to wait before starting the animation.
        * @param {function} options.ease - Easing function that describes the rate of change of a parameter over time.
        *                                  Equations used were developed by Robert Penner.
        * @param {function} options.onProgress - Callback dispatched every engine step while animation is running.
        * @param {function} options.onComplete - Callback dispatched when the animation has finished.
        * @return {Clip} - Clip instance.
        */
        to: function( elements, duration, props, options )
        {
            var clip = TweenSpace.createClip( elements, duration, props, options );
            clip.play();

            return clip;
        },
        /** Pauses all clips and sequences.
        * @method pauseAll*/
        pauseAll: function()
        {
            _node = _queue_DL.head;
            for( ;_queue_DL.length() > 0; )
            {
                _node.data.pause();
                _node = _node.next;
            }
                
        },
        /** Resumes all clips and sequences.
        * @method resumeAll*/
        resumeAll: function()
        {
            var i = _queue_paused_DL.length()-1;
            _node = _queue_paused_DL.head;
            for( ; i>=0 ; i--)
            {
                _node.data.resume();
                _node = _node.next;
            }
        },
        /*reverseAll: function()
        {
            var i = _queue_paused.length-1;
            for( ; i>=0 ; i--)
                _queue_paused[i].reverse();
        },*/
        /** Resumes all clips and sequences.
        * @var {object} options - An object containing custom properties such as 'delay', 'onComplete', etc. */
        options: 
        {
            delay: 0,
            yoyo: false,
            repeat: 0,
            timescale: 1,
            debug: false,
            ease:
            {
                //Robert Penner's Easing Equations
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
                        return (to-from) - TweenSpace.options.ease.bounce.out(dur-t, 0, (to-from), dur) + from;
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
                        if (t < dur/2) return TweenSpace.options.ease.bounce.in (t*2, 0, (to-from), dur) * .5 + from;
                        else return TweenSpace.options.ease.bounce.out (t*2-dur, 0, (to-from), dur) * .5 + (to-from)*.5 + from;
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
                
            },
            onProgress : function(){},
            onComplete : function(){}
        },
        /** Calls a function after an specified time.
        * @method delayedCall
        * @param {function} callback - Function to call.
        * @param {int} delay - Delay time in milliseconds. */
        delayedCall: function( callback, delay )
        {
            var id = setTimeout( function()
            {
                clearTimeout( id );
                callback();
                return;
            }, delay );
        },
        /**
        * Static method that returns a Clip instance which holds destination values and other properties.
        * This method creates a Clip instance as well as stores its current values.
        * @method createClip
        * @param {*} elements - One or more elements whose properties should be animated.
                                Accepted arguments are a DOM element, an array of elements or CSS selection string.
        * @param {int} duration - Duration in milliseconds.
        * @param {object} props - An object containing the destination values of css properties.
        *                       
        * @param {object} options - An object containing custom properties such as 'delay', 'onComplete', etc.
        * @param {int} options.delay - Amount of time in milliseconds to wait before starting the animation.
        * @param {function} options.ease - Easing function that describes the rate of change of a parameter over time.
        *                                  Equations used were developed by Robert Penner.
        * @param {function} options.onProgress - Callback dispatched every engine step while animation is running.
        * @param {function} options.onComplete - Callback dispatched when the animation has finished.
        * @return {Clip} - Clip instance.
        */
        createClip: function( elements, duration, props, options )
        {
            return new Clip(elements, duration, props, options);
        },
        /**
        * Static method that returns a Sequence instance which is responsable of handling playback operations on groups of clips.
        * @method createSequence
        * @param {*} clips - One or more clips whose properties should be animated.
                            Accepted arguments are a DOM element, an array of elements or CSS selection string.
        * @return {Sequence} - Sequence instance.
        */
        createSequence: function( clips )
        {
            return new Sequence(clips);
        },
        /** Callback dispatched every engine step while animation is running.
        * @method elements */
        onProgressAll : function()
        {},
        /** Callback dispatched when engine finishes all its queues.
        * @method elements */
        onCompleteAll : function()
        {},
        /** TweenSpace Engine version.
         *  @var {string} version */
        version: '1.0.1.0', //major.minor.dev_stage
        /** Useful under a debugging enviroment for faster revisiones.
         *  If true, the engine will assign destination values immediately and no animation will be performed. 
         *  @var {boolean} debug */
        debug: false
	};

})();