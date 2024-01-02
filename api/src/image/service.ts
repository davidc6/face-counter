import EventEmitter from "events";
import vision, { ImageAnnotatorClient } from "@google-cloud/vision"
import { JobStatus } from "../types";
import { randomIntFromInterval } from "../utils/random"
import path from "path";
import { existsSync } from "fs";

type Image = Record<string, any>
type ImageCollection = Map<string, Image>

export class ImageService {
    private imageCollection: ImageCollection
    private imageEmitter: EventEmitter
    private vision: ImageAnnotatorClient

    constructor(imageCollection, imageEmitter) {
        this.imageCollection = imageCollection
        this.imageEmitter = imageEmitter
        this.vision = new vision.ImageAnnotatorClient()
    }

    insert(id: string) {
        const defaultProperties = {
            name: id, status: JobStatus.Enqueued, info: { faceCount: 0 }
        }
        this.imageCollection.set(id, defaultProperties)
        const image = this.imageCollection.get(id)
        this.imageEmitter.emit("image-update", image)
        return image
    }

    update(id: string, properties: any) {
        let image = this.imageCollection.get(id)
        image = {
            ...image,
            properties
        }
    }

    async countFacesGCP(imageId: string) {
        const image = this.imageCollection.get(imageId) as Image
        const file = path.resolve('uploads', imageId);

        if (!existsSync(file)) {
            console.log('Image not found. Required for processing.')
            return Promise.reject('Image not found. Required for processing.')
        }

        // Start detection
        image.status = JobStatus.Progess
        this.imageEmitter.emit("image-update", image)
        const [result] = await this.vision.faceDetection(file)

        // Complete detection
        const faces = result.faceAnnotations;
        const count = faces && faces.length ? faces.length : 0;

        image.info.faceCount = count
        image.status = JobStatus.Complete

        this.imageEmitter.emit("image-update", image)
        return
    }

    /**
     * Emulates face recognision process.
     * Timeouts added just to show transition between different states.
     * 
     * @param imageId Image id
     */
    countFacesEmulator(imageId: string) {
        if (this.imageCollection.has(imageId)) {
            const image = this.imageCollection.get(imageId) as Image

            setTimeout(() => {
                image.status = JobStatus.Progess
                this.imageEmitter.emit("image-update", image)
            }, 1500)

            setTimeout(() => {
                image.status = JobStatus.Complete
                image.info.faceCount = randomIntFromInterval(0, 20)

                this.imageEmitter.emit("image-update", image)
            }, 3000)
        }
    }
}