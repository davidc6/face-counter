import { Roles } from "../types";

type User = Record<string, any>
type UserCollection = Map<string, User>

export class UserService {
    private userCollection: UserCollection;

    constructor(userCollection: UserCollection) {
        this.userCollection = userCollection
    }

    async register(userId: string) {
        if (!this.userCollection.has(userId)) {
            this.userCollection.set(userId, { role: Roles.User, images: [] })
            return userId
        }
    }

    async updateImage(userId: string, image: any) {
        if (this.userCollection.has(userId)) {
            const user = this.userCollection.get(userId) as User
            user.images.push(image)
            return user
        }
        return null
    }

    async search(userId: string) {
        return this.userCollection.get(userId)
    }
}
