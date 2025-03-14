import { Request } from 'express';

export const fileNamer = (
  req: Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) return callback(new Error('No file provided'), false);

  const fileExtension = file.mimetype.split('/')[1];

  const fileName = `${file.fieldname}-${Date.now()}.${fileExtension}`;

  callback(null, fileName);
};
