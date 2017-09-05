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
        /** Sets or returns Timeline repeat amount.
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
         *  @return {Timeline} - A Timeline instance.
         *  @memberof Timeline */
        this.play = function( playhead )
        {
            _reversed = false;
            _repeat_direction = true;
            playhead  = _checkPlayhead( playhead );
            playhead  = _adjustRepeatPlayhead( playhead );
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
         *  @memberof Timeline */
        this.seek = function( playhead )
        {
            playhead  = _checkPlayhead( playhead );
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
         *  If no argument is passed, animation will be paused at current playhead.
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