export class MetadataStorage {
    private readonly schemaDirectives: Array<{ name: string, obj: object }> = [];
    private readonly resolvers: Array<{
        name: string,
        func: Function,
        type: object,
        directives: Array<{ name: string, args: object }>
    }> = [];

    addSchemaDirective(name: string, obj: object) {
        this.schemaDirectives.push({ name, obj });
    }

    getSchemaDirectives() {
        return this.schemaDirectives.reduce((acc, cur) => ({ ...acc, [cur.name]: cur.obj }), {});
    }

    addResolver(name: string, func: Function, type: object, directives: Array<{ name: string, args: object }>) {
        this.resolvers.push({ name, func, type, directives });
    }

    getResolvers() {
        return this.resolvers;
    }
}

let metadataStorage: MetadataStorage;
export function getMetadataStorage(): MetadataStorage {
    if (!metadataStorage) {
        metadataStorage = new MetadataStorage();
    }

    return metadataStorage;
}
