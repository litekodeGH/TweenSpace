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
            //console.log('currentTime', _tweens[_tweens.length-1].currentTime() + _tweens[_tweens.length-1].delay());
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
         *  @param {*} tweens - Tween, Tween parameters object or array of Tween instances.
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
                    if( _tweens.length == 0)
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
            
            //console.log('_apply', value, adjustPlayhead);
            for(q=0; q < _tweens.length; q++)
            {    
                if(adjustPlayhead==true && value!=undefined)
                    adjustedValue = value + ( -_tweens[q].delay() );
                else adjustedValue = value;
                
                /*if(operation=='play')
                   console.log('_tweens', _tweens[q].currentTime(), adjustedValue );
                */
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