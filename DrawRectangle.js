// DrawTriangle.js (c) 2012 matsuda
function main() {  
  // Retrieve <canvas> element
  var canvas = document.getElementById('example');  
  if (!canvas) { 
    console.log('Failed to retrieve the <canvas> element');
    return false; 
  } 

  // Get the rendering context for 2DCG
  var ctx = canvas.getContext('2d');
  
  // Draw a two rectangles of different colors
  ctx.fillStyle = 'rgba(120, 135, 150, 1.0)';
  ctx.fillRect(227, 0, 225, 225);
  ctx.fillStyle = 'rgba(245, 135, 223, 1.0)'; // Set color to second color
  ctx.fillRect(0, 0, 225, 225);  // Fill a rectangle with the color
 
    x= 227;
    r = '255';
    g = '255';
    b = '0';
    a = '1.0'
    
    
    
    //testing 1.2.3..
    for(i=0; i<4; i++){ //generates 16 smaller rectangles
        x+=30;
        y=0;
        r = r - 10;
        for(j=0; j<4; j++){
            g = g-10;
        ctx.fillStyle = 'rgba(' + r +','+ g +', 0, 1.0)';
        ctx.fillRect(y+=30, x, 30, 30);
    }
    }
}
