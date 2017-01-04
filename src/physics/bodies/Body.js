(function ( TweenSpace )
{
    TweenSpace.Physics.Circle = function( x = 0, y = 0 )
    {
        return new Circle( x, y );
    }
    
    class Body
    {
        constructor ( x = 0, y = 0 )
        {
            this.x = x;
            this.y = y;
            this.px = x;
            this.py = y;
            this.acceleration = new Vec2D(0, 0);
            this.mass = 1;
            this.restitution = 0.4; // 0 = no bounce,  1 = max bounce
            this.static = false;
        }

        accelerate(delta)
        {
            this.x += this.acceleration.x * delta * delta;
            this.y += this.acceleration.y * delta * delta;
            this.acceleration.x = 0;
            this.acceleration.y = 0;
        }

        inertia(delta)
        {
            var x = this.x*2 - this.px;
            var y = this.y*2 - this.py;
            this.px = this.x;
            this.py = this.y;
            this.x = x;
            this.y = y;
        }
    }
    
    class Circle extends Body
    {
        constructor ( radius = 20, x = 0, y = 0  )
        {
            super( x, y );
            this.radius = radius;
        }
        
        draw(context)
        {
            console.log(this.x, this.y, this.radius);
            context.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 0, Math.PI*2, false);
            context.moveTo(this.x, this.y);
            context.lineTo(this.x+this.radius, this.y);
            context.stroke();
        }
    }
    
})(TweenSpace || {});