import axios from "axios";
import { getAPIHostName } from '../utils/index'

export const uploadImage = async (filename, file) => {
    const foldersPath = 'assest/image';
    const options = { headers: { 'Content-Type': file.type } };

    try {
        const s3Urls = await axios.get(
            `${getAPIHostName()}/services/aws-generate-url?filename=${filename}&path=${foldersPath}&contentType=${file.type}`
        ).then(response => response.data?.urls);

        if (!s3Urls.signedUrl) {
            throw new Error('S3 signed url is not defined');
        }

        axios.put(s3Urls.signedUrl, file, options);

        return s3Urls.publicUrl
    } catch (err) {
        console.error(`Error uploading image: ${err.message}`);
    }
}