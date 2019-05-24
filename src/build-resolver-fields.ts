import { getMetadataStorage } from "./metadata.storage";

export function buildResolverFields() {
    const resolvers = getMetadataStorage().getResolvers();
    const directives = getMetadataStorage().getSchemaDirectives();

    return resolvers.reduce((acc, cur) => {
        let resolver = cur.func;
        cur.directives.forEach(d => {
            const directiveClass = directives[d.name];
            if (!directiveClass) {
                throw new Error();
            }

            const directive = new directiveClass(d.args);

            // Only support visitFieldResolver
            resolver = directive.visitFieldResolver(resolver);
        });

        const field = {
            type: cur.type,
            resolve: resolver,
        };

        return { ...acc, [cur.name]: field };
    }, {});
}
