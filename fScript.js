// var nodemailer = require('nodemailer');
// import nodemailer from ('nodemailer');
const video = document.getElementById("video");

Promise.all([
  faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
  faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
  faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
])
  .then(hasGetUserMedia)
  .then(faceRecognition);


function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
}

if (hasGetUserMedia()) {
  const enableWebcamButton = document.getElementById('webcamButton');
  enableWebcamButton.addEventListener('click', startWebcam);
} else {
  console.warn('getUserMedia() is not supported by your browser');
}

function startWebcam() {
  navigator.mediaDevices
    .getUserMedia({
      video: true,
      audio: false,
    })
    .then((stream) => {
      video.srcObject = stream;
    })
    .catch((error) => {
      console.error(error);
    });
}

function getLabeledFaceDescriptions() {
  const labels = ["Amey", "Radhey", "Sudip","Prashant sir", "judge", "Dimple", "Umar"];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 1; i <= 2; i++) {
        const img = await faceapi.fetchImage(`./labels/${label}/${i}.jpeg`);
        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
        // console.log(label)
      }
      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}

async function faceRecognition() {
  const labeledFaceDescriptors = await getLabeledFaceDescriptions();
  const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors);

  video.addEventListener("play", async () => {

    const canvas = faceapi.createCanvasFromMedia(video);
    document.body.append(canvas);

    const displaySize = { width: video.width, height: video.height };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(video)
        .withFaceLandmarks()
        .withFaceDescriptors();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);

      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);

      const results = resizedDetections.map((d) => {
        return faceMatcher.findBestMatch(d.descriptor);
      });
      results.forEach((result, i) => {
        const box = resizedDetections[i].detection.box;
        console.log(box)
        const drawBox = new faceapi.draw.DrawBox(box, {
          label: result,
        });
        console.log(drawBox)
        drawBox.draw(canvas);
        const myName = drawBox.options.label._label;
        
        // console.log(myName)
        // function sendEmail() {
        //   Email.send({
        //     Host : "smtp.mailtrap.io",
        //     Username : "<Mailtrap username>",
        //     Password : "<Mailtrap password>",
        //     To : 'tom805246@gmail.com',
        //     From : "tom805246@gmail.com",
        //     Subject : "Test email",
        //     Body : "<html><h2>Header</h2><strong>Bold text</strong><br></br><em>Italic</em></html>"
        //   }).then(
        //     message => alert(message)
        //   );
        // }

        // var transporter = nodemailer.createTransport({
        //   service: 'gmail',
        //   auth: {
        //     user: 'keyurmurkar@gmail.com',
        //     pass: 'keyur2001'
        //   }
        // });
        
        // var mailOptions = {
        //   from: 'keyurmurkar@gmail.com',
        //   to: 'tom805246@gmail.com',
        //   subject: 'Sending Email using Node.js',
        //   text: 'That was easy!'
        // };

        // function email() {
        //   transporter.sendMail(mailOptions, function(error, info){
        //     if (error) {
        //       console.log(error);
        //     } else {
        //       console.log('Email sent: ' + info.response);
        //     }
        //   });
        // }

        function sendMail(){
          var params = {
            name: "sudip",
            email: "impactgjc@gmail.com",
            message: "Hello Intruder detected"
          }
          const serviceID = "service_zw56dzh";
          const templateID = "template_2awpoar"
  
          emailjs.send(serviceID, templateID, params)
              .then((res) =>{
                  console.log("Sent")
                  console.log(res)
                })
              .catch((err)=>{console.log(err)})
        }



        const myArr = [];
        if(myName==="unknown"){
          myArr.push(myName)
        }
        if(myArr[0]=="unknown"){
          console.log("Intruder here")
          // sendEmail();
          // email();
          sendMail()
        }
        // console.log(myArr)
        myArr.pop()
        // console.log(myArr)
      });
    }, 100);
  });
}




// function myFunction(){ cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
//   console.log('Cookie deleted:', cookie);
//   cookieStore.delete(cookie.name);
// }));
// }

// function reloadP(){
//   document.location.reload();
//   myFunction();
// }