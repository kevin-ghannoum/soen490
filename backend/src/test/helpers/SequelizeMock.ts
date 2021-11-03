import path from 'path';
import { Sequelize } from 'sequelize-typescript';

export const sequelizeMock = (): Sequelize => {
  return new Sequelize({
    validateOnly: true,
    models: [path.join(__dirname, '../../main/models', '*.ts')],
  });
};
