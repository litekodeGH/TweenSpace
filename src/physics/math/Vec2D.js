(function ( TweenSpace )
{
    TweenSpace.Physics.Vec2D = function( x = 0, y = 0 )
    {
        return new Vec2D( x, y );
    }
    
    class Vec2D 
    {
        constructor (x, y)
        { 
            this.x = x; 
            this.y = y;
        }

        //Calculates magnitude
        mag()
        { 
            return Math.sqrt(this.x * this.x + this.y * this.y); 
        }

        angle()
        { 
            return Math.atan2(this.y, this.x);
        }

        normalize()
        { 
            var mag = this.mag();
            this.x /= mag;
            this.y /= mag;
        }

        //Scales vector this by factor
        scale(factor)
        {
            this.x *= factor;
            this.y *= factor;
        }

        rotate(radians)
        {
            var x = this.x;
            var y = this.y;
            this.x = x * Math.cos(radians) - y * Math.sin(radians);
            this.y = x * Math.sin(radians) + y * Math.cos(radians);
        }

        rotateTo(radians, pivot )
        {
            var x = this.x;
            var y = this.y;
            this.x = ((x - pivot.x) * Math.cos(radians) - (y - pivot.y) * Math.sin(radians)) + pivot.x;
            this.y = ((x - pivot.x) * Math.sin(radians) + (y - pivot.y) * Math.cos(radians)) + pivot.y;
        }

        //Adds vector this and vec
        add(vec)
        {
            this.x += vec.x;
            this.y += vec.y;
        }

        //Substracts vector this and vec
        minus(vec)
        {
            this.x -= vec.x;
            this.y -= vec.y;
        }

        //Calculates the cross product between vector this and vec
        cross(vec)
        {
            return this.x * vec.y - this.y * vec.x;
        }

        //Calculates the dot product between vector this and vec
        dot(vec)
        {
            return this.x * vec.x + this.y * vec.y;
        }

        //Calculates the perpendicular product between vector this and vec
        perp(vec)
        {
            return this.y * vec.x + this.x * -vec.y;
        }

        //Convert this vector to its perpendicular
        perpendicular()
        {
            var x = -this.y;
            var y = this.x;
            this.x = x;
            this.y = y;
        }

        //Clones a Vec2d object
        clone()
        { 
            return new Vec2D( this.x, this.y );
        }
    }
})(TweenSpace || {});