import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { ApolloServer } from 'apollo-server';
import { SchemaDirective } from "./schema-directive.decorator";
import { getMetadataStorage } from "./metadata.storage";
import { buildResolverFields } from "./build-resolver-fields";
import { SchemaDiectiveResolverVisitor } from "./schema-directive-resolver-visitor";

/**
 * Define the schema directive
 */
@SchemaDirective('changeCase')
class ChangeCaseDirective extends SchemaDiectiveResolverVisitor {
    visitFieldResolver(resolver) {
        const { to } = this.args;
        return async function (...args) {
            const result = await resolver.apply(this, args);
            if (typeof result === "string") {
                return to === 'upper' ? result.toUpperCase() : result.toLowerCase();
            }
            return result;
        };
    }
}

/**
 * Define resolver
 */
function helloResolver() {
    return 'Hello World';
}

/**
 * Manually hook up resolver,
 * It can be done by a decorator
 * e.g. @Directive('changeCase', { to: 'upper' })
 */
getMetadataStorage().addResolver('hello', helloResolver, GraphQLString, [{ name: 'changeCase', args: { to: 'upper' } }]);

/**
 * Simply build resolver fields and apply directives
 */
const resolverFields = buildResolverFields();

const schema = new GraphQLSchema({
    query: new GraphQLObjectType({
        name: 'Query',
        fields: resolverFields,
    })
});

const server = new ApolloServer({
    schema,
});

server.listen(4242)
    .then(({ url }) => console.log(`🚀 Server is running at ${url}`))
