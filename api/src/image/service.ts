import EventEmitter from "events";
import { JobStatus } from "../types";

type Image = Record<string, any>
type ImageCollection = Map<string, Image>

export class ImageService {
    private imageCollection: ImageCollection;
    private imageEmitter: EventEmitter

    constructor(imageCollection, imageEmitter) {
        this.imageCollection = imageCollection
        this.imageEmitter = imageEmitter
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

    processFaceDetection(imageId: string) {
        // TODO
        if (this.imageCollection.has(imageId)) {
            const image = this.imageCollection.get(imageId) as Image
            image.status = JobStatus.Progess
            this.imageEmitter.emit("image-update", image)

            setTimeout(() => {

                image.status = JobStatus.Complete
                image.info.faceCount = 10

                this.imageEmitter.emit("image-update", image)

            }, 3000)
        }
    }
}