/*
Copyright (c) 2011-2017 TweenSpace

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
if (TweenSpace === undefined) 
{    
    /**
     * TweenSpace Engine.
     * @class TweenSpace is a Javascript library that tweens object properties producing smooth animations.
     * It is an optimized tweening engine written from square one in pure Javascript with no dependencies. 
     * Tween and Timeline are the core classes that make possible the creation and management of many types of tweenings.
     * Tween instances are responsible of handling animations on single and multiple objects.
     * Timeline instances are capable of controlling playback operations and time management on groups of tweens.
     * @public
     */
    var TweenSpace, Tweenspace, TS;
    TweenSpace = Tweenspace = TS = (function ()
    {
        return {
            /* Underscore is an object which contains TweenSpace private properties and methods.
            * @private*/
            _:{}
        };
    })();
}