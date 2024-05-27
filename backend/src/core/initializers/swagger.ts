import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { OpenAPIObject } from 'openapi3-ts';

const schemas = validationMetadatasToSchemas({
  refPointerPrefix: '#/components/schemas/',
});

const swaggerFile: OpenAPIObject = routingControllersToSpec(
  getMetadataArgsStorage(),
  { routePrefix: '/api/v1' },
  {
    components: {
      schemas,
    },
  }
);

export default swaggerFile;
