import { Type, TSchema } from "@sinclair/typebox";

type JsonSchema = {
  type?: string;
  properties?: Record<string, JsonSchema>;
  required?: string[];
  items?: JsonSchema;
  additionalProperties?: boolean | JsonSchema;
  enum?: unknown[];
  default?: unknown;
  description?: string;
  minimum?: number;
  maximum?: number;
  minLength?: number;
  maxLength?: number;
  defaultValue?: unknown;
};

function schemaToTypebox(schema: JsonSchema): TSchema {
  if (!schema) return Type.Object({});

  switch (schema.type) {
    case "string":
      const stringProps: Parameters<typeof Type.String>[0] = {};
      if (schema.description) stringProps.description = schema.description;
      if (schema.minLength) stringProps.minLength = schema.minLength;
      if (schema.maxLength) stringProps.maxLength = schema.maxLength;
      if (schema.default) stringProps.default = schema.default as string;
      return Type.String(stringProps);

    case "number":
      const numberProps: Parameters<typeof Type.Number>[0] = {};
      if (schema.description) numberProps.description = schema.description;
      if (schema.minimum !== undefined) numberProps.minimum = schema.minimum;
      if (schema.maximum !== undefined) numberProps.maximum = schema.maximum;
      if (schema.default) numberProps.default = schema.default as number;
      return Type.Number(numberProps);

    case "boolean":
      const boolProps: Parameters<typeof Type.Boolean>[0] = {};
      if (schema.description) boolProps.description = schema.description;
      if (schema.default !== undefined) boolProps.default = schema.default as boolean;
      return Type.Boolean(boolProps);

    case "array":
      if (schema.items) {
        const itemType = schemaToTypebox(schema.items);
        const arrayProps: Parameters<typeof Type.Array>[1] = {};
        if (schema.description) arrayProps.description = schema.description;
        return Type.Array(itemType, arrayProps);
      }
      return Type.Array(Type.Unknown());

    case "object":
      const props: Record<string, TSchema> = {};
      const required: string[] = [];

      if (schema.properties) {
        for (const [key, propSchema] of Object.entries(schema.properties)) {
          props[key] = schemaToTypebox(propSchema);
          if (schema.required?.includes(key)) {
            required.push(key);
          }
        }
      }

      const objProps: Parameters<typeof Type.Object>[1] = {};
      if (schema.additionalProperties === true) {
        objProps.additionalProperties = true;
      } else if (schema.additionalProperties === false) {
        objProps.additionalProperties = false;
      }
      if (schema.description) objProps.description = schema.description;

      if (required.length > 0) {
        return Type.Object(props, { ...objProps, required: required as any });
      }
      return Type.Object(props, objProps);

    default:
      if (schema.enum) {
        const enumValues = schema.enum as unknown[];
        if (enumValues.length > 0 && typeof enumValues[0] === "string") {
          const unionMembers = enumValues.map(v => Type.Literal(v as string));
          return Type.Union(unionMembers as any, schema.description ? { description: schema.description } : {});
        }
      }
      if (schema.description) {
        return Type.Any({ description: schema.description });
      }
      return Type.Any();
  }
}

export { schemaToTypebox, JsonSchema };