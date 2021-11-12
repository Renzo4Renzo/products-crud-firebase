export class ImageReader {
  extractBase64 = async ($event: any) =>
    new Promise((resolve, reject) => {
      try {
        if ($event.size > 1048576) {
          reject('Max size allowed is 1MB!');
        }
        const imageReader = new FileReader();
        imageReader.readAsDataURL($event);
        imageReader.onload = () => {
          if (imageReader.result) {
            if (imageReader.result.toString().includes('data:image')) {
              resolve({
                base: imageReader.result,
              });
            } else {
              reject('This file is not an image!');
            }
          } else reject("Can't read this file!");
        };
        imageReader.onerror = (error) => {
          reject("Can't read this file!");
        };
      } catch (error) {
        return console.log(error);
      }
    });
}
