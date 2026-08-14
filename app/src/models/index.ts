import  User  from './user.model';
import { RefreshToken } from './refreshToken.model';
import { Audit } from './audit.model';
import { Membership } from './membership.model';
import { Benefit } from './benefit.model';

// Un usuario puede tener varios Refresh Tokens (si inicia sesión en el cel y en la PC)
User.hasMany(RefreshToken, { foreignKey: 'userId' });
RefreshToken.belongsTo(User, { foreignKey: 'userId' });

// Un usuario tiene muchos registros de auditoría
User.hasMany(Audit, { foreignKey: 'userId' });
Audit.belongsTo(User, { foreignKey: 'userId' });

// Relación 1 a 1: Un usuario tiene una sola membresía
User.hasOne(Membership, { foreignKey: 'userId' });
Membership.belongsTo(User, { foreignKey: 'userId' });

// Un usuario puede tener muchos beneficios
User.hasMany(Benefit, { foreignKey: 'userId' });
Benefit.belongsTo(User, { foreignKey: 'userId' });

export {
  User,
  RefreshToken,
  Audit,
  Membership,
  Benefit
};