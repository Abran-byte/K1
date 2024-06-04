const text = document.querySelector(".text");
const tip = document.querySelector(".tip");
const line = document.querySelector(".line");
const point = document.querySelector(".point");
const position = document.querySelector("#x");
const distance = document.querySelector("#d");
const time = document.querySelector("#t");
const speed = document.querySelector("#s");
const displacement = document.querySelector("#∆x");
const velocity = document.querySelector("#v");
const acceleration = document.querySelector("#a");
const startButton = document.querySelector(".start");
const endButton = document.querySelector(".end");
const nextButton = document.querySelector(".next");

let tracker = [];

let phase = 0;
let tracking = 'none';
let dotPos = 250;
let prevDotPos = dotPos;
let StartingDotPos;
let StartingTime;
let CurTime;
let dotV = 0;
let prevDotV = dotV;
let dotA = 0;
let x = 0;
let prevX = 0;
let d = 0;
let AX = 0;
let t = 0;
let s = 0;
let v = 0;
let prevV = 0;
let a = 0;

function removeElementsByClass(className) {
    let elements = document.getElementsByClassName(className);
    while(elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
    }
}

function movePoint(event){
    if(event.clientX<10){
        dotPos = 0;
        point.style.left = '-3px';
    }
    else if(event.clientX>510){
        dotPos = 500;
        point.style.left = '497px';
    }
    else{
        dotPos = event.clientX-10;
        point.style.left = `${event.clientX-13}px`;
    }
    point.style.left = `${dotPos-3}px`
}
function calcPos(){
    x = Math.round((dotPos-250)/25*10)/10;
    position.innerText = `x = ${x}`;
}
function calcD(){
    if(dotV==0 && dotV!=prevDotV){
        drawTrack();
    }
    
    tracker[tracker.length-1].style.width = `${Math.abs(dotPos-StartingDotPos)}px`;
    if(dotPos<StartingDotPos){
        tracker[tracker.length-1].style.left = `${dotPos}px`
    }
    d = 0;
    tracker.forEach(track=>{
        let trackLength = Number(track.style.width.replace('px',''));
        d = d + trackLength;
    })
    d = Math.round(d/2.5)/10;
    distance.innerText = `d = ${d}`;
}
function calcAX(){
    tracker[tracker.length-1].style.width = `${Math.abs(dotPos-StartingDotPos)}px`;
    if(dotPos<StartingDotPos){
        tracker[tracker.length-1].style.left = `${dotPos}px`
    } else {
        tracker[tracker.length-1].style.left = `${StartingDotPos}px`
    }
    AX = Math.round((dotPos-StartingDotPos)/2.5)/10;
    displacement.innerText = `∆x = ${AX}`;
}
function calcS(){
    
}
function drawTrack(){
    StartingDotPos = dotPos;
    tracker.push(document.createElement('div'));
    line.appendChild(tracker[tracker.length-1]);
    tracker[tracker.length-1].classList.add('track');
    tracker[tracker.length-1].style.position = 'absolute';
    tracker[tracker.length-1].style.top = '-30px';
    tracker[tracker.length-1].style.left = `${dotPos}px`;
    tracker[tracker.length-1].style.width = '0px';
    tracker[tracker.length-1].style.height = '8px';
    tracker[tracker.length-1].style.background = 'rgb(255 110 50 / 20%)';
}

point.addEventListener("mousedown", ()=>{
    document.addEventListener("mousemove", movePoint);
});

document.addEventListener("mouseup", ()=>{
    document.removeEventListener("mousemove", movePoint);
});

startButton.addEventListener("click", ()=>{
    d = 0;
    t = 0;
    tracker = [];
    removeElementsByClass('track');
    switch(phase){
        case 2:
            tracking = 'distance';
            break;
        case 3:
            tracking = 'displacement';
            break;
        case 4:
            tracking = 'avgSpeed';
            StartingTime = new Date();
            break;
        case 5:
            tracking = 'avgVelocity';
            StartingTime = new Date();
            break;
    }
    drawTrack();
});
endButton.addEventListener("click", ()=>{
    if(phase==4){
        s = Math.round(d/t*10)/10;
        speed.innerText = `s = ${s} (average)`;
    }
    if(phase==5){
        v = Math.round(AX/t*10)/10;
        velocity.innerText = `v = ${v} (average)`;
    }
    tracking = 'none';
})

nextButton.addEventListener("click", ()=>{
    phase++;
    console.log(`phase ${phase}`);
    d = 0;
    AX = 0;
    distance.innerText = `d = 0`;
    displacement.innerText = `∆x = 0`;
    tracking = 'none';
    tracker = [];
    removeElementsByClass('track');
    switch(phase) {
        case 1:
            text.innerText = 'I. Position\n Position describes where the point is. Since our point is only moving on a line, we can describe position using a single variable, usually called "x".';
            position.style.visibility = 'visible';
            break;
        case 2:
            text.innerText = 'II. Distance\nDistance measures how much the point moves over a given duration. Think of it as how much steps the point took. A common symbol to represent distance is "d". Use the "Start" and "End" buttons to measure the distance traveled by the point.';
            tip.innerText = 'Tip: Observe how distance relate to position, and how you can calculate it using some key positions.';
            tip.style.visibility = 'visible';
            distance.style.visibility = 'visible';
            startButton.style.visibility = 'visible';
            endButton.style.visibility = 'visible';
            break;
        case 3:
            text.innerText = 'III. Displacement\nDisplacement describes how the point moved from start to finish. It is calculated by subtracting the initial position from the starting Position. Note that this can give a negative value, which is fine because it gives us the direction of displacement. Positive is right and negative is left.'
            tip.innerText = 'Tip: Observe how displacement is different from distance.'
            displacement.style.visibility = 'visible';
            break;
        case 4:
            text.innerText = 'IV. Average Speed\nAverage speed means how much distance a point traveled during a unit of time. In other words, how fast the point is moving on average. It is calculated by distance divided by time(d/t), and it has no direction as distance is.';
            tip.innerText = 'Tip: Try moving the point at different speeds and see how the average speed corresponds.';
            displacement.style.visibility = 'hidden';
            time.style.visibility = 'visible';
            speed.style.visibility = 'visible';
            break;
        case 5:
            text.innerText = 'V. Average Velocity\nAverage velocity means how much displacement a point has during a unit of time. It is similar to average speed, but average velocity only takes the starting and ending positions and time into account, whereas average speed can be affected by the route.';
            tip.innerText = 'Tip: Observe how fast the point is moving does not directly correspond to the average velocity, but how the position changed from start to finish.';
            distance.style.visibility = 'hidden';
            speed.style.visibility = 'hidden';
            displacement.style.visibility = 'visible';
            velocity.style.visibility = 'visible';
            break;
        case 6:
            text.innerText = 'VI. Instantaneous Speed\nInstantaneous speed is how fast the point is moving at an instant. You can think of it as measuring how much the point moved over a very little duration(t approaching 0).';
            tip.innerText = 'Tip: Observe how instantaneous speed changes every moment, unlike average speed where it is determined after the given duration.';
            displacement.style.visibility = 'hidden';
            velocity.style.visibility = 'hidden';
            time.style.visibility = 'hidden';
            speed.style.visibility = 'visible';
            startButton.style.visibility = 'hidden';
            endButton.style.visibility = 'hidden';
            tracking = 'none';
            break;
        case 7:
            text.innerText = 'VII. Instantaneous Velocity\nInstantaneous velocity is the average velocity but over a very little duration. Since there is no route involved in such a short duration, instantaneous velocity is just the instantaneous speed with the added direction.';
            tip.innerText = 'Tip: Observe how positive and negative velocity relates to the direction of the point\'s movement.';
            speed.style.visibility = 'hidden';
            velocity.style.visibility = 'visible';
            break;
        case 8:
            text.innerText = 'VIII. Acceleration\nAcceleration is how much the velocity changes during a unit of time. In other words, how fast the velocity is changing. You can also calculate average and instantaneous acceleration depending on the time duration. In this demonstration, we will only show instantaneous acceleration.';
            tip.innerText = 'Tip: Observe how positive and negative values relate to the point\'s movement.';
            acceleration.style.visibility = 'visible';
            nextButton.style.visibility = 'hidden';
            break;
        }
});

setInterval(function(){
    calcPos();
    dotV = (dotPos-prevDotPos)/0.01;
    prevDotPos = dotPos;
    dotA = (dotV-prevDotV)/0.01;
    if(tracking=='distance'){
        calcD();
    } else if(tracking=='displacement'){
        calcAX();
    } else if(tracking=='avgSpeed'){
        calcD();
        CurTime = new Date();
        t = Math.round((CurTime.getTime() - StartingTime.getTime())/100)/10;
        time.innerText = `t = ${t}`;
    } else if(tracking=='avgVelocity'){
        calcAX();
        CurTime = new Date();
        t = Math.round((CurTime.getTime() - StartingTime.getTime())/100)/10;
        time.innerText = `t = ${t}`;
    }
    prevDotV = dotV;
}, 10);

setInterval(function(){
    if(phase==6){
        s = Math.abs(Math.round((x-prevX)/0.05/25*10)/10);
        speed.innerText = `s = ${s} (instantaneous)`;
        prevX = x;
    }
    if(phase==7){
        v = Math.round((x-prevX)/0.05/25*10)/10;
        velocity.innerText = `v = ${v} (instantaneous)`;
        prevX = x;
    }
    if(phase==8){
        v = Math.round((x-prevX)/0.05/25*10)/10;
        a = Math.round((v-prevV)/0.05*10)/10;
        velocity.innerText = `v = ${v} (instantaneous)`;
        acceleration.innerText = `a = ${a} (instantaneous)`;
        prevX = x;
        prevV = v;
    }
},50)
