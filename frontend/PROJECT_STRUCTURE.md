# Angular Project Structure

## 📁 Folder Organization

### `core/` - Application Core (Singleton Services)
- **services/** - App-wide services (API calls, authentication)
  - `anime-api.service.ts` - Handles all anime API calls
- **models/** - Core domain models and interfaces
  - `anime.model.ts` - Anime interface and status enum
  - `api-response.model.ts` - API response interfaces
- **guards/** - Route guards (auth, permissions)
- **interceptors/** - HTTP interceptors (error handling, auth tokens)
  - `http-error.interceptor.ts` - Global error handling

### `shared/` - Reusable Components
- **components/** - Shared UI components (buttons, cards, modals)
- **directives/** - Custom directives
- **pipes/** - Custom pipes (filters, transformations)
- **models/** - Shared interfaces/types

### `features/` - Feature Modules
- **anime-list/** - Main list view of animes
- **anime-detail/** - Single anime detail page
- **search/** - Search functionality
- **categories/** - Category-based views (watched, watching, etc.)

### `layout/` - Layout Components
- **navbar/** - Top navigation bar
- **sidebar/** - Side navigation (categories)
- **footer/** - Footer component

### `environments/` - Environment Configuration
- `environment.ts` - Development config (API URL: https://localhost:5001/api)
- `environment.prod.ts` - Production config

## 🎯 Design Approach: Mobile-First

All styles start with mobile (320px+) and scale up using `min-width` media queries:
- **Mobile**: 320px+ (base styles)
- **Tablet**: 768px+
- **Desktop**: 1024px+
- **Large Desktop**: 1440px+

## 📝 Next Steps

1. Connect to your API by updating `environment.ts` with correct API URL
2. Add CORS configuration to your .NET API
3. Create feature components using Angular CLI:
   ```
   ng generate component features/anime-list
   ng generate component features/anime-detail
   ng generate component features/search
   ng generate component layout/navbar
   ```
4. Set up routing in `app.routes.ts`
5. Style components using mobile-first CSS
