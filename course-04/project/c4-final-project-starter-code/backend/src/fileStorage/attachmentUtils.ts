import * as AWS from 'aws-sdk';
import * as AWSXRay from 'aws-xray-sdk'
import { createLogger } from '../utils/logger';
const XAWS = AWSXRay.captureAWS(AWS)


// TODO: Implement the fileStogare logic


const logger = createLogger("attachment")
export class AttachmentUtils{
    constructor(
        private readonly s3client = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName: string = process.env.ATTACHMENT_S3_BUCKET,
        private readonly expiry: Number = Number(process.env.SIGNED_URL_EXPIRATION)

    ){}
    
    getAttachmentUrl(todoId: string){
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    async getUploadUrl(todoId: string): Promise<string> {
        logger.info("creating presigned url...");
        const url = this.s3client.getSignedUrl('putObject', {
            Bucket: this.bucketName,
            Key: todoId, 
            Expires: this.expiry
        });
        logger.info("URL: ", url);
        return url as string;
    }

}
