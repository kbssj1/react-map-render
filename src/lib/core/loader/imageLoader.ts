class ImageLoader {

  constructor() {

  }

  public load(url: string, successCallback : (str:string) => void) {
    successCallback("test123")
  }

}

export default ImageLoader;