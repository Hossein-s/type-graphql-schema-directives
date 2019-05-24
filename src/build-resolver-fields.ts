import { getMetadataStorage } from "./metadata.storage";
import { GraphQLField, DirectiveNode, ArgumentNode, ValueNode } from "graphql";

export function buildResolverFields() {
    const resolvers = getMetadataStorage().getResolvers();
    const directives = getMetadataStorage().getSchemaDirectives();

    return resolvers.reduce((acc, cur) => {
        let resolver = cur.func;
        const astNodeDirectives: [DirectiveNode?] = [];
        cur.directives.forEach(d => {
            const directiveClass = directives[d.name];
            if (!directiveClass) {
                throw new Error();
            }

            const directive = new directiveClass(d.args);

            // Only support visitFieldResolver
            resolver = directive.visitFieldResolver(resolver);
            astNodeDirectives.push({
                kind: "Directive",
                name: {
                    kind: "Name",
                    value: d.name,
                },
                arguments: Object.keys(d.args).map<ArgumentNode>(argName => {
                    return {
                        kind: "Argument",
                        name: {
                            kind: "Name",
                            value: argName,
                        },
                        value: getValueNode(d.args[argName]),
                    }
                }),
            });
        });

        const field: GraphQLField<any, any> = {
            type: cur.type as any,
            resolve: resolver as any,
            name: cur.name,
            description: '',
            args: null,
            astNode: {
                kind: "FieldDefinition",
                name: {
                    kind: "Name",
                    value: cur.name,
                },
                type: {
                    kind: "NamedType",
                    name: {
                        kind: "Name",
                        value: "String",
                    }
                },
                directives: astNodeDirectives,
            }

        };

        return { ...acc, [cur.name]: field };
    }, {});
}


/**
 * Value type should be defined in SchemaDirective class
 * Here I just use StringValue for show case
 */
function getValueNode(value): ValueNode {
    return {
        kind: "StringValue",
        value,
    };
}
