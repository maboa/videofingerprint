var processor = {
  interval : 100, // interval between frame samples (ms)
  sample : 1,     // sample colour every n pixels
  framenum : 0,
  oldAverageR : 0,
  oldAverageG : 0,
  oldAverageB : 0,
  timerCallback: function() {
    this.video.pause();
    if (this.video.ended || this.video.currentTime >= this.video.duration ) {
      return;
    }
    this.computeFrame();
    var self = this;
    setTimeout(function () {
        self.timerCallback();
      }, 0);
  },

  doLoad: function() {
    this.video = document.getElementById("video");
    this.c1 = document.getElementById("c1");
    this.fp = document.getElementById("fingerprint");
    this.fc = document.getElementById("fingerrgb");
    this.dp = document.getElementById("deltaprint");
    this.dt = document.getElementById("deltatotal");
    this.dc = document.getElementById("deltargb");
    //this.c1 = document.createElement("c1");
    //this.c1.setAttribute('width',480);  
    //this.c1.setAttribute('height',270);

    this.ctx1 = this.c1.getContext("2d");
    this.ctxfp = this.fp.getContext("2d");
    this.ctxfc = this.fc.getContext("2d");
    this.ctxdp = this.dp.getContext("2d");
    this.ctxdt = this.dt.getContext("2d");
    this.ctxdc = this.dc.getContext("2d");

    this.cb1 = document.getElementById("cb1");
    var self = this;
    this.video.addEventListener("play", function() {
        self.width = self.video.width; // self.video.videoWidth;
        self.height = self.video.height; // self.video.videoHeight;
        self.timerCallback();
      }, false);
  },

  computeFrame: function() {
    this.ctx1.drawImage(this.video, 0, 0, this.width, this.height);
    var frame = this.ctx1.getImageData(0, 0, this.width, this.height);
  	var l = frame.data.length / 4;
    var totalR = 0, totalG = 0, totalB = 0;


    for (var i = 0; i < l; i = i + this.sample) {
      var grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

      totalR += frame.data[i * 4 + 0];
      totalG += frame.data[i * 4 + 1];
      totalB += frame.data[i * 4 + 2];
    }
    //this.ctx1.putImageData(frame, 0, 0);

    var averageR = Math.floor(totalR/(l/this.sample));
    var averageG = Math.floor(totalG/(l/this.sample));
    var averageB = Math.floor(totalB/(l/this.sample));

    var deltaTolerance = 100;

    var deltaR = averageR > this.oldAverageR ? averageR - this.oldAverageR : this.oldAverageR - averageR;
    var deltaG = averageG > this.oldAverageG ? averageG - this.oldAverageG : this.oldAverageG - averageG;
    var deltaB = averageB > this.oldAverageB ? averageB - this.oldAverageB : this.oldAverageB - averageB;


    this.oldAverageR = averageR;
    this.oldAverageG = averageG;
    this.oldAverageB = averageB;



    //console.log("R = "+averageR+", G = "+averageG+", B = "+averageB);

    //console.log(deltaR + "," + deltaG + "," + deltaB);

    this.ctxfp.strokeStyle = "rgb("+averageR+","+averageG+","+averageB+")"; 
    this.ctxfp.strokeRect(this.framenum,0,1,40);

    this.ctxfc.strokeStyle = "rgb(255,0,0)"; 
    this.ctxfc.strokeRect(this.framenum,averageR,1,1);
    this.ctxfc.strokeStyle = "rgb(0,255,0)"; 
    this.ctxfc.strokeRect(this.framenum,averageG,1,1);
    this.ctxfc.strokeStyle = "rgb(0,0,255)"; 
    this.ctxfc.strokeRect(this.framenum,averageB,1,1);

    this.ctxdp.strokeStyle = "rgb("+(255-deltaR)+","+(255-deltaG)+","+(255-deltaB)+")"; 
    this.ctxdp.strokeRect(this.framenum,0,1,40);

    this.ctxdt.strokeStyle = "rgb(255,255,255)"; 
    this.ctxdt.strokeRect(this.framenum,0,1,((deltaR+deltaG+deltaB)/3));

    this.ctxdc.strokeStyle = "rgb(255,0,0)"; 
    this.ctxdc.strokeRect(this.framenum,deltaR,1,1);
    this.ctxdc.strokeStyle = "rgb(0,255,0)"; 
    this.ctxdc.strokeRect(this.framenum,deltaG,1,1);
    this.ctxdc.strokeStyle = "rgb(0,0,255)"; 
    this.ctxdc.strokeRect(this.framenum,deltaB,1,1);

    //white baseline
    this.ctxdc.strokeStyle = "rgb(255,255,255)"; 
    this.ctxdc.strokeRect(this.framenum,0,1,1);

    //document.body.style.backgroundColor="rgb("+averageR+","+averageG+","+averageB+")";

    this.framenum++;

    // jump to next time

    var jumpTo = this.interval * this.framenum;
    //console.log(jumpTo);
    this.video.currentTime = jumpTo/1000;
    //console.log(this.framenum);
    //console.log(this.video.currentTime);
    //console.log(this.video.ended);
    //console.log(this.video.duration);
    
    return;
  }
};
