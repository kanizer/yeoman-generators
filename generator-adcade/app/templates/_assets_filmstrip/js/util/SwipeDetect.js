/**
  *
  * props to:
  * http://www.javascriptkit.com/javatutors/touchevents2.shtml
  *
  * desc:
  * detect get swipe status/direction using framework touch events 
  * 
  * usage:
  * var sd = new SwipeDetect();
  * sd.setStart(e); // onTriggerDown - pass in MouseEvent
  * sd.checkEnd(e); // onTriggerUp - pass in MouseEvent
  * // returns
  * // sd.direction contains either "none", "left", "right", "top", or "down"
  * // sd.velocity contains speed at touch up
  *
  **/


define([],
function ()
{
    var SwipeDetect = function()
    {
        var touchobj,
        swipedir,
        velocity,
        startX,
        startY,
        distX,
        distY,

        // constants
        threshold = 100, //required min distance traveled to be considered swipe
        restraint = 100, // maximum distance allowed at the same time in perpendicular direction
        allowedTime = 300, // maximum time allowed to travel that distance

        elapsedTime,
        startTime,
        returnObj = {direction: "none", velocity: 0}



        this.setStart = function(mouseevent)
        {
            touchobj = mouseevent
            swipedir = 'none'
            dist = 0
            startX = touchobj.screenX
            startY = touchobj.screenY

            // no timestamp in touch event
            startTime = new Date().getTime(); // record time when finger first makes contact with surface

            returnObj = {direction: swipedir, velocity: 0};

            return returnObj;
        }

        this.checkMove = function(mouseevent)
        {
            touchobj = mouseevent
            checkMotion();

            returnObj = {direction: swipedir, velocity: 0};
            return returnObj;
        }

        this.checkEnd = function(mouseevent)
        {
            touchobj = mouseevent
            checkMotion()

            if (elapsedTime <= allowedTime){ // first condition for swipe met
                if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){ // 2nd condition for horizontal swipe met
                   swipedir = (distX < 0)? 'left' : 'right' // if dist traveled is negative, it indicates left swipe
                }
                else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){ // 2nd condition for vertical swipe met
                    swipedir = (distY < 0)? 'up' : 'down' // if dist traveled is negative, it indicates up swipe
                }
            }
 
            returnObj = {direction: swipedir, velocity: velocity};
            return returnObj;
        }

        function checkMotion()
        {
            distX = touchobj.screenX - startX // get horizontal dist traveled by finger while in contact with surface
            distY = touchobj.screenY - startY // get vertical dist traveled by finger while in contact with surface
            elapsedTime = new Date().getTime() - startTime // get time elapsed
            velocity = distX/elapsedTime;
        }


    }

    return SwipeDetect;

});