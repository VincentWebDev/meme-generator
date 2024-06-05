import React, { useState, useEffect } from "react";

export default function Meme() {
  const [allMemes, setAllMemes] = useState();

  const [meme, setMeme] = useState({
    topText: "one does not simply",
    bottomText: "walk into Mordor",
    randomImage: "https://i.imgflip.com/1bij.jpg",
    imgWidth: 568,
    imgHeight: 335,
  });

  // set timer so canvas can load first and .getContext won't return an error
  setTimeout(() => {
    const canvas = document.querySelector("canvas");
    const ctx = canvas.getContext("2d");
    var img = new Image();
    img.src = meme.randomImage;
    img.onload = imageLoaded;

    //Canvas image in order to download image and text together
    function imageLoaded() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 50, meme.imgWidth, meme.imgHeight);
      ctx.fillStyle = "#ffffff";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 5;
      ctx.font = "50px impact, sans-serif";
      ctx.textAlign = "center";
      ctx.strokeText(meme.topText, meme.imgWidth / 2, meme.imgHeight / 3);
      ctx.fillText(meme.topText, meme.imgWidth / 2, meme.imgHeight / 3);
      ctx.strokeText(meme.bottomText, meme.imgWidth / 2, meme.imgHeight / 1);
      ctx.fillText(meme.bottomText, meme.imgWidth / 2, meme.imgHeight / 1);
    }
  }, 10);

  // emtpy array to run useEffect once to prevent infinite loop
  useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then((resolve) => resolve.json())
      .then((memesData) => setAllMemes(memesData.data.memes));
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setMeme((prevMeme) => {
      return {
        ...prevMeme,
        [name]: value,
      };
    });
  }
  //scale images, seems like code doesn't work for all ratios, not sure if it's a useState issue
  function scaleWidth(width, height) {
    const ratio = width / height;
    if (width > 600 && width > height) {
      return 600;
    } else if (width > 600) {
      return 600 * ratio;
    } else if (height > 600) {
      return 600 * ratio;
    } else {
      return width;
    }
  }

  function scaleHeight(width, height) {
    const ratio = width / height;
    if (width > 600 && width > height) {
      return 600 / ratio;
    } else if (width > 600) {
      return 600;
    } else if (height > 600) {
      return 600;
    } else {
      return height;
    }
  }

  function newImage(event) {
    const ranNum = Math.floor(Math.random() * 100);
    console.log(`width: ${allMemes[ranNum].width}
    height: ${allMemes[ranNum].height}`);

    const scaledWidth = scaleWidth(
      allMemes[ranNum].width,
      allMemes[ranNum].height
    );
    const scaledHeight = scaleHeight(
      allMemes[ranNum].width,
      allMemes[ranNum].height
    );

    setMeme((prevMeme) => {
      return {
        ...prevMeme,
        randomImage: allMemes[ranNum].url,
        imgWidth: scaledWidth,
        imgHeight: scaledHeight,
      };
    });

    console.log(`new width: ${meme.imgWidth}
    new height: ${meme.imgHeight}`);
    console.log(
      "width: " + scaleWidth(618, 499) + " height: " + scaleHeight(618, 499)
    );
  }

  return (
    <main>
      {/* no form tag so button submission will not refresh page */}
      <div className="form">
        <label>
          top text
          <input
            type="text"
            placeholder="shut up"
            name="topText"
            value={meme.topText}
            onChange={handleChange}
          />
        </label>
        <label>
          bottom text
          <input
            type="text"
            placeholder="and take my money"
            name="bottomText"
            value={meme.bottomText}
            onChange={handleChange}
          />
        </label>
        <button onClick={newImage}>Get New Image 🖼️</button>
      </div>
      <div className="canvas">
        <canvas width="600" height="600"></canvas>
      </div>
      {/* previous code below without being able to download image and text together */}
      {/* <img src={meme.randomImage} alt="meme image" />
      <h2 className="meme--text top">{meme.topText}</h2>
      <h2 className="meme--text bottom">{meme.bottomText}</h2> */}
    </main>
  );
}
