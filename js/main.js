///Global variable

let width = 500,
    height = 0,
    filter = 'none',
    streaming = false;

//dom elements

const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const gallery = document.getElementById('gallery');
const photoButton = document.getElementById('photo-button');
const clearButton = document.getElementById('clear-button');
const photoFilter = document.getElementById('photo-filter');
const videoButton = document.getElementById('video_recorder');


//to check camera action me toh nahi he
let isAction=false;

//recording k liye use hoga

let recording=[];
let objectForMediaWork;


//get media stream

navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(function (stream) {
        //link to the video source
        video.srcObject = stream;
        //Play video
        video.play();
        objectForMediaWork = new MediaRecorder(stream);

        objectForMediaWork.ondataavailable =function(e){
            recording.push(e.data);
        }
        objectForMediaWork.addEventListener("stop",function(){

            

            const blob=new Blob(recording , {type:'video/mp4'});
            const url =window.URL.createObjectURL(blob);
            let vid = document.createElement("a");
            vid.download = "video.mp4";
            vid.href=url;
            gallery.appendChild(vid)
            // a.click();
            recording=[];
        })
        

    })
    .catch(function (err) {
        console.log(`Error:${err}`);
    });


videoButton.addEventListener("click",function(){
    if(objectForMediaWork==undefined){
        alert("allow camera permission");
        return;
    }
    if(isAction == false){
        objectForMediaWork.start();
        videoButton.innerText="Stop";
    }else{
        objectForMediaWork.stop();
        videoButton.innerText= "Record";
    }
    isAction=!isAction;
})


    //play when ready


video.addEventListener('canplay', function (e) {
    if (!streaming) {
        //set video canvas height
        height = video.videoHeight / (video.videoWidth / width);

        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);

        streaming = true;
    }
}, false);


//// ye capture button ka event he


photoButton.addEventListener('click',function(e){

    takePicture();
  
},false);


//filter event
photoFilter.addEventListener('change',function(e){
    //Set filter to chosen option
    filter=e.target.value;
    // set filter to video
    video.style.filter=filter;
    
})


//clear event
clearButton.addEventListener('click',function(e){
    ///clear photos
    gallery.innerHTML = '';
    //change filter  back  to none
    filter= 'none';
    //set video filter 
    video.style.filter = filter;
    //reset select list
    photoFilter.selectIndex =0;


});



///ye function canvas se picture le lega


function takePicture(){
   //create canvas
   const context=canvas.getContext('2d');
   if(width && height){
       //set canvas props
       canvas.width = width;
       canvas.height= height;
       //now we draw the image of camera current video on the canvas

       context.drawImage(video,0,0,width,height);

    ///creating an image from canvas after drawing it
    const imgUrl = canvas.toDataURL('image/png');

    //now we create image element in dom and assign picture to it

    const img = document.createElement('img');
    
    //set image soource
    img.setAttribute('src',imgUrl);

    img.style.filter = filter;
    
    //add image to photos
    gallery.appendChild(img);

   }
}
