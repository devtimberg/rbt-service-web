all:
	bun run dev

icon:
	bun run icons:sync

ts:
	@echo "🔨 Проверяем TypeScript...\n"
	bunx tsc --noEmit
