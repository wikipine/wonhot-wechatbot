import { Sequelize } from 'sequelize';

const config = useRuntimeConfig();
const database = config.public['VITE_MYSQL_DATABASE'] as string;
const host = config.public['VITE_MYSQL_HOST'] as string;
const user = config.public['VITE_MYSQL_USER'] as string;
const password = config.public['VITE_MYSQL_PASSWORD'] as string;
const table_prefix = config.public['VITE_MYSQL_TABLE_PREFIX'];

export const sequelize = new Sequelize(database, user, password, {
    host: host,
    dialect: 'mysql',
    timezone: '+08:00',
    define: {
        paranoid: true, // 启用软删
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        deletedAt: 'deleted_at'
    },
    dialectOptions: {
        dateStrings: true,
        typeCast: true
    },
    hooks: {
        beforeDefine: function (columns: any, model: { tableName: string; name: { singular: string; plural: string }; }) {
            // 表前缀增加 plural表示复数，singular 单数 表示用原来的
            model.tableName = table_prefix + '_' + model.name?.singular;
        }
    }
})
