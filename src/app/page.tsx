import { testDatabaseConnection } from '@/lib/db'

export default async function Home() {
  const dbStatus = await testDatabaseConnection()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Добро пожаловать в AsmanCamp
        </h1>
        
        <div className="mb-8 p-6 border rounded-lg bg-white/5">
          <h2 className="text-2xl font-semibold mb-4">Статус базы данных</h2>
          <div className={`p-4 rounded ${dbStatus.connected ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {dbStatus.connected ? (
              <div>
                <p className="text-green-400 font-bold">✓ Подключено к Neon PostgreSQL</p>
                <p className="text-sm mt-2">Версия: {dbStatus.version}</p>
                <p className="text-sm">Время: {dbStatus.timestamp}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-400 font-bold">✗ Ошибка подключения</p>
                <p className="text-sm mt-2">{dbStatus.error}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid text-center lg:grid-cols-3 gap-4">
          <a
            href="/api/test-db"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              API Test{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Тест API для проверки подключения к БД
            </p>
          </a>

          <a
            href="https://neon.tech/docs"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Docs{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Документация Neon PostgreSQL
            </p>
          </a>

          <a
            href="https://nextjs.org/docs"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-semibold">
              Next.js{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                →
              </span>
            </h2>
            <p className="m-0 max-w-[30ch] text-sm opacity-50">
              Документация Next.js
            </p>
          </a>
        </div>
      </div>
    </main>
  )
}
