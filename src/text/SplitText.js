/**SplitText Module */
(function ( TweenSpace ) {
    
    /**Static method that is capable of getting text ready to be animated by characters, words or lines.
     * @method SplitText                                                                                                   
     * @param {object} params - An object containing SplitText properties.
     * @property {*} params.elements - Element or elements whose properties should be animated. Accepted arguments are a DOM element, an array of elements or query selection string.
     * @property {string} params.type - Text will get ready to be animated by characters, words or lines.  
     * @return {SplitText} - SplitText instance.
     * @memberof TweenSpace */
    TweenSpace.SplitText = function( params )
    {
        return new SplitText(params);
    }
    
    /**
     * @class SplitText class is capable of getting text ready to be animated by characters, words or lines.
     * @param {object} params - An object containing SplitText properties.
     * @property {*} params.elements - Element or elements whose properties should be animated. Accepted arguments are a DOM element, an array of elements or query selection string.
     * @property {string} params.type - Text will get ready to be animated by characters, words or lines.  
     * @return {SplitText} - SplitText instance.
     * @memberof SplitText  
     * @public */
    class SplitText
    {
        constructor (params)
        {     
            if(params == undefined)
                params = {};
            params.elements = TweenSpace._.alternativeParams('elements', params);
            var line_match = (params.type!= undefined) ? params.type.match("line") != null : false,
                word_match = (params.type!= undefined) ? params.type.match("word") != null : false,
                char_match = (params.type!= undefined) ? params.type.match("char") != null : false;
            
            this.chars = this.char = [];
            this.words = this.word = [];
            this.lines = this.line = [];
            this.elements = this.element = this.item = this.items = this.object = this.objects = function( elements )
            {
                if(elements != undefined)
                    this._.elements = TweenSpace._.getElements(elements);
                
                return this._.elements;
            }
            
            //PRIVATE MEMBERS
            this._ = 
            {
                isSplit: false,
                elements: (params.elements!= undefined)?TweenSpace._.getElements(params.elements):undefined,
                isLine: line_match,
                isWord: word_match,
                isChar: (line_match == false && word_match == false )?true:char_match,
                round:  function (value, decimals) {
                            return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
                        },
                originalData:[]
            }
            
            if( this._.elements != undefined )
                this.split();
        }
        
        /** Splits text into characters, words and lines.
         *  @method  split 
         *  @memberof SplitText */
        split(type)
        {
            if( type != undefined)
            {
                var line_match = (type!= undefined) ? type.match("line") != null : false,
                    word_match = (type!= undefined) ? type.match("word") != null : false,
                    char_match = (type!= undefined) ? type.match("char") != null : false;
                
                this._.isLine = line_match;
                this._.isWord = word_match;
                this._.isChar = (line_match == false && word_match == false )?true:char_match;
            }
               
            
            if( this._.isSplit == false)
            {
                this._.isSplit = true;
                var elems = this._.elements, chars, words, lines,
                    charWidthInc = 0, wordWidthInc = 0, wordsInLineInc = 0, 
                    startCharIndex = 0, startWordIndex = 0,lineInc = 0, charInc = 0, wordInc = -1;
                
                if(elems!= undefined)
                {
                    var i = 0;
                    //Loop over elements
                    for(;i<elems.length;i++)
                    {
                        var j = 0, 
                            parent_style = {}, 
                            stylesheet = window.getComputedStyle(elems[i], null);
                        //startCharIndex = 0;
                        //charInc = 0;
                        parent_style.width = stylesheet.width;
                        parent_style.height = stylesheet.height;
                        parent_style.paddingLeft = stylesheet.paddingLeft;
                        parent_style.paddingRight = stylesheet.paddingRight;
                        parent_style.marginLeft = stylesheet.marginLeft;
                        parent_style.marginRight = stylesheet.marginRight;
                        parent_style.borderRightWidth = stylesheet.borderRightWidth;
                        parent_style.borderLeftWidth = stylesheet.borderLeftWidth;
                        
                        //Loop over elements' childNodes looking for text elements only
                        for(;j<elems[i].childNodes.length;j++)
                        {
                            var lineStr = "";
                            
                            //Loop over characters
                            if(elems[i].childNodes[j].data != undefined)
                            {
                                var str = elems[i].childNodes[j].data;
                                this._.originalData.push( elems[i].childNodes[j].data );
                                chars = str.split('');
                                words = str.split(' ');
                                
                                //Delete text
                                elems[i].childNodes[j].data = "";
                                
                                var k = 0;
                                wordInc++;
                                var div_word = document.createElement('div');
                                div_word.id = 'word_'+wordInc;
                                div_word.style.position = "relative";
                                div_word.style.display = "inline-block";
                                forChar:for(;k<str.length;k++)
                                {
                                    var div_char;
                                    div_char = document.createElement('div');
                                    div_char.id = 'char_'+charInc;
                                    div_char.style.position = "relative";
                                    div_char.style.display = "inline-block";
                                    
                                    //Check if next character is a whitespace
                                    if( k+1 < str.length)
                                    {
                                        if(str[k+1]==" ")
                                            div_char.innerHTML = str[k]+"&nbsp;";
                                        else
                                            div_char.innerHTML = str[k];
                                    }
                                    //ADD last char
                                    else
                                    {
                                        div_char.innerHTML = str[k];
                                        if(this._.isWord == true)
                                        {
                                            this.words.push(div_word);
                                            elems[i].appendChild(div_word);
                                            wordsInLineInc++;
                                            var style_word = window.getComputedStyle(div_word, null);
                                            wordWidthInc += this._.round(parseFloat(style_word.width), 2) || 0;
                                        }
                                    }    
                                    //Check if current character is a whitespace
                                    if( str[k]==" " )
                                    {
                                        //ADD word
                                        if(this._.isWord == true)
                                        {
                                            this.words.push(div_word);
                                            elems[i].appendChild(div_word);
                                            wordsInLineInc++;
                                            var style_word = window.getComputedStyle(div_word, null);
                                            wordWidthInc += this._.round(parseFloat(style_word.width), 2) || 0;
                                        }
                                        
                                        wordInc++;
                                        div_word = document.createElement('div');
                                        div_word.id = 'word_'+wordInc;
                                        div_word.style.position = "relative";
                                        div_word.style.display = "inline-block";
                                    }
                                    else
                                    {
                                        //If isChar == false, don't store char divs into this.chars array
                                        if(this._.isChar == true)
                                            this.chars.push(div_char);
                                        
                                        if(this._.isWord == true)
                                        {
                                            //Add word and char divs to DOM
                                            if(this._.isChar == true)
                                                div_word.appendChild(div_char);
                                            //Add ONLY word divs to DOM
                                            else
                                                div_word.innerHTML += div_char.innerHTML;
                                        }    
                                        else
                                            //Add ONLY char divs to DOM
                                            elems[i].appendChild(div_char);
                                    }
                                    
                                    //Check lines
                                    if(this._.isLine == true)
                                    {
                                        lineStr += str[k];
                                        if(this._.isWord == true)
                                        {
                                            
                                            if( wordWidthInc >= this._.round(parseFloat(parent_style.width), 2) || k == str.length-1 )
                                            {
                                                var div_line = document.createElement('div');
                                                div_line.id = 'line_'+lineInc;
                                                div_line.style.position = "relative";
                                                div_line.style.display = "inline-block";
                                                
                                                var length = wordsInLineInc-1 + ((k == str.length-1)?1:0);
                                                var m = startWordIndex;
                                                forLoop1:for(;m<length;m++)
                                                    div_line.appendChild( elems[i].removeChild( document.getElementById('word_'+m) ) );
                                                
                                                this.words.push(div_line);
                                                elems[i].appendChild(div_line);
                                                lineInc++;
                                                this.lines.push(div_line);
                                                startWordIndex = m;
                                                
                                                //Last line was added so break the loop
                                                if(k == str.length-1)
                                                    break forChar;
                                                
                                                var style_word2 = window.getComputedStyle(document.getElementById('word_'+m), null);
                                                    wordWidthInc = this._.round(parseFloat(style_word2.width), 2) || 0;
                                            }
                                        }
                                        else
                                        {
                                            //Add char div temporarely
                                            if(this._.isChar == false)
                                            elems[i].appendChild(div_char);
                                        
                                            var style_char = window.getComputedStyle(div_char, null);
                                            charWidthInc += this._.round(parseFloat(style_char.width), 2) || 0;
                                            if( str[k]!=" " || k == str.length-1)
                                            {
                                                if( charWidthInc>=this._.round(parseFloat(parent_style.width), 2) || k == str.length-1 )
                                                {
                                                    var lastChar = lineStr.slice(-1);
                                                    lineStr = lineStr.substring(0, lineStr.length-1);
                                                    lineStr += (k == str.length-1)?lastChar:"";
                                                    
                                                    charWidthInc=this._.round(parseFloat(style_char.width), 2) || 0;
                                                    wordsInLineInc = 0;
                                                    
                                                    var div_line = document.createElement('div');
                                                    div_line.id = 'line_'+lineInc;
                                                    div_line.style.position = "relative";
                                                    div_line.style.display = "inline-block";
                                                    
                                                    //Add line from string
                                                    if(this._.isChar == false)
                                                        div_line.innerHTML = lineStr;
                                                    //Add line grouping previously added char divs
                                                    else
                                                    {
                                                        var length = charInc-1;
                                                        var l = startCharIndex;
                                                        forLoop2:for(;l<=length;l++)
                                                        {
                                                            div_line.appendChild( elems[i].removeChild( document.getElementById('char_'+l) ) );
                                                            if(k == str.length-1 && l == length)
                                                            {
                                                                length++;
                                                                div_line.appendChild( elems[i].removeChild( document.getElementById('char_'+(l+1)) ) );
                                                                break forLoop2;
                                                            }
                                                        }
                                                    }
                                                    
                                                    this.words.push(div_line);
                                                    elems[i].appendChild(div_line);
                                                    this.lines.push(div_line);
                                                    
                                                    lineInc++;
                                                    lineStr = lastChar;
                                                    startCharIndex = length+1;
                                                }
                                            }
                                            
                                            //Remove temporarely added char div
                                            if(this._.isChar == false)
                                                elems[i].removeChild(div_char);
                                        }
                                    }
                                    
                                    if(str[k] != " ")
                                        charInc++;
                                }
                            }
                        }
                    }
                }
            }
        }
        
         /** Sets text back to the original state.
         *  @method  unsplit 
         *  @memberof SplitText */
        unsplit()
        {
            if( this._.isSplit == true)
            {
                this._.isSplit = false;
                var elems = this._.elements;
                var i = 0;
                
                //Loop over elements
                for(;i<elems.length;i++)
                    elems[i].innerHTML = this._.originalData[i];
            }
        } 
    }
    
})(TweenSpace || {});