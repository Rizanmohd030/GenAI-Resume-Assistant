# GenAI Resume Assistant

The backend now supports model-aware Gemini routing plus round-robin API key rotation. Instead of sending every request to the same model, the server chooses a model based on the kind of generation being requested and then rotates keys inside that pool.

Current routing strategy:

- `career` uses `gemini-2.5-flash-lite` because this work is mostly resume rewriting, keyword extraction, and summarization.
- `interview` usually uses `gemini-2.5-flash-lite`, but upgrades to `gemini-2.5-flash` for more complex roles or long job descriptions.
- `dsa` uses `gemini-2.5-flash`, and can upgrade to `gemini-2.5-pro` for especially complex requests.
- `full` uses `gemini-2.5-flash` by default, and can upgrade to `gemini-2.5-pro` for high-complexity prompts.

Use any one of these environment variable patterns:

```env
GEMINI_API_KEY=your-primary-key
```

```env
GEMINI_API_KEY_1=your-first-key
GEMINI_API_KEY_2=your-second-key
GEMINI_API_KEY_3=your-third-key
```

```env
GEMINI_API_KEYS=your-first-key,your-second-key,your-third-key
```

If multiple keys are present, the API route rotates through them on each request. When a key is rate-limited, it automatically retries with the next key in the pool.

If you only have two keys today, the simplest setup is still:

```env
GEMINI_API_KEY_1=your-first-key
GEMINI_API_KEY_2=your-second-key
```

Those keys will be shared across the routed models.

If you want separate pools per model later, you can also use:

```env
GEMINI_FLASH_LITE_KEY_1=your-lite-key
GEMINI_FLASH_LITE_KEY_2=your-lite-key-2

GEMINI_FLASH_KEY_1=your-flash-key
GEMINI_FLASH_KEY_2=your-flash-key-2

GEMINI_PRO_KEY_1=your-pro-key
```
