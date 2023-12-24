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
            _repeatedProps = [],
            _repeat = 0,
            _repeat_inc = 0,
            _repeat_direction = true, //true = forward, false = backwards
            _yoyo_isOdd = false,
            _yoyo = false,
            _duration = 0,
            _reversed = false,
            _currentTime = 0;
        
        /** If true, it'll accurately manage multiple tweens on the same element at cost of performance.
         * 
         *  @method checkConflicts
         *  @return {bool} - Either true or false.
         *  @memberof Timeline */
        this.checkConflicts = false;
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
			int = (int <= -1)?Number.MAX_SAFE_INTEGER:int;
			
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
            // console.log("___Timeline current time", _tweens[_tweens.length-1].currentTime(), _tweens[_tweens.length-1].delay());
            // return _tweens[_tweens.length-1].currentTime() + _tweens[_tweens.length-1].delay();
            //console.log(_currentTime);
            return _currentTime;
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
        this.onCompleteTimebar = undefined;
        /** Callback dispatched every engine tick while animation is running.
         *  @var onProgress 
         *  @memberof Timeline */
        this.onProgress = undefined;
        this._onProgress = function(time)
        {
            _currentTime = time;
            // console.log('_onProgress', _currentTime);
        }
        this.onProgressTimebar = undefined;
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
					_this.repeat(params.repeat || undefined );
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
           // console.log(_currentTime);
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
		/* this.seek = function( playhead )
		{
			let stwn_list = [];
			//LOOP OVER TWEENS
			for(let i = 0, twn; twn = _tweens[i]; i++)
			{
				if(twn.isCSSText())
					console.warn( 'The useCSSText property is not supported by Timeline.seek() method. This tween contains an element with id: ' + twn.elements()[0].id );
				
				//LOOP OVER SUBTWEENS
				for(let j = 0, stwn; stwn = twn.subTweens()[j]; j++)
				{
					//CHECK IT ELEMENT EXISTS IN stwn_list
					let element_found,  stwn_item;
					element_loop:for(let k = 0; stwn_item = stwn_list[k]; k++)
					{
						if(stwn.element == stwn_item.element)
						{
							element_found = stwn.element;
							break element_loop;
						}
					}
					
					//IF ELEMENT DOESN'T EXIST ADD TO stwn_list
					if(element_found == undefined)
					{
						stwn_list.push({ element:stwn.element, props:{} });
						for (let prop in stwn.values) 
						{
							
							stwn_list[stwn_list.length-1].props[prop] = [{tween:twn, subtween:stwn, values:stwn.values[prop]}];
						}
					}
					//IF ELEMENT EXISTS, ADD SUBTWEEN VALUES TO RESPECTIVE PROPS
					else
					{
						for (let prop in stwn.values) 
						{
							if(stwn_item.props[prop])
								stwn_item.props[prop].push({tween:twn, subtween:stwn, values:stwn.values[prop]});
							else
								stwn_item.props[prop] = [{tween:twn, subtween:stwn, values:stwn.values[prop]}];
						}
					}
				}
			}
			
			//LOOP OVER REARRANGED LIST
			// {element:element, props:{propsA:propsA, propsB:propsB}}
			for(let i = 0, item; item = stwn_list[i]; i++)
			{	
				//LOOP OVER PROPS
				for (let prop in item.props) 
				{
					//item.props[prop]
					//[ {tween:Tween, subtween:, SubTween, values:PropValues} ]
					
					//SORT CHRONOLOGICALLY
					item.props[prop] = sortProps(item.props[prop]);
					
					for(let w = 0, prop_anim; prop_anim = item.props[prop][w]; w++)
					{
						let mTime = playhead - prop_anim.tween.delay();
						if(mTime>prop_anim.tween.durationRepeat()) mTime=prop_anim.tween.durationRepeat();
						
						let dTime = playhead - prop_anim.tween.delay();
						if(dTime<0) dTime=0;
						else if(dTime>prop_anim.tween.durationRepeat()) dTime=prop_anim.tween.durationRepeat();
						
						prop_anim.tween.adjustPlayhead(playhead);

						//FIRST ANIMATION APPEARANCE
						if(w==0)
						{
							if( prop == 'transform')
								prop_anim.values.transform = JSON.parse(JSON.stringify(prop_anim.values.creationValues[prop]));
							else if(prop_anim.values.creationValues[prop].constructor === Array)
								prop_anim.values.fromValues = Array.from(prop_anim.values.creationValues[prop]);
							else
								prop_anim.values.fromValues = prop_anim.values.creationValues[prop];
							
						}
						//FOLLOWING ANIMATIONS
						else if(w>0)
						{
							prop_anim.subtween.resetValues()	
							prop_anim.subtween.manageSubTween(true);
						}

						prop_anim.tween.seek(playhead-prop_anim.tween.delay());
						//prop_anim.subtween.elementStyle[prop] = prop_anim.subtween.tick_prop(prop, dTime, false);
						
						
							
//						console.log(prop_anim.subtween.element.id, prop_anim.tween.UID(),  prop_anim.subtween.UID(), playhead, dTime,
//										prop_anim.tween.durationRepeat());
							
							
					}
				}
			}
		} */
		
        /* this.start_seek = function( playhead )
		{
            _currentTime = playhead;

			let stwn_list = [];
			//LOOP OVER TWEENS
			for(let i = 0, twn; twn = _tweens[i]; i++)
			{
				//LOOP OVER SUBTWEENS
				 for(let j = 0, stwn; stwn = twn.subTweens()[j]; j++)
				{
                    // console.log(stwn.values);
                    for (const prop in stwn.values) {
                        if (Object.hasOwnProperty.call(stwn.values, prop)) {
                            const stwn_prop_init_value = stwn.values[prop];
                            
                            stwn.element.style[prop] = stwn_prop_init_value['initValues'];
                            console.log(prop, stwn.element.style[prop]);
                        }
                    }
				}  
			}

            for (let index = 0; index <= _currentTime; index+=16.67) {
                
                console.log(index);
                this.seek(index);
                
            }
		} */
        this.seek = function( playhead )
		{
            _currentTime = playhead;

			let stwn_list = [];
			//LOOP OVER TWEENS
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
                        // console.log(parseInt(_currentTime), stwn.tweenParent().delay(), stwn.tweenParent().duration());
                        
                        // console.log(prop_stwn_group[0], stwn);
                        stwn.tweenParent().tick_draw_prop(prop_stwn_group[0], _currentTime-stwn.tweenParent().delay(), false, stwn)
                        // stwn.tick_prop(prop_stwn_group[0], 200, false);
                        // console.log("___________");
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
						
//						console.log(a.tween.delay(), b.tween.delay());
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
            _currentTime = value;

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
                
                _repeat_inc = parseInt(parseInt(playhead)/_this.duration());
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
            
            if(_this.checkConflicts == true)
                storeRepeatedProps();
        }
        
        function storeRepeatedProps()
        {
            //[subtween, element_id, prop_name]
            let subtweens_props = [];

            //_repeatedProps
            //LOOP OVER TWEENS
            for (let index = 0; index < _tweens.length; index++) 
            {
                const twn = _tweens[index];
                //LOOP OVER TWEEN'S SUBTWEENS
                for (let index = 0; index < twn.subTweens().length; index++) 
                {
                    const stwn = twn.subTweens()[index];
                    
                    //LOOP OVER SUBTWEEN'S PROPS
                    for (const key in stwn.props) 
                    {
                        if (Object.hasOwnProperty.call(stwn.props, key)) 
                        {
                            const element = stwn.props[key];
                            subtweens_props.push([stwn, stwn.element.id, key ]);
                            // console.log(stwn.UID(), stwn.element.id, key);
                        }
                    }
                }
            }

            // console.log(subtweens_props);

            let same_prop_stwns = [];
            //LOOP OVER SUBTWEENS
            for (let i = 0; i < subtweens_props.length; i++)
            {
                const i_stwn_prop = subtweens_props[i];
                // console.log(i_stwn_prop);
                let stwn_group = [i_stwn_prop[2], i_stwn_prop[0]];
                 //LOOP OVER SAME SUBTWEENS FINDING REPEATED PROPS
                for (let j = 0; j < subtweens_props.length; j++)
                {
                    const j_stwn_prop = subtweens_props[j];
                    // console.log(i_stwn_prop[0] == j_stwn_prop[0], i_stwn_prop[2], j_stwn_prop[2]);
                    //console.log(i_stwn_prop[0].UID(), j_stwn_prop[0].UID());
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
                        // console.log(stwn_group);
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

            // console.log(same_prop_stwns);

            _repeatedProps = same_prop_stwns;

            
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