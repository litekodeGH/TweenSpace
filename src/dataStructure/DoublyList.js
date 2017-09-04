(function ( TweenSpace ) {
    /**
     * DoublyList.
     * @class Internal class that implements a circular bi-directional linked list in both directions.
     * @return {DoublyList} - DoublyList instance.
     * @private
     */
    function DoublyList()
    {
        this.head = null;
        this.tail = null;

        var _length = 0;
        var _temp_node;

        this.length = function ()
        {
            return _length;
        }

        this.push = function (value)
        {
            _temp_node = (value.__proto__.constructor.name == 'Node')?value:TweenSpace._.Node(value);

            if (_length > 0)
            {
                this.tail.next = _temp_node;
                _temp_node.prev = this.tail;
            }
            else
            {
                this.head = _temp_node;
                this.tail = _temp_node;
            }

            this.tail = _temp_node;
            this.tail.next = this.head;
            this.head.prev = this.tail;

            _length++;

            return _temp_node;
        }

        this.remove = function ( node )
        {
            if( !node )
                return null;

            if (_length > 1)
            {
                _temp_node = node.prev.next = node.next;
                node.next.prev = node.prev;

                if (node == this.head)
                    this.head = node.next;
                if (node == this.tail)
                    this.tail = node.prev;
            }
            else
            {
                this.head = null;
                this.tail = null;
            }

            //node = null;
            _length--;
            _length = (_length > 0)?_length:0;

            return node;
        }

        return this;
    }

    /* Private stuff.
     * @private*/
    TweenSpace._.DoublyList = function()
    {
        return new DoublyList();
    };

})(TweenSpace || {});