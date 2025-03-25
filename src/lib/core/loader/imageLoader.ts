class ImageLoader {

  constructor() {

  }

  public load(url: string, successCallback : (str:HTMLImageElement) => void) {
    let image = new Image()
    image.src = url

    image.onload = function() {
      successCallback(image);
    };
  }

}

export default ImageLoader;