/**SVG Module
* @private */
(function ( TweenSpace ) {
    
    /**SVG Module.
    * @private*/
    TweenSpace.SVG = 
    {
        getTotalLength: function(svgObj)
        {
            var length = null;
            if( svgObj.tagName == 'circle') length = circlePathLength(svgObj);
            else if( svgObj.tagName == 'rect') length = rectPathLength(svgObj);
            else if( svgObj.tagName == 'polygon') length = polygonPathLength(svgObj);
            else if( svgObj.tagName == 'path') length = pathLength(svgObj);

            return length;
        },
        path:
        {
            toAbsolute: function(path)
            {
                return pathToAbsolute(path);
            },
            toLinear: function(path)
            {
                return pathToLinear(path);
            },
            toBezier: function(path1, path2)
            {
                return pathToCubicBezier(path1, path2);
            },
            toString: function( array )
            {
                return pathArrayToString( array );
            } 
        },
        svgToPath: function( svgObj )
        {
            return svgToPath( svgObj );
        },
        matchPathPoints: function ( segmentList1, segmentList2 )
        {
            return matchPathPoints( segmentList1, segmentList2 );
        }
    }
    
    /** Returns path length of an SVG Circle.
     * @private */
    function circlePathLength(svgObj)
    {
        var r = svgObj.getAttribute('r');
        var circleLength = 2 * Math.PI * r; 
        return circleLength;
    }
    /** Returns path length of an SVG Rectangle.
     * @private */
    function rectPathLength(svgObj)
    {
        var w = svgObj.getAttribute('width');
        var h = svgObj.getAttribute('height');

        return (w*2)+(h*2);
    }
    /** Returns path length of an SVG Polygon.
     * @private */
    function polygonPathLength(svgObj)
    {
        var points = svgObj.getAttribute('points');
        points = points.split(" ");
        var x1 = null, x2, y1 = null, y2 , lineLength = 0, x3, y3;
        for(var i = 0; i < points.length; i++)
        {
            var coords = points[i].split(",");
            if(x1 == null && y1 == null){

                if(/(\r\n|\n|\r)/gm.test(coords[0]))
                {
                    coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm,"");
                    coords[0] = coords[0].replace(/\s+/g,"");
                }

                if(/(\r\n|\n|\r)/gm.test(coords[1]))
                {
                    coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm,"");
                    coords[0] = coords[1].replace(/\s+/g,"");
                }

                x1 = coords[0];
                y1 = coords[1];
                x3 = coords[0];
                y3 = coords[1];

            }
            else
            {
                if(coords[0] != "" && coords[1] != "")
                {             
                    if(/(\r\n|\n|\r)/gm.test(coords[0]))
                    {
                        coords[0] = coords[0].replace(/(\r\n|\n|\r)/gm,"");
                        coords[0] = coords[0].replace(/\s+/g,"");
                    }

                    if(/(\r\n|\n|\r)/gm.test(coords[1]))
                    {
                        coords[0] = coords[1].replace(/(\r\n|\n|\r)/gm,"");
                        coords[0] = coords[1].replace(/\s+/g,"");
                    }

                    x2 = coords[0];
                    y2 = coords[1];

                    lineLength += Math.sqrt(Math.pow((x2-x1), 2)+Math.pow((y2-y1),2));

                    x1 = x2;
                    y1 = y2;
                    if(i == points.length-2)
                        lineLength += Math.sqrt(Math.pow((x3-x1), 2)+Math.pow((y3-y1),2));
                }
            }

        }
        return lineLength;
    }
    /** Returns path length of an SVG Path.
     * @private */
    function pathLength(svgObj)
    {
        return svgObj.getTotalLength();
    }
    /** Returns a path string out of an array of path segments.
     * @private */
    function pathArrayToString( array )
    {
        return array.valueOf().toString().replace(/,/g, " ");
    }
    /** Match the amount of points in the path of two SVG Objects.
     * @private */
    function matchPathPoints( segmentList1, segmentList2 )
    {
        var s1 = checkArgument(segmentList1);
        var s2 = checkArgument(segmentList2);
        var s3 = [];
        
        var long, short;
        if(s1.length>s2.length)
        { 
            long = s1;
            short = s2;
        }
        else if(s1.length<s2.length)
        { 
            long = s2;
            short = s1;
        }
        else
            return [s1, s2];

        var short_length = short.length;
        var long_length = long.length;

        var additionalPoints = Math.ceil( long_length / (short_length-1) );
        var lastAdditionalPoints = long_length - ( (short_length-1)*additionalPoints ) ;
        var additionalCounter = 0, additionalLength = 0, foundPoint;
        
        var h = 1;
        forLoop:for(;h<short_length;h++)
        {
            additionalLength = additionalPoints;
            
            if(lastAdditionalPoints < 0)
            {    
                if(additionalCounter >= lastAdditionalPoints)
                {    
                    additionalCounter--;
                    additionalLength--;
                }
            }
            else if(lastAdditionalPoints > 0)
            {    
                if(additionalCounter <= lastAdditionalPoints)
                {   
                    additionalCounter++;
                    additionalLength++;
                }
            }
            
            var j = 0;
            if( short[h-1][0] == 'M' )
            {    
                foundPoint = findDotsAtSegment( short[h-1][1], short[h-1][2], short[h][1], short[h][2], short[h][3], short[h][4], short[h][5], short[h][6], 1/additionalPoints );
                s3.push([ 'M', short[h-1][1], short[h-1][2] ] );
                s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
                j = 1;
            }
            else j = 0;

            for(;j<additionalLength;j++)
            {
                if( j == 0 )
                {    
                    foundPoint = findDotsAtSegment( short[h-1][5], short[h-1][6], short[h][1], short[h][2], short[h][3], short[h][4], short[h][5], short[h][6], 1/additionalLength );
                    s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
                }
                else
                {   
                    foundPoint = findDotsAtSegment( foundPoint.x, foundPoint.y, foundPoint.n.x, foundPoint.n.y, foundPoint.end.x, foundPoint.end.y, short[h][5], short[h][6], 1/(additionalLength-j) );

                    s3.push([ 'C', foundPoint.start.x, foundPoint.start.y, foundPoint.m.x, foundPoint.m.y, foundPoint.x, foundPoint.y ] );
                }
            }
        }

        return (s1.length > s2.length) ? [long, s3] : [s3, long];
        
        function checkArgument(arg)
        {
            //arg has to be a path.
            if(arg.constructor === String)
                return TweenSpace.SVG.path.toBezier( arg );
            //arg has to be an SVG Element.
            else if(arg.tagName == 'rect' || arg.tagName == 'polygon' || arg.tagName == 'ellipse' || arg.tagName == 'circle' || arg.tagName == 'path' )
                return TweenSpace.SVG.path.toBezier( TweenSpace.SVG.path.toString(TweenSpace.SVG.svgToPath( arg ) ) );
        }
    }
    
    //____________________________________________________________
    // Source: https://github.com/adobe-webplatform/Snap.svg
    // Author: Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
    function pathToAbsolute( path )
    {
        path = stringToSegmentsArray(path);
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0,
            pa0;
        if (path[0][0] == "M") {
            x = +path[0][1];
            y = +path[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = ["M", x, y];
        }
        var crz = path.length == 3 &&
            path[0][0] == "M" &&
            path[1][0].toUpperCase() == "R" &&
            path[2][0].toUpperCase() == "Z";
        for (var r, pa, i = start, ii = path.length; i < ii; i++) {
            res.push(r = []);
            pa = path[i];
            pa0 = pa[0];
            if (pa0 != pa0.toUpperCase()) {
                r[0] = pa0.toUpperCase();
                switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +pa[6] + x;
                        r[7] = +pa[7] + y;
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y].concat(pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res.concat(catmullRom2bezier(dots, crz));
                        break;
                    case "O":
                        res.pop();
                        dots = ellipsePath(x, y, pa[1], pa[2]);
                        dots.push(dots[0]);
                        res = res.concat(dots);
                        break;
                    case "U":
                        res.pop();
                        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                        r = ["U"].concat(res[res.length - 1].slice(-2));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + ((j % 2) ? x : y);
                        }
                }
            } else if (pa0 == "R") {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ["R"].concat(pa.slice(-2));
            } else if (pa0 == "O") {
                res.pop();
                dots = ellipsePath(x, y, pa[1], pa[2]);
                dots.push(dots[0]);
                res = res.concat(dots);
            } else if (pa0 == "U") {
                res.pop();
                res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                r = ["U"].concat(res[res.length - 1].slice(-2));
            } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    r[k] = pa[k];
                }
            }
            pa0 = pa0.toUpperCase();
            if (pa0 != "O") {
                switch (r[0]) {
                    case "Z":
                        x = +mx;
                        y = +my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = r[r.length - 2];
                        my = r[r.length - 1];
                    default:
                        x = r[r.length - 2];
                        y = r[r.length - 1];
                }
            }
        }
        
        return res;
        
    }
    function pathToLinear( path )
    {
        var array = pathToAbsolute( path );
        var linear_path = [];
        var length = array.length;
        var i = 0;
        for(;i<length;i++)
        {
            if( array[i][0] == 'M' )
                linear_path.push([array[i][0], array[i][array[i].length-2], array[i][array[i].length-1]]);
            else if(array[i][0] == 'Z')
                linear_path.push(['Z']);
            else if(array[i][0] == 'H')
                linear_path.push(['L', array[i][array[i].length-1], array[i-1][array[i-1].length-1]]);
            else if(array[i][0] == 'V')
                linear_path.push(['L', array[i-1][array[i-1].length-2], array[i][array[i].length-1]]);
            else
                linear_path.push(['L', array[i][array[i].length-2], array[i][array[i].length-1]]);
        }
        
        return linear_path;
    }
    function rectToPath(x, y, w, h, rx, ry)
    {
        if( x.tagName == 'rect')
        {
            var rect = x;
            
            x = rect.getAttribute('x') || 0;
            y = rect.getAttribute('y') || 0;
            w = rect.getAttribute('width');
            h = rect.getAttribute('height');
            rx = rect.getAttribute('rx') || 0;
            ry = rect.getAttribute('ry') || 0;
             
        }
        else if( ['circle','ellipse','line','polygon','polyline', 'path', 'text'].indexOf(x.tagName)!=-1 )
        {    
            console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+x.tagName+', expecting SVG rect instead.');
            return;
        }
        
        if (rx && ry)
        {
            return [
                ["M", +x + (+rx), y],
                ["l", w - rx * 2, 0],
                ["a", rx, ry, 0, 0, 1, rx, ry],
                ["l", 0, h - ry * 2],
                ["a", rx, ry, 0, 0, 1, -rx, ry],
                ["l", rx * 2 - w, 0],
                ["a", rx, ry, 0, 0, 1, -rx, -ry],
                ["l", 0, ry * 2 - h],
                ["a", rx, ry, 0, 0, 1, rx, -ry],
                ["z"]
            ];
        }
        
        var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        return res;
    }
    function circleToPath(cx, cy, r)
    {
        if( cx.tagName == 'circle')
        {
            var circle = cx;
            
            cx = circle.getAttribute('cx') || 0;
            cy = circle.getAttribute('cy') || 0;
            r = circle.getAttribute('r') || 0;
            
        }
        else if( ['ellipse','rect','line','polygon','polyline', 'path', 'text'].indexOf(cx.tagName)!=-1 )
        {    
            console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+cx.tagName+', expecting SVG circle instead.');
            return;
        }
        
        return ellipseToPath(cx, cy, r);
    }
    function ellipseToPath(cx, cy, rx, ry, a)
    {
        if( cx.tagName == 'ellipse')
        {
            var ellipse = cx;
            
            cx = ellipse.getAttribute('cx') || 0;
            cy = ellipse.getAttribute('cy') || 0;
            rx = ellipse.getAttribute('rx') || 0;
            ry = ellipse.getAttribute('ry') || 0;
            
        }
        else if( ['circle','rect','line','polygon','polyline', 'path', 'text'].indexOf(cx.tagName)!=-1 )
        {    
            console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+cx.tagName+', expecting SVG ellipse instead.');
            return;
        }
        
        if (a == null && ry == null)
            ry = rx;
        
        cx = +cx;
        cy = +cy;
        rx = +rx;
        ry = +ry;
        if (a != null)
        {
            var rad = Math.PI / 180,
                x1 = cx + rx * Math.cos(-ry * rad),
                x2 = cx + rx * Math.cos(-a * rad),
                y1 = cy + rx * Math.sin(-ry * rad),
                y2 = cy + rx * Math.sin(-a * rad),
                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
        }
        else
        {
            /*res = [
                ["M", cx, cy],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];*/
            res = [
                ["M", cx, cy-ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];
        }
        return res;
    }
    function polygonToPath(poly)
    {
        if( poly.tagName == 'polygon')
        {
            poly = TweenSpace._.getElements(poly);
        
            var newPoints = [];
            var length = poly[0].animatedPoints.length;
            var i = 0;
            for(;i<length;i++)
            {
                if(i==0)
                    newPoints.push(['M', poly[0].animatedPoints[i].x, poly[0].animatedPoints[i].y]);
                else if(i==length-1)
                     newPoints.push(['Z']);
                else
                    newPoints.push(['L', poly[0].animatedPoints[i].x, poly[0].animatedPoints[i].y]);

            }
            return newPoints;
        }
        else if( ['circle','ellipse','line','rect','polyline', 'path', 'text'].indexOf(poly.tagName)!=-1 )
        {    
            console.warn('TweenSpace.js Warning: SVG - Argument is an SVG '+poly.tagName+', expecting SVG polygon instead.');
            return;
        }
    }
    function svgToPath(svgObj)
    {
        if(svgObj.tagName == 'rect')
            return rectToPath(svgObj);
        else if(svgObj.tagName == 'polygon')
            return polygonToPath(svgObj);
        else if(svgObj.tagName == 'ellipse')
            return ellipseToPath(svgObj);
        else if(svgObj.tagName == 'circle')
            return circleToPath(svgObj);
        else if(svgObj.tagName == 'path')
            return pathToAbsolute( svgObj.getAttribute('d') );
        else
            return null;
    }
    function linearToCubic(x1, y1, x2, y2)
    {
        return [x1, y1, x2, y2, x2, y2];
    }
    function quadToCubic(x1, y1, cpx, cpy, x2, y2)
    {
        var _1_3 = 0.33333333333333333333333, // 1/3
            _2_3 = 0.66666666666666666666667; // 2/3
        return [ (_1_3 * x1 + _2_3 * cpx), (_1_3 * y1 + _2_3 * cpy), (_1_3 * x2 + _2_3 * cpx), (_1_3 * y2 + _2_3 * cpy), x2, y2 ];
    }
    function arcToCubic(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive)
    {
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        var PI = TweenSpace._.PI();
        var _120 = PI * 120 / 180,
            rad = PI / 180 * (+angle || 0),
            res = [],
            p1, p2,
            rotate = function (x, y, rad)
            {
                return { x: ( x * Math.cos(rad) - y * Math.sin(rad) ), y: ( x * Math.sin(rad) + y * Math.cos(rad) ) };
            };
        
        if ( recursive == undefined )
        {
            p1 = rotate(x1, y1, -rad);
            x1 = p1.x;
            y1 = p1.y;
            
            p2 = rotate(x2, y2, -rad);
            x2 = p2.x;
            y2 = p2.y;
            var cos = Math.cos(PI / 180 * angle),
                sin = Math.sin(PI / 180 * angle),
                x = (x1 - x2) / 2,
                y = (y1 - y2) / 2;
            var h = (x * x) / (rx * rx) + (y * y) / (ry * ry);
            if (h > 1)
            {
                h = Math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            var rx2 = rx * rx,
                ry2 = ry * ry,
                k = (large_arc_flag == sweep_flag ? -1 : 1) *
                    Math.sqrt(Math.abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                cx = k * rx * y / ry + (x1 + x2) / 2,
                cy = k * -ry * x / rx + (y1 + y2) / 2,
                f1 = Math.asin(((y1 - cy) / ry).toFixed(9)),
                f2 = Math.asin(((y2 - cy) / ry).toFixed(9));

            f1 = x1 < cx ? PI - f1 : f1;
            f2 = x2 < cx ? PI - f2 : f2;
            f1 < 0 && (f1 = PI * 2 + f1);
            f2 < 0 && (f2 = PI * 2 + f2);
            if (sweep_flag && f1 > f2)
                f1 = f1 - PI * 2;
            
            if (!sweep_flag && f2 > f1)
                f2 = f2 - PI * 2;
        }
        else
        {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        
        var df = f2 - f1;
        if (Math.abs(df) > _120)
        {
            var f2old = f2,
                x2old = x2,
                y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * Math.cos(f2);
            y2 = cy + ry * Math.sin(f2);
            res = arcToCubic(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        var c1 = Math.cos(f1),
            s1 = Math.sin(f1),
            c2 = Math.cos(f2),
            s2 = Math.sin(f2),
            t = Math.tan(df / 4),
            hx = 4 / 3 * rx * t,
            hy = 4 / 3 * ry * t,
            m1 = [x1, y1],
            m2 = [x1 + hx * s1, y1 - hy * c1],
            m3 = [x2 + hx * s2, y2 - hy * c2],
            m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        
        if (recursive)
            return [m2, m3, m4].concat(res);
        else
        {
            res = [m2, m3, m4].concat(res).join().split(",");
            var newres = [];
            for (var i = 0, ii = res.length; i < ii; i++)
                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
            
            return newres;
        }
    }
    function pathToCubicBezier(path, path2)
    {
        var p = pathToAbsolute(path),
            p2 = path2 && pathToAbsolute(path2),
            attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            processPath = function (path, d, pcom)
            {
                var nx, ny, cmd;
                if (!path)
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                
                !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
                
                cmd = path[0];
                if( cmd == "M")
                {   
                    d.X = path[1];
                    d.Y = path[2];
                }
                else if( cmd == "A")
                    path = ["C"].concat(arcToCubic.apply(0, [d.x, d.y].concat(path.slice(1))));
                else if( cmd == "S")
                {    
                    if (pcom == "C" || pcom == "S") // In "S" case we have to take into account, if the previous command is C/S.
                    { 
                        nx = d.x * 2 - d.bx;          // And reflect the previous
                        ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                    }
                    else // or some else or nothing
                    {                            
                        nx = d.x;
                        ny = d.y;
                    }
                    path = ["C", nx, ny].concat(path.slice(1));
                }
                else if( cmd == "T")
                {    
                    if (pcom == "Q" || pcom == "T") // In "T" case we have to take into account, if the previous command is Q/T.
                    { 
                        d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                        d.qy = d.y * 2 - d.qy;        // to case "S".
                    }
                    else // or something else or nothing
                    {                            
                        d.qx = d.x;
                        d.qy = d.y;
                    }
                    path = ["C"].concat(quadToCubic(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                }
                else if( cmd == "Q")
                {    
                    d.qx = path[1];
                    d.qy = path[2];
                    path = ["C"].concat(quadToCubic(d.x, d.y, path[1], path[2], path[3], path[4]));
                }
                else if( cmd == "L")
                    path = ["C"].concat(linearToCubic(d.x, d.y, path[1], path[2]));
                else if( cmd == "H")
                    path = ["C"].concat(linearToCubic(d.x, d.y, path[1], d.y));
                else if( cmd == "V")
                    path = ["C"].concat(linearToCubic(d.x, d.y, d.x, path[1]));
                else if( cmd == "Z")
                    path = ["C"].concat(linearToCubic(d.x, d.y, d.X, d.Y));
                        
                return path;
            },
            fixArc = function (pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = Math.max(p.length, p2 && p2.length || 0);
                }
            },
            fixM = function (path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = Math.max(p.length, p2 && p2.length || 0);
                }
            },
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        
        for (var i = 0, ii = Math.max(p.length, p2 && p2.length || 0); i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command
            
            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath
            
            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
                p2[i] && (pfirst = p2[i][0]);
                if (pfirst != "C") {
                    pcoms2[i] = pfirst;
                    i && (pcom = pcoms2[i - 1]);
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] != "A" && pfirst == "C") {
                    pcoms2[i] = "C";
                }

                fixArc(p2, i);
            }
            fixM(p, p2, attrs, attrs2, i);
            fixM(p2, p, attrs2, attrs, i);
            var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = parseFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = parseFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (parseFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (parseFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
            
        }
        
        return p2 ? [p, p2] : p;
    }
    function stringToSegmentsArray(pathString)
    {
        if (!pathString)
            return null;
        
        var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
            data = [];
        
        if (!data.length)
        {
            String(pathString).replace(/([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig, function (a, b, c) {
                var params = [],
                    name = b.toLowerCase();
                c.replace(/(-?\d*\.?\d*(?:e[\-+]?\\d+)?)[\s]*,?[\s]*/ig, function (a, b) {
                    b && params.push(+b);
                });
                if (name == "m" && params.length > 2) {
                    data.push([b].concat(params.splice(0, 2)));
                    name = "l";
                    b = b == "m" ? "l" : "L";
                }
                if (name == "o" && params.length == 1) {
                    data.push([b, params[0]]);
                }
                if (name == "r") {
                    data.push([b].concat(params));
                } else while (params.length >= paramCounts[name]) {
                    data.push([b].concat(params.splice(0, paramCounts[name])));
                    if (!paramCounts[name]) {
                        break;
                    }
                }
            });
        }
        return data;
    }
    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t)
    {
        var t1 = 1 - t,
            t13 = Math.pow(t1, 3),
            t12 = Math.pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = (90 - Math.atan2(mx - nx, my - ny) * 180 / TweenSpace._.PI() );
        // (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {x: mx, y: my},
            n: {x: nx, y: ny},
            start: {x: ax, y: ay},
            end: {x: cx, y: cy},
            alpha: alpha
        };
    }
    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z)
    {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
            var p = [
                        {x: +crp[i - 2], y: +crp[i - 1]},
                        {x: +crp[i],     y: +crp[i + 1]},
                        {x: +crp[i + 2], y: +crp[i + 3]},
                        {x: +crp[i + 4], y: +crp[i + 5]}
                    ];
            if (z) {
                if (!i) {
                    p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
                } else if (iLen - 4 == i) {
                    p[3] = {x: +crp[0], y: +crp[1]};
                } else if (iLen - 2 == i) {
                    p[2] = {x: +crp[0], y: +crp[1]};
                    p[3] = {x: +crp[2], y: +crp[3]};
                }
            } else {
                if (iLen - 4 == i) {
                    p[3] = p[2];
                } else if (!i) {
                    p[0] = {x: +crp[i], y: +crp[i + 1]};
                }
            }
            d.push(["C",
                  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                  (p[1].x + 6 * p[2].x - p[3].x) / 6,
                  (p[1].y + 6*p[2].y - p[3].y) / 6,
                  p[2].x,
                  p[2].y
            ]);
        }

        return d;
    }
    function ellipsePath(x, y, rx, ry, a)
    {
        if (a == null && ry == null) {
            ry = rx;
        }
        x = +x;
        y = +y;
        rx = +rx;
        ry = +ry;
        if (a != null) {
            var rad = Math.PI / 180,
                x1 = x + rx * Math.cos(-ry * rad),
                x2 = x + rx * Math.cos(-a * rad),
                y1 = y + rx * Math.sin(-ry * rad),
                y2 = y + rx * Math.sin(-a * rad),
                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
        } else {
            res = [
                ["M", x, y],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];
        }
        res.toString = toString;
        return res;
    }
    
    // Source: https://github.com/adobe-webplatform/Snap.svg
    // Author: Dmitry Baranovskiy (http://dmitry.baranovskiy.com/)
    //____________________________________________________________
})(TweenSpace || {});