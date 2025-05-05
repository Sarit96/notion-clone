import { Model, DataTypes, ModelStatic } from 'sequelize';
import sequelize from '../config/db.config';

// Define interface for User attributes
interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define interface for User creation attributes (excluding auto-generated fields)
interface UserCreationAttributes extends Omit<UserAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

// Define User model class
class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Define association with Note model
  static associate(models: any) {
    User.hasMany(models.Note, { foreignKey: 'userId' });
  }

  // Method to return user data without sensitive password field
  toJSON() {
    const values = { ...this.get() } as Partial<UserAttributes>;
    delete values.password;
    return values;
  }
}

// Initialize User model with schema definition
User.init(
  {
    // Primary key
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    // Username field with uniqueness constraint
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    // Email field with validation
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    // Password field (will be hashed)
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    // Timestamp fields
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    }
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User; 