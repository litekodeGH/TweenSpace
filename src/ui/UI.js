/*UI Module*/
(function (TweenSpace) {
    
    TweenSpace.UI = {};
	
	
    TweenSpace.UI.Timebar = function (params)
    {
        return new Timebar(params);
    }
    
    function Timebar( params )
    {
        /** Reference to Timebar instance.
         * @private */
        let _this = this;
		let _target;
		
		let _play_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="11.2px" height="12.8px" viewBox="0 0 11.2 12.8" style="overflow:visible;" xml:space="preserve"><style type="text/css"> .st0{opacity:0.8;} .st1{fill:none;stroke:#32B47D;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2px;}</style><g id="play_2_" class="st0"> <polygon class="st1" points="0.5,0.5 10.7,6.4 0.5,12.3 "/></g></svg>';
		
		let _pause_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="5.2px" height="12.8px" viewBox="0 0 5.2 12.8" style="overflow:visible;" xml:space="preserve"><style type="text/css"> .st0{opacity:0.8;fill:none;stroke:#32B47D;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;stroke-width:2px;}</style><path id="pause_1_" class="st0" d="M0.5,0.5v11.8 M4.7,0.5v11.8"/></svg>';
		
		let _loop_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="16.5px" height="16px" viewBox="0 0 16.5 13.2" style="overflow:visible;enable-background:new 0 0 16.5 13.2;" xml:space="preserve"><style type="text/css"> .st0{fill:none;stroke:#32B47D;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><path class="st0" d="M5.9,2.3C3,2.3,0.8,4.6,0.8,7.4v0c0,2.8,2.3,5.1,5.1,5.1h4.8c2.8,0,5.1-2.3,5.1-5.1v0c0-2.8-2.3-5.1-5.1-5.1 l3.1-1.5"/></svg>';

		let _once_svg_string = '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="15.8px" height="16px" viewBox="0 0 15.8 3.9" style="overflow:visible;enable-background:new 0 0 15.8 3.9;" xml:space="preserve"><style type="text/css"> .st0{fill:none;stroke:#32B47D;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;}</style><polyline class="st0" points="0.8,3.2 15.1,3.2 12.7,0.8 "/></svg>';

		let _play, _pause, _playing = false, _looping = false, _bbox, _bbox_checked = false;
		
		this.holder = document.createElement('div');
		let _playHolder = document.createElement('div');
		let _loopHolder = document.createElement('div');
		let _barHolder = document.createElement('div');
		let _cursorBarHolder = document.createElement('div');
		let _cursorBar = document.createElement('div');
		let _endSpacer = document.createElement('div');
		let _cursor = document.createElement('div');
		let _time = document.createElement('div');
		
		this.constructor = new function()
        {
            _playHolder.innerHTML = _play_svg_string;
            _loopHolder.innerHTML = _once_svg_string;
			
			_this.holder.appendChild(_playHolder);
			_this.holder.appendChild(_loopHolder);
			_cursorBarHolder.appendChild(_cursorBar);
			_barHolder.appendChild(_cursorBarHolder);
			_barHolder.appendChild(_cursor);
			_this.holder.appendChild(_barHolder);
			_this.holder.appendChild(_time);
			_this.holder.appendChild(_endSpacer);
			
			
			//Styles
			_this.holder.style.width = '100%';
			_this.holder.style.height = '30px';
			_this.holder.style.display = 'flex';
			_this.holder.style.flexWrap = 'nowrap';
			// _this.holder.style.padding = '0px 12px 0px 10px';
			_this.holder.style.position = 'absolute';
			_this.holder.style.bottom = '0px';
			_this.holder.style.background = 'rgba(71, 77, 83, 0.9)';
			_this.holder.style.alignItems = 'center';
			
			_playHolder.style.marginRight = '6px';
			_playHolder.style.width = '14px';
			_playHolder.style.cursor = 'pointer';
			_playHolder.style.height = '16px';
			_playHolder.style.padding = '0px 0px 0px 10px';
			
			_loopHolder.style.marginRight = '6px';
			_loopHolder.style.height = '16px';
			_loopHolder.style.cursor = 'pointer';
			_loopHolder.style.padding = '0px 10px 0px 10px';
			
			_barHolder.style.width = '100%';
			_barHolder.style.height = '100%';
			_barHolder.style.background = 'rgba(51, 57, 63, 0)';
			_barHolder.style.cursor = 'pointer';
			_barHolder.style.display = 'grid';
			_barHolder.style.alignContent = 'center';
			_barHolder.style.padding = '0px 0px 0px 0px';
			
			_cursorBarHolder.style.position = 'relative';
			_cursorBarHolder.style.width = '100%';
			_cursorBarHolder.style.height = '2px';
			_cursorBarHolder.style.background = 'rgba(150, 150, 150, 0.5)';
			_cursorBarHolder.style.pointerEvents = 'none';
			_cursorBarHolder.style.borderRadius = '2px';
			
			_cursorBar.style.height = '2px';
			_cursorBar.style.background = 'rgba(50, 180, 125, 0.7)';
			_cursorBar.style.borderRadius = '4px';
			
			_cursor.style.position = 'absolute';
			_cursor.style.top = '7px';
			_cursor.style.width = '4px';
			_cursor.style.height = '16px';
			_cursor.style.background = 'rgba(50, 180, 125, 0.7)';
			_cursor.style.pointerEvents = 'none';
			_cursor.style.borderRadius = '4px';
			_cursor.style.left = '0px';

			_time.style.width = '60px';
			_time.style.height = '16px';
			_time.style.color = 'white';
			_time.style.fontFamily = 'sans-serif';
			_time.style.fontSize = '12px';
			_time.style.padding = '0px 0px 0px 10px';
			_time.style.opacity = 0.5;
			_time.style.pointerEvents = 'none';
			_time.style.userSelect = 'none';
			_time.style.textAlign = 'center';
			_time.textContent = '00:00.0';


			_endSpacer.style.width = '14px';
			_endSpacer.style.height = '16px';
			
			_bbox = _barHolder.getBoundingClientRect();
			
			_playHolder.addEventListener('click', onPlay);
			_loopHolder.addEventListener('click', onLoop);
			
			_barHolder.addEventListener('mousedown', function(e)
			{
				onMouseMove(e);
				_bbox = _barHolder.getBoundingClientRect();
				_barHolder.addEventListener('mousemove', onMouseMove);
			});
			document.body.addEventListener('mouseup', function()
			{
				_barHolder.removeEventListener('mousemove', onMouseMove);
			});
			
			window.onresize = onresize;
			
        };
		
		/** Add a target to be time controled. 
		* The parameter target can be either Timeline or Tween instance.
        * @method add
        * @memberof Timebar */
       	this.add = function(target)
		{
			_target = target;
			_target.onProgressTimebar = onProgressTimebar;
			_target.onCompleteTimebar = onCompleteTimebar;
			return this;
		}
		
		function onPlay(e)
		{
			if(_playing == false)
			{
				if(_target.currentTime() == _target.duration())
					_target.play(0);
				else
					_target.play();
				
				_playing = true;
				_playHolder.innerHTML = _pause_svg_string;
			}
			else
			{
				_target.pause();
				_playing = false;
				_playHolder.innerHTML = _play_svg_string;
			}
		}
		
		function onLoop(e)
		{
			if(_looping == false)
			{
				_looping = true;
				_loopHolder.innerHTML = _loop_svg_string;
				_target.repeat(-1);
			}
			else
			{
				_looping = false;
				_loopHolder.innerHTML = _once_svg_string;
				_target.repeat(0);
			}
		}
		
		function onMouseMove(e)
		{
			let playhead = TweenSpace.params.ease.linear( e.offsetX, 0, _target.duration(), Math.round(_bbox.width) );
			
			_cursorBar.style.width = ((playhead)*100/_target.duration())+'%';
			_cursor.style.left = Math.round(e.clientX)+'px';
			_target.seek(playhead);

		}
		
		function onProgressTimebar(e)
		{
			if(_bbox_checked == false)
			{
				_bbox = _barHolder.getBoundingClientRect();
				_bbox_checked = true;
			}
			
			_cursorBar.style.width = ((_target.currentTime())*100/_target.duration())+'%';
			_cursor.style.left = Math.round(_bbox.width)*((_target.currentTime())/_target.duration())+_bbox.x+'px';
			_time.textContent = msToTime(parseInt(_target.currentTime()));
		}
		
		function onresize(e)
		{
			_bbox_checked = false;
			onProgressTimebar();
		}
		
		function onCompleteTimebar()
		{
			if(_looping)
				return;
			
			_playHolder.innerHTML = _play_svg_string;
			_playing = false;
		}

		function msToTime(duration)
		{
			var milliseconds = parseInt((duration%1000)/100)
				, seconds = parseInt((duration/1000)%60)
				, minutes = parseInt((duration/(1000*60))%60)
				, hours = parseInt((duration/(1000*60*60))%24);

			hours = (hours < 10) ? "0" + hours : hours;
			minutes = (minutes < 10) ? "0" + minutes : minutes;
			seconds = (seconds < 10) ? "0" + seconds : seconds;
			
			if( hours == '00' && minutes == '00' )
				return seconds + "." + milliseconds;
			else if(hours == '00')
				return minutes + ":" + seconds + "." + milliseconds;

			return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
		}
        
        
        return this;
    }
	
})(TweenSpace || {});