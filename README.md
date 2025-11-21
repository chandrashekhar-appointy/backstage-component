# Demo Service

A basic Express.js service integrated with Backstage.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Running the Service

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

### Available Endpoints

- `GET /` - Welcome message
- `GET /health` - Health check endpoint
- `GET /api/info` - Service information

### Backstage Integration

This service is registered in Backstage using the `catalog-info.yaml` file in the root directory.

## Testing

```bash
npm test
```
