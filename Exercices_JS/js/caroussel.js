const carousselImg = document.querySelector('#caroussel_img');
const precedentBtn = document.querySelector('#precedent');
const suivantBtn = document.querySelector('#suivant');
const firstImgBtn = document.querySelector('#img1');
const secondImgBtn = document.querySelector('#img2');
const thirdImgBtn = document.querySelector('#img3');
let i = 0;
let images = ['images/img0.jpg', 'images/img1.jpg', 'images/img2.jpg']


precedentBtn.addEventListener('click', function () {
    if (i === 0) {
        i = (images.length - 1);
        carousselImg.src = `images/img${i}.jpg`;
    } else {
        i--;
        console.log("precedentBtn else " + i)
        carousselImg.src = `images/img${i}.jpg`;
    }
})

suivantBtn.addEventListener('click', function () {
    if (i === (images.length - 1)) {
        i++;
        i = 0;
        carousselImg.src = `images/img${i}.jpg`;

    } else {
        i++;
        carousselImg.src = `images/img${i}.jpg`;
    }
})
firstImgBtn.addEventListener('click', function () {
    carousselImg.src = "images/img0.jpg";
    i = 0;
})

secondImgBtn.addEventListener('click', function () {
    carousselImg.src = "images/img1.jpg";
    i = 1;
})

thirdImgBtn.addEventListener('click', function () {
    carousselImg.src = "images/img2.jpg";
    i = 2;
})