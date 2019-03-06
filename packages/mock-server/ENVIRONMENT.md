# Environment Variables

Application can be configured using these environment variables:

| Name                 | Default value | Description                                                                       |
| :------------------- | :------------ | :-------------------------------------------------------------------------------- |
| `PORT`               | not set       | Port for application to listen on.                                                |
| `WHITE_LIST_ORIGINS` | not set       | Comma-separated list of origins from which cross-origin requests will be allowed. |
| `SCHEMAS`            | `mockSchema`  | Comma-separated list of schema names to be merged into the application schema.    |
