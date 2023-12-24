/* NODE */
(function ( TweenSpace ) {

    /**
     * Node.
     * @class Internal class. Simple node used in DoublyList.
     * @param {Tween} value - Stores a Tween instance.
     * @return {Node}  - Node instance.
     * @private
     */
    function Node(value)
    {
        this.data = value;
        this.prev = null;
        this.next = null;

        return this;
    }

    /* Private stuff.
     * @private*/
    TweenSpace._.Node = function(value)
    {
        return new Node(value);
    };

})(TweenSpace || {});