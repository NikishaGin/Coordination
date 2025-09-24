import {Injectable} from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import { ConfigService } from "@nestjs/config";
import { MultipartFile } from '@fastify/multipart';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class StorageService {
    private readonly storageDir: string;

    constructor(private config: ConfigService) {
        const storageName = this.config.get<string>("STORAGE_PATH", "./storage");
        this.storageDir = path.join(process.cwd(), storageName);

        if (!fs.existsSync(this.storageDir)) {
            fs.mkdirSync(this.storageDir, { recursive: true });
        }
    }


    private static _generateFilename(this: void, file: MultipartFile): string {
        const ext = file.filename.split('.').pop();
        return `${uuidv4()}.${ext}`;
    }


    getFilePath(folder: string, systemFilename: string): string | null {
        const filePath = path.join(this.storageDir, folder, systemFilename);
        return fs.existsSync(filePath) ? filePath : null;
    }


    async saveFile(file: any): Promise<string> {


        return '';
    }



}