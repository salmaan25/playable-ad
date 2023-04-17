let topBarRatio = 0.11;
let objSz = 40;
let objY = 10;
let objCnt = 2;
let ObjTargetCnt = [3, 3]; // Target count to collect for each object
let easeCnt = [0, 0];
let easeLimit = 10;
let objHolderHeightRatio = 0.7;
let objHolderWidth = 60
let objHolderSep = 20;
let objHolderRad = 10;

let cart;
let cartImages = [-1, -1, -1, -1, -1, -1, -1];
let cartImagesCopy = [-1, -1, -1, -1, -1, -1, -1];
let cartItemCnt = 0; 
let cartCoord = [];
let cartImageCoord = [];
let cartBorderX0 = 14;
let cartBorderX1 = 6;
let slotSz = 64;
let cartImgSz = 40;

let allItems = [];

let boardItemCnt = [3, 3, 3];
let boardItemTotalCnt = 3;
let allBoardItemsCoord = [];
let boardImgSz = 80;

let currentSelected = -1;
let currentCart = -1;

let animateCnt = 0;
let animate = 0;
let animationDelta = 50;
let initialDis = 0;
let cartAnimationFactor = 0.3;

let itemsToMoveL = -1;
let itemsToMoveR = -1;
let moveItemsToRight = 0;
let moveItemsToLeft = 0;

let showEndFrame = false;

let currentMid = -1;

function preload() {
  cart = loadImage('Cart.png');
  // objHolder = loadImage('ObjectiveCard_FG.png');
  
  allItems[0] = loadImage('earth.png');
  allItems[1] = loadImage('football.png');
  allItems[2] = loadImage('panda.png');

  // EndCard = loadImage('PlayableEndCard.png');
  appIcon = loadImage('AppIcon.png');
  // appIconCircle = loadImage('AppIcon_Circle.png');
  buttonImg = loadImage('MS3D_button.png');
  
  
}

function setupBg() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  var objHolderHeight = height * topBarRatio * objHolderHeightRatio;
  createCanvas(width, height);
  background(47, 22, 57);
  
  fill(13, 13, 22);
  rect(0, 0, width, height*topBarRatio);

  let cnt = 0;
  for(i = 0; i < objCnt; i++) {
    if(ObjTargetCnt[i] >= 0) {
      cnt++;
    }
  }

  if(cnt == 0) {
    showEndFrame = true;
  }
  let leftPadding = (width-objHolderWidth*cnt-objHolderSep*(cnt-1))/2;
  cnt = 0;
  for(i = 0; i < objCnt; i++) {
    if(ObjTargetCnt[i] >= 0) {
      // image(objHolder, objHolder.width+i*objHolder.width+objHolderSep, objY, objHolder.width, objHolder.height);
      strokeWeight(3);
      // 6C389F 
      // stroke(18, 38, 24);
      stroke(224, 176, 255);
      // fill(248, 224, 200);
      fill(173, 173, 173);
      rect(leftPadding+cnt*objHolderWidth+cnt*objHolderSep, height*topBarRatio/2 - objHolderHeight/2, objHolderWidth, objHolderHeight, objHolderRad);

      image(allItems[i], leftPadding+cnt*objHolderWidth+cnt*objHolderSep+objHolderWidth/2-objSz/2, height*topBarRatio/2 - objSz/2, objSz, objSz);
      textSize(22);
      strokeWeight(2);
      stroke(224, 176, 255);
      // text('word', 10, 30);

      if(ObjTargetCnt[i] == 0) {
        fill('green');
        text('✓', leftPadding+cnt*objHolderWidth+cnt*objHolderSep+objHolderWidth/2+objSz/4, height*topBarRatio/2 + objSz/1.5);
        if(easeCnt[i] == easeLimit) {
          ObjTargetCnt[i]--;
        } else
          easeCnt[i]++;
      } else {
        fill(255, 255, 255);
        text(ObjTargetCnt[i], leftPadding+cnt*objHolderWidth+cnt*objHolderSep+objHolderWidth/2+objSz/4, height*topBarRatio/2 + objSz/1.5);
      }
      cnt++;
      // fill(0, 102, 153, 51);
      // text('word', 10, 90);

    }
  }

  // for(i = 0; i < objCnt; i++) {
  //   if(ObjTargetCnt[i] > 0) {
  //     cnt++;
  //     textSize(22);
  //     // text('word', 10, 30);
  //     fill(255, 255, 255);
  //     text(ObjTargetCnt[i], objHolder.width+i*objHolder.width+objHolderSep, objY+objHolder.height);
  //     // fill(0, 102, 153, 51);
  //     // text('word', 10, 90);

  //   }
  // }
  
  // image(cart, 0, height - cart.height*1.2, cart.width, cart.height)
  
  // console.log(cart.width + " " + cart.height);
  
  image(cart, 0, height - cart.height, width, cart.height)
}

function renderItems() {
  for(i = allBoardItemsCoord.length-1; i >= 0; i--) {
    drawingContext.shadowOffsetX = 10;
    drawingContext.shadowOffsetY = -10;
    drawingContext.shadowBlur = 20;
    drawingContext.shadowColor = 'black';
    image(allItems[allBoardItemsCoord[i][2]], allBoardItemsCoord[i][0], allBoardItemsCoord[i][1], allBoardItemsCoord[i][3], allBoardItemsCoord[i][3]);
  }
}

function findCartCoord() {
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  let cartBorderX0L = (cartBorderX0/512)*width;
  let cartBorderX1L = (cartBorderX1/512)*width;
  let slotSzL = (slotSz/512)*width;
  // let cartImgSzL = (cartImgSz/512)*width;
  
  // widthPerSlot = (cart.width-8*cartBorderX)/cartImages.length;
  for(i = 0; i < cartImages.length; i++) {
    
    let xShift = cartBorderX0L + i*slotSzL + i*cartBorderX1L + slotSzL/2 - cartImgSz/2;
    let yShift = height - cart.height + cart.height/2 - cartImgSz/2;
    cartCoord[i] = [xShift, yShift];
    // if(!animate)
    //   cartImageCoord[i] = cartCoord[i];
  }
}

function renderCart() {
  for(i = 0; i < cartImages.length; i++) {
    if(cartImages[i] != -1) {
      image(allItems[cartImages[i]], cartImageCoord[i][0], cartImageCoord[i][1], cartImgSz, cartImgSz); 
    }
  }
}

function setup() {
  noStroke();
  findCartCoord();
  cartImageCoord = cartCoord.slice();
  var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
  var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
  setupBg();
  
  let cnt = 0;
  for(i = 0; i < boardItemCnt.length; i++) {
    for(j = 0; j < boardItemCnt[i]; j++) {
      xc = generateNumber(2*boardImgSz, width-2*boardImgSz);
      yc = generateNumber(height*topBarRatio+2*boardImgSz, height-2*boardImgSz-cart.height);
      // console.log(xc + " " + yc);
      // allBoardItems[cnt] = allItems[i];
      allBoardItemsCoord[cnt] = [xc, yc, i, boardImgSz];
      
      image(allItems[i], xc, yc, boardImgSz, boardImgSz);
      cnt++;
    }
  }
  renderItems();
  renderCart();
}

function draw() {
  // const dirY = (mouseY / height - 0.5) * 4;
  // const dirX = (mouseX / width - 0.5) * 4;
  // directionalLight(204, 204, 204, dirX, dirY, 1000);
  setupBg();
  findCartCoord();
  renderItems();
  renderCart();
  if(animateCnt > 0) {
    if((animateCnt&(1)) > 0)
      moveTo(currentSelected, currentCart);
    if((animateCnt&(1<<1)) > 0)
      moveItemsInCart();
    if((animateCnt&(1<<2)) > 0) {
      playMatchAnimation();
    }
    if((animateCnt&(1<<3)) > 0) {
      moveItemsLeft();
    }
  } else if(animate == 1) {
    boardItemCnt[allBoardItemsCoord[currentSelected][2]]--;
    boardItemTotalCnt--;
    allBoardItemsCoord.splice(currentSelected, 1);
    currentSelected = -1; 
    cartImageCoord = cartCoord.slice();
    cartImages = cartImagesCopy.slice();
    console.log(cartImageCoord);
    console.log(cartImages);

    matchItems();
    // moveItemsLeft();

    // TODO: Move this to after items have been matched and moved.
    if((animateCnt&(1<<2)) == 0 && (animateCnt&(1<<3)) == 0) {
      if(isCartFull()) {
        console.log("Cart full");
        showEndFrame = true;
      }
    }
    
    // boardItemCnt[allBoardItemsCoord[currentSelected][2]]--;
    // boardItemTotalCnt--;
    // allBoardItemsCoord.splice(currentSelected, 1);
    // currentSelected = -1; 
    // cartImageCoord = cartCoord;
    // cartImages = cartImagesCopy;
    animate = 0;
  }
  if(showEndFrame && animateCnt == 0) {
    console.log("drawing end frame");
    // clear();
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
    // createCanvas(width, height);
    // background(47, 22, 57, 150);

    fill(0, 0, 0, 150);
    rect(0, 0, width, height);

    // appIcon.resize(width/3, width/3)
    imageWd = min(width/3, 200);
    image(appIcon, width/2 - imageWd/2, height*0.15, imageWd, imageWd);

    textSize(40);
    strokeWeight(2);
    stroke(224, 176, 255);
    fill(255, 255, 255);
    playMoreText = 'Explore More Levels!';
    textAlign(CENTER);
    // text(playMoreText);
    text(playMoreText, 0, height*0.15+imageWd+height/15, width, 100);

    // buttonImg.resize(min(width/2, 300), 0);
    btnWd = min(width/2, 300);;
    playButton = new Button(width/2-btnWd/2, height*0.15+imageWd+height/4, buttonImg, btnWd, 20, buttonImg.height/buttonImg.width);
    playButton.display();
    // image(buttonImg, width/2-buttonImg.width/2, height*0.15+appIcon.height+250, buttonImg.width, buttonImg.height);
    
    


    // EndCard.resize();
    // image(EndCard, 0, 0, width, height);

    // return;
  }
}

function matchItems() {
  for(i = 0; i < cartImages.length-2; i++) {
    if(cartImages[i] == -1)
      break;
    match = true;
    for(j = i+1; j < i+3; j++) {
      if(cartImages[j] != cartImages[i]) {
        match = false;
        break;
      }
    }
    if(match) {
      currentMid = i+1;
      animateCnt ^= (1<<2);
      playMatchAnimation();
    }
  }
}

function playMatchAnimation() {
  console.log("playing match animation");
  newXL = cartImageCoord[currentMid-1][0]+animationDelta*cartAnimationFactor;
  newXR = cartImageCoord[currentMid+1][0]-animationDelta*cartAnimationFactor;
  newY = cartCoord[currentMid][1];
  cartImageCoord[currentMid-1][0] = newXL;
  cartImageCoord[currentMid+1][0] = newXR;
  if(newXL >= cartCoord[currentMid][0]) {
    newXL = newXR = cartCoord[currentMid][0];
    cartImageCoord = cartCoord.slice();
    cartImages[currentMid] = cartImages[currentMid-1] = cartImages[currentMid+1] = -1;
    // currentMid = -1;
    animateCnt ^= (1<<2);
    cartItemCnt -= 3;

    // TODO: ADD BLAST ANIMATION

    itemsToMoveL = currentMid+2;
    itemsToMoveR = currentMid+2;
    while(itemsToMoveR < cartImages.length) {
      if(cartImages[itemsToMoveR] == -1)
        break;
      itemsToMoveR++;
    }
    itemsToMoveR--;
    if(itemsToMoveR < itemsToMoveL)
      return;
    moveItemsToLeft = itemsToMoveR-itemsToMoveL+1;
    cartImagesCopy = cartImages.slice();
    for(i = itemsToMoveL; i <= itemsToMoveR; i++) {
      cartImagesCopy[i - 3] = cartImagesCopy[i];
    }
    for(i = itemsToMoveR; i >= itemsToMoveR-2; i--) {
      cartImagesCopy[i] = -1;
    }
    // cartImagesCopy[currentCart] = cartImages[currentCart-1];
    animateCnt ^= (1<<3);
  }
}

function moveItemsLeft() {
  console.log("Animating Cart Left");
  for(i = itemsToMoveL; i <= itemsToMoveR; i++) {
    moveItemLeft(i);
  }
}

function moveItemLeft(cartId) {
  newX = cartImageCoord[cartId][0]-animationDelta*cartAnimationFactor;
  console.log(newX);
  if(newX <= cartCoord[cartId-3][0]) {
    newX = cartCoord[cartId-3][0];
    moveItemsToLeft--;
  }
  newY = cartCoord[cartId][1];
  cartImageCoord[cartId] = [newX, newY]
  if(moveItemsToLeft == 0) {
    animateCnt ^= (1<<3);
    cartImageCoord = cartCoord.slice();
    cartImages = cartImagesCopy.slice();
    console.log(cartImageCoord);
    console.log(cartImages);
  }
}

function moveTo(objectIndex, cartIndex) {
  console.log("Animating movement");
  xStart = allBoardItemsCoord[objectIndex][0];
  yStart = allBoardItemsCoord[objectIndex][1];
  imgId = allBoardItemsCoord[objectIndex][2];
  
  xEnd = cartCoord[cartIndex][0];
  yEnd = cartCoord[cartIndex][1];

  xRange = abs(xEnd-xStart);
  yRange = abs(yEnd-yStart);
  hypo = sqrt(xRange*xRange + yRange*yRange);

  animationDeltaX = (xRange/hypo)*animationDelta;
  animationDeltaY = (yRange/hypo)*animationDelta;
  sizeDelta = hypo/initialDis;

  // console.log(animationDeltaX + " " + animationDeltaY);
  
  // ANIMATE BY CHANGING X AND Y VALUES AND RERENDERING
  if(xStart > xEnd) {
    xStart -= animationDeltaX;
    if(xStart < xEnd)
      xStart = xEnd;
  } else {
    xStart += animationDeltaX;
    if(xStart > xEnd)
      xStart = xEnd;
  }
  if(yStart > yEnd) {
    yStart -= animationDeltaY;
    if(yStart < yEnd)
      yStart = yEnd;
  } else {
    yStart += animationDeltaY;
    if(yStart > yEnd)
      yStart = yEnd;
  }
  
  allBoardItemsCoord[objectIndex][0] = xStart;
  allBoardItemsCoord[objectIndex][1] = yStart;
  allBoardItemsCoord[objectIndex][3] = max(cartImgSz, sizeDelta*boardImgSz); 
  
  
  
  if(xEnd == xStart && yEnd == yStart) {
    // console.log("animation done");
    animateCnt ^= 1;
    // boardItemCnt[allBoardItemsCoord[currentSelected][2]]--;
    // boardItemTotalCnt--;
    // allBoardItemsCoord.splice(currentSelected, 1);
    // currentSelected = -1; 
    // renderInCart(imgId, cartIndex);
  }
}

function isCartFull() {
  return (cartImages[cartImages.length-1] != -1);
}

function moveItemsInCart() {
  console.log("Animating Cart");
  for(i = itemsToMoveR; i >= itemsToMoveL; i--) {
    moveCartItem(i);
  }
}

function moveCartItem(cartId) {
  newX = cartImageCoord[cartId][0]+animationDelta*cartAnimationFactor;
  console.log(newX);
  if(newX >= cartCoord[cartId+1][0]) {
    newX = cartCoord[cartId+1][0];
    moveItemsToRight--;
  }
  newY = cartCoord[cartId][1];
  cartImageCoord[cartId] = [newX, newY]
  if(moveItemsToRight == 0) {
    animateCnt ^= (1<<1);
    // cartImageCoord = cartCoord.slice();
    // cartImages = cartImagesCopy.slice();
    // console.log(cartImageCoord);
    // console.log(cartImages);
  }
}

function renderInCart(imgId, cartId) {
  image(allItems[imgId], cartCoord[cartId][0], cartCoord[cartId][1], cartImgSz, cartImgSz); 
}

function mouseReleased() {
  if(animateCnt > 0)
    return;
  if(showEndFrame) {
    playButton.mouseReleased();
    // Check end frame button conditions and open playstore is button is clicked
    return;
  }
  for(i = 0; i < allBoardItemsCoord.length; i++) {
    xl = allBoardItemsCoord[i][0];
    yt = allBoardItemsCoord[i][1];
    xr = xl+boardImgSz;
    yb = yt+boardImgSz;
    
    // console.log(xl + " " + xr + " " + yt + " " + yb);
    
    if(mouseX >= xl && mouseX <= xr && mouseY >= yt && mouseY <= yb) {
      currentSelected = i;
      animate = 1;
      addToCart();
      // initialCoord = [allBoardItemsCoord[i][0], allBoardItemsCoord[i][1]];
      
      // COMMENT THESE LINES
      // boardItemCnt[allBoardItemsCoor[i][2]]--;
      // boardItemTotalCnt--;
      // allBoardItemsCoor.splice(i, 1);
      
      
      // fill(47, 22, 57);
      // rect(xl, yt, objSz, objSz);
      
      // console.log("board item" + i + "clicked");
      // setupBg();
      // renderItems();
      break;
    }
  }
}

function addToCart() {
  let cartId = -1;
  imgId = allBoardItemsCoord[currentSelected][2];
  if(imgId < objCnt) {
    ObjTargetCnt[imgId]--;
  }
  cartImagesCopy = cartImages.slice();
  for(i = cartImages.length-1; i >= 0; i--) {
    console.log(i);
    if(cartImages[i] == allBoardItemsCoord[currentSelected][2]) {
      console.log(cartImages[i] + " found another");
      // imgId = cartImages[i];
      cartId = i;
      break;
    }
  }
  cartId++;
  if(cartId == 0) {
    cartId = cartItemCnt;
  }
  console.log(cartId + " " + cartItemCnt + " " + imgId);
  currentCart = cartId;
  if(cartId == cartItemCnt) {
    console.log("Dont move anything");
    currentCart = cartId;
    cartImagesCopy[currentCart] = imgId;
    // cartImages[cartItemCnt] = allBoardItemsCoord[currentSelected][2];
  } else {
    console.log("move something");
    itemsToMoveL = cartId;
    itemsToMoveR = cartItemCnt-1;
    moveItemsToRight = itemsToMoveR-itemsToMoveL+1;
    for(i = itemsToMoveR; i >= itemsToMoveL; i--) {
      cartImagesCopy[i + 1] = cartImagesCopy[i];
    }
    cartImagesCopy[currentCart] = cartImages[currentCart-1];
    animateCnt ^= (1<<1);
    // console.log(moveItemsToRight);
    // moveCartItemsToLeft();
  }
  initialDis = sqrt((allBoardItemsCoord[currentSelected][0]-cartCoord[cartId][0])*(allBoardItemsCoord[currentSelected][0]-cartCoord[cartId][0]) + (allBoardItemsCoord[currentSelected][1]-cartCoord[cartId][1])*(allBoardItemsCoord[currentSelected][1]-cartCoord[cartId][1]));
  cartItemCnt++;
  animateCnt ^= 1;
}

var generateNumber = function(min, max) {
    var range = max - min;
    return min + range * Math.random();
};




class Button {
  constructor(inX, inY, inImg, szX, delta, aspectRatio) {
    this.x = inX;
    this.y = inY;
    this.img = inImg;
    this.szX = szX;
    this.delta = delta;
    this.aspectRatio = aspectRatio;
  }
  
  display() {
    // image(allItems[0], 0, 0, allItems[0].width, allItems[0].height);
    let decSz = false;
    stroke(0);
    // tint the image on mouse hover
    if (this.over()) {
      tint(240, 255);
      if(mouseIsPressed == true) {
        decSz = true;
        // image(this.img, this.x, this.y, this.szX-40, this.szY-40);
      }
    }

    if(decSz == true) {
      // console.log("inside true");
      tint(220, 255);
      // image(buttonImg, 0, 0, buttonImg.width, buttonImg.height);
      // image(allItems[0], 0, 0, allItems[0].width, allItems[0].height);
      image(this.img, this.x+this.delta/2, this.y+this.delta/2, this.szX-this.delta, this.aspectRatio*(this.szX-this.delta));
    } else {
      // console.log("inside false");
      // image(buttonImg, 0, 0, buttonImg.width, buttonImg.height);
      // image(allItems[0], 0, 0, allItems[0].width, allItems[0].height);
      image(this.img, this.x, this.y, this.szX, this.aspectRatio*this.szX);
    }
    noTint();


    // if(this.over()) {
    //   tint(220, 255);
    //   image(this.img, this.x, this.y, this.szX, this.szY);
    //   noTint();
    // } else {
    //   image(this.img, this.x, this.y, this.szX, this.szY);
    // }
  }
  
  // over automatically matches the width & height of the image read from the file
  // see this.img.width and this.img.height below
  over() {
    if (mouseX > this.x && mouseX < this.x + this.szX && mouseY > this.y && mouseY < this.y + this.aspectRatio*this.szX) {
      console.log("over button");
      return true;
    } else {
      return false;
    }
  }
  
  mousePressed() {
    image(this.img, this.x, this.y, this.szX-20, this.szY-20);
  }
  
  mouseReleased() {
    if(this.over()) {
      this.openLink();
    }
  }

  openLink() {
    window.open('https://play.google.com/store/apps/details?id=com.gameberrylabs.match3d&hl=en_IN&gl=US&pli=1');
  } 
  
}

// function setup() {
//   // createCanvas(400, 400);
//    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
//   var height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
//   createCanvas(height, width);
// }

// function draw() {
//   background(100);
//   fill(255, 255, 0);
//   ellipse(width/2, height/2, 150, 150);
// }

// // function touchStarted () {
// //   if (!fullscreen()) {
// //     fullscreen(true);
// //   }
// // }

// /* full screening will change the size of the canvas */
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
// }

// /* prevents the mobile browser from processing some default
//  * touch events, like swiping left for "back" or scrolling the page.
//  */
// document.ontouchmove = function(event) {
//     event.preventDefault();
// };