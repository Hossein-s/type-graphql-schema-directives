import { getMetadataStorage } from "./metadata.storage";

export const SchemaDirective = (name: string) => {
    return (target) => {
        getMetadataStorage().addSchemaDirective(name, target);
    }
}
