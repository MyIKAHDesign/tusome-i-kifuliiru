# Content Migration Guide: MDX to JSON

## Overview

We're migrating from MDX to JSON-based content to enable:
- **Better structure**: Type-safe content with TypeScript
- **Component-based rendering**: Custom React components for different content types
- **More flexibility**: Interactive features, search, filtering
- **Professional presentation**: Modern UI components

## Content Types

### 1. Number Lessons (`number-lesson`)
For number-related content (ukuharura).

**Example Structure:**
```json
{
  "type": "number-lesson",
  "title": "Bihumbi bibiri",
  "range": "2.000 - 2.999",
  "sections": [
    {
      "title": "Bihumbi bibiri na higuma",
      "range": "2.001 - 2.009",
      "numbers": [
        {
          "value": 2001,
          "kifuliiru": "Bihumbi bibiri na higuma",
          "pronunciation": "optional",
          "notes": "optional"
        }
      ]
    }
  ]
}
```

### 2. Vocabulary (`vocabulary`)
For word lists and dictionaries.

**Example Structure:**
```json
{
  "type": "vocabulary",
  "title": "Amagambo",
  "words": [
    {
      "kifuliiru": "Muyegerere",
      "english": "Hello",
      "french": "Bonjour",
      "swahili": "Hujambo",
      "pronunciation": "optional",
      "category": "greetings",
      "example": "Muyegerere, muli mutya?"
    }
  ]
}
```

### 3. Lessons/Articles (`lesson` | `article`)
For narrative content.

**Example Structure:**
```json
{
  "type": "article",
  "title": "Ukuharura mu Kifuliiru",
  "blocks": [
    {
      "type": "heading",
      "level": 1,
      "content": "Title"
    },
    {
      "type": "paragraph",
      "content": "Text content..."
    },
    {
      "type": "list",
      "items": ["Item 1", "Item 2"]
    },
    {
      "type": "image",
      "src": "/path/to/image.png",
      "alt": "Description"
    }
  ]
}
```

## Migration Process

### Option 1: Automated Migration (Recommended for numbers)

Run the migration script:
```bash
npx ts-node scripts/migrate-to-json.ts
```

This will:
- Convert MDX files to JSON
- Save to `data-json/` directory
- Preserve folder structure

### Option 2: Manual Migration (For better control)

1. Create JSON file in `data-json/` with same structure as `data/`
2. Use the example files as templates
3. Customize the structure as needed

## Benefits

1. **Type Safety**: TypeScript types ensure content structure
2. **Reusable Components**: NumberLesson, Vocabulary, Lesson components
3. **Interactive Features**: Search, filter, sort in Vocabulary
4. **Better UX**: Grid layouts, cards, animations
5. **Easier Maintenance**: Structured data is easier to update

## Next Steps

1. Migrate number lessons first (most structured)
2. Test with a few files
3. Migrate vocabulary content
4. Keep narrative content in MDX or convert to JSON blocks
5. Update content loader to prioritize JSON over MDX

