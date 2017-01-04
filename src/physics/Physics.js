/**Physics Module
* @private */
(function ( TweenSpace )
{
    var _body;
    var _body_DL = TweenSpace._.DoublyList();
    
    //Physics Static Class
    TweenSpace.Physics = {};
    
    //Private members
    TweenSpace.Physics._ = {};
    TweenSpace.Physics._.body_DL = _body_DL;
    
    TweenSpace.Physics._.updateBodies = function()
    {
        _body = null;

        //Loop over bodies
        var canvas = TweenSpace.Physics.canvas;
        var context = TweenSpace.Physics.context;
        var curr_node = _body_DL.head;
        var j=0;
        for( ; j<_body_DL.length(); j++ )
        {
            _body = curr_node.data;

            //Loop
            _body.acceleration.y += TweenSpace.Physics.gravity;
            
            if( _body_DL.length() > 1 ) curr_node = curr_node.prev;

            j--;
            j = (j<0)?0:j;

            if(curr_node)
                curr_node = curr_node.next;
        }
        
        //Draw bodies
        curr_node = _body_DL.head;
        j=0;
        context.clearRect(0, 0, canvas.width, canvas.height);
        for( ; j<_body_DL.length(); j++ )
        {
            _body = curr_node.data;
            _body.draw(context);
            
            if( _body_DL.length() > 1 ) curr_node = curr_node.prev;

            j--;
            j = (j<0)?0:j;

            if(curr_node)
                curr_node = curr_node.next;
        }
    };
    
    //Public members
    TweenSpace.Physics.active = false;
    TweenSpace.Physics.gravity = 98; //1 meter = 100 pixels
    TweenSpace.Physics.setCanvas = function(canvas)
    {
        TweenSpace.Physics.canvas = canvas;
        TweenSpace.Physics.context = canvas.getContext('2d');
    };
    
    TweenSpace.Physics.addBody = function( body )
    {
        _body_DL.push(body);
    };
    
    TweenSpace.Physics.removeBody = function( node )
    {
        _body_DL.remove(node);
    };
    
    TweenSpace.Physics.start = function()
    {
        TweenSpace.Physics.active = true;
        TweenSpace._.engine();
    };
    
    TweenSpace.Physics.stop = function()
    {
        TweenSpace.Physics.active = false;
    };
    
})(TweenSpace || {});