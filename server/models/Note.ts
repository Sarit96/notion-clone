import { Model, DataTypes, ModelStatic } from 'sequelize';
import sequelize from '../config/db.config';

interface NoteAttributes {
  id: number;
  title: string;
  content: string;
  icon: string | null;
  cover_url: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  publicId: string | null;
}

interface NoteCreationAttributes extends Omit<NoteAttributes, 'id' | 'createdAt' | 'updatedAt'> { }

class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
  public id!: number;
  public title!: string;
  public content!: string;
  public icon!: string | null;
  public cover_url!: string | null;
  public userId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public publicId!: string | null;

  static associate(models: any) {
    Note.belongsTo(models.User, { foreignKey: 'userId' });
  }
}

Note.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cover_url: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    publicId: {
      type: DataTypes.STRING(64),
      allowNull: true,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Note',
    tableName: 'notes',
    timestamps: true,
  }
);

export default Note; 