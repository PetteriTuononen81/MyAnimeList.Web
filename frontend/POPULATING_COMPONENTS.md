# 🎯 How to Populate Components with Data

## What We Just Did - Step by Step

### **Step 1: Made AnimeCard Accept Data (@Input)**

**File: `anime-card.ts`**

```typescript
import { Component, Input } from '@angular/core';
import { Anime } from '../../../core/models/anime.model';

@Component({
  selector: 'app-anime-card',
  ...
})
export class AnimeCard {
  @Input() anime!: Anime;  // ← Component can now receive anime data
}
```

**What `@Input()` does:**
- Makes `anime` a **property** that can receive data from **parent** component
- `!` means "this will be set, don't worry TypeScript"
- Like a **parameter** for the component

---

### **Step 2: Updated HTML to Display the Data**

**File: `anime-card.html`**

```html
<div class="anime-card">
  <img [src]="anime.imageUrl" [alt]="anime.title">
  <h3>{{ anime.title }}</h3>
  <p>{{ anime.description }}</p>
  <span>{{ anime.status }}</span>
  <span>{{ anime.episodes }} Episodes</span>
</div>
```

**Syntax Explained:**
- `{{ anime.title }}` - Display text (interpolation)
- `[src]="anime.imageUrl"` - Bind property to data (property binding)
- `[alt]="anime.title"` - Bind attribute to data

---

### **Step 3: App Component Gets Data from Service**

**File: `app.ts`**

```typescript
import { Component } from '@angular/core';
import { AnimeApiService } from './core/services/anime-api.service';
import { Anime } from './core/models/anime.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [AnimeCard, CommonModule],  // ← CommonModule for @for
  ...
})
export class App {
  animes: Anime[] = [];  // ← Array to hold anime data

  constructor(private animeService: AnimeApiService) {
    // ← Inject service
    this.animes = this.animeService.getDummyAnimes();  // ← Get data
  }
}
```

**What happens:**
1. **Inject service** via constructor
2. **Call method** to get dummy data
3. **Store data** in `animes` array

---

### **Step 4: Loop Through Data in HTML**

**File: `app.html`**

```html
<div class="app-container">
  <h1>My Anime List</h1>
  <p>{{ animes.length }} anime in your collection</p>

  <div class="cards-container">
    @for (anime of animes; track anime.id) {
      <app-anime-card [anime]="anime"></app-anime-card>
    }
  </div>
</div>
```

**Syntax Explained:**
- `@for (anime of animes; track anime.id) { }` - Loop through array (Angular 17+ syntax)
- `[anime]="anime"` - Pass data to child component
  - Left `anime` = @Input property name
  - Right `anime` = variable from loop

---

## 📊 The Complete Data Flow

```
1. Service creates dummy data
   ┌─────────────────────────┐
   │ AnimeApiService         │
   │ getDummyAnimes()        │
   │ Returns: Anime[]        │
   └─────────────────────────┘
            │
            ↓
2. App component gets the data
   ┌─────────────────────────┐
   │ App Component           │
   │ constructor() {         │
   │   animes = service      │
   │     .getDummyAnimes();  │
   │ }                       │
   └─────────────────────────┘
            │
            ↓
3. App HTML loops through data
   ┌─────────────────────────┐
   │ app.html                │
   │ @for (anime of animes)  │
   │   <app-anime-card       │
   │     [anime]="anime">    │
   └─────────────────────────┘
            │
            ↓
4. AnimeCard receives one anime
   ┌─────────────────────────┐
   │ AnimeCard Component     │
   │ @Input() anime: Anime   │
   │                         │
   │ Displays:               │
   │ - anime.title           │
   │ - anime.description     │
   │ - etc.                  │
   └─────────────────────────┘
```

---

## 🔑 Key Concepts

### **1. @Input() Decorator**
```typescript
@Input() anime!: Anime;
```
- Makes property **receivable** from parent
- Parent passes data like: `[anime]="someData"`

### **2. Constructor Injection**
```typescript
constructor(private animeService: AnimeApiService) {
  // Service is now available as this.animeService
}
```
- Angular **automatically** provides the service
- `private` makes it a class property

### **3. Data Binding**
```html
<!-- Interpolation (display text) -->
{{ anime.title }}

<!-- Property Binding (set property) -->
[src]="anime.imageUrl"

<!-- Two-way Binding (for forms) -->
[(ngModel)]="anime.title"
```

### **4. @for Loop (Angular 17+)**
```html
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}
```
- Loops through array
- `track` tells Angular how to identify each item (for performance)

---

## 🧪 What You Should See Now

When you open http://localhost:4200, you should see:

- **Title**: "My Anime List"
- **Count**: "6 anime in your collection"
- **6 Cards** displaying:
  - Naruto (Watched)
  - One Piece (Watching)
  - Attack on Titan (Finished)
  - My Hero Academia (Ongoing)
  - Sword Art Online (Unliked)
  - Death Note (Watched)

Each card shows:
- ✅ Colored placeholder image
- ✅ Anime title
- ✅ Description
- ✅ Status
- ✅ Episode count

---

## 📚 Angular Syntax Summary

| Syntax | Name | Purpose | Example |
|--------|------|---------|---------|
| `{{ }}` | Interpolation | Display data | `{{ anime.title }}` |
| `[property]` | Property Binding | Set property | `[src]="imageUrl"` |
| `(event)` | Event Binding | Handle events | `(click)="onClick()"` |
| `[(ngModel)]` | Two-way Binding | Forms | `[(ngModel)]="name"` |
| `@for` | Loop | Repeat elements | `@for (item of items)` |
| `@if` | Conditional | Show/hide | `@if (showThis)` |
| `@Input()` | Input Property | Receive data | `@Input() data` |
| `@Output()` | Output Event | Emit events | `@Output() click` |

---

## ✅ Summary

**What we accomplished:**
1. Created a service with dummy data ✅
2. Made AnimeCard accept data via `@Input()` ✅
3. Injected service into App component ✅
4. Got data from service in constructor ✅
5. Looped through data to create multiple cards ✅
6. Passed each anime to AnimeCard component ✅

**The pattern:**
```
Service → Component → HTML Loop → Child Component → Display
```

**Your page now shows real (dummy) data with 6 different anime cards!** 🎉
