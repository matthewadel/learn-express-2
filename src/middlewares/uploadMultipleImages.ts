import { NextFunction, Request, Response } from "express";
import { multerOptions } from "./uploadSingleImage";
import { asyncWrapper } from "./asyncWrapper";
import sharp from "sharp";
import { v4 } from "uuid";

export const uploadMultipleImages = (
  fieldNames: { name: string; maxCount: number }[]
) => {
  const upload = multerOptions();
  return upload.fields(fieldNames);
};

export const compressMultipleImages = (
  data: {
    fieldName: string;
    folderName: string;
  }[]
) => {
  return asyncWrapper(
    async (req: Request, res: Response, next: NextFunction) => {
      await Promise.all(
        data.map(async (item) => {
          if (
            req.files &&
            typeof req.files === "object" &&
            item.fieldName in req.files
          ) {
            const files = (
              req.files as { [fieldname: string]: Express.Multer.File[] }
            )[item.fieldName];
            if (files) {
              for (const file of files) {
                const filename = `${item.fieldName}-${v4()}-${Date.now()}.png`;
                await sharp(file.buffer)
                  .resize(300, 300)
                  .toFormat("png")
                  .png({ quality: 80 })
                  .toFile(`src/uploads/${item.folderName}/${filename}`);
                if (!req.body[item.fieldName]) {
                  req.body[item.fieldName] = [];
                }

                req.body[item.fieldName].push(filename);
              }
            }
          }
        })
      );

      next();
    }
  );
};
