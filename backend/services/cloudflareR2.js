import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';

class CloudflareR2Service {
  constructor() {
    // Hardcoded configuration
    const config = {
      accountId: '916e3914cac6ee5760a5465d07d29a87',
      accessKeyId: '144d8054ed35cf734513f332767f411f',
      accessKeySecret: 'dc28d4bae67e98f03e95b22c3c22b1622f51d88e28dcee7c1e06e559e6096df2',
      bucket: 'my-image-storage',
      publicUrl: 'https://pub-916e3914cac6ee5760a5465d07d29a87.r2.dev'
    };

    this.client = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.accessKeySecret,
      }
    });

    this.bucket = config.bucket;
    this.publicUrl = config.publicUrl;
  }

  generateFileName(originalname) {
    const timestamp = Date.now();
    const hash = crypto.createHash('md5').update(`${timestamp}-${originalname}`).digest('hex');
    const ext = originalname.split('.').pop();
    return `${hash}.${ext}`;
  }

  async uploadImage(file) {
    try {
      if (!file || !file.buffer) {
        throw new Error('Invalid file provided');
      }

      const fileName = this.generateFileName(file.originalname);
      const key = `images/${fileName}`;

      console.log('Attempting to upload file:', {
        bucket: this.bucket,
        key,
        contentType: file.mimetype,
        bufferSize: file.buffer.length
      });

      const command = new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });

      await this.client.send(command);

      const publicUrl = `${this.publicUrl}/${key}`;
      console.log('Upload successful, public URL:', publicUrl);

      return {
        success: true,
        url: publicUrl,
        key: key
      };
    } catch (error) {
      console.error('Error uploading to R2:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async deleteImage(key) {
    try {
      if (!key) {
        throw new Error('No key provided for deletion');
      }

      const command = new DeleteObjectCommand({
        Bucket: this.bucket,
        Key: key
      });

      await this.client.send(command);
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting from R2:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new CloudflareR2Service();