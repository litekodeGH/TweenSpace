/* DOUBLY LIST */
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
            if(value==undefined)
                return;
            
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
        
        this.unshift = function (value)
        {
            if(value==undefined)
                return;
            
            _temp_node = (value.__proto__.constructor.name == 'Node')?value:TweenSpace._.Node(value);

            if (_length > 0)
            {
                this.head.prev = _temp_node;
                _temp_node.next = this.head;
            }
            else
            {
                this.head = _temp_node;
                this.tail = _temp_node;
            }

            this.head = _temp_node;
            this.tail.next = this.head;
            this.head.prev = this.tail;

            _length++;

            return _temp_node;
        }
        
        /* Inserts a new_data before or after specified existing_node. 
         * When 'before_after_bool' is set to false, the new_data will be inserted before the 'existing_node'.
         * @private*/
        this.insert = function ( new_data, existing_node, before_after_bool )
        {
            if(new_data == undefined || existing_node == undefined)
                return;
            
            new_data = (new_data.__proto__.constructor.name == 'Node')?new_data:TweenSpace._.Node(new_data);
            
            if(before_after_bool == undefined)
                before_after_bool = true;
            else if( before_after_bool == 'after' )
                before_after_bool = true;
            else if( before_after_bool == 'before' )
                before_after_bool = false;
            
            //Add node after existing node
            if( before_after_bool == true)
            {
                if(existing_node == this.tail)
                    this.push(new_data);
                else
                {
                    new_data.next = existing_node.next;
                    new_data.prev = existing_node;
                    existing_node.next = existing_node.next.prev = new_data;
                    
                    _length++;
                }
            }
            //Add node before existing node
            else
            {
                if(existing_node == this.head)
                    this.unshift(new_data);
                else
                {
                    new_data.next = existing_node;
                    new_data.prev = existing_node.prev;
                    existing_node.prev = existing_node.prev.next = new_data;
                    
                    _length++;
                }
            }
            
            
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
            _length = (_length < 0)?0:_length;//_length = (_length > 0)?_length:0;

            return node;
        }
        
        this.nodeAt = function ( index )
        {
            if(index >= _length)
            {
                console.warn('TweenSpace - DoublyList: index ' + index + ' is out of range.');
                return;
            }
            
            _temp_node = this.head;
            
            var i = 0;
            for(;i<_length;i++)
            {
                if(i==index)
                    return _temp_node;
                
                _temp_node = _temp_node.next;
            }
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