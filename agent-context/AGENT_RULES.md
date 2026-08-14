# CropWise Agent Rules

1. Read `CropWise_Antigravity_Master_Spec.txt` before making structural changes.
2. Do not invent features or stray from the specification.
3. Do not rewrite unrelated files.
4. Do not remove working functionality.
5. Do not expose API keys in client code or Git repository.
6. Do not put business logic inside React UI components; place calculation logic inside `lib/engine/`.
7. Do not make AI responsible for numerical calculations, scores, or crop rankings.
8. Do not create duplicate scoring formulas; use `lib/engine/scoring-engine.js`.
9. Do not add unnecessary npm dependencies.
10. Keep mock and reference data clearly labeled (`isReferenceData: true`).
11. Keep the application runnable (`npm run dev`) after each phase.
12. Update `PROJECT_STATUS.md` after meaningful architectural work.
