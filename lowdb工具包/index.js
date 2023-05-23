// 测试 lowdb工具包
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

// 拼接存放路径
const __dirname = dirname(fileURLToPath(import.meta.url));
//测试是否可以凭空创建文件夹下文件 答案是不行
const file = join(__dirname, '/src/lowdb.json');

// 初始化文件
const adapter = new JSONFile(file);
const defaultData = { yahaha: [] };
const db = new Low(adapter, defaultData);
await db.read();

// Create and query items using plain JavaScript
// db.data.yahaha.push('hello world');
// const firstPost = db.data.yahaha[0];
// 或者提取变量方便使用
const { yahaha } = db.data;
yahaha.push('测试数据');

await db.write();
