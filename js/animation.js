var Animation = function() {
    
    var pause       = false;

    var canvas		= document.querySelector('canvas');
    var canvasCtx   = canvas.getContext('2d');
    var WIDTH       = canvas.width;
    var HEIGHT      = canvas.height;
    var lineColor   = 'white';
    var bgColor     = '#473C3C';

    var constructor     = window.AudioContext || window.webkitAudioContext;
    var context 		= new constructor();
    var analyser 		= null;
    var bufferLength 	= null;
    var timeArray 		= null;
    var freqArray       = null;

    var animationNum = 0;

    var animationType = [
        function() {        // AnimationNum 0 : Frequency bars
            analyser.fftSize = 32;
            bufferLength 	= analyser.frequencyBinCount;
            freqArray       = new Uint8Array(bufferLength);
            drawBars();
        },
        function() {        // AnimationNum 1 : Oscilloscope style curve
            analyser.fftSize = 1024;
            bufferLength 	= analyser.frequencyBinCount;
            timeArray 		= new Uint8Array(bufferLength);
            drawCurve();
        }
    ];

    var connectAnalyser = function() {
        var source 	= context.createMediaElementSource($audio);
        analyser 	= context.createAnalyser();
        source.connect(analyser);
        source.connect(context.destination);
    };

    var drawBars = function() {
        analyser.getByteFrequencyData(freqArray);
        var barWidth = WIDTH / bufferLength;
        var x = 0, y = 0;
        canvasCtx.fillStyle = bgColor;
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        for (var i = 0; i < bufferLength; i++) {
            canvasCtx.fillStyle = 'green';
            y = HEIGHT - freqArray[i]*100 / 255;
            canvasCtx.fillRect(x, y, barWidth, freqArray[i]*100 / 255);
            x += barWidth;
        }

        if (!pause) window.requestAnimationFrame(drawBars);
    };

    var drawCurve = function() {

        var x = 0, v = 0, y = 0;

        analyser.getByteTimeDomainData(timeArray);

        canvasCtx.fillStyle = bgColor;
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = lineColor;

        canvasCtx.beginPath();

        for(var i = 0; i < bufferLength; i++) {
            v = timeArray[i] / 128.0;
            y = v * HEIGHT/2;

            (i === 0) ? canvasCtx.moveTo(x, y) :  canvasCtx.lineTo(x, y);

            x += WIDTH / bufferLength;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT/2);
        canvasCtx.stroke();

        if (!pause) window.requestAnimationFrame(drawCurve);
    };

    canvas.addEventListener('click', function() {
        animationNum = (animationNum >= animationType.length - 1) ? 0 : animationNum + 1;
        animationType[animationNum]();
    });


    var start = function() {
        pause = false;
        if (!analyser) connectAnalyser();
        animationType[animationNum]();
    };
    
    var pause = function() {
        pause = true;
        animationType[animationNum]();
    };

    return {
        start: start,
        pause: pause
    };
};