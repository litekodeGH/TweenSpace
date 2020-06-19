/**
 * Engine loop module.
 * @private */
(function ( TweenSpace )
{
    /** if true, engine is running.
     * @private */
    var _isEngineOn = false;
    /** Global elapsed time.
     * @private */
    var _eTime = 0;
    /** Delta time.
     * @private */
    var _dt = 0;
    /** Accumulated delta time. If last frame took more time to calculate
     * than expected, that delta time will be saved and added up 
     * to the next on time frame's delta time. 
     * @private */
    var _dt_accum = 0;
    /** Ideal delta time.
     * @private */
    var _interval = 16.67;
    /** Ideal delta time.
     * @private */
    var _min_interval = 1;
    /** Ideal delta time.
     * @private */
    var _max_interval = 34;
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
    
    var _queue_DL, _tick_tweens;
    
    
    /** tick method counter.
     *  @private */
    TweenSpace._.tickCounter = function()
    {
        return _tickCounter;
    }
    /** Delta time.
     *  @private */
    TweenSpace._.dt = function(dt)
    {
        if(dt) _dt = dt;
        return _dt;
    }
    /** Delta time.
     *  @private */
    TweenSpace._.interval = function()
    {
        return _interval;
    }
    /** Engine loop based on 'requestAnimationFrame' method.
     *  @private */
    TweenSpace._.engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            _isEngineOn = true;
            _tickCounter = _eTime = _dt = _dt_accum = 0;
            _start_time = _then = window.performance.now();
            
            _queue_DL = TweenSpace._.queue_DL;
            _tick_tweens = TweenSpace._.tick_tweens;
            //var body_DL = TweenSpace.Physics._.body_DL; //__________________________________________________________________________________________________________________________
            
             _requestAnimationFrame(tick);//tick();
        }
    }
    
    function tick(now)
    {
//---------------------------------------------------------
        
        if(!_then) 
            _start_time = _then = now;
		
        //_eTime = now - _start_time;
        _dt = now - _then;
        _then = now;
        
        //Loop over tweens
        if(_dt > _min_interval && _dt < _max_interval)
        {
            _dt += _dt_accum;
			_dt = (_dt<0)?0:_dt;
            _tick_tweens(_dt);
            _dt_accum = 0;
			
			
        }
        else
        {
            _dt_accum += _dt;
        }
		
        _cancelAnimationFrame(_reqID);
        if( _queue_DL.length() > 0 )//|| TweenSpace.Physics.active == true ) 
        {
            _reqID = _requestAnimationFrame(tick);
        }
        else
        {
            //Engine turns off
            _isEngineOn = false;
            _eTime = 0;
			_dt = 16.67;
        }
            
        
//---------------------------------------------------------
        //Loop over bodies
//        if(TweenSpace.Physics.active == true)
//            TweenSpace.Physics._.updateBodies(); //__________________________________________________________________________________________________________________________

        _tickCounter++;
        
//        if(_tickCounter%20==0)
//            console.log('fps: ', 1000/_dt, _queue_DL.length() );
    }
    
    /**
     * Event to pause TweenSpace engine entirely while window or tab is hidden.
     * @private */
    document.addEventListener("visibilitychange", TweenSpaceOnVizChange);
    function TweenSpaceOnVizChange(e)
    {
        if(document.visibilityState == 'hidden')
            setTimeout( function() { TweenSpace.pauseAll(); }, 16.67);
        else
            setTimeout( function() { TweenSpace.resumeAll(); }, 16.67);
    }
    
})(TweenSpace || {});