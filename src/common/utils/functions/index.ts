import { Request } from 'express';
import { existsSync, unlinkSync } from 'fs';
import { join } from 'path';

// create route for upload files
export const createRoute = (destinationName: string, fileType: string) => {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const day = new Date().getDay();

  return `./public/uploads/${fileType}/${destinationName}/${year}/${month}/${day}`;
};

// delete property in object
export function deleteInvalidPropertyInObject(data = {}, blackListFields = []) {
  let nullishData = ['', ' ', '0', 0, null, undefined];
  Object.keys(data).forEach((key) => {
    if (blackListFields.includes(key)) delete data[key];
    if (typeof data[key] == 'string') data[key] = data[key].trim();
    if (Array.isArray(data[key]) && data[key].length > 0)
      data[key] = data[key].map((item) => item.trim());
    if (Array.isArray(data[key]) && data[key].length == 0) delete data[key];
    if (nullishData.includes(data[key])) delete data[key];
  });
}
export function copyObject(object: object) {
  return JSON.parse(JSON.stringify(object));
}


export const GetUrlForSave = (dir: string) => {
  return dir.substring(8);
};

export function deleteFileInPublic(fileAddress: string) {
  if (fileAddress) {
    const pathFile = join(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'public',
      fileAddress,
    );
    if (existsSync(pathFile)) unlinkSync(pathFile);
  }
}

export function deleteFilesInPublic(req: Request) {
  if (req.file) {
    deleteFileInPublic(req.file.path.substring(7));
  } else if (req.files) {
    let files: any = Object.values(req.files);

    files = files.flat(2);

    for (let file of files) {
      deleteFileInPublic(file.path.substring(7));
    }
  }
}


