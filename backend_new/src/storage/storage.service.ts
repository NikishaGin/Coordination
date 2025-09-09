import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DiskStorage } from '@blazity/nest-file-fastify';
import { resolve } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { MultipartFile } from '@fastify/multipart';
import { Readable } from 'node:stream';

@Injectable()
export class FileStorageService {
    public readonly storage: DiskStorage;
    private readonly uploadPath: string;

    constructor(private config: ConfigService) {
        this.uploadPath = resolve(this.config.get<string>('UPLOAD_PATH', '.uploads'));
        this.storage = new DiskStorage({
            dest: this.uploadPath,
            filename: FileStorageService._getFilename,
        });
    }

    private static _getFilename(this: void, file: MultipartFile): string {
        const ext = file.filename.split('.').pop();
        return `${uuidv4()}.${ext}`;
    }

    public getFilePath(systemName: string, folder?: string): string | null {
        const filePath = folder
            ? resolve(this.uploadPath, folder, systemName)
            : resolve(this.uploadPath, systemName);
        return existsSync(filePath) ? filePath : null;
    }

    public async saveFile(
        stream: Readable,
        folder?: string,
    ): Promise<{ systemName: string; path: string }> {
        const stamp = new Date().toISOString().slice(0, 19);
        const systemName = `${stamp}-${uuidv4()}`;

        const dir = folder
            ? resolve(this.uploadPath, folder)
            : this.uploadPath;

        await fs.promises.mkdir(dir, {recursive: true});
        const filePath = resolve(dir, systemName);

        await pipeline(stream, fs.createWriteStream(filePath));
        return {systemName, path: filePath};
    }

    public async deleteFile(systemName: string, folder?: string): Promise<void> {
        const filePath = folder
            ? resolve(this.uploadPath, folder, systemName)
            : resolve(this.uploadPath, systemName);
        await fs.promises.unlink(filePath).catch(() => {
        });
    }
}
