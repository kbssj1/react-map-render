class ImageLoader {

  constructor() {

  }

  public load(url: string, successCallback : (str:HTMLImageElement) => void) {
    let image = new Image();
    image.src = "http://localhost:3000/test.jpg";

    image.onload = function() {
      successCallback(image);
    };
  }

}

export default ImageLoader;