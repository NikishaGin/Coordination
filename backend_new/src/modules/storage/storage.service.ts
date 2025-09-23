import {Injectable} from "@nestjs/common";
import * as fs from "node:fs";
import * as path from "node:path";
import * as process from "node:process";
import { ConfigService } from "@nestjs/config";

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


    async saveFile(file: any): Promise<string> {


        return '';
    }



}