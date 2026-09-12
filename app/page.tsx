import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Шапка */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-indigo-600">Asman Camp</h1>
            </div>
            <nav className="flex items-center gap-4">
              <Link
                href="/auth/admin/login"
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition"
              >
                Вход для персонала
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Главный контент */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Герой секция */}
        <div className="text-center py-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Добро пожаловать в <br />
            <span className="text-indigo-600">Asman Camp</span>
          </h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Незабываемые летние смены для детей и подростков с уникальными программами развития
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-medium text-lg hover:bg-indigo-700 transition shadow-lg hover:shadow-xl">
              Записаться в лагерь
            </button>
            <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-50 transition border-2 border-indigo-600">
              Узнать больше
            </button>
          </div>
        </div>

        {/* Особенности */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Образовательные программы</h3>
            <p className="text-gray-600">
              Развивающие занятия, мастер-классы и творческие мастерские для всестороннего развития
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Активный отдых</h3>
            <p className="text-gray-600">
              Спортивные игры, походы, квесты и множество активностей на свежем воздухе
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Безопасность</h3>
            <p className="text-gray-600">
              Профессиональная команда, круглосуточная охрана и медицинское сопровождение
            </p>
          </div>
        </div>

        {/* Призыв к действию */}
        <div className="bg-indigo-600 rounded-2xl p-12 text-center text-white my-16">
          <h3 className="text-3xl font-bold mb-4">Готовы подарить ребенку незабываемое лето?</h3>
          <p className="text-lg mb-8 text-indigo-100">
            Забронируйте место в смене прямо сейчас
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-medium text-lg hover:bg-gray-100 transition shadow-lg">
            Связаться с нами
          </button>
        </div>
      </main>

      {/* Футер */}
      <footer className="border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2024 Asman Camp. Все права защищены.
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="#" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                Контакты
              </Link>
              <Link href="#" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                О лагере
              </Link>
              <Link href="#" className="text-gray-600 hover:text-indigo-600 transition text-sm">
                Программы
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
