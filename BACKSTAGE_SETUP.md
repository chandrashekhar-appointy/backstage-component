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

---

## Step 6: Enable Google Cloud Build Integration

**Google Cloud Build** can be integrated into Backstage to show build status alongside GitHub Actions.

### Installation Steps:

1. **Install the Cloud Build plugin** in your Backstage frontend:

In `packages/app/package.json`, add:
```json
{
  "dependencies": {
    "@backstage-community/plugin-cloudbuild": "^0.4.0"
  }
}
```

2. **Update catalog-info.yaml** with Cloud Build annotation:

Add this annotation to your component's metadata:
```yaml
metadata:
  name: demo-service
  annotations:
    github.com/project-slug: chandrashekhar-appointy/backstage-component
    google.com/cloudbuild-project-slug: YOUR_GCP_PROJECT_ID
```

Replace `YOUR_GCP_PROJECT_ID` with your actual GCP project ID.

3. **Configure GCP integration** in your Backstage `app-config.yaml`:

```yaml
integrations:
  github:
    - host: github.com
      token: ${GITHUB_TOKEN}

  gcp:
    - projectId: YOUR_GCP_PROJECT_ID
      # Service account key for authentication
      # Can be a path to a JSON file or JSON string
      clientEmail: ${GCP_CLIENT_EMAIL}
      privateKey: ${GCP_PRIVATE_KEY}
```

4. **Set up GCP Service Account**:

   a. Go to GCP Console → IAM & Admin → Service Accounts

   b. Create a new service account (e.g., `backstage-cloudbuild`)

   c. Grant these roles:
      - `Cloud Build Viewer`
      - `Service Account User`

   d. Create and download a JSON key

   e. Set environment variables:
   ```bash
   export GCP_CLIENT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
   export GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   ```

5. **Add to your entity page** in `packages/app/src/components/catalog/EntityPage.tsx`:

```typescript
import {
  EntityCloudbuildContent,
  isCloudbuildAvailable,
} from '@backstage-community/plugin-cloudbuild';

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

    <EntityLayout.Route
      if={isCloudbuildAvailable}
      path="/cloud-build"
      title="Cloud Build"
    >
      <EntityCloudbuildContent />
    </EntityLayout.Route>
  </EntityLayout>
);
```

6. **Install dependencies and restart**:
```bash
cd /path/to/your/backstage
yarn install
yarn dev
```

### Setting Up Cloud Build in GCP:

1. **Connect your GitHub repository to Cloud Build**:
   - Go to GCP Console → Cloud Build → Triggers
   - Click "Connect Repository"
   - Select "GitHub" and authenticate
   - Choose your repository: `chandrashekhar-appointy/backstage-component`

2. **Create a Build Trigger**:
   - Name: `demo-service-ci`
   - Event: Push to branch
   - Branch: `^main$`
   - Configuration: Cloud Build configuration file (yaml)
   - Location: `/cloudbuild.yaml`
   - Click "Create"

3. **Test the trigger**:
   - Push a commit to the main branch
   - Cloud Build will automatically run
   - Check GCP Console → Cloud Build → History

### What You'll See in Backstage:

Once Cloud Build is integrated:

1. **Cloud Build Tab**: New tab in your component page
2. **Build History**: All Cloud Build runs with timestamps
3. **Build Status**: Success/Failure status for each build
4. **Build Logs**: Links to view detailed logs in GCP Console
5. **Build Triggers**: Information about configured triggers
6. **Parallel CI/CD View**: See both GitHub Actions AND Cloud Build in the same component!

### Using Both GitHub Actions and Cloud Build:

You can run both simultaneously:
- **GitHub Actions**: For GitHub-specific workflows (PR checks, release management)
- **Cloud Build**: For GCP-specific builds (container builds, GKE deployments)

Both will appear in separate tabs in your Backstage catalog, giving you complete visibility into all CI/CD pipelines!

### Troubleshooting Cloud Build:

**Builds not showing up?**
- Verify `google.com/cloudbuild-project-slug` annotation is correct
- Check GCP service account has Cloud Build Viewer role
- Ensure GCP credentials are properly set as environment variables
- Check Backstage frontend logs for errors

**Permission errors?**
- Verify service account has necessary roles
- Check that the JSON key is valid and not expired
- Ensure projectId matches the annotation in catalog-info.yaml

