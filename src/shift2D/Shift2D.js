/**Physics Module
* @private */
(function ( TweenSpace ) {
    TweenSpace.Physics = function( params )
    {
        return new Physics(params);
    }
    
    class Physics
    {
        constructor (params)
        {
            console.log('constructor');
        }
        PhysicsMethod1 ()
        {
            console.log('PhysicsMethod1');
        }
    }
})(TweenSpace || {});