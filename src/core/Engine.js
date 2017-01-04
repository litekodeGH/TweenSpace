/**
 * Engine loop module.
 * @private */
(function ( TweenSpace ) {
    
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
    
    /**
     * Engine loop based on 'requestAnimationFrame' method.
     * @private */
        
    TweenSpace._.dt = function()
    {
        return _dt;
    }
    TweenSpace._.engine = function()
    {
        //____ENGINE STARTS_____//
        if( _isEngineOn == false )
        {
            _isEngineOn = true;
            _tickCounter = _eTime = _now = _dt = 0;
            _start_time = _then = window.performance.now();
            var queue_DL = TweenSpace._.queue_DL;
            //var body_DL = TweenSpace.Physics._.body_DL; //__________________________________________________________________________________________________________________________
            
            tick();
            function tick()
            {
                //console.log(_tickCounter);
                _cancelAnimationFrame(_reqID);
                if( queue_DL.length() > 0 || TweenSpace.Physics.active == true )
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
                TweenSpace._.updateTweens();
                //Loop over bodies
                /*if(TweenSpace.Physics.active == true)
                    TweenSpace.Physics._.updateBodies();*/ //__________________________________________________________________________________________________________________________

                _tickCounter++;
            }
        }
    }
    
})(TweenSpace || {});