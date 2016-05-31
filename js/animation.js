var Animation = function() {

    var canvas		= document.querySelector('canvas');
    var canvasCtx   = canvas.getContext('2d');
    var WIDTH       = canvas.width;
    var HEIGHT      = canvas.height;
    var lineColor   = 'white';
    var bgColor     = '#473C3C';

    var context 		= new AudioContext();
    var analyser 		= null;
    var bufferLength 	= null;
    var dataArray 		= null; // where analyser data is copied

    var connectContext = function() {
        var source 	= context.createMediaElementSource($audio);
        analyser 	= context.createAnalyser();
        analyser.fftSize = 2048;
        bufferLength 	= analyser.frequencyBinCount;
        dataArray 		= new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);
        source.connect(analyser);
        source.connect(context.destination);
    };

    var drawLine = function() {
        window.requestAnimationFrame(drawLine);

        analyser.getByteTimeDomainData(dataArray);

        canvasCtx.fillStyle = bgColor;
        canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

        canvasCtx.lineWidth = 1;
        canvasCtx.strokeStyle = lineColor;

        canvasCtx.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        for(var i = 0; i < bufferLength; i++) {
            var v = dataArray[i] / 128.0;
            var y = v * HEIGHT/2;

            if(i === 0) {
                canvasCtx.moveTo(x, y);
            } else {
                canvasCtx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        canvasCtx.lineTo(WIDTH, HEIGHT/2);
        canvasCtx.stroke();
    };

    var start = function() {
        connectContext();
        drawLine();
    };

    return {
        start: start
    };
};