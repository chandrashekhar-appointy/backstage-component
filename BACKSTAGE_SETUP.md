# Backstage Integration Setup Guide

## Overview
This guide will help you integrate your demo service with Backstage and enable GitHub Actions visibility.

## Step 1: Upload to GitHub

1. Initialize git repository:
```bash
cd /Users/chandrashekhar29/appointy/poc/backstage-component
git init
git add .
git commit -m "Initial commit: Demo Express service for Backstage"
```

2. Create a new repository on GitHub (e.g., `backstage-component`)

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/backstage-component.git
git branch -M main
git push -u origin main
```

## Step 2: Update catalog-info.yaml

Before pushing, update the following in `catalog-info.yaml`:
- Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username
- Update `owner: team-a` to match your Backstage team name (or keep as is)
- Update `system: demo-system` if you have a specific system defined in Backstage

## Step 3: Register Component in Backstage

### Option A: Manual Registration (Recommended for first time)
1. Go to your Backstage instance
2. Click on "Create" or "Register Existing Component"
3. Enter the URL to your catalog-info.yaml:
   ```
   https://github.com/YOUR_USERNAME/backstage-component/blob/main/catalog-info.yaml
   ```
4. Click "Analyze" and then "Import"

### Option B: Automatic Registration (Using catalog config)
Add to your Backstage `app-config.yaml`:

```yaml
catalog:
  locations:
    - type: url
      target: https://github.com/YOUR_USERNAME/backstage-component/blob/main/catalog-info.yaml
      rules:
        - allow: [Component, API]
```

## Step 4: Enable GitHub Actions Plugin

**YES, you need to install and configure the GitHub Actions plugin** to see workflow runs in Backstage.

### Installation Steps:

1. **Install the plugin** in your Backstage backend:

In `packages/backend/package.json`, add:
```json
{
  "dependencies": {
    "@backstage/plugin-github-actions": "^0.6.0"
  }
}
```

2. **Configure the plugin** in `packages/backend/src/plugins/catalog.ts`:

```typescript
import { GithubActionsEntityProvider } from '@backstage/plugin-github-actions-backend';

// Add to your catalog builder
const builder = CatalogBuilder.create(env);
builder.addEntityProvider(
  GithubActionsEntityProvider.fromConfig(env.config, {
    logger: env.logger,
    schedule: env.scheduler.createScheduledTaskRunner({
      frequency: { minutes: 30 },
      timeout: { minutes: 3 },
    }),
  }),
);
```

3. **Configure GitHub integration** in your `app-config.yaml`:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}  # Set this as environment variable

# Enable GitHub Actions
github:
  apps:
    - host: github.com
      token: ${GITHUB_TOKEN}
```

4. **Set up GitHub Personal Access Token**:
   - Go to GitHub Settings → Developer settings → Personal access tokens
   - Generate a token with `repo` scope
   - Set it as environment variable: `export GITHUB_TOKEN=your_token_here`

5. **Install frontend plugin** in `packages/app/package.json`:

```json
{
  "dependencies": {
    "@backstage/plugin-github-actions": "^0.6.0"
  }
}
```

6. **Add to your entity page** in `packages/app/src/components/catalog/EntityPage.tsx`:

```typescript
import {
  EntityGithubActionsContent,
  isGithubActionsAvailable,
} from '@backstage/plugin-github-actions';

// Add to your service entity page
const serviceEntityPage = (
  <EntityLayout>
    {/* ... other tabs ... */}
    <EntityLayout.Route
      if={isGithubActionsAvailable}
      path="/github-actions"
      title="GitHub Actions"
    >
      <EntityGithubActionsContent />
    </EntityLayout.Route>
  </EntityLayout>
);
```

7. **Restart Backstage**:
```bash
cd /path/to/your/backstage
yarn install
yarn dev
```

## Step 5: Verify Integration

1. After setup, go to your component in Backstage catalog
2. You should see a "GitHub Actions" tab
3. Push a commit to trigger the workflow
4. The workflow status should appear in Backstage

## Troubleshooting

### GitHub Actions not showing up?
- Verify `github.com/project-slug` annotation in catalog-info.yaml is correct
- Check that GITHUB_TOKEN has proper permissions
- Ensure the GitHub Actions plugin is properly installed
- Check Backstage backend logs for errors

### Component not registering?
- Validate your catalog-info.yaml syntax
- Ensure the repository is public or Backstage has access
- Check catalog processing logs in Backstage

## What You'll See in Backstage

Once everything is configured:

1. **Component Overview**: Basic information about your service
2. **GitHub Actions Tab**: All workflow runs with status (success/failure)
3. **Recent Workflow Runs**: Latest CI/CD pipeline executions
4. **Build Status**: Real-time status of your builds
5. **APIs Tab**: Documentation for your API endpoints

The GitHub Actions integration will automatically update as new workflows run!
