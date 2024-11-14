import { UserProfile } from "../types/user";


class UserModel {
    private user: UserProfile = {
        country: 'string',
        display_name: 'Jane Doe',
        email: 'string',
        explicit_content: {
            filter_enabled: true,
            filter_locked: false
        },
        external_urls: { spotify: 'string' },
        followers: { href: 'string', total: 10 },
        href: 'string',
        id: 'string',
        images: [
            {
                url: 'https://images.unsplash.com/photo-1499557354967-2b2d8910bcca?q=80&w=1936&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                height: 10,
                width: 10,
            }
        ],
        product: 'string',
        type: 'string',
        uri: 'string',
    }

    getProfile(): UserProfile | undefined {
        return this.user
    }
}

export default new UserModel