import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS);


// TODO: Implement the fileStogare logic

//Accessing the S3buckets
const s3bucketName = process.env.ATTACHMENT_S3_BUCKET
// Accessing the Expiration Time
const ExpirationTime = 300



export class AttachmentUtils{
    constructor(
        private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
        private readonly bucketName = s3bucketName

    ){}
    getAttachmentUrl(todoId: string){
        return `https://${this.bucketName}.s3.amazonaws.com/${todoId}`
    }

    getUploadUrl(todoId: string): string{
        return this.s3.getSignedUrl('putObject',{
            Bucket: this.bucketName,
            key: todoId,
            Expires: ExpirationTime
        })
    }
}

