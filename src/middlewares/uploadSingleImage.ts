import { NextFunction, Request, Response } from "express";
import multer from "multer";
import { v4 } from "uuid";
import sharp from "sharp";
import { asyncWrapper } from "../middlewares/asyncWrapper";
import { BadRequestError } from "../utils/errors";

export const uploadSingleImage = (fieldName: string) => {
  // disk storage solution
  // const multerStorage = multer.diskStorage({
  //   destination: (req, file, cb) => {
  //     cb(null, "uploads/categories");
  //   },
  //   filename: (req, file, cb) => {
  //     const ext = file.mimetype.split("/")[1];
  //     const filename = `category-${v4()}-${Date.now()}.${ext}`;
  //     console.log(filename);
  //     cb(null, filename);
  //   }
  // });

  // memory storage solution
  const multerStorage = multer.memoryStorage();

  const multerFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: Function
  ): void => {
    if (file.mimetype.startsWith("image")) {
      cb(null, true);
    } else cb(new BadRequestError("only images are allowed"), false);
  };
  const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

  return upload.single(fieldName);
};

export const compressImage = (fileSuffix: string, folderName: string) =>
  asyncWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const filename = `${fileSuffix}-${v4()}-${Date.now()}.png`;
    if (req.file?.buffer) {
      await sharp(req.file?.buffer)
        .resize(300, 300)
        .toFormat("png")
        .png({ quality: 80 })
        .toFile(`src/uploads/${folderName}/${filename}`);

      req.body.image = filename;
    }
    next();
  });

export function returnImageUrlInResoinse<T>({
  entity,
  fieldName,
  folderName
}: {
  entity: T;
  fieldName: keyof T;
  folderName: string;
}) {
  if (entity?.[fieldName] && process.env.BASE_URL) {
    entity[fieldName] =
      `${process.env.BASE_URL}/${folderName}/${entity[fieldName]}` as NonNullable<T>[keyof T];
  }
}
