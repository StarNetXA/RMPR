import fs from 'fs';
import murmurhash from 'murmurhash';

export async function fingerprint(filePath) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        const stream = fs.createReadStream(filePath, { highWaterMark: 1024 });

        stream.on('data', (chunk) => {
            const filtered = [];
            for (const byte of chunk) {
                // 过滤：0x9(TAB)、0xA(LF)、0xD(CR)、0x20(SPACE)
                if (byte !== 0x09 && byte !== 0x0A && byte !== 0x0D && byte !== 0x20) {
                    filtered.push(byte);
                }
            }
            chunks.push(Buffer.from(filtered));
        });

        stream.on('end', () => {
            try {
                const buffer = Buffer.concat(chunks);
                // 关键修正：直接使用字节Buffer进行哈希计算
                const hash = murmurhash.v2(buffer, 1); // 确保使用murmur2算法
                const unsignedHash = hash >>> 0; // 转换为无符号32位
                resolve(unsignedHash);
            } catch (e) {
                reject(e);
            }
        });

        stream.on('error', reject);
    });
}

// 使用示例
// computeHash('./package.json')
//     .then(hash => console.log(`Hash: ${hash}`)) 
//     .catch(console.error);