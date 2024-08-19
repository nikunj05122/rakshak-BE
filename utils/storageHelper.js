const { admin } = require("./firebaseAdmin");
const { v4: uuidv4 } = require('uuid');

class storageHelper {
    constructor() {
        this.bucketName = process.env.STORAGEBUCKET
        this.storageRef = admin.storage().bucket(this.bucketName)
    }

    async uploadFile(file, destination) {
        const fileId = this.#generateUrlFriendlyName(file.originalname);
        const filePath = `${destination}/${fileId}`;

        return new Promise(async (resolve, reject) => {

            try {

                const fileRef = this.storageRef.file(filePath);

                // Save the buffer to the file reference
                await fileRef.save(file.buffer, {
                    metadata: {
                        contentType: file.mimetype,
                        firebaseStorageDownloadTokens: uuidv4(),
                    },
                });

                // Make the file publicly accessible
                await fileRef.makePublic();


                // Return the file's public URL
                resolve({
                    url: fileRef.publicUrl(),
                    filePath
                });
            } catch (error) {
                reject(error);
            }
        })
    }

    async deleteFile(filePath) {
        return new Promise(async (resolve, reject) => {
            try {
                const fileRef = this.storageRef.file(filePath);

                await fileRef.delete();
                resolve(true);
            } catch (error) {
                reject(error)
            }
        })
    }

    #generateUrlFriendlyName(fileName) {
        // Generate a unique prefix using current timestamp
        const prefix = Date.now().toString();

        // Generate a unique identifier
        const uniqueId = Math.random().toString(36).substring(2, 8);

        // Replace special characters and spaces with hyphens
        const urlFriendlyName = encodeURIComponent(fileName).replace(/%20/g, "-");

        // Combine the prefix, unique id, and url friendly name
        // const finalName = `${prefix}_${uniqueId}_${urlFriendlyName}`;

        return `${prefix}_${uniqueId}_${urlFriendlyName}`;
    }
}

module.exports = storageHelper;
